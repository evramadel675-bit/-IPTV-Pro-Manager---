import React, { useState, useEffect } from 'react';
import {
  X,
  DownloadCloud,
  Link as LinkIcon,
  FileText,
  Server,
  Save,
  Globe,
  Sparkles,
  Info
} from 'lucide-react';
import { ToolNote, NoteCategory } from '../types/client';

interface ToolNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (noteData: Omit<ToolNote, 'id' | 'createdAt' | 'updatedAt'>, id?: string) => void;
  noteToEdit?: ToolNote | null;
}

export const ToolNoteModal: React.FC<ToolNoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  noteToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<NoteCategory>('downloader');
  const [downloaderCode, setDownloaderCode] = useState('');
  const [url, setUrl] = useState('');
  const [secondaryUrl, setSecondaryUrl] = useState('');
  const [content, setContent] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setCategory(noteToEdit.category || 'downloader');
      setDownloaderCode(noteToEdit.downloaderCode || '');
      setUrl(noteToEdit.url || '');
      setSecondaryUrl(noteToEdit.secondaryUrl || '');
      setContent(noteToEdit.content || '');
    } else {
      setTitle('');
      setCategory('downloader');
      setDownloaderCode('');
      setUrl('');
      setSecondaryUrl('');
      setContent('');
    }
    setErrorMsg('');
  }, [noteToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('يرجى إدخال عنوان الأداة أو اسم التطبيق');
      return;
    }

    if (category === 'downloader' && !downloaderCode.trim() && !content.trim()) {
      setErrorMsg('يرجى إدخال كود Downloader أو كتابة ملاحظة');
      return;
    }

    if (category === 'app_link' && !url.trim() && !content.trim()) {
      setErrorMsg('يرجى إدخال رابط التطبيق للتحميل');
      return;
    }

    if (category === 'server_info' && !url.trim() && !content.trim()) {
      setErrorMsg('يرجى إدخال الـ DNS الرئيسي على الأقل');
      return;
    }

    onSave(
      {
        title: title.trim(),
        category,
        downloaderCode: downloaderCode.trim() || undefined,
        url: url.trim() || undefined,
        secondaryUrl: secondaryUrl.trim() || undefined,
        content: content.trim(),
      },
      noteToEdit ? noteToEdit.id : undefined
    );
    onClose();
  };

  // Dynamic Title Placeholder based on category
  const getTitlePlaceholder = () => {
    switch (category) {
      case 'downloader':
        return 'مثال: تطبيق IBO Player Pro أو SmartOne IPTV';
      case 'app_link':
        return 'مثال: تطبيق Cobra IPTV APK أو BOB Player Web';
      case 'server_info':
        return 'مثال: سيرفر Hawk IPTV أو Portal Xtream';
      default:
        return 'مثال: خطوات التفعيل الشاملة أو ملاحظات خاصة بالعملاء';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {noteToEdit ? 'تعديل الأداة / الملاحظة' : 'إضافة أداة أو كود تحميل جديد'}
              </h2>
              <p className="text-xs text-slate-400">
                حقول ديناميكية تتكيف تلقائياً مع التصنيف المختار
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-semibold">
              {errorMsg}
            </div>
          )}

          {/* 1. Category Selector */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">
              اختر نوع الأداة / التصنيف:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                {
                  id: 'downloader',
                  label: 'كود Downloader',
                  icon: DownloadCloud,
                  activeColor: 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-emerald-500/20',
                },
                {
                  id: 'app_link',
                  label: 'رابط تطبيق',
                  icon: LinkIcon,
                  activeColor: 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-cyan-500/20',
                },
                {
                  id: 'server_info',
                  label: 'سيرفر و DNS',
                  icon: Server,
                  activeColor: 'bg-purple-500 text-slate-950 border-purple-400 shadow-purple-500/20',
                },
                {
                  id: 'note',
                  label: 'ملاحظة شاملة',
                  icon: FileText,
                  activeColor: 'bg-amber-500 text-slate-950 border-amber-400 shadow-amber-500/20',
                },
              ].map((c) => {
                const Icon = c.icon;
                const isSelected = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id as NoteCategory)}
                    className={`py-2 px-2 rounded-xl border flex flex-col items-center gap-1 font-bold transition cursor-pointer ${
                      isSelected
                        ? `${c.activeColor} shadow-md`
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px]">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Title Field (Always Present) */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">
              عنوان الأداة / اسم التطبيق <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={getTitlePlaceholder()}
              className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition"
            />
          </div>

          {/* ================= DYNAMIC FIELDS BASED ON CATEGORY ================= */}

          {/* Case 1: كود Downloader */}
          {category === 'downloader' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-200 font-bold flex items-center gap-1.5">
                    <DownloadCloud className="w-4 h-4 text-emerald-400" />
                    <span>كود تطبيق Downloader الرقمي (Shortcode)</span>
                    <span className="text-emerald-400">*</span>
                  </label>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                    أرقام فقط
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  الكود الرقمي (مكون عادة من 5 إلى 6 أرقام) الذي يدخله العميل في تطبيق Downloader على الشاشات الذكية.
                </p>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={downloaderCode}
                    onChange={(e) => setDownloaderCode(e.target.value)}
                    placeholder="مثال: 841203 أو 28907"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-base sm:text-lg font-mono font-black text-emerald-300 focus:border-emerald-500 outline-none"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  ملاحظات أو طريقة الشرح والتثبيت (اختياري):
                </label>
                <textarea
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="مثال: افتح تطبيق Downloader، أدخل الكود في خانة البحث، اضغط GO وسيبدأ التحميل فوراً..."
                  className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* Case 2: رابط تطبيق */}
          {category === 'app_link' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-cyan-500/30 space-y-2">
                <label className="text-slate-200 font-bold flex items-center gap-1.5">
                  <LinkIcon className="w-4 h-4 text-cyan-400" />
                  <span>رابط التحميل المباشر (Direct URL / APK)</span>
                  <span className="text-cyan-400">*</span>
                </label>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  الرابط المباشر لتحميل ملف APK أو صفحة التنزيل على الويب لمشاركتها مع العميل.
                </p>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/download/app.apk"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-mono text-cyan-300 focus:border-cyan-500 outline-none"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  ملاحظات وتعليمات التثبيت (اختياري):
                </label>
                <textarea
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="مثال: قم بتمكين تثبيت التطبيقات من مصادر غير معروفة، الإصدار v3.2، كود فك الضغط..."
                  className="w-full bg-slate-800 border border-slate-700 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* Case 3: سيرفر و DNS */}
          {category === 'server_info' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-purple-500/30 space-y-3">
                {/* Primary DNS */}
                <div>
                  <label className="text-slate-200 font-bold flex items-center gap-1.5 mb-1">
                    <Server className="w-4 h-4 text-purple-400" />
                    <span>الـ DNS الرئيسي (Primary DNS / Portal URL)</span>
                    <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="http://line.iptv-server.com:8080"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-mono text-purple-300 focus:border-purple-500 outline-none"
                    dir="ltr"
                  />
                </div>

                {/* Secondary DNS */}
                <div>
                  <label className="text-slate-300 font-medium flex items-center gap-1.5 mb-1">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span>الـ DNS الثانوي / البديل (Secondary DNS) (اختياري):</span>
                  </label>
                  <input
                    type="text"
                    value={secondaryUrl}
                    onChange={(e) => setSecondaryUrl(e.target.value)}
                    placeholder="http://backup.iptv-server.com:8080"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-mono text-slate-200 focus:border-purple-500 outline-none"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  ملاحظات وبيانات السيرفر (اختياري):
                </label>
                <textarea
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="مثال: السيرفر يدعم بروتوكول HLS، المنافذ المفتوحة 80 / 8080، توجيهات تشغيل الماك..."
                  className="w-full bg-slate-800 border border-slate-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* Case 4: ملاحظة عامة / شاملة */}
          {category === 'note' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700 space-y-3">
                <span className="text-[11px] font-bold text-amber-300 block">
                  يمكنك حفظ كافة البيانات (كود + رابط + DNS) معاً في ملحوظة واحدة متكاملة:
                </span>

                {/* Downloader Code (Optional) */}
                <div>
                  <label className="block text-slate-400 mb-1">
                    كود Downloader (اختياري):
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={downloaderCode}
                    onChange={(e) => setDownloaderCode(e.target.value)}
                    placeholder="مثال: 841203"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono text-emerald-300 outline-none focus:border-emerald-500"
                    dir="ltr"
                  />
                </div>

                {/* Direct App Link (Optional) */}
                <div>
                  <label className="block text-slate-400 mb-1">
                    رابط التطبيق أو الموقع (اختياري):
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/download/app.apk"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono text-cyan-300 outline-none focus:border-cyan-500"
                    dir="ltr"
                  />
                </div>

                {/* Secondary URL / DNS (Optional) */}
                <div>
                  <label className="block text-slate-400 mb-1">
                    الـ DNS أو الرابط البديل (اختياري):
                  </label>
                  <input
                    type="text"
                    value={secondaryUrl}
                    onChange={(e) => setSecondaryUrl(e.target.value)}
                    placeholder="http://line.server.com:8080"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono text-purple-300 outline-none focus:border-purple-500"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Comprehensive Content Area */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  الملاحظات والشرح الشامل والتعليمات:
                </label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="اكتب الشرح الكامل، خطوات التفعيل، كود الماك، أو أي إرشادات شاملة للعميل..."
                  className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-slate-400 hover:text-white rounded-xl text-xs font-semibold cursor-pointer transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{noteToEdit ? 'حفظ التعديل' : 'إضافة الأداة'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
