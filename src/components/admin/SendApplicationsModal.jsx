import { useState } from 'react';
import { Send, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { SAUDI_COMPANIES } from '../../data/saudiCompanies';

export default function SendApplicationsModal({ isOpen, onClose, clientInfo }) {
  const [phase, setPhase] = useState('confirm'); // 'confirm' | 'sending' | 'done'
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState({ sent: 0, failed: 0, total: 0 });

  if (!isOpen) return null;

  const handleClose = () => {
    // Reset state when closing
    setPhase('confirm');
    setProgress(0);
    setResults({ sent: 0, failed: 0, total: 0 });
    onClose();
  };

  const handleStart = async () => {
    setPhase('sending');
    setProgress(0);

    // Simulate incremental progress while the API call runs
    const total = SAUDI_COMPANIES.length;
    const batchSize = 50;
    const numBatches = Math.ceil(total / batchSize);
    const batchDelay = 600; // slightly more than API's 500ms delay

    // Start progress ticker in parallel
    let batchesDone = 0;
    const ticker = setInterval(() => {
      batchesDone += 1;
      const pct = Math.min(Math.round((batchesDone / numBatches) * 95), 95);
      setProgress(pct);
      if (batchesDone >= numBatches) clearInterval(ticker);
    }, batchDelay);

    try {
      const response = await fetch('/api/send-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientInfo,
          companies: SAUDI_COMPANIES,
        }),
      });

      clearInterval(ticker);
      setProgress(100);

      const data = await response.json();
      setResults({
        sent: data.sent ?? 0,
        failed: data.failed ?? 0,
        total: data.total ?? SAUDI_COMPANIES.length,
      });
    } catch (err) {
      clearInterval(ticker);
      setProgress(100);
      setResults({
        sent: 0,
        failed: SAUDI_COMPANIES.length,
        total: SAUDI_COMPANIES.length,
      });
    } finally {
      setPhase('done');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
      dir="rtl"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 mx-4 shadow-2xl">

        {/* ── Confirm phase ── */}
        {phase === 'confirm' && (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#006C35]/10 mb-4">
                <Send size={28} className="text-[#006C35]" />
              </div>
              <h2 className="text-xl font-black text-gray-900">
                تقديم على ٢٠٠ شركة
              </h2>
              {clientInfo?.full_name && (
                <p className="text-sm text-gray-500 mt-1">
                  للعميل: <span className="font-bold text-gray-700">{clientInfo.full_name}</span>
                </p>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
              <p className="text-sm text-amber-800 font-bold mb-1">تنبيه مهم</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                سيتم إرسال {SAUDI_COMPANIES.length} إيميل إلى شركات سعودية مختلفة.
                تأكد من إعداد <span className="font-mono font-bold">RESEND_API_KEY</span> في
                إعدادات Vercel قبل البدء.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleStart}
                className="flex-1 flex items-center justify-center gap-2 bg-[#006C35] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#005528] transition-colors"
              >
                <Send size={16} />
                ابدأ الإرسال
              </button>
              <button
                onClick={handleClose}
                className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 px-8 rounded-xl hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </>
        )}

        {/* ── Sending phase ── */}
        {phase === 'sending' && (
          <>
            <div className="text-center mb-8">
              <Loader2 size={40} className="animate-spin text-[#006C35] mx-auto mb-4" />
              <h2 className="text-xl font-black text-gray-900 mb-1">جاري الإرسال...</h2>
              <p className="text-sm text-gray-500">
                {Math.round((progress / 100) * SAUDI_COMPANIES.length)}/{SAUDI_COMPANIES.length} إيميل
              </p>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>التقدم</span>
                <span>{progress}%</span>
              </div>
              <div className="bg-gray-100 rounded-full h-3">
                <div
                  className="bg-[#006C35] rounded-full h-3 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <p className="text-center text-xs text-gray-400">
              يرجى عدم إغلاق هذه النافذة أثناء الإرسال
            </p>
          </>
        )}

        {/* ── Done phase ── */}
        {phase === 'done' && (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#006C35]/10 mb-4">
                <CheckCircle size={28} className="text-[#006C35]" />
              </div>
              <h2 className="text-xl font-black text-gray-900">اكتمل الإرسال</h2>
              <p className="text-sm text-gray-500 mt-1">
                تم معالجة {results.total} شركة
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-2xl p-4">
                <CheckCircle size={20} className="text-green-600 shrink-0" />
                <div>
                  <p className="text-sm font-black text-green-800">
                    أُرسل بنجاح: {results.sent} إيميل
                  </p>
                </div>
              </div>

              {results.failed > 0 && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl p-4">
                  <XCircle size={20} className="text-red-500 shrink-0" />
                  <div>
                    <p className="text-sm font-black text-red-700">
                      فشل: {results.failed} إيميل
                    </p>
                  </div>
                </div>
              )}

              {results.failed === 0 && (
                <div className="bg-[#006C35]/5 rounded-2xl p-4 text-center">
                  <p className="text-sm font-bold text-[#006C35]">
                    تم إرسال جميع الطلبات بنجاح
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleClose}
              className="w-full bg-[#006C35] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#005528] transition-colors"
            >
              إغلاق
            </button>
          </>
        )}
      </div>
    </div>
  );
}
