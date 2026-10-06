import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X, Smartphone } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // If already running in standalone mode or user dismissed this session
  if (isInstalled || dismissed) {
    return null;
  }

  // Android / Chromium install flow
  if (isInstallable) {
    return (
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 border-b border-emerald-500/30 px-4 py-2.5 text-slate-100 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Smartphone className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">تثبيت التطبيق على هاتفك (PWA)</p>
              <p className="text-xs text-slate-300 hidden sm:block">
                ثبّت التطبيق ليعمل كتطبيق أصلي سريع وبدون شريط المتصفح حتى في وضع عدم الاتصال
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={install}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs md:text-sm shadow-md transition"
            >
              <Download className="w-4 h-4" />
              <span>تثبيت الآن</span>
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="text-slate-400 hover:text-white p-1 rounded-md"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border-b border-emerald-500/30 px-4 py-2 text-slate-100 shadow-md">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                <Smartphone className="w-4 h-4" />
              </div>
              <p className="text-xs md:text-sm text-slate-200">
                يمكنك تثبيت هذا التطبيق على الآيفون كـ <strong className="text-emerald-400 font-semibold">تطبيق مستقل</strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowIOSGuide(true)}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3 py-1 rounded-lg text-xs transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>كيفية التثبيت على iOS</span>
              </button>
              <button
                onClick={() => setDismissed(true)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">تثبيت التطبيق على آيفون / آيباد</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-sm text-slate-300 my-4">
                <div className="flex items-start gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg shrink-0 mt-0.5">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block mb-0.5">1. اضغط على زر المشاركة (Share)</span>
                    <span className="text-xs text-slate-400">ستجده في أسفل متصفح Safari أو بأعلى الشاشة في iPad.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0 mt-0.5">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block mb-0.5">2. اختر "إضافة إلى الشاشة الرئيسية"</span>
                    <span className="text-xs text-slate-400">مرر للأسفل في القائمة واضغط على "Add to Home Screen".</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg shrink-0 mt-0.5">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block mb-0.5">3. اضغط "إضافة" (Add)</span>
                    <span className="text-xs text-slate-400">سيظهر تطبيق IPTV Pro على شاشتك الرئيسية كأي تطبيق أصلي!</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-2 w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold py-2.5 text-sm text-slate-950 transition shadow-lg"
              >
                فهمت، شكراً لك!
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
