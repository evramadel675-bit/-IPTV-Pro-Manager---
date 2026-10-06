import React, { useState } from 'react';
import { User, Sparkles, CheckCircle2, ShieldCheck, HeartHandshake, X } from 'lucide-react';

interface WelcomeOnboardingModalProps {
  isOpen: boolean;
  onSaveName: (name: string) => void;
  currentName?: string;
  isInitialSetup?: boolean;
  onClose?: () => void;
}

export const WelcomeOnboardingModal: React.FC<WelcomeOnboardingModalProps> = ({
  isOpen,
  onSaveName,
  currentName = '',
  isInitialSetup = true,
  onClose,
}) => {
  const [name, setName] = useState(currentName);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('يرجى كتابة اسمك للمتابعة');
      return;
    }
    if (trimmed.length < 2) {
      setError('يرجى إدخال اسم صحيح (حرفين على الأقل)');
      return;
    }
    setError('');
    onSaveName(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-emerald-500/10 text-right">
        {/* Optional close button if user is only editing an existing name */}
        {!isInitialSetup && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Icon & Glow */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="relative mb-3 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 shadow-xl shadow-emerald-500/25">
            <Sparkles className="w-8 h-8" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>نسخة مجانية ومفتوحة بالكامل مدى الحياة ♾️</span>
          </span>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {isInitialSetup ? 'مرحباً بك في IPTV Pro Manager!' : 'تعديل اسم المستخدم'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm">
            {isInitialSetup
              ? 'البرنامج مجاني ومفتوح بالكامل بدون أي أكواد تفعيل. يرجى إدخال اسمك الكريم لتخصيص تجربة العمل:'
              : 'يمكنك تحديث اسمك المعروض في شريط التطبيق:'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              الاسم الكريم <span className="text-emerald-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="اكتب اسمك هنا (مثال: م. أحمد عبد الله)"
                className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-2xl pl-3 pr-11 py-3 text-sm text-white placeholder-slate-500 outline-none transition"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 flex items-center justify-center pointer-events-none">
                <User className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            {error && (
              <p className="text-xs text-rose-400 mt-1.5 font-medium">{error}</p>
            )}
          </div>

          {/* Highlights for initial setup */}
          {isInitialSetup && (
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-[11px]">
                <HeartHandshake className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>مميزات النسخة المجانية:</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-400 pr-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>استخدام مجاني دائم وبلا قيود وبدون كلمات مرور.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>إدارة الاشتراكات، حساب الأرباح، وتنبيهات الواتساب.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>حفظ فوري ومشفر لكافة بيانات عملائك محلياً.</span>
                </li>
              </ul>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.99] text-slate-950 font-black py-3 rounded-2xl text-sm shadow-lg shadow-emerald-500/25 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{isInitialSetup ? 'دخول وبدء استخدام البرنامج 🚀' : 'حفظ التعديل'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
