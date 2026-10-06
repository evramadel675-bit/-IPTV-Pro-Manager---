import React, { useState, useEffect, useRef } from 'react';
import { X, RefreshCw, Calendar, DollarSign, TrendingUp, CheckCircle, MessageSquare } from 'lucide-react';
import { Client } from '../types/client';

interface RenewModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  onConfirmRenewal: (
    clientId: string,
    newExpiryDate: string,
    newCost: number,
    newSelling: number,
    newProfit: number
  ) => void;
  currency: string;
}

export const RenewModal: React.FC<RenewModalProps> = ({
  isOpen,
  onClose,
  client,
  onConfirmRenewal,
  currency,
}) => {
  const [selectedMonths, setSelectedMonths] = useState(12);
  const [newExpiry, setNewExpiry] = useState('');
  const [costPrice, setCostPrice] = useState<number | ''>(200);
  const [sellingPrice, setSellingPrice] = useState<number | ''>(350);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (client) {
      setCostPrice(client.costPrice);
      setSellingPrice(client.sellingPrice);
      computeExpiry(12);
    }
  }, [client, isOpen]);

  const computeExpiry = (months: number) => {
    setSelectedMonths(months);
    if (!client) return;

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let base = new Date();
    if (client.expiryDate) {
      const currentExp = new Date(client.expiryDate);
      currentExp.setHours(0, 0, 0, 0);
      // If current expiry is still in the future, renew from that date; otherwise from today
      if (currentExp.getTime() > now.getTime()) {
        base = currentExp;
      }
    }

    base.setMonth(base.getMonth() + months);
    const y = base.getFullYear();
    const m = String(base.getMonth() + 1).padStart(2, '0');
    const d = String(base.getDate()).padStart(2, '0');
    setNewExpiry(`${y}-${m}-${d}`);
  };

  if (!isOpen || !client) return null;

  const calculatedProfit = (Number(sellingPrice) || 0) - (Number(costPrice) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpiry) return;
    onConfirmRenewal(
      client.id,
      newExpiry,
      Number(costPrice) || 0,
      Number(sellingPrice) || 0,
      calculatedProfit
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">تجديد اشتراك العميل</h2>
              <p className="text-xs text-slate-400">
                {client.name} — ({client.subscriptionType})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Current Expiry Banner */}
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">تاريخ الانتهاء الحالي:</span>
            <span className="font-mono font-bold text-amber-300">{client.expiryDate}</span>
          </div>

          {/* Quick Duration Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              مدة التجديد المطلوبة:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { months: 1, label: '+ شهر' },
                { months: 3, label: '+ 3 شهور' },
                { months: 6, label: '+ 6 شهور' },
                { months: 12, label: '+ سنة' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.months}
                  onClick={() => computeExpiry(opt.months)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition ${
                    selectedMonths === opt.months
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* New Expiry Date */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              تاريخ الانتهاء الجديد بعد التجديد:
            </label>
            <div
              className="relative cursor-pointer group"
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
                value={newExpiry}
                onChange={(e) => setNewExpiry(e.target.value)}
                onClick={(e) => {
                  try {
                    (e.target as HTMLInputElement).showPicker?.();
                  } catch (err) {}
                }}
                dir="ltr"
                className="w-full bg-slate-900 border border-slate-700 group-hover:border-slate-600 focus:border-emerald-500 rounded-xl pl-3.5 pr-10 py-2.5 text-sm sm:text-base font-mono text-left text-emerald-300 font-bold outline-none cursor-pointer transition select-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:z-10"
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
          </div>

          {/* Price & Profit Update */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                سعر التكلفة ({currency})
              </label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                سعر البيع ({currency})
              </label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Profit Preview */}
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2.5 flex items-center justify-between text-xs">
            <span className="text-emerald-300 font-medium">الربح من هذا التجديد:</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              +{calculatedProfit} {currency}
            </span>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs sm:text-sm shadow-md transition"
            >
              <CheckCircle className="w-4 h-4" />
              <span>تأكيد التجديد وتحديث التاريخ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
