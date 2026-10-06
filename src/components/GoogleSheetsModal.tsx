import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Download,
  Upload,
  Layers,
  Code,
  HelpCircle,
  Save
} from 'lucide-react';
import { GOOGLE_APPS_SCRIPT_CODE } from '../utils/appsScriptCode';
import { testGoogleSheetsConnection, pushClientsToSheets, fetchClientsFromSheets } from '../services/googleSheets';
import { Client, AppSettings, SyncResult, ToolNote } from '../types/client';
import { generateFullBackup, parseAndValidateBackup } from '../services/storage';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  clients: Client[];
  onClientsLoaded: (clients: Client[]) => void;
  notes: ToolNote[];
  onNotesLoaded: (notes: ToolNote[]) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  clients,
  onClientsLoaded,
  notes,
  onNotesLoaded,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'setup' | 'code' | 'guide' | 'backup'>('setup');
  const [urlInput, setUrlInput] = useState(settings.googleSheetsUrl || '');
  const [isTesting, setIsTesting] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [testResult, setTestResult] = useState<SyncResult | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleSaveUrl = () => {
    onUpdateSettings({ ...settings, googleSheetsUrl: urlInput.trim() });
    onShowToast('تم حفظ رابط Google Sheets بنجاح', 'success');
  };

  const handleTestConnection = async () => {
    if (!urlInput.trim()) {
      setTestResult({ success: false, message: 'الرجاء إدخال رابط Web App أولاً' });
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    const res = await testGoogleSheetsConnection(urlInput.trim());
    setIsTesting(false);
    setTestResult(res);
    if (res.success) {
      onUpdateSettings({ ...settings, googleSheetsUrl: urlInput.trim() });
      onShowToast('تم التحقق من الاتصال بنجاح!', 'success');
    }
  };

  const handlePushAll = async () => {
    if (!urlInput.trim()) {
      onShowToast('يرجى حفظ رابط Web App أولاً', 'error');
      return;
    }
    setIsPushing(true);
    const res = await pushClientsToSheets(urlInput.trim(), clients);
    setIsPushing(false);
    if (res.success) {
      onShowToast(`تمت مزامنة وحفظ ${clients.length} عميل في شيت جوجل بنجاح!`, 'success');
    } else {
      onShowToast(res.message, 'error');
    }
  };

  const handlePullAll = async () => {
    if (!urlInput.trim()) {
      onShowToast('يرجى حفظ رابط Web App أولاً', 'error');
      return;
    }
    if (
      clients.length > 0 &&
      !window.confirm('هل تريد استبدال العملاء الحاليين بالبيانات المستوردة من شيت جوجل؟')
    ) {
      return;
    }

    setIsPulling(true);
    const res = await fetchClientsFromSheets(urlInput.trim());
    setIsPulling(false);
    if (res.success && res.clients) {
      onClientsLoaded(res.clients);
      onShowToast(`تم استيراد ${res.clients.length} عميل من شيت جوجل!`, 'success');
    } else {
      onShowToast(res.message, 'error');
    }
  };

  const copyScriptCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    onShowToast('تم نسخ كود Apps Script بالكامل!', 'success');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'الاسم', 'الهاتف', 'السيرفر', 'نوع_الحساب', 'الكود', 'المستخدم', 'كلمة_المرور', 'الرابط', 'التكلفة', 'البيع', 'الربح', 'تاريخ_الانتهاء', 'ملاحظات'];
    const rows = clients.map((c) => [
      c.id,
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.subscriptionType}"`,
      `"${c.accountType}"`,
      `"${c.code || ''}"`,
      `"${c.username || ''}"`,
      `"${c.password || ''}"`,
      `"${c.serverUrl || ''}"`,
      c.costPrice,
      c.sellingPrice,
      c.profit,
      `"${c.expiryDate}"`,
      `"${c.notes || ''}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `iptv_clients_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('تم تحميل ملف CSV بنجاح', 'success');
  };

  // Export comprehensive backup (Clients + Notes + Tools)
  const exportToJSON = () => {
    const fullBackup = generateFullBackup(clients, notes, settings);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `iptv_backup_full_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
    onShowToast(`تم تصدير النسخة الاحتياطية الشاملة (${clients.length} عميل و ${notes.length} أداة)!`, 'success');
  };

  // Import comprehensive backup
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = parseAndValidateBackup(content);
      if (result.success) {
        if (result.clients && result.clients.length > 0) {
          onClientsLoaded(result.clients);
        }
        if (result.notes && result.notes.length > 0) {
          onNotesLoaded(result.notes);
        }
        if (result.providers && result.providers.length > 0) {
          onUpdateSettings({
            ...settings,
            customProviders: Array.from(new Set([...settings.customProviders, ...result.providers])),
          });
        }
        onShowToast(result.message, 'success');
      } else {
        onShowToast(result.message, 'error');
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                الربط مع Google Sheets وحفظ البيانات
              </h2>
              <p className="text-xs text-slate-400">
                مزامنة سحابية مجانية ودائمة عبر Google Apps Script Web App
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 text-xs font-semibold shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('setup')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'setup'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>إعداد الرابط والمزامنة</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'code'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>كود Apps Script الجاهز</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'guide'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>خطوات التشغيل السريعة</span>
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'backup'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير نسخة احتياطية</span>
          </button>
        </div>

        {/* Tab 1: Setup */}
        {activeTab === 'setup' && (
          <div className="p-5 space-y-4 overflow-y-auto">
            {/* Status indicator */}
            <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/80">
              <label className="block text-xs font-bold text-slate-200 mb-2">
                رابط تطبيق الويب الخاص بـ Google Apps Script (Web App URL):
              </label>
              <div className="space-y-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-mono text-emerald-300 focus:border-emerald-500 outline-none"
                  dir="ltr"
                />
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleSaveUrl}
                    className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs transition"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>حفظ الرابط</span>
                  </button>
                  <button
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3.5 py-1.5 rounded-xl text-xs transition disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>{isTesting ? 'جاري فحص الاتصال...' : 'اختبار الاتصال بالشيت'}</span>
                  </button>
                </div>
              </div>

              {testResult && (
                <div
                  className={`mt-3 p-3 rounded-xl border text-xs flex items-start gap-2 ${
                    testResult.success
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  )}
                  <div>
                    <span className="font-bold block">{testResult.message}</span>
                    {testResult.timestamp && (
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        وقت الفحص: {testResult.timestamp}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sync Action Buttons */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">عمليات المزامنة اليدوية:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Push */}
                <button
                  onClick={handlePushAll}
                  disabled={isPushing}
                  className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition disabled:opacity-50"
                >
                  <Upload className={`w-4 h-4 ${isPushing ? 'animate-bounce' : ''}`} />
                  <span>
                    {isPushing
                      ? 'جاري إرسال البيانات...'
                      : `إرسال كل العملاء إلى الشيت (${clients.length})`}
                  </span>
                </button>

                {/* Pull */}
                <button
                  onClick={handlePullAll}
                  disabled={isPulling}
                  className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-bold text-xs sm:text-sm transition disabled:opacity-50"
                >
                  <Download className={`w-4 h-4 ${isPulling ? 'animate-pulse' : ''}`} />
                  <span>
                    {isPulling ? 'جاري جلب البيانات...' : 'استيراد العملاء من شيت جوجل'}
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Note */}
            <div className="p-3 bg-blue-950/20 border border-blue-500/30 rounded-xl text-xs text-blue-300 space-y-1">
              <span className="font-bold block">💡 ميزة الأمان والتخزين المزدوج:</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                جميع بياناتك تُحفظ تلقائياً في ذاكرة هاتفك (LocalStorage) وتعمل بدون إنترنت، وحينما تقوم بالربط مع شيت جوجل سيتم حفظ نسخة سحابية دائمة ومزامنتها لحظياً!
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Apps Script Code */}
        {activeTab === 'code' && (
          <div className="p-5 space-y-3 overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                كود Google Apps Script الجاهز (Code.gs):
              </span>
              <button
                onClick={copyScriptCode}
                className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs transition"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'تم النسخ!' : 'نسخ الكود بالكامل'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-400">
              انسخ هذا الكود والصقه في محرّر Apps Script بداخل ملف الشيت الخاص بك، وسيتولى هو إنشاء الأعمدة وحفظ البيانات تلقائياً.
            </p>

            <pre className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-72 select-all leading-relaxed" dir="ltr">
              {GOOGLE_APPS_SCRIPT_CODE}
            </pre>
          </div>
        )}

        {/* Tab 3: Step-by-Step Guide */}
        {activeTab === 'guide' && (
          <div className="p-5 space-y-3 text-xs text-slate-300 overflow-y-auto">
            <h3 className="font-bold text-white text-sm mb-2">
              خطوات تشغيل وربط شيت جوجل في 3 دقائق فقط:
            </h3>

            <div className="space-y-3">
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/80">
                <span className="font-bold text-emerald-400 block mb-1">
                  1. إنشاء جدول بيانات Google جديد:
                </span>
                <p className="text-slate-400 text-[11px]">
                  توجه إلى{' '}
                  <a
                    href="https://sheets.new"
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 underline"
                  >
                    sheets.new
                  </a>{' '}
                  لفتح شيت فارغ وسمّه مثلاً: "إدارة IPTV".
                </p>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/80">
                <span className="font-bold text-emerald-400 block mb-1">
                  2. فتح محرر Apps Script ولصق الكود:
                </span>
                <p className="text-slate-400 text-[11px]">
                  من القائمة العلوية للشيت: اضغط على <strong>الإضافات (Extensions)</strong> ثم اختر{' '}
                  <strong>Apps Script</strong>. امسح أي كود موجود والصق كود السكربت الموجود في تبويب{' '}
                  <span className="text-emerald-300">"كود Apps Script الجاهز"</span> أعلاه ثم اضغط حفظ.
                </p>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/80">
                <span className="font-bold text-emerald-400 block mb-1">
                  3. نشر التطبيق (Deploy as Web App) - خطوة مهمة جداً:
                </span>
                <ul className="list-disc list-inside text-slate-400 text-[11px] space-y-1 mt-1">
                  <li>اضغط على زر <strong>نشر (Deploy)</strong> بالأعلى ثم <strong>توزيع جديد (New deployment)</strong>.</li>
                  <li>اضغط على الترس ⚙️ واختر نوع التوزيع: <strong>تطبيق ويب (Web app)</strong>.</li>
                  <li>
                    في خانة <strong className="text-amber-300">من يمكنه الوصول (Who has access)</strong>: اختر حتماً{' '}
                    <strong className="text-emerald-400">أي شخص (Anyone)</strong> حتى يتمكن التطبيق من حفظ واستقبال البيانات.
                  </li>
                  <li>اضغط Deploy، وافق على الأذونات (Advanced &rarr; Go to ...).</li>
                </ul>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/80">
                <span className="font-bold text-emerald-400 block mb-1">
                  4. نسخ الرابط ولصقه هنا:
                </span>
                <p className="text-slate-400 text-[11px]">
                  انسخ <strong>Web App URL</strong> الذي يظهر لك وضعه في خانة الرابط بتبويب{' '}
                  <span className="text-emerald-300">"إعداد الرابط والمزامنة"</span>، واضغط اختبار ومزامنة!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Backup & Export */}
        {activeTab === 'backup' && (
          <div className="p-5 space-y-4 overflow-y-auto">
            <div className="bg-emerald-950/30 border border-emerald-500/30 p-3.5 rounded-2xl">
              <span className="text-xs font-bold text-emerald-300 block mb-1">
                نظام النسخ الاحتياطي والاسترجاع الشامل:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                عند الضغط على <strong>تصدير البيانات (JSON)</strong>، يتم حفظ بيانات <strong>العملاء + قسم الملاحظات وأكواد Downloader</strong> معاً في نفس الملف بأمان تام. ويمكنك استرجاع كل شيء بنقرة واحدة عبر زر <strong>استيراد البيانات</strong>.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-white block">1. تصدير البيانات (Export Data):</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={exportToJSON}
                  className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition"
                >
                  <Download className="w-4 h-4" />
                  <span>تصدير البيانات الشاملة (JSON)</span>
                </button>

                <button
                  onClick={exportToCSV}
                  className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 font-bold text-xs sm:text-sm transition"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>تصدير العملاء كـ Excel (CSV)</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-white block">2. استيراد البيانات (Import Data):</span>
              <p className="text-xs text-slate-400">
                استرجع جميع العملاء والملاحظات وأكواد Downloader من ملف النسخة الاحتياطية JSON الخاص بك:
              </p>
              <div>
                <label className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border-2 border-dashed border-slate-600 hover:border-emerald-500 text-slate-200 font-bold text-xs sm:text-sm cursor-pointer transition">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>اختر ملف النسخة الاحتياطية (JSON) للاسترجاع</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-800/80 border-t border-slate-700/80 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
