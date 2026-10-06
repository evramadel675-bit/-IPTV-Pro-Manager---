import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  User,
  Phone,
  Tv,
  Key,
  Globe,
  DollarSign,
  Calendar,
  FileText,
  Plus,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Client, AccountType } from '../types/client';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>, id?: string) => void;
  clientToEdit?: Client | null;
  availableProviders: string[];
  onAddCustomProvider: (name: string) => void;
  currency: string;
}

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  clientToEdit,
  availableProviders,
  onAddCustomProvider,
  currency,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subscriptionType, setSubscriptionType] = useState('Cobra');
  const [isAddingNewProvider, setIsAddingNewProvider] = useState(false);
  const [newProviderInput, setNewProviderInput] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('code');
  const [code, setCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [serverUrl, setServerUrl] = useState('');
  const [costPrice, setCostPrice] = useState<number | ''>(200);
  const [sellingPrice, setSellingPrice] = useState<number | ''>(350);
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Auto-calculated profit
  const calculatedProfit = (Number(sellingPrice) || 0) - (Number(costPrice) || 0);

  // Default expiry helper
  const addMonthsToDate = (months: number, baseDateStr?: string) => {
    const base = baseDateStr ? new Date(baseDateStr) : new Date();
    base.setMonth(base.getMonth() + months);
    const y = base.getFullYear();
    const m = String(base.getMonth() + 1).padStart(2, '0');
    const d = String(base.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  useEffect(() => {
    if (clientToEdit) {
      setName(clientToEdit.name);
      setPhone(clientToEdit.phone);
      setSubscriptionType(clientToEdit.subscriptionType || 'Cobra');
      setAccountType(clientToEdit.accountType || 'code');
      setCode(clientToEdit.code || '');
      setUsername(clientToEdit.username || '');
      setPassword(clientToEdit.password || '');
      setServerUrl(clientToEdit.serverUrl || '');
      setCostPrice(clientToEdit.costPrice ?? 0);
      setSellingPrice(clientToEdit.sellingPrice ?? 0);
      setExpiryDate(clientToEdit.expiryDate || '');
      setNotes(clientToEdit.notes || '');
    } else {
      // Defaults for new client
      setName('');
      setPhone('');
      setSubscriptionType(availableProviders[0] || 'Cobra');
      setAccountType('code');
      setCode('');
      setUsername('');
      setPassword('');
      setServerUrl('http://');
      setCostPrice(200);
      setSellingPrice(350);
      // Default expiry: 1 year from now
      setExpiryDate(addMonthsToDate(12));
      setNotes('');
    }
    setIsAddingNewProvider(false);
    setNewProviderInput('');
    setErrorMsg('');
  }, [clientToEdit, isOpen, availableProviders]);

  if (!isOpen) return null;

  const handleAddNewProvider = () => {
    if (!newProviderInput.trim()) return;
    const trimmed = newProviderInput.trim();
    onAddCustomProvider(trimmed);
    setSubscriptionType(trimmed);
    setIsAddingNewProvider(false);
    setNewProviderInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('يرجى إدخال اسم العميل');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('يرجى إدخال رقم الهاتف');
      return;
    }
    if (!expiryDate) {
      setErrorMsg('يرجى تحديد تاريخ الانتهاء');
      return;
    }

    if (accountType === 'code' && !code.trim()) {
      setErrorMsg('يرجى إدخال كود التفعيل');
      return;
    }

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      subscriptionType,
      accountType,
      code: accountType === 'code' ? code.trim() : undefined,
      username: accountType === 'credentials' ? username.trim() : undefined,
      password: accountType === 'credentials' ? password.trim() : undefined,
      serverUrl: accountType === 'credentials' ? serverUrl.trim() : undefined,
      costPrice: Number(costPrice) || 0,
      sellingPrice: Number(sellingPrice) || 0,
      profit: calculatedProfit,
      expiryDate,
      notes: notes.trim(),
    };

    onSave(payload, clientToEdit ? clientToEdit.id : undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {clientToEdit ? 'تعديل بيانات العميل' : 'إضافة عميل واشتراك جديد'}
              </h2>
              <p className="text-xs text-slate-400">
                تسجيل بيانات السيرفر، الأكواد، وحساب الأرباح تلقائياً
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* 1. Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                اسم العميل <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: أحمد محمود"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                رقم الهاتف (للواتساب والاتصال) <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="مثال: 01012345678"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  dir="ltr"
                />
                <Phone className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* 3. Subscription Type / Server */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300">
                نوع الاشتراك / سيرفر الـ IPTV <span className="text-emerald-400">*</span>
              </label>
              {!isAddingNewProvider && (
                <button
                  type="button"
                  onClick={() => setIsAddingNewProvider(true)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة شركة جديدة</span>
                </button>
              )}
            </div>

            {isAddingNewProvider ? (
              <div className="flex items-center gap-2 bg-slate-800/90 p-2 rounded-xl border border-emerald-500/40">
                <input
                  type="text"
                  value={newProviderInput}
                  onChange={(e) => setNewProviderInput(e.target.value)}
                  placeholder="اكتب اسم الشركة الجديدة (مثال: Aroma 4K)..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-white focus:border-emerald-500 outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddNewProvider}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs"
                >
                  إضافة
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingNewProvider(false)}
                  className="text-slate-400 hover:text-white px-2 py-1 text-xs"
                >
                  إلغاء
                </button>
              </div>
            ) : (
              <select
                value={subscriptionType}
                onChange={(e) => setSubscriptionType(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none cursor-pointer"
              >
                {availableProviders.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 4. Account Type Toggle: (كود فقط) أو (User / Password / URL) */}
          <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">نوع البيانات المسجلة:</span>
              <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-700">
                <button
                  type="button"
                  onClick={() => setAccountType('code')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    accountType === 'code'
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  كود فقط
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('credentials')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    accountType === 'credentials'
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  User / Password / URL
                </button>
              </div>
            </div>

            {/* If Code Only */}
            {accountType === 'code' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  كود الاشتراك <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required={accountType === 'code'}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="مثال: COBRA-88992211"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-emerald-300 focus:border-emerald-500 outline-none"
                    dir="ltr"
                  />
                  <Key className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            )}

            {/* If Credentials: 3 fields */}
            {accountType === 'credentials' && (
              <div className="space-y-2.5 pt-1">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    اسم المستخدم (Username)
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="مثال: user_vip_88"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono text-slate-100 focus:border-emerald-500 outline-none"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    كلمة المرور (Password)
                  </label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="مثال: pass9922"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono text-slate-100 focus:border-emerald-500 outline-none"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    رابط السيرفر (Server Host URL)
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={serverUrl}
                      onChange={(e) => setServerUrl(e.target.value)}
                      placeholder="http://iptv-server.com:8080"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono text-cyan-300 focus:border-cyan-500 outline-none"
                      dir="ltr"
                    />
                    <Globe className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5, 6, 7. Pricing & Automatic Profit Calculation */}
          <div className="bg-slate-800/40 p-3.5 rounded-2xl border border-slate-700/80 space-y-3">
            <span className="text-xs font-bold text-slate-300 block">
              الأسعار وحساب الأرباح التلقائي:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Cost Price */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  سعر التكلفة / الجملة ({currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-white focus:border-emerald-500 outline-none"
                />
              </div>

              {/* Selling Price */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  سعر البيع للعميل ({currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-white focus:border-emerald-500 outline-none"
                />
              </div>

              {/* Calculated Profit Badge */}
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-2.5 flex flex-col justify-center">
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold mb-0.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>الربح التلقائي:</span>
                </div>
                <div className="font-mono text-lg font-black text-emerald-300">
                  {calculatedProfit >= 0 ? `+${calculatedProfit}` : calculatedProfit} {currency}
                </div>
              </div>
            </div>
          </div>

          {/* 8. Expiry Date + Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300">
                تاريخ انتهاء الاشتراك <span className="text-emerald-400">*</span>
              </label>
            </div>
            <div
              className="relative mb-2 cursor-pointer group"
              onClick={() => {
                try {
                  dateInputRef.current?.focus();
                  dateInputRef.current?.showPicker?.();
                } catch (e) {}
              }}
            >
              <input
                ref={dateInputRef}
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                onClick={(e) => {
                  try {
                    (e.target as HTMLInputElement).showPicker?.();
                  } catch (err) {}
                }}
                dir="ltr"
                className="w-full bg-slate-900 border border-slate-700 group-hover:border-slate-600 focus:border-emerald-500 rounded-xl pl-3.5 pr-10 py-2.5 text-sm sm:text-base font-mono text-left text-slate-100 outline-none cursor-pointer transition select-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:z-10"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  try {
                    dateInputRef.current?.focus();
                    dateInputRef.current?.showPicker?.();
                  } catch (err) {}
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-300 transition p-1 flex items-center justify-center cursor-pointer z-20"
                title="فتح التقويم"
              >
                <Calendar className="w-4 h-4 pointer-events-none" />
              </button>
            </div>

            {/* Quick Duration Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400 ml-1">تحديد سريع:</span>
              <button
                type="button"
                onClick={() => setExpiryDate(addMonthsToDate(1))}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700"
              >
                + شهر
              </button>
              <button
                type="button"
                onClick={() => setExpiryDate(addMonthsToDate(3))}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700"
              >
                + 3 شهور
              </button>
              <button
                type="button"
                onClick={() => setExpiryDate(addMonthsToDate(6))}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700"
              >
                + 6 شهور
              </button>
              <button
                type="button"
                onClick={() => setExpiryDate(addMonthsToDate(12))}
                className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-400 text-xs border border-emerald-500/40 font-bold"
              >
                + سنة كاملة
              </button>
            </div>
          </div>

          {/* 9. Optional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              ملاحظات إضافية (اختياري)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: نوع الشاشة، تطبيق المشغل (IBO Player/Smarters)، Mac Address..."
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:border-emerald-500 outline-none resize-none"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-6 py-2 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{clientToEdit ? 'حفظ التعديلات' : 'إضافة وتأكيد'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
