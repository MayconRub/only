import express from "express";
import { createTurbofyClient } from "@turbofy/sdk";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import os from "os";

dotenv.config();

const app = express();
const PORT = 3000;

const upload = multer({ dest: os.tmpdir() });

// Middleware for parsing JSON
app.use(express.json());

// Helper to get Supabase client lazily to prevent boot crashes
function getSupabase() {
  const url = (process.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co").replace(/^["']|["']$/g, '');
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "placeholder").replace(/^["']|["']$/g, '');
  return createClient(url, key);
}

// API Route: Create Pix Payment
app.post("/api/payments/pix", async (req, res) => {
  let paymentRecord: any;
  try {
    const body = req.body || {};
    const { amount, description, payerEmail, userId, creatorId, planId, duration, paymentId } = body;

    if (!process.env.TURBOFY_CLIENT_ID || !process.env.TURBOFY_CLIENT_SECRET) {
      return res.status(500).json({ error: "Turbofy credentials not configured." });
    }

    const turbofyClient = createTurbofyClient({
      baseUrl: "https://api.turbofypay.com",
      credentials: {
        clientId: process.env.TURBOFY_CLIENT_ID.replace(/^["']|["']$/g, '').trim(),
        clientSecret: process.env.TURBOFY_CLIENT_SECRET.replace(/^["']|["']$/g, '').trim(),
      },
      timeoutMs: 60000, // Increase timeout to 60s
    });

    const supabase = getSupabase();

    if (!userId || !creatorId || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Dados de pagamento inválidos." });
    }
    
    // SURGICAL IDEMPOTENCY: Check for existing pending payment first
    // We check for user, creator, amount and plan to avoid creating duplicates
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    if (paymentId) {
      const { data: existing } = await supabase
        .from("payments")
        .select("*")
        .eq("id", paymentId)
        .single();
      paymentRecord = existing;
    }

    if (!paymentRecord) {
      const { data: recentPending } = await supabase
        .from("payments")
        .select("*")
        .eq("user_id", userId)
        .eq("creator_id", creatorId)
        .eq("amount", amount)
        .eq("plan_id", planId)
        .eq("status", "pending")
        .gt("created_at", fiveMinsAgo)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (recentPending) {
        console.log("[PIX] Reusing recent pending payment:", recentPending.id);
        paymentRecord = recentPending;
      }
    }

    if (!paymentRecord) {
      const { data: newRecord, error: dbError } = await supabase
        .from("payments")
        .insert({
          user_id: userId,
          creator_id: creatorId,
          amount: amount,
          plan_id: planId,
          duration: duration || 30,
          status: "pending",
        })
        .select()
        .single();

      if (dbError || !newRecord) throw new Error("Falha ao registrar pagamento no banco de dados.");
      paymentRecord = newRecord;
    }

    // If we already have a platform ID, try to recover it immediately
    if (paymentRecord.mp_payment_id) {
      try {
        // @ts-ignore
        const charge = await turbofyClient.pix.getCharge({ id: paymentRecord.mp_payment_id });
        if (charge && charge.pix) {
          return res.json({
            paymentId: paymentRecord.id,
            qrCodeBase64: charge.pix.qrCode,
            qrCode: charge.pix.copyPaste,
          });
        }
      } catch (e) {
        console.log("[PIX] Platform ID exists but fetch failed, proceeding to createCharge.");
      }
    }

    const amountCents = Math.round(amount * 100);
    let charge;
    let attempts = 0;
    const maxAttempts = 3; // Increase to 3 attempts
    
    while (attempts < maxAttempts) {
      try {
        console.log(`[PIX] Creating charge for ${paymentRecord.id} (Attempt ${attempts + 1})`);
        charge = await turbofyClient.pix.createCharge({
          amountCents: amountCents,
          description: (description || "Pagamento").substring(0, 100),
          externalRef: paymentRecord.id,
          idempotencyKey: paymentRecord.id, // CRITICAL: Use our ID as idempotency key
          metadata: { userId, creatorId, planId }
        });
        break;
      } catch (err: any) {
        attempts++;
        let errorMessage = err.message || "Unknown error";
        
        // If the error message is HTML, it's likely a Cloudflare/Gateway error
        if (errorMessage.includes("<!DOCTYPE html>") || errorMessage.includes("<html>")) {
          errorMessage = "Turbofy Gateway Error (502/504)";
        }

        let statusCode = err.status || (err.response && err.response.status);
        
        // Manual detection for Cloudflare errors if status is missing
        if (!statusCode) {
          if (errorMessage.includes("502")) statusCode = 502;
          if (errorMessage.includes("504")) statusCode = 504;
        }

        console.error(`[PIX] Attempt ${attempts} failed (Status ${statusCode}):`, errorMessage.substring(0, 200));
        
        // If it's a conflict (409), it means it was created but we didn't get the ID
        // With idempotencyKey, a retry of createCharge should return the existing one.
        // If it still fails with 409, we might have a problem, but usually 409 means "already exists".
        if (statusCode === 409 || errorMessage.toLowerCase().includes("already exists") || errorMessage.toLowerCase().includes("conflict")) {
          console.log("[PIX] Conflict/Idempotency hit, retrying createCharge might return the existing one.");
        }

        if (attempts >= maxAttempts) throw new Error(errorMessage);
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
      }
    }

    if (!charge) throw new Error("Serviço de pagamentos indisponível.");

    // Update record with platform ID
    await supabase
      .from("payments")
      .update({ mp_payment_id: charge.id })
      .eq("id", paymentRecord.id);

    res.json({
      paymentId: paymentRecord.id,
      qrCodeBase64: charge.pix.qrCode,
      qrCode: charge.pix.copyPaste,
    });
    } catch (error: any) {
      console.error("[PIX] Final Error:", error.message);
      
      let detailedError = error.message || "Erro interno no servidor";
      
      const isNetworkError = detailedError.includes("fetch failed") || 
                            detailedError.includes("ECONNRESET") || 
                            detailedError.includes("ETIMEDOUT") ||
                            detailedError.includes("socket hang up");

      const isHtmlError = detailedError.includes("<!DOCTYPE html>") || detailedError.includes("<html>");

      if (isNetworkError || isHtmlError) {
        detailedError = "O serviço de pagamentos está demorando a responder. Como o PIX foi gerado no Turbofy, tente aguardar um momento ou clique em continuar novamente.";
      }
      
      res.status(500).json({ 
        error: detailedError,
        paymentId: paymentRecord?.id 
      });
    }
});

// API Route: Turbofy Webhook
app.post("/api/webhooks/turbofy", async (req, res) => {
  try {
    console.log("Webhook received:", JSON.stringify(req.body));
    
    // Turbofy/Gawget webhook payload structure
    const body = req.body || {};
    const event = body.event || body.type; // Some platforms use 'type'
    const data = body.data || body;

    console.log(`Processing event: ${event}`);

    // We care about paid charges/payments
    const isPaidEvent = event === "charge.paid" || event === "payment.paid" || event === "order.paid" || event === "payment.succeeded";
    
    if (isPaidEvent && data) {
      // The charge object can be top-level or nested
      const charge = data.charge || data.object || data;
      const id = charge.id;
      const status = charge.status;
      // Check multiple possible fields for the external reference
      const externalRef = charge.externalRef || charge.external_reference || (charge.metadata && (charge.metadata.externalRef || charge.metadata.external_reference || charge.metadata.paymentId));

      console.log(`Webhook data - ID: ${id}, Status: ${status}, ExternalRef: ${externalRef}`);

      if (externalRef) {
        // Update payment status in our database
        // Handle different success status strings
        const isApproved = status === "PAID" || status === "approved" || status === "succeeded" || status === "paid" || status === "completed";
        const newStatus = isApproved ? "approved" : status.toLowerCase();
        
        console.log(`Updating payment ${externalRef} to status ${newStatus}`);
        const supabase = getSupabase();
        
        const { error: updateError } = await supabase
          .from("payments")
          .update({ 
            status: newStatus,
            mp_payment_id: id // Ensure we store the platform's ID
          })
          .eq("id", externalRef);

        if (updateError) {
          console.error("Error updating payment status:", updateError);
        }

        // If approved, create/update the subscription
        if (isApproved) {
          console.log(`Payment ${externalRef} is PAID, checking if it's a subscription or mimo`);
          const { data: paymentRecord, error: fetchError } = await supabase
            .from("payments")
            .select("*")
            .eq("id", externalRef)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            console.error("Error fetching payment record:", fetchError);
          }

          if (paymentRecord) {
            // Only create subscription if it's NOT a mimo
            if (paymentRecord.plan_id !== 'mimo') {
              const duration = paymentRecord.duration || 30;
              const endDate = new Date();
              endDate.setDate(endDate.getDate() + duration);

              const { error: subError } = await supabase.from("subscriptions").insert({
                user_id: paymentRecord.user_id,
                creator_id: paymentRecord.creator_id,
                plan_id: paymentRecord.plan_id,
                status: "active",
                end_date: endDate.toISOString(),
              });

              if (subError) {
                console.error("Error creating subscription:", subError);
              } else {
                console.log(`Subscription created for user ${paymentRecord.user_id}`);
              }
            } else {
              console.log(`Mimo payment ${externalRef} approved, recording in mimos table.`);
              
              // Create record in mimos table for better organization
              const { error: mimoError } = await supabase.from("mimos").insert({
                user_id: paymentRecord.user_id,
                creator_id: paymentRecord.creator_id,
                amount: paymentRecord.amount,
                payment_id: paymentRecord.id,
                status: "completed"
              });

              if (mimoError) {
                console.error("Error creating mimo record:", mimoError);
              }

              // Create a notification for the creator
              await supabase.from("notifications").insert({
                user_id: paymentRecord.creator_id,
                type: "mimo",
                content: `Você recebeu um mimo de R$ ${paymentRecord.amount}!`,
                metadata: { amount: paymentRecord.amount, sender_id: paymentRecord.user_id }
              });
            }
          } else {
            console.warn(`Payment record not found for externalRef: ${externalRef}`);
          }
        }
      } else {
        console.warn("Webhook missing id or externalRef", { id, externalRef });
      }
    } else {
      console.log("Ignoring webhook event:", event);
    }

    // Always return 200 OK to Turbofy so they know we received it
    // Even if it's a test event or an event we don't care about
    res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook error:", error);
    // CRITICAL: Always return 200 to Turbofy so the webhook test passes
    // and the webhook doesn't get disabled.
    res.status(200).send("OK");
  }
});

// API Route: Sync Payment Status
app.get("/api/payments/sync/:paymentId", async (req, res) => {
  try {
    const { paymentId } = req.params;
    const supabase = getSupabase();

    // Get the payment record
    const { data: paymentRecord, error: fetchError } = await supabase
      .from("payments")
      .select("*")
      .eq("id", paymentId)
      .single();

    if (fetchError || !paymentRecord) {
      return res.status(404).json({ error: "Payment not found." });
    }

    // If already approved, just return it
    if (paymentRecord.status === "approved") {
      return res.json({ status: "approved" });
    }

    // If we have a platform ID, check with the payment service
    if (paymentRecord.mp_payment_id && process.env.TURBOFY_CLIENT_ID && process.env.TURBOFY_CLIENT_SECRET) {
      const turbofyClient = createTurbofyClient({
        baseUrl: "https://api.turbofypay.com",
        credentials: {
          clientId: process.env.TURBOFY_CLIENT_ID.replace(/^["']|["']$/g, '').trim(),
          clientSecret: process.env.TURBOFY_CLIENT_SECRET.replace(/^["']|["']$/g, '').trim(),
        },
      });

      const charge = await turbofyClient.pix.getCharge(paymentRecord.mp_payment_id);
      const status = charge.status as string;
      
      if (charge && (status === "PAID" || status === "approved" || status === "succeeded")) {
        // Update to approved
        await supabase
          .from("payments")
          .update({ status: "approved" })
          .eq("id", paymentId);

        // Create subscription if not exists
        const { data: existingSub } = await supabase
          .from("subscriptions")
          .select("id")
          .eq("user_id", paymentRecord.user_id)
          .eq("creator_id", paymentRecord.creator_id)
          .eq("status", "active")
          .maybeSingle();

        if (!existingSub) {
          const duration = paymentRecord.duration || 30;
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + duration);

          await supabase.from("subscriptions").insert({
            user_id: paymentRecord.user_id,
            creator_id: paymentRecord.creator_id,
            plan_id: paymentRecord.plan_id,
            status: "active",
            end_date: endDate.toISOString(),
          });
        }

        return res.json({ status: "approved" });
      } else if (charge && (status === "PAID" || status === "approved" || status === "succeeded") && paymentRecord.plan_id === 'mimo') {
        // Update to approved
        await supabase
          .from("payments")
          .update({ status: "approved" })
          .eq("id", paymentId);

        // Check if already recorded in mimos
        const { data: existingMimo } = await supabase
          .from("mimos")
          .select("id")
          .eq("payment_id", paymentId)
          .maybeSingle();

        if (!existingMimo) {
          await supabase.from("mimos").insert({
            user_id: paymentRecord.user_id,
            creator_id: paymentRecord.creator_id,
            amount: paymentRecord.amount,
            payment_id: paymentRecord.id,
            status: "completed"
          });

          await supabase.from("notifications").insert({
            user_id: paymentRecord.creator_id,
            type: "mimo",
            content: `Você recebeu um mimo de R$ ${paymentRecord.amount}!`,
            metadata: { amount: paymentRecord.amount, sender_id: paymentRecord.user_id }
          });
        }

        return res.json({ status: "approved" });
      }
    }

    res.json({ status: paymentRecord.status });
  } catch (error) {
    console.error("Error syncing payment:", error);
    res.status(500).json({ error: "Failed to sync payment." });
  }
});

// API Route: Convert and Upload Audio
app.post("/api/audio/convert", upload.single("audio"), async (req, res) => {
  const file = req.file;
  const userId = req.body.userId;

  if (!file || !userId) {
    return res.status(400).json({ error: "Missing audio file or userId" });
  }

  const inputPath = file.path;
  const outputPath = path.join(os.tmpdir(), `${file.filename}.m4a`);

  try {
    // Dynamically import ffmpeg to avoid crashing the server on boot in Vercel
    const ffmpeg = (await import("fluent-ffmpeg")).default;
    try {
      const ffmpegInstaller = (await import("@ffmpeg-installer/ffmpeg")).default;
      if (ffmpegInstaller && ffmpegInstaller.path) ffmpeg.setFfmpegPath(ffmpegInstaller.path);
      const ffprobeInstaller = (await import("@ffprobe-installer/ffprobe")).default;
      if (ffprobeInstaller && ffprobeInstaller.path) ffmpeg.setFfprobePath(ffprobeInstaller.path);
    } catch (e) {
      console.warn("Could not load ffmpeg installers, using system ffmpeg if available");
    }

    // Convert to AAC (.m4a)
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .toFormat("mp4")
        .audioCodec("aac")
        .on("end", resolve)
        .on("error", reject)
        .save(outputPath);
    });

    // Read the converted file
    const fileBuffer = fs.readFileSync(outputPath);
    const fileName = `chat/${userId}/${Math.random()}.m4a`;

    // Upload to Supabase
    const supabase = getSupabase();
    const { data, error: uploadError } = await supabase.storage
      .from("posts")
      .upload(fileName, fileBuffer, {
        contentType: "audio/mp4",
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage.from("posts").getPublicUrl(fileName);

    // Cleanup temp files
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

    res.json({ url: publicUrlData.publicUrl });
  } catch (error: any) {
    console.error("Audio conversion error:", error);
    // Cleanup temp files on error
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    res.status(500).json({ error: "Failed to convert audio: " + error.message });
  }
});

async function startServer() {
  // Vite middleware for development (only if NOT on Vercel)
  if (!process.env.VERCEL && process.env.NODE_ENV !== "production") {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.warn("Vite not found, skipping dev middleware");
    }
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Only start the server if not running on Vercel
if (!process.env.VERCEL) {
  startServer();
}

export default app;
