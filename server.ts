import express from "express";
import { createServer as createViteServer } from "vite";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON
app.use(express.json());

// Initialize Supabase Client (Admin)
const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Mercado Pago
const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "" });
const payment = new Payment(client);

// API Route: Create Pix Payment
app.post("/api/payments/pix", async (req, res) => {
  try {
    const { amount, description, payerEmail, userId, creatorId, planId } = req.body;

    if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
      return res.status(500).json({ error: "Mercado Pago token not configured." });
    }

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

    // Request to Mercado Pago
    const paymentData = {
      transaction_amount: amount,
      description: description || "Assinatura Novinha do JOB",
      payment_method_id: "pix",
      payer: {
        email: payerEmail || "test@test.com",
      },
      external_reference: paymentRecord.id, // Link MP payment to our DB record
    };

    const mpResponse = await payment.create({ body: paymentData });

    // Update the record with the MP payment ID
    await supabase
      .from("payments")
      .update({ mp_payment_id: mpResponse.id?.toString() })
      .eq("id", paymentRecord.id);

    // Return the Pix data to the frontend
    res.json({
      paymentId: paymentRecord.id,
      qrCodeBase64: mpResponse.point_of_interaction?.transaction_data?.qr_code_base64,
      qrCode: mpResponse.point_of_interaction?.transaction_data?.qr_code,
    });
  } catch (error: any) {
    console.error("Error creating Pix payment:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// API Route: Mercado Pago Webhook
app.post("/api/webhooks/mercadopago", async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === "payment") {
      const paymentId = data.id;
      
      // Fetch payment details from MP
      const mpPayment = await payment.get({ id: paymentId });
      const externalReference = mpPayment.external_reference;
      const status = mpPayment.status;

      if (externalReference) {
        // Update payment status in our database
        await supabase
          .from("payments")
          .update({ status: status === "approved" ? "approved" : status })
          .eq("id", externalReference);

        // If approved, create/update the subscription
        if (status === "approved") {
          const { data: paymentRecord } = await supabase
            .from("payments")
            .select("*")
            .eq("id", externalReference)
            .single();

          if (paymentRecord) {
            // Create subscription
            const endDate = new Date();
            if (paymentRecord.plan_id === 'monthly') endDate.setDate(endDate.getDate() + 30);
            else if (paymentRecord.plan_id === 'quarterly') endDate.setDate(endDate.getDate() + 90);
            else if (paymentRecord.plan_id === 'yearly') endDate.setDate(endDate.getDate() + 365);
            else endDate.setDate(endDate.getDate() + 30); // Default 30 days

            await supabase.from("subscriptions").insert({
              user_id: paymentRecord.user_id,
              creator_id: paymentRecord.creator_id,
              plan_id: paymentRecord.plan_id,
              status: "active",
              end_date: endDate.toISOString(),
            });
          }
        }
      }
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).send("Error processing webhook");
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
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

startServer();
