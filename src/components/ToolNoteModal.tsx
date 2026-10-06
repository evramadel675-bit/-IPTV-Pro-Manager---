import React, { useState, useEffect } from 'react';
import { X, DownloadCloud, Link as LinkIcon, FileText, Server, Save } from 'lucide-react';
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
  const [content, setContent] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setCategory(noteToEdit.category || 'downloader');
      setDownloaderCode(noteToEdit.downloaderCode || '');
      setUrl(noteToEdit.url || '');
      setContent(noteToEdit.content || '');
    } else {
      setTitle('');
      setCategory('downloader');
      setDownloaderCode('');
      setUrl('');
      setContent('');
    }
    setErrorMsg('');
  }, [noteToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('يرجى إدخال عنوان الملاحظة أو اسم التطبيق');
      return;
    }

    onSave(
      {
        title: title.trim(),
        category,
        downloaderCode: downloaderCode.trim() || undefined,
        url: url.trim() || undefined,
        content: content.trim(),
      },
      noteToEdit ? noteToEdit.id : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {noteToEdit ? 'تعديل الأداة / الملاحظة' : 'إضافة أداة أو كود تحميل جديد'}
              </h2>
              <p className="text-xs text-slate-400">
                أكواد تطبيق Downloader، روابط التطبيقات، وملاحظات السيرفرات
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">
              عنوان الأداة / اسم التطبيق <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: تطبيق IBO Player Pro أو كود تطبيق Smart IPTV"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">التصنيف:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'downloader', label: 'كود Downloader', icon: DownloadCloud },
                { id: 'app_link', label: 'رابط تطبيق', icon: LinkIcon },
                { id: 'server_info', label: 'سيرفر و DNS', icon: Server },
                { id: 'note', label: 'ملاحظة عامة', icon: FileText },
              ].map((c) => {
                const Icon = c.icon;
                const isSelected = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id as NoteCategory)}
                    className={`py-2 px-2 rounded-xl border flex flex-col items-center gap-1 font-semibold transition ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px]">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Downloader Code Field */}
          <div className="bg-slate-800/40 p-3 rounded-2xl border border-slate-700/80">
            <label className="block text-slate-300 font-bold mb-1">
              كود تحميل تطبيق Downloader (Downloader Code):
            </label>
            <p className="text-[11px] text-slate-400 mb-1.5">
              الكود الرقمي المكون من 5 أو 6 أرقام المستخدم في تطبيق Downloader على الشاشات الذكية
            </p>
            <input
              type="text"
              value={downloaderCode}
              onChange={(e) => setDownloaderCode(e.target.value)}
              placeholder="مثال: 841203 أو 28907"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-emerald-300 focus:border-emerald-500 outline-none"
              dir="ltr"
            />
          </div>

          {/* Direct URL */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">
              رابط التحميل المباشر أو موقع الخدمة (اختياري):
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/app.apk"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:border-cyan-500 outline-none"
              dir="ltr"
            />
          </div>

          {/* Content / Instructions Textarea */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">
              الملاحظات وطريقة التشغيل والشرح:
            </label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اكتب أي تعليمات للتثبيت، طريقة تفعيل الماك أدرس، أو ملاحظات هامة للعميل..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs sm:text-sm shadow-md transition"
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
