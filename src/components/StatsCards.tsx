import React from 'react';
import { Users, CheckCircle2, AlertTriangle, XCircle, TrendingUp, DollarSign } from 'lucide-react';
import { Client } from '../types/client';

interface StatsCardsProps {
  clients: Client[];
  currency: string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ clients, currency }) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const totalClients = clients.length;

  let activeCount = 0;
  let expiringWeekCount = 0;
  let expiredCount = 0;
  let totalRevenue = 0;
  let totalCost = 0;
  let totalProfit = 0;

  clients.forEach((c) => {
    totalRevenue += Number(c.sellingPrice || 0);
    totalCost += Number(c.costPrice || 0);
    totalProfit += Number(c.profit || 0);

    if (!c.expiryDate) return;
    const expDate = new Date(c.expiryDate);
    expDate.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      expiredCount++;
    } else {
      activeCount++;
      if (diffDays <= 7) {
        expiringWeekCount++;
      }
    }
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 my-3 sm:my-4">
      {/* 1. Total Clients */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 border border-slate-800 hover:border-slate-700 transition">
        <div className="flex items-center justify-between mb-1 gap-1">
          <span className="text-[11px] sm:text-xs text-slate-400 font-medium truncate">إجمالي العملاء</span>
          <div className="p-1 sm:p-1.5 bg-blue-500/10 text-blue-400 rounded-lg shrink-0">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-lg sm:text-xl lg:text-2xl font-black text-white">{totalClients}</span>
          <span className="text-[10px] sm:text-[11px] text-slate-500 font-normal shrink-0">مشترك</span>
        </div>
      </div>

      {/* 2. Active Subs */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 border border-emerald-950/40 hover:border-emerald-500/30 transition">
        <div className="flex items-center justify-between mb-1 gap-1">
          <span className="text-[11px] sm:text-xs text-slate-400 font-medium truncate">سارية ونشطة</span>
          <div className="p-1 sm:p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-lg sm:text-xl lg:text-2xl font-black text-emerald-400">{activeCount}</span>
          <span className="text-[10px] sm:text-[11px] text-slate-500 font-normal shrink-0">اشتراك</span>
        </div>
      </div>

      {/* 3. Expiring This Week */}
      <div className={`glass-card rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 border transition ${
        expiringWeekCount > 0
          ? 'border-amber-500/40 bg-amber-950/20 shadow-lg shadow-amber-950/30'
          : 'border-slate-800'
      }`}>
        <div className="flex items-center justify-between mb-1 gap-1">
          <span className="text-[11px] sm:text-xs text-amber-300 font-medium truncate">تنتهي هذا الأسبوع</span>
          <div className={`p-1 sm:p-1.5 rounded-lg shrink-0 ${expiringWeekCount > 0 ? 'bg-amber-500/20 text-amber-400 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
            <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-lg sm:text-xl lg:text-2xl font-black text-amber-400">{expiringWeekCount}</span>
          <span className="text-[10px] sm:text-[11px] text-amber-400/80 font-normal shrink-0">للتجديد</span>
        </div>
      </div>

      {/* 4. Expired Subs */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 border border-slate-800 hover:border-rose-950/50 transition">
        <div className="flex items-center justify-between mb-1 gap-1">
          <span className="text-[11px] sm:text-xs text-slate-400 font-medium truncate">منتهية الصلاحية</span>
          <div className="p-1 sm:p-1.5 bg-rose-500/10 text-rose-400 rounded-lg shrink-0">
            <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-lg sm:text-xl lg:text-2xl font-black text-rose-400">{expiredCount}</span>
          <span className="text-[10px] sm:text-[11px] text-slate-500 font-normal shrink-0">منتهي</span>
        </div>
      </div>

      {/* 5. Total Net Profit */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 to-slate-900/50 transition">
        <div className="flex items-center justify-between mb-1 gap-1">
          <span className="text-[11px] sm:text-xs text-emerald-300 font-bold truncate">صافي الأرباح</span>
          <div className="p-1 sm:p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0">
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1 overflow-hidden">
          <span className="text-base sm:text-lg lg:text-xl xl:text-2xl font-black text-emerald-400 truncate">
            {totalProfit.toLocaleString('en-US')}
          </span>
          <span className="text-[10px] sm:text-[11px] text-emerald-300 font-medium shrink-0">{currency}</span>
        </div>
      </div>

      {/* 6. Total Revenue & Cost */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 border border-slate-800 transition">
        <div className="flex items-center justify-between mb-1 gap-1">
          <span className="text-[11px] sm:text-xs text-slate-400 font-medium truncate">إجمالي المبيعات</span>
          <div className="p-1 sm:p-1.5 bg-purple-500/10 text-purple-400 rounded-lg shrink-0">
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1 overflow-hidden">
          <span className="text-base sm:text-lg lg:text-xl xl:text-2xl font-black text-white truncate">
            {totalRevenue.toLocaleString('en-US')}
          </span>
          <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium shrink-0">{currency}</span>
        </div>
      </div>
    </div>
  );
};
