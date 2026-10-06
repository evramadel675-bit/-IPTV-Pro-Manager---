import React, { useState } from 'react';
import {
  ShieldAlert,
  Smartphone,
  Copy,
  Check,
  KeyRound,
  MessageCircle,
  Sparkles,
  Lock,
  Unlock,
  AlertTriangle,
  Code2,
  Terminal,
  Settings
} from 'lucide-react';
import {
  verifyActivationKey,
  saveLicense,
  generateActivationKey,
  SECRET_KEY,
  DEVELOPER_PHONE,
  LIFETIME_EXPIRY,
  isLifetimeExpiry,
} from '../services/licensing';

interface ActivationScreenProps {
  deviceId: string;
  onActivated: (expiryDate: string) => void;
  expiredDate?: string;
}

export const ActivationScreen: React.FC<ActivationScreenProps> = ({
  deviceId,
  onActivated,
  expiredDate,
}) => {
  const [inputKey, setInputKey] = useState('');
  const [copiedDevice, setCopiedDevice] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isActivating, setIsActivating] = useState(false);

  // Admin Key Generator Tool for Eng. Evram Adel
  const [showAdminTool, setShowAdminTool] = useState(false);
  const [adminSecretInput, setAdminSecretInput] = useState('');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [genTargetDeviceId, setGenTargetDeviceId] = useState(deviceId);
  const [genDuration, setGenDuration] = useState<'1' | '3' | '6' | '12' | 'lifetime'>('12');
  const [generatedKey, setGeneratedKey] = useState('');
  const [copiedGenKey, setCopiedGenKey] = useState(false);

  const copyDeviceId = () => {
    navigator.clipboard.writeText(deviceId);
    setCopiedDevice(true);
    setTimeout(() => setCopiedDevice(false), 2500);
  };

  const handleWhatsAppContact = () => {
    const message = `مرحباً مهندس إفرام عادل،\nأرغب في تفعيل برنامج IPTV Pro Manager لرقم جهازي:\n*${deviceId}*\nيرجى تزويدي بكود التفعيل.`;
    const url = `https://wa.me/${DEVELOPER_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsActivating(true);

    setTimeout(() => {
      const result = verifyActivationKey(inputKey, deviceId);
      setIsActivating(false);

      if (result.valid && result.expiryDate) {
        saveLicense(inputKey.trim(), result.expiryDate);
        onActivated(result.expiryDate);
      } else {
        setErrorMessage(result.error || 'كود التفعيل غير صحيح');
      }
    }, 400);
  };

  // Admin generator handler
  const handleGenerateKey = () => {
    if (!genTargetDeviceId.trim()) return;
    let expStr: string;
    if (genDuration === 'lifetime') {
      expStr = LIFETIME_EXPIRY;
    } else {
      const exp = new Date();
      exp.setMonth(exp.getMonth() + parseInt(genDuration, 10));
      expStr = exp.toISOString().split('T')[0];
    }
    const key = generateActivationKey(genTargetDeviceId.trim(), expStr);
    setGeneratedKey(key);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminSecretInput.trim() === SECRET_KEY) {
      setIsAdminUnlocked(true);
      setGenTargetDeviceId(deviceId);
    } else {
      alert('كلمة المرور السرية غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between items-center p-4 relative overflow-hidden select-none">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar / App Branding */}
      <div className="w-full max-w-md flex items-center justify-between pt-3 pb-2 z-10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black text-white">
              IPTV <span className="text-emerald-400">Pro</span>
            </h1>
            <p className="text-[10px] text-slate-400">نسخة العميل النهائي (Client Edition)</p>
          </div>
        </div>

        <button
          onClick={() => setShowAdminTool(true)}
          className="text-slate-600 hover:text-slate-400 p-2 rounded-lg transition"
          title="أداة المطور لتوليد الأكواد"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Main Activation Card */}
      <div className="w-full max-w-md my-auto z-10">
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Top lock badge */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 shadow-lg shadow-emerald-500/10">
              <KeyRound className="w-8 h-8 animate-pulse" />
            </div>

            <h2 className="text-lg sm:text-xl font-black text-white mb-1">
              {expiredDate ? 'انتهت فترة تفعيل البرنامج' : 'تفعيل برنامج IPTV Pro'}
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              {expiredDate
                ? `انتهت صلاحية النسخة بتاريخ (${expiredDate}). تواصل مع المهندس إفرام عادل لتجديد التفعيل.`
                : 'هذه النسخة مخصصة لجهازك فقط، يرجى تزويد المطور برقم الجهاز أدناه للحصول على كود التفعيل.'}
            </p>
          </div>

          {/* 1. Device ID Display */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>رقم الجهاز الخاص بك (Device ID):</span>
              </span>
              <span className="text-[10px] text-emerald-400/80 bg-emerald-950/60 px-2 py-0.5 rounded-full font-mono font-bold">
                فريد لجهازك
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <span
                className="font-mono text-sm sm:text-base font-black text-emerald-300 tracking-wider select-all truncate"
                dir="ltr"
              >
                {deviceId}
              </span>

              <button
                type="button"
                onClick={copyDeviceId}
                className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-95 text-emerald-400 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0"
              >
                {copiedDevice ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ رقم الجهاز</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 2. WhatsApp Contact Button */}
          <button
            type="button"
            onClick={handleWhatsAppContact}
            className="w-full flex items-center justify-center gap-2 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-bold py-3 px-4 rounded-2xl text-xs sm:text-sm mb-5 transition active:scale-98 shadow-md"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>تواصل مع المهندس إفرام عادل للتفعيل عبر الواتساب</span>
          </button>

          {/* 3. Activation Key Input Form */}
          <form onSubmit={handleActivate} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                كود التفعيل (Activation Key):
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={inputKey}
                  onChange={(e) => {
                    setInputKey(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="KEY-XXXXXXXX-XXXX..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-3 text-xs sm:text-sm font-mono text-emerald-300 placeholder-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Activate Button */}
            <button
              type="submit"
              disabled={isActivating || !inputKey.trim()}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-98 text-slate-950 font-black py-3 px-4 rounded-xl text-sm shadow-xl shadow-emerald-500/20 transition disabled:opacity-50 cursor-pointer"
            >
              {isActivating ? (
                <span>جاري التحقق من الكود...</span>
              ) : (
                <>
                  <Unlock className="w-4 h-4 stroke-[2.5]" />
                  <span>تفعيل البرنامج</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Developer Permanent Signature & Footer */}
      <footer className="w-full max-w-xl text-center py-3 z-10">
        <div className="flex flex-col items-center justify-center gap-1 text-xs text-slate-400">
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-center">
            <span className="p-1 rounded bg-emerald-500/15 text-emerald-400">
              <Code2 className="w-3.5 h-3.5" />
            </span>
            <span>تم التطوير بواسطة:</span>
            <strong className="text-white font-bold">مهندس إفرام عادل</strong>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-mono text-[11px] font-semibold" dir="ltr">
              Eng. Evram Adel - IT Support & Systems Engineeer
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            All Rights Reserved © 2026 IPTV Pro
          </span>
        </div>
      </footer>

      {/* Admin Key Generator Modal (For Eng. Evram Adel only) */}
      {showAdminTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl text-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>لوحة توليد الأكواد (المهندس إفرام عادل)</span>
              </div>
              <button
                onClick={() => {
                  setShowAdminTool(false);
                  setIsAdminUnlocked(false);
                  setAdminSecretInput('');
                  setGeneratedKey('');
                }}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {!isAdminUnlocked ? (
              <form onSubmit={handleAdminLogin} className="space-y-3">
                <p className="text-slate-400 text-xs">
                  أدخل المفتاح السري لتوليد أكواد التفعيل للعملاء:
                </p>
                <input
                  type="password"
                  placeholder="المفتاح السري..."
                  value={adminSecretInput}
                  onChange={(e) => setAdminSecretInput(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 rounded-xl"
                >
                  دخول للوحة التوليد
                </button>
              </form>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    رقم جهاز العميل (Client Device ID):
                  </label>
                  <input
                    type="text"
                    value={genTargetDeviceId}
                    onChange={(e) => setGenTargetDeviceId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 font-mono text-emerald-300 outline-none"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">مدة الاشتراك:</label>
                  <div className="grid grid-cols-5 gap-1">
                    {[
                      { id: '1', l: 'شهر' },
                      { id: '3', l: '3 شهور' },
                      { id: '6', l: '6 شهور' },
                      { id: '12', l: 'سنة' },
                      { id: 'lifetime', l: 'مدى الحياة ♾️' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setGenDuration(opt.id as any)}
                        className={`py-1.5 px-1 rounded-lg font-bold text-[11px] border transition ${
                          genDuration === opt.id
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {opt.l}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateKey}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 rounded-xl text-xs shadow-md"
                >
                  ⚡ توليد كود التفعيل الآن
                </button>

                {generatedKey && (
                  <div className="bg-slate-950 border border-emerald-500/40 p-3 rounded-xl space-y-2 mt-2">
                    <span className="text-[10px] text-slate-400 block font-bold">
                      كود التفعيل الجاهز للإرسال للعميل:
                    </span>
                    <p className="font-mono text-xs text-emerald-300 select-all break-all" dir="ltr">
                      {generatedKey}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedKey);
                          setCopiedGenKey(true);
                          setTimeout(() => setCopiedGenKey(false), 2000);
                        }}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-1.5 rounded-lg flex items-center justify-center gap-1"
                      >
                        {copiedGenKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedGenKey ? 'تم النسخ!' : 'نسخ الكود'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setInputKey(generatedKey);
                          setShowAdminTool(false);
                        }}
                        className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-500/30"
                      >
                        تطبيق على هذا الجهاز
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
