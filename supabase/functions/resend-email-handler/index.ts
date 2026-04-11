// @ts-ignore - Deno imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

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
          <h1 style="color: #6C5CE7;">Hola ${record.name},</h1>
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
          <h1 style="color: #6C5CE7;">Bienvenido a los Fundadores</h1>
          <p style="color: #999;">Has asegurado tu lugar en la lista de early access de kCaliper.</p>
          <p style="color: #999;">Te notificaremos en cuanto se liberen los espacios de la plataforma.</p>
          <br/>
          <p style="color: #666; font-size: 12px;">© 2026 kCaliper AI. Todos los derechos reservados.</p>
        </div>
      `;
    }
    else {
      throw new Error("Unknown payload format.");
    }

    if (!RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY environment variable.");

    const resendReq = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "kCaliper <hola@kcaliper.com>", // You must verify this domain in Resend
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    const resendRes = await resendReq.json();

    return new Response(JSON.stringify(resendRes), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: resendReq.ok ? 200 : 400,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
