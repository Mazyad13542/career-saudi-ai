export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, mobile, email, notes } = req.body;

  if (!name || !mobile) {
    return res.status(400).json({ error: 'الاسم والجوال مطلوبان' });
  }

  const payload = {
    title: 'باقة قِمّة الكاملة',
    value: 199,
    currency: 'SAR',
    products: [
      {
        title: 'باقة قِمّة الكاملة — ٦ خدمات مهنية',
        price: 199,
        qty: 1,
      },
    ],
    clientName: name,
    clientMobile: mobile.startsWith('966') ? mobile : `966${mobile.replace(/^0/, '')}`,
    clientEmail: email || '',
    note: notes || '',
    callBackUrl: `${process.env.SITE_URL || 'https://career-saudi-ai-r2wd.vercel.app'}/payment-success`,
    cancelUrl: `${process.env.SITE_URL || 'https://career-saudi-ai-r2wd.vercel.app'}/order`,
    supportedCardBrands: ['mada', 'VISA', 'MASTERCARD'],
    displayPending: true,
  };

  try {
    const response = await fetch('https://restpaylink.sa/api/getInvoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_id': process.env.PAYLINK_API_ID,
        'secret_key': process.env.PAYLINK_SECRET_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.url) {
      console.error('PayLink error:', JSON.stringify(data));
      return res.status(500).json({ error: 'فشل في إنشاء رابط الدفع', details: data, status: response.status });
    }

    return res.status(200).json({ url: data.url, transactionNo: data.transactionNo });
  } catch (err) {
    console.error('PayLink fetch error:', err);
    return res.status(500).json({ error: 'خطأ في الاتصال بخادم الدفع' });
  }
}
