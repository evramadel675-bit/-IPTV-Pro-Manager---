import React from 'react';
import { Search, X, Filter, Calendar, Tag, ArrowUpDown } from 'lucide-react';
import { ExpiryFilter } from '../types/client';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  expiryFilter: ExpiryFilter;
  onExpiryFilterChange: (f: ExpiryFilter) => void;
  selectedProvider: string;
  onProviderChange: (p: string) => void;
  availableProviders: string[];
  sortBy: string;
  onSortChange: (s: string) => void;
  filteredCount: number;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  expiryFilter,
  onExpiryFilterChange,
  selectedProvider,
  onProviderChange,
  availableProviders,
  sortBy,
  onSortChange,
  filteredCount,
  totalCount,
}) => {
  const filterTabs: { id: ExpiryFilter; label: string; badgeColor?: string }[] = [
    { id: 'all', label: 'الكل' },
    { id: 'expiring_week', label: 'تنتهي هذا الأسبوع', badgeColor: 'bg-amber-500/20 text-amber-300' },
    { id: 'expiring_today', label: 'تنتهي اليوم', badgeColor: 'bg-rose-500/20 text-rose-300' },
    { id: 'expiring_month', label: 'تنتهي هذا الشهر' },
    { id: 'expired', label: 'منتهية الصلاحية', badgeColor: 'bg-rose-900/40 text-rose-300' },
    { id: 'active', label: 'سارية ونشطة' },
  ];

  return (
    <div className="space-y-2.5 sm:space-y-3 mb-4">
      {/* Search Input & Sort Selector Row */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث بالاسم، رقم الهاتف، الكود، السيرفر..."
            className="w-full bg-slate-900/90 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pr-10 pl-9 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 transition outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Provider Filter & Sort Selectors: 2 columns on mobile, row on desktop */}
        <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex sm:items-center">
          {/* Provider Filter Select */}
          <div className="relative w-full sm:w-auto">
            <select
              value={selectedProvider}
              onChange={(e) => onProviderChange(e.target.value)}
              className="w-full sm:w-auto bg-slate-900 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl px-2.5 sm:px-3 py-2 sm:py-2.5 appearance-none pr-7 sm:pr-8 pl-3 focus:border-emerald-500 outline-none cursor-pointer truncate"
            >
              <option value="all">كل السيرفرات</option>
              {availableProviders.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <Tag className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort Selector */}
          <div className="relative w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full sm:w-auto bg-slate-900 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl px-2.5 sm:px-3 py-2 sm:py-2.5 appearance-none pr-7 sm:pr-8 pl-3 focus:border-emerald-500 outline-none cursor-pointer truncate"
            >
              <option value="expiry_asc">تاريخ الانتهاء (الأقرب)</option>
              <option value="expiry_desc">تاريخ الانتهاء (الأبعد)</option>
              <option value="newest">الأحدث إضافة</option>
              <option value="profit_desc">الأعلى ربحاً</option>
              <option value="name">اسم العميل (أبجدياً)</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Expiry Quick Filter Tabs with Responsive Flex Wrap */}
      <div className="flex items-center gap-1.5 flex-wrap text-xs pt-0.5">
        {filterTabs.map((tab) => {
          const isActive = expiryFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onExpiryFilterChange(tab.id)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              {tab.id === 'expiring_week' && !isActive && (
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse" />
              )}
            </button>
          );
        })}

        {/* Counter Tag */}
        <span className="mr-auto whitespace-nowrap text-[11px] text-slate-500 py-1">
          عرض {filteredCount} من أصل {totalCount} عميل
        </span>
      </div>
    </div>
  );
};
