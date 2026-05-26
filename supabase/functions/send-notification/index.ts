/**
 * قِمّة Send Notification Edge Function
 * Sends in-app notifications and email (via Resend).
 *
 * Deploy: supabase functions deploy send-notification
 * Secret: supabase secrets set RESEND_API_KEY=re_xxxxx
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  userId: string;
  type: string;
  title: string;
  body?: string;
  link?: string;
  metadata?: Record<string, unknown>;
  sendEmail?: boolean;
  userEmail?: string;
}

async function sendEmail(to: string, subject: string, html: string) {
  const resendKey = Deno.env.get('RESEND_API_KEY');
  if (!resendKey) return; // Skip if not configured

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'قِمّة <notifications@qimma.sa>',
      to,
      subject,
      html,
    }),
  });
}

const EMAIL_TEMPLATES = {
  job_match: (title: string, body: string) => `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(to left, #006C35, #00A651); padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 20px;">قِمّة — منصة المسيرة المهنية</h1>
      </div>
      <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 12px 12px;">
        <h2 style="color: #111827;">${title}</h2>
        <p style="color: #6b7280;">${body}</p>
        <a href="https://qimma.sa/dashboard/jobs-for-you" style="display: inline-block; background: #006C35; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
          عرض الوظائف المناسبة لك
        </a>
      </div>
      <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 16px;">
        قِمّة · الرياض، المملكة العربية السعودية · <a href="https://qimma.sa/privacy" style="color: #9ca3af;">سياسة الخصوصية</a>
      </p>
    </div>
  `,
  application_update: (title: string, body: string) => `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(to left, #006C35, #00A651); padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0;">قِمّة — تحديث على طلبك</h1>
      </div>
      <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 12px 12px;">
        <h2 style="color: #111827;">${title}</h2>
        <p style="color: #6b7280;">${body}</p>
        <a href="https://qimma.sa/dashboard/applications" style="display: inline-block; background: #006C35; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
          متابعة طلباتي
        </a>
      </div>
    </div>
  `,
  welcome: (title: string, body: string) => `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(to left, #006C35, #00A651); padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0;">مرحباً بك في قِمّة! 🎉</h1>
      </div>
      <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 12px 12px;">
        <h2 style="color: #111827;">${title}</h2>
        <p style="color: #6b7280;">${body}</p>
        <a href="https://qimma.sa/dashboard" style="display: inline-block; background: #006C35; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
          ابدأ رحلتك المهنية
        </a>
      </div>
    </div>
  `,
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const payload: NotificationPayload = await req.json();

    // Insert in-app notification
    await supabase.from('notifications').insert({
      user_id:  payload.userId,
      type:     payload.type,
      title:    payload.title,
      body:     payload.body,
      link:     payload.link,
      metadata: payload.metadata ?? {},
    });

    // Optionally send email
    if (payload.sendEmail && payload.userEmail) {
      const template = EMAIL_TEMPLATES[payload.type as keyof typeof EMAIL_TEMPLATES]
        || EMAIL_TEMPLATES.welcome;
      const html = template(payload.title, payload.body || '');
      await sendEmail(payload.userEmail, payload.title, html);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
