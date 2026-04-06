import express from "express";
import { createTurbofyClient } from "@turbofy/sdk";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import dotenv from "dotenv";
import multer from "multer";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffprobeInstaller from "@ffprobe-installer/ffprobe";
import fs from "fs";
import os from "os";

try {
  if (ffmpegInstaller && ffmpegInstaller.path) {
    ffmpeg.setFfmpegPath(ffmpegInstaller.path);
  }
  if (ffprobeInstaller && ffprobeInstaller.path) {
    ffmpeg.setFfprobePath(ffprobeInstaller.path);
  }
} catch (e) {
  console.error("Failed to set ffmpeg paths:", e);
}

dotenv.config();

const app = express();
const PORT = 3000;

const upload = multer({ dest: os.tmpdir() });

// Middleware for parsing JSON
app.use(express.json());

// Initialize Supabase Client (Admin)
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "placeholder";

if (!process.env.VITE_SUPABASE_URL) {
  console.warn("WARNING: VITE_SUPABASE_URL is not set. Supabase will not work.");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// API Route: Create Pix Payment
app.post("/api/payments/pix", async (req, res) => {
  try {
    const body = req.body || {};
    const { amount, description, payerEmail, userId, creatorId, planId } = body;

    if (!process.env.TURBOFY_CLIENT_ID || !process.env.TURBOFY_CLIENT_SECRET) {
      return res.status(500).json({ error: "Turbofy credentials not configured." });
    }

    // Initialize Turbofy Client inside the route to prevent boot crashes
    const turbofyClient = createTurbofyClient({
      baseUrl: "https://api.turbofypay.com",
      credentials: {
        clientId: process.env.TURBOFY_CLIENT_ID.trim(),
        clientSecret: process.env.TURBOFY_CLIENT_SECRET.trim(),
      },
    });

    // Create a payment record in Supabase first to get an ID
    const { data: paymentRecord, error: dbError } = await supabase
      .from("payments")
      .insert({
        user_id: userId,
        creator_id: creatorId,
        amount: amount,
        plan_id: planId,
        status: "pending",
      })
      .select()
      .single();

    if (dbError || !paymentRecord) {
      console.error("Database error:", dbError);
      return res.status(500).json({ error: "Failed to create payment record." });
    }

    // Convert amount to cents for Turbofy (e.g. 29.90 -> 2990)
    const amountCents = Math.round(amount * 100);

    // Request to Turbofy
    const charge = await turbofyClient.pix.createCharge({
      amountCents: amountCents,
      description: (description || "Assinatura").substring(0, 100), // Limit length just in case
      externalRef: paymentRecord.id.replace(/[^a-zA-Z0-9-]/g, ''), // Ensure safe pattern
      metadata: {
        userId: userId,
        creatorId: creatorId,
        planId: planId
      }
    });

    // Update the record with the Turbofy payment ID
    await supabase
      .from("payments")
      .update({ mp_payment_id: charge.id })
      .eq("id", paymentRecord.id);

    // Return the Pix data to the frontend
    res.json({
      paymentId: paymentRecord.id,
      qrCodeBase64: charge.pix.qrCode,
      qrCode: charge.pix.copyPaste,
    });
  } catch (error: any) {
    console.error("Error creating Pix payment:", error);
    
    // Extract detailed validation errors from Turbofy SDK if available
    let detailedError = error.message || "Internal server error";
    if (error.fieldErrors) {
      detailedError += " Detalhes: " + JSON.stringify(error.fieldErrors);
    }
    
    res.status(500).json({ error: detailedError });
  }
});

// API Route: Turbofy Webhook
app.post("/api/webhooks/turbofy", async (req, res) => {
  try {
    console.log("Webhook received:", JSON.stringify(req.body));
    
    // Turbofy webhook payload structure based on standard event formats
    const body = req.body || {};
    const event = body.event;
    const data = body.data;

    // We only care about when a charge is paid
    if (event === "charge.paid" && data) {
      // Turbofy sometimes nests the charge object inside data.charge
      const charge = data.charge || data;
      const { id, status, externalRef } = charge;

      if (id && externalRef) {
        // Update payment status in our database
        // Turbofy uses "PAID" for successful payments
        const newStatus = status === "PAID" ? "approved" : status.toLowerCase();
        
        const { error: updateError } = await supabase
          .from("payments")
          .update({ status: newStatus })
          .eq("id", externalRef);

        if (updateError) {
          console.error("Error updating payment status:", updateError);
        }

        // If approved, create/update the subscription
        if (status === "PAID") {
          const { data: paymentRecord, error: fetchError } = await supabase
            .from("payments")
            .select("*")
            .eq("id", externalRef)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error("Error fetching payment record:", fetchError);
          }

          if (paymentRecord) {
            // Create subscription
            const endDate = new Date();
            if (paymentRecord.plan_id === 'monthly') endDate.setDate(endDate.getDate() + 30);
            else if (paymentRecord.plan_id === 'quarterly') endDate.setDate(endDate.getDate() + 90);
            else if (paymentRecord.plan_id === 'yearly') endDate.setDate(endDate.getDate() + 365);
            else endDate.setDate(endDate.getDate() + 30); // Default 30 days

            const { error: subError } = await supabase.from("subscriptions").insert({
              user_id: paymentRecord.user_id,
              creator_id: paymentRecord.creator_id,
              plan_id: paymentRecord.plan_id,
              status: "active",
              end_date: endDate.toISOString(),
            });

            if (subError) {
              console.error("Error creating subscription:", subError);
            }
          }
        }
      }
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
