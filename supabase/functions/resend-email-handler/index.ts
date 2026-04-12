// @ts-ignore - Deno imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const SMTP_USER = Deno.env.get("SMTP_USER") || "contacto@kcaliper.com";
const SMTP_PASS = Deno.env.get("SMTP_PASS") || "Tenkaichi23$";
const SMTP_HOST = Deno.env.get("SMTP_HOST") || "mail.privateemail.com";
const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") || "465");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    
    // Supabase Webhooks send payload.type = 'INSERT' or 'UPDATE'
    const isWebhook = payload.record !== undefined;
    
    let to = "";
    let subject = "";
    let html = "";

    // Handle Influencer Application triggered by DB Webhook
    if (isWebhook && payload.table === "influencers") {
      const record = payload.record;
      to = record.email;
      subject = "Hemos recibido tu aplicación a kCaliper 🤝";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #050508; color: #ffffff;">
          <h1 style="color: #00D2FF;">Hola ${record.name},</h1>
          <p style="color: #999;">Hemos recibido tu información para el programa de embajadores de <strong>kCaliper.ai</strong>.</p>
          <p style="color: #999;">Nuestros asesores están revisando tu perfil de Instagram (${record.ig_handle}) y en menos de 48 horas te enviaremos una actualización.</p>
          <br/>
          <p style="color: #666; font-size: 12px;">© 2026 kCaliper AI. Todos los derechos reservados.</p>
        </div>
      `;
    } 
    // Handle Waitlist via DB Webhook
    else if (isWebhook && payload.table === "waitlist") {
      const record = payload.record;
      to = record.email;
      subject = "Tu lugar en kCaliper está asegurado 🎯";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #050508; color: #ffffff;">
          <h1 style="color: #00D2FF;">Bienvenido a los Fundadores</h1>
          <p style="color: #999;">Has asegurado tu lugar en la lista de early access de kCaliper.</p>
          <p style="color: #999;">Te notificaremos en cuanto se liberen los espacios de la plataforma.</p>
          <br/>
          <p style="color: #666; font-size: 12px;">© 2026 kCaliper AI. Todos los derechos reservados.</p>
        </div>
      `;
    }
    else {
      // Manual trigger or other format
      to = payload.to || "";
      subject = payload.subject || "Notificación de kCaliper";
      html = payload.html || "";
    }

    if (!to) throw new Error("Recipient email is missing.");

    // Initialize SMTP client
    const client = new SmtpClient();

    await client.connectTLS({
      hostname: SMTP_HOST,
      port: SMTP_PORT,
      username: SMTP_USER,
      password: SMTP_PASS,
    });

    await client.send({
      from: "kCaliper AI <contacto@kcaliper.com>",
      to: to,
      subject: subject,
      content: html,
      html: html,
    });

    await client.close();

    return new Response(JSON.stringify({ success: true, message: "Email sent successfully via SMTP" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("SMTP Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

