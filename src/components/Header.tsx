import React from 'react';
import {
  Tv,
  Plus,
  FileSpreadsheet,
  MessageSquare,
  Download,
  RefreshCw,
  Users,
  DownloadCloud,
  FileCode,
  User
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  userName?: string;
  onEditUserName?: () => void;
  onAddNewClient: () => void;
  onAddNewToolNote: () => void;
  activeTab: 'clients' | 'tools';
  onChangeTab: (tab: 'clients' | 'tools') => void;
  clientsCount: number;
  notesCount: number;
  onOpenSheets: () => void;
  onOpenWhatsAppTemplate: () => void;
  onOpenSingleFileExport: () => void;
  isSheetsConfigured: boolean;
  isSyncing: boolean;
  onSync: () => void;
  currency: string;
}

export const Header: React.FC<HeaderProps> = ({
  userName,
  onEditUserName,
  onAddNewClient,
  onAddNewToolNote,
  activeTab,
  onChangeTab,
  clientsCount,
  notesCount,
  onOpenSheets,
  onOpenWhatsAppTemplate,
  onOpenSingleFileExport,
  isSheetsConfigured,
  isSyncing,
  onSync,
}) => {
  const { isInstallable, install, isInstalled } = usePWAInstall();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pt-2.5 sm:pt-3 pb-2 sm:pb-2.5">
        {/* Top Bar: Responsive Layout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-2.5">
          {/* Logo & App Name + Mobile User Greeting */}
          <div className="flex items-center justify-between gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/20 shrink-0">
                <Tv className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                    IPTV <span className="text-emerald-400">Pro</span>
                  </h1>
                  <span className="text-[10px] bg-slate-800 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold">
                    مجاني ♾️
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 hidden xs:block">
                  إدارة اشتراكات وعملاء الـ IPTV والأدوات
                </p>
              </div>
            </div>

            {/* Mobile User Greeting Badge */}
            {userName && (
              <button
                onClick={onEditUserName}
                className="sm:hidden flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 text-slate-200 px-2.5 py-1 rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm shrink-0"
                title="تعديل اسم المستخدم"
              >
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <User className="w-2.5 h-2.5" />
                </div>
                <span className="text-emerald-300 font-bold max-w-[85px] truncate">
                  {userName}
                </span>
              </button>
            )}
          </div>

          {/* Action Controls & Tools - Horizontally Scrollable on Mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5 sm:py-0 w-full sm:w-auto shrink-0">
            {/* Desktop User Greeting Badge */}
            {userName && (
              <button
                onClick={onEditUserName}
                className="hidden sm:flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm shrink-0"
                title="تعديل اسم المستخدم"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <User className="w-3 h-3" />
                </div>
                <span className="text-slate-400">أهلاً بك،</span>
                <span className="text-emerald-300 font-bold max-w-[130px] truncate">
                  {userName}
                </span>
              </button>
            )}

            {/* Dynamic Add CTA Button */}
            {activeTab === 'clients' ? (
              <button
                onClick={onAddNewClient}
                className="shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-slate-950 font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>عميل جديد</span>
              </button>
            ) : (
              <button
                onClick={onAddNewToolNote}
                className="shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-slate-950 font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>أداة جديدة</span>
              </button>
            )}

            {/* Google Sheets Modal Button */}
            <button
              onClick={onOpenSheets}
              className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                isSheetsConfigured
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/40'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
              title="إعدادات شيت جوجل والنسخ الاحتياطي"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isSheetsConfigured ? 'شيت جوجل (متصل)' : 'شيت جوجل'}</span>
            </button>

            {/* WhatsApp Template Editor */}
            <button
              onClick={onOpenWhatsAppTemplate}
              className="shrink-0 p-2 rounded-xl border border-slate-700 bg-slate-800/80 text-emerald-400 hover:bg-slate-700 transition cursor-pointer"
              title="تخصيص نص رسالة الواتساب للتجديد"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            {/* Quick Sync Button if configured */}
            {isSheetsConfigured && (
              <button
                onClick={onSync}
                disabled={isSyncing}
                className={`shrink-0 p-2 rounded-xl border border-slate-700 hover:border-emerald-500/50 bg-slate-800/80 text-slate-300 hover:text-emerald-400 transition cursor-pointer ${
                  isSyncing ? 'animate-spin text-emerald-400' : ''
                }`}
                title="مزامنة فورية مع شيت جوجل"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            {/* Single File Export Modal */}
            <button
              onClick={onOpenSingleFileExport}
              className="shrink-0 flex items-center gap-1 text-slate-300 hover:text-white border border-slate-700 bg-slate-800/60 hover:bg-slate-800 px-2.5 py-1.5 rounded-xl text-xs transition cursor-pointer"
              title="تصدير كود HTML أحادي مستقل"
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>ملف HTML</span>
            </button>

            {/* In-app install button if installable */}
            {isInstallable && !isInstalled && (
              <button
                onClick={install}
                className="shrink-0 flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
                title="تثبيت التطبيق على الجهاز"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تثبيت</span>
              </button>
            )}
          </div>
        </div>

        {/* Primary Navigation Tabs Switcher (Clients vs Tools & Downloader Codes) */}
        <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-slate-800/80 w-full sm:max-w-md mx-auto sm:mx-0">
          <button
            onClick={() => onChangeTab('clients')}
            className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'clients'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>العملاء والاشتراكات</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                activeTab === 'clients' ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {clientsCount}
            </span>
          </button>

          <button
            onClick={() => onChangeTab('tools')}
            className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'tools'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <DownloadCloud className="w-4 h-4 shrink-0" />
            <span>الملاحظات والأكواد</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                activeTab === 'tools' ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {notesCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
