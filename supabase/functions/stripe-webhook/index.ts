import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import Stripe from "npm:stripe@14.14.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") || "";
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

// For edge runtime crypto
const cryptoProvider = Stripe.createSubtleCryptoProvider();

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get("Stripe-Signature");
    if (!signature) {
      return new Response("No signature found", { status: 400 });
    }

    const body = await req.text();
    let event;

    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        STRIPE_WEBHOOK_SECRET,
        undefined,
        cryptoProvider
      );
    } catch (err: any) {
      console.error(`Webhook signature verification failed.`, err.message);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Process the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_details?.email;
      
      console.log(`Payment successful for email: ${customerEmail}`);
      
      if (!customerEmail) {
        throw new Error("No customer email present in checkout session");
      }

      // Check if user already exists
      const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = users?.users.find(u => u.email === customerEmail);

      let role = 'athlete';
      let planDisplayName = 'Atleta Pro';
      let htmlTitle = '¡Bienvenido a la Era de kCaliper! 🚀';
      let isCoach = false;

      // Determine the precise plan based on test amounts (399, 1290, 1299, 9990)
      if (session.amount_total) {
        if (session.amount_total === 9990) {
          role = 'coach'; isCoach = true; planDisplayName = 'Coach Global Elite';
        } else if (session.amount_total === 1299) {
          role = 'coach'; isCoach = true; planDisplayName = 'Coach Professional';
        } else if (session.amount_total === 1290) {
          role = 'athlete'; planDisplayName = 'Atleta Legend';
        } else if (session.amount_total === 399) {
          role = 'athlete'; planDisplayName = 'Atleta Pro';
        }
      }

      htmlTitle = isCoach ? '¡Bienvenido a kCaliper Coach! 🎯' : '¡Bienvenido a la Era de kCaliper! 🚀';

      if (existingUser) {
        // User exists, upgrade them immediately
        await supabaseAdmin.from('profiles').update({
          role: role,
          plan: 'pro',
          status: 'active'
        }).eq('id', existingUser.id);
        
        console.log(`Upgraded existing user ${customerEmail} to ${role} PRO`);
      } else {
        // User does not exist, save purchase so it automatically maps upon registration
        await supabaseAdmin.from('stripe_purchases').insert({
          stripe_session_id: session.id,
          customer_email: customerEmail,
          stripe_customer_id: typeof session.customer === 'string' ? session.customer : session.customer?.id,
          amount_total: session.amount_total,
          currency: session.currency,
          payment_status: session.payment_status,
          plan_type: role + '_pro',
        });
        console.log(`Saved decoupled purchase for future user ${customerEmail}`);
      }

      // -------------------------------------------------------------
      // GENERATE MAGIC LINK (ZERO FRICTION)
      // -------------------------------------------------------------
      let magicLinkUrl = 'https://kcaliper.com/login';
      try {
        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
          type: 'magiclink',
          email: customerEmail,
          options: {
            redirectTo: 'https://kcaliper.com/'
          }
        });
        if (linkData?.properties?.action_link) {
          magicLinkUrl = linkData.properties.action_link;
          
          // Replace base domain if local or custom domain config is needed, but action_link uses the project SUPABASE_URL internally as redirect.
          // Usually Vercel or your SITE_URL handles the redirect correctly if configured in Supabase Auth mapping.
        }
      } catch (err) {
        console.error("Magic link failed", err);
      }

      // -------------------------------------------------------------
      // SEND WELCOME EMAIL VIA SMTP
      // -------------------------------------------------------------
      const SMTP_USER = Deno.env.get("SMTP_USER") || "contacto@kcaliper.com";
      const SMTP_PASS = Deno.env.get("SMTP_PASS") || "Tenkaichi23$";
      const SMTP_HOST = Deno.env.get("SMTP_HOST") || "mail.privateemail.com";
      const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") || "465");

      const primaryColor = isCoach ? '#00D2FF' : '#6C5CE7';
      
      const welcomeHtml = `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #050508; color: #ffffff; border-radius: 20px; border: 1px solid #222;">
          <h1 style="color: ${primaryColor}; font-size: 28px; font-weight: 800; text-align: center; margin-bottom: 30px;">${htmlTitle}</h1>
          
          <p style="color: #999; font-size: 16px; line-height: 1.6; text-align: center;">Tu pago del plan <strong>${planDisplayName}</strong> se ha procesado exitosamente. Has asegurado tu precio de fundador y tus beneficios de por vida.</p>
          
          <div style="background-color: #111; border: 1px solid ${primaryColor}40; border-radius: 12px; padding: 20px; margin: 30px 0; text-align: center;">
            <h2 style="color: #fff; font-size: 18px; margin-top: 0;">Tu entorno está configurado</h2>
            <p style="color: #666; font-size: 14px; margin-bottom: 25px;">Hemos generado una llave de acceso mágico exclusivo para tu cuenta. No necesitas inventar ninguna contraseña, solo haz clic en el botón de abajo para entrar directo a tu Dashboard y comenzar.</p>
            
            <a href="${magicLinkUrl}" style="display: inline-block; background-color: ${primaryColor}; color: ${isCoach ? '#000' : '#fff'}; text-decoration: none; font-weight: bold; font-size: 16px; padding: 16px 32px; border-radius: 50px; text-transform: uppercase; letter-spacing: 1px;">Entrar a mi Dashboard</a>
          </div>

          <p style="color: #666; font-size: 12px; text-align: center;">Este es un link de sesión único. También puedes entrar a kcaliper.com/login y escribir este correo para recibir otro enlace mágico cuando lo necesites.</p>
          <br/>
          <p style="color: #444; font-size: 10px; text-align: center; text-transform: uppercase; letter-spacing: 2px;">© 2026 kCaliper AI.</p>
        </div>
      `;

      try {
        const { SmtpClient } = await import("https://deno.land/x/smtp@v0.7.0/mod.ts");
        const client = new SmtpClient();

        await client.connectTLS({
          hostname: SMTP_HOST,
          port: SMTP_PORT,
          username: SMTP_USER,
          password: SMTP_PASS,
        });

        await client.send({
          from: "kCaliper AI <contacto@kcaliper.com>",
          to: customerEmail,
          subject: htmlTitle,
          content: welcomeHtml,
          html: welcomeHtml,
        });

        await client.close();
        console.log(`Sent welcome email via SMTP to ${customerEmail}`);
      } catch (smtpErr: any) {
        console.error("SMTP Welcome Email failed:", smtpErr.message);
      }

    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error(`Edge Function Error: ${error.message}`);
    return new Response(`Server error: ${error.message}`, { status: 500 });
  }
});
