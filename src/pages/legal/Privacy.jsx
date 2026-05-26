import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const SECTIONS = [
  {
    title: 'المعلومات التي نجمعها',
    items: [
      { label: 'بيانات الحساب', text: 'الاسم الكامل، عنوان البريد الإلكتروني، رقم الجوال (اختياري)، المدينة.' },
      { label: 'بيانات الملف المهني', text: 'المسمى الوظيفي، الخبرات المهنية، التعليم، المهارات، الشهادات، المشاريع.' },
      { label: 'السيرة الذاتية', text: 'ملفات السيرة الذاتية التي ترفعها، مخزّنة بشكل آمن في خوادم Supabase.' },
      { label: 'بيانات الاستخدام', text: 'الصفحات التي تزورها، الوظائف التي تتقدّم إليها، جلسات المقابلات التدريبية.' },
      { label: 'بيانات الدفع', text: 'رقم الطلب من PayPal ومبلغ الاشتراك فقط. لا نخزّن أرقام البطاقات الائتمانية.' },
    ],
  },
  {
    title: 'كيف نستخدم معلوماتك',
    items: [
      { label: 'تقديم الخدمة', text: 'تخصيص توصيات الوظائف، حساب نقاط الملف المهني، عرض الإحصائيات.' },
      { label: 'التواصل', text: 'إرسال إشعارات الوظائف الجديدة، تذكيرات الاشتراك، وردود على استفساراتك.' },
      { label: 'تحسين المنصة', text: 'تحليل أنماط الاستخدام (بشكل مجمّع وغير مُحدَّد الهوية) لتطوير الخدمات.' },
      { label: 'الأمان', text: 'اكتشاف الاستخدام المشبوه وحماية حسابك من الاختراق.' },
    ],
  },
  {
    title: 'مشاركة البيانات مع أطراف ثالثة',
    items: [
      { label: 'Supabase', text: 'مزوّد قاعدة البيانات والمصادقة. بياناتك مخزّنة في خوادم Supabase الأوروبية المشفّرة.' },
      { label: 'PayPal', text: 'معالجة المدفوعات فقط. يخضع PayPal لسياسة خصوصية مستقلة.' },
      { label: 'لا مبيعات', text: 'لا نبيع بياناتك الشخصية لأي جهة تسويقية أو إعلانية.' },
      { label: 'الإفصاح القانوني', text: 'قد نُفصح عن البيانات إذا استوجب ذلك القانون أو حكم قضائي.' },
    ],
  },
  {
    title: 'حقوقك على بياناتك',
    items: [
      { label: 'الاطلاع', text: 'يمكنك طلب نسخة من جميع البيانات المخزّنة عنك.' },
      { label: 'التصحيح', text: 'يمكنك تعديل بياناتك مباشرةً من إعدادات حسابك.' },
      { label: 'الحذف', text: 'يمكنك طلب حذف حسابك وجميع بياناتك نهائياً عبر الإعدادات أو مراسلتنا.' },
      { label: 'الاعتراض', text: 'يمكنك الاعتراض على معالجة بياناتك لأغراض تسويقية.' },
      { label: 'النقل', text: 'يمكنك تصدير بياناتك بصيغة CSV من إعدادات الحساب.' },
    ],
  },
  {
    title: 'الأمان وحماية البيانات',
    body: `نطبّق معايير أمان عالية لحماية بياناتك، تشمل: تشفير البيانات أثناء النقل (TLS/HTTPS)، تشفير البيانات في حالة السكون، المصادقة الثنائية (2FA) المتاحة عبر Supabase Auth، وعمليات تدقيق أمني دورية. ومع ذلك، لا يوجد نظام آمن بالكامل، وننصحك باستخدام كلمة مرور قوية وفريدة لحسابك.`,
  },
  {
    title: 'ملفات تعريف الارتباط (Cookies)',
    body: `نستخدم ملفات تعريف ارتباط ضرورية فقط للحفاظ على جلسة تسجيل الدخول. لا نستخدم ملفات تعريف ارتباط تتبعية لأغراض إعلانية. يمكنك تعطيلها من إعدادات متصفحك، غير أن ذلك قد يؤثر على وظائف المنصة.`,
  },
  {
    title: 'مدة الاحتفاظ بالبيانات',
    body: `نحتفظ ببياناتك طالما كان حسابك نشطاً. بعد حذف الحساب، تُحذف البيانات الشخصية خلال ٣٠ يوماً. تُحتفظ بعض البيانات المالية (رقم الطلب ومبلغه) لمدة سبع سنوات وفق متطلبات النظام السعودي.`,
  },
  {
    title: 'التغييرات على سياسة الخصوصية',
    body: `سنُبلّغك بأي تغييرات جوهرية على هذه السياسة عبر البريد الإلكتروني أو إشعار داخل المنصة قبل ثلاثين يوماً من تطبيقها. استمرارك في استخدام المنصة بعد سريان التغييرات يُعدّ قبولاً لها.`,
  },
  {
    title: 'التواصل بشأن الخصوصية',
    body: `لأي استفسارات أو طلبات تتعلق ببياناتك الشخصية، تواصل مع مسؤول حماية البيانات لدينا عبر: privacy@qimma.sa`,
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10 text-right">
          <span className="text-xs font-bold text-[#006C35] bg-[#006C35]/10 px-3 py-1 rounded-full">قانوني</span>
          <h1 className="text-3xl font-black text-gray-900 mt-4 mb-2">سياسة الخصوصية</h1>
          <p className="text-gray-500 text-sm">آخر تحديث: يناير ٢٠٢٥</p>
          <p className="text-gray-600 mt-4 leading-relaxed">
            في قِمّة، نُولي حماية خصوصيتك أولوية قصوى. توضّح هذه السياسة أنواع البيانات التي نجمعها، وكيف نستخدمها، وحقوقك الكاملة عليها.
          </p>
        </div>

        <div className="space-y-8">
          {SECTIONS.map((s, i) => (
            <section key={i} className="border-b border-gray-100 pb-8 last:border-none">
              <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-3 flex-row-reverse">
                <span className="text-right flex-1">{s.title}</span>
                <span className="text-xs font-bold text-[#006C35] bg-[#006C35]/10 px-2 py-1 rounded-full flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
              </h2>
              {s.items ? (
                <div className="space-y-3">
                  {s.items.map((item, j) => (
                    <div key={j} className="flex gap-3 flex-row-reverse">
                      <span className="text-sm font-black text-gray-800 flex-shrink-0">{item.label}:</span>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 leading-relaxed text-sm text-right">{s.body}</p>
              )}
            </section>
          ))}
        </div>

        <div className="mt-12 p-6 bg-gray-50 rounded-2xl text-right">
          <p className="text-sm text-gray-500">
            للاطلاع على القواعد الحاكمة لاستخدام المنصة، يُرجى مراجعة{' '}
            <Link to="/terms" className="text-[#006C35] font-bold hover:underline">شروط الاستخدام</Link>.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
