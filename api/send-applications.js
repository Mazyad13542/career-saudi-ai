export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { clientInfo, companies, fromEmail } = req.body;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) return res.status(500).json({ error: 'RESEND_API_KEY not configured' });

  const results = [];
  const batchSize = 50; // Send in batches of 50

  for (let i = 0; i < companies.length; i += batchSize) {
    const batch = companies.slice(i, i + batchSize);

    const emails = batch.map((company) => ({
      from:
        fromEmail ||
        `تقديمات مهنية <careers@${process.env.RESEND_FROM_DOMAIN || 'resend.dev'}>`,
      to: [company.hr_email],
      subject: `طلب وظيفة - ${clientInfo.full_name}${clientInfo.target_job ? ` - ${clientInfo.target_job}` : ''}`,
      html: generateEmailHTML(clientInfo, company),
    }));

    try {
      const response = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emails),
      });

      const data = await response.json();

      if (response.ok && data.data) {
        batch.forEach((company, idx) => {
          results.push({
            company: company.nameAr,
            email: company.hr_email,
            status: 'sent',
            id: data.data[idx]?.id,
          });
        });
      } else {
        batch.forEach((company) => {
          results.push({
            company: company.nameAr,
            email: company.hr_email,
            status: 'failed',
            error: data.message || 'Unknown error',
          });
        });
      }
    } catch (err) {
      batch.forEach((company) => {
        results.push({
          company: company.nameAr,
          email: company.hr_email,
          status: 'failed',
          error: err.message,
        });
      });
    }

    // Small delay between batches
    if (i + batchSize < companies.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  const sent = results.filter((r) => r.status === 'sent').length;
  const failed = results.filter((r) => r.status === 'failed').length;

  res.json({ success: true, total: results.length, sent, failed, results });
}

function generateEmailHTML(client, company) {
  const name = client.full_name || 'المتقدم';
  const phone = client.phone || '';
  const university = client.university || '';
  const degree = client.degree || '';
  const major = client.major || '';
  const expYears = client.experience_years || 'حديث التخرج';
  const lastJob = client.last_job_title || '';
  const skills = client.skills || '';
  const targetJob = client.target_job || 'وظيفة مناسبة';
  const languages = Array.isArray(client.languages)
    ? client.languages.join('، ')
    : client.languages || 'العربية';
  const linkedin = client.linkedin_url || '';

  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, sans-serif; direction: rtl; background: #f9f9f9; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #006C35, #00A651); padding: 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 22px; }
    .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px; }
    .body { padding: 30px; }
    .greeting { font-size: 16px; color: #1a1a1a; margin-bottom: 20px; line-height: 1.8; }
    .section { background: #f8f9fa; border-right: 3px solid #006C35; padding: 15px 20px; border-radius: 0 8px 8px 0; margin: 15px 0; }
    .section h3 { margin: 0 0 10px; color: #006C35; font-size: 14px; }
    .section p { margin: 5px 0; color: #444; font-size: 14px; line-height: 1.7; }
    .footer { background: #f0f4f0; padding: 20px 30px; text-align: center; }
    .footer p { color: #888; font-size: 12px; margin: 0; }
    .contact-btn { display: inline-block; background: #006C35; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>طلب انضمام لفريق ${company.nameAr}</h1>
      <p>${company.sector}</p>
    </div>
    <div class="body">
      <p class="greeting">
        السادة المسؤولين في ${company.nameAr} المحترمين،<br>
        السلام عليكم ورحمة الله وبركاته،
      </p>
      <p style="color:#444; line-height:1.9; font-size:15px;">
        يسعدني أن أتقدم بطلب للانضمام إلى فريقكم المتميز في <strong>${company.nameAr}</strong>،
        وذلك لشغل منصب <strong>${targetJob}</strong> أو أي منصب يتوافق مع مؤهلاتي وخبراتي.
      </p>

      <div class="section">
        <h3>المعلومات الشخصية</h3>
        <p><strong>الاسم:</strong> ${name}</p>
        ${phone ? `<p><strong>جوال:</strong> ${phone}</p>` : ''}
        ${languages ? `<p><strong>اللغات:</strong> ${languages}</p>` : ''}
      </div>

      <div class="section">
        <h3>المؤهل العلمي</h3>
        ${university ? `<p><strong>الجامعة:</strong> ${university}</p>` : ''}
        ${degree ? `<p><strong>الدرجة:</strong> ${degree}${major ? ` في ${major}` : ''}</p>` : ''}
      </div>

      ${
        lastJob || expYears
          ? `
      <div class="section">
        <h3>الخبرة المهنية</h3>
        ${expYears ? `<p><strong>سنوات الخبرة:</strong> ${expYears}</p>` : ''}
        ${lastJob ? `<p><strong>آخر مسمى وظيفي:</strong> ${lastJob}</p>` : ''}
      </div>`
          : ''
      }

      ${
        skills
          ? `
      <div class="section">
        <h3>المهارات</h3>
        <p>${skills}</p>
      </div>`
          : ''
      }

      <p style="color:#444; line-height:1.9; font-size:15px; margin-top:20px;">
        أؤمن بأن انضمامي لفريق ${company.nameAr} سيكون إضافة حقيقية، وأنا على استعداد تام لإجراء مقابلة في أي وقت مناسب لكم.
      </p>

      ${phone ? `<div style="text-align:center;"><a href="tel:${phone}" class="contact-btn">تواصل معي: ${phone}</a></div>` : ''}
      ${linkedin ? `<p style="text-align:center;"><a href="${linkedin}" style="color:#006C35;">ملفي على LinkedIn</a></p>` : ''}
    </div>
    <div class="footer">
      <p>مع خالص التحية والتقدير | ${name}</p>
    </div>
  </div>
</body>
</html>`;
}
