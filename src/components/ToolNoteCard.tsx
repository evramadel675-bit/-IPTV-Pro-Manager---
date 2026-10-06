import React, { useState } from 'react';
import {
  DownloadCloud,
  ExternalLink,
  Copy,
  Check,
  Edit2,
  Trash2,
  FileText,
  Link as LinkIcon,
  Server,
  Globe,
  MessageCircle
} from 'lucide-react';
import { ToolNote } from '../types/client';

interface ToolNoteCardProps {
  note: ToolNote;
  onEdit: (note: ToolNote) => void;
  onDelete: (id: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ToolNoteCard: React.FC<ToolNoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  onShowToast,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    onShowToast(`تم نسخ ${label}!`, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getCategoryInfo = () => {
    switch (note.category) {
      case 'downloader':
        return {
          label: 'كود Downloader',
          color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          icon: DownloadCloud,
        };
      case 'app_link':
        return {
          label: 'رابط تطبيق',
          color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
          icon: LinkIcon,
        };
      case 'server_info':
        return {
          label: 'سيرفر و DNS',
          color: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          icon: Server,
        };
      default:
        return {
          label: 'ملاحظة شاملة',
          color: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          icon: FileText,
        };
    }
  };

  const cat = getCategoryInfo();
  const IconComponent = cat.icon;

  const shareToWhatsApp = () => {
    let msg = `*${note.title}*\n`;
    if (note.downloaderCode) {
      msg += `📲 كود تحميل Downloader: *${note.downloaderCode}*\n`;
    }
    if (note.url) {
      const urlLabel = note.category === 'server_info' ? '🌐 الـ DNS الرئيسي' : '🔗 الرابط المباشر';
      msg += `${urlLabel}: ${note.url}\n`;
    }
    if (note.secondaryUrl) {
      msg += `🌐 الـ DNS الثانوي / البديل: ${note.secondaryUrl}\n`;
    }
    if (note.content) {
      msg += `📝 ملاحظات: ${note.content}\n`;
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between relative group">
      <div>
        {/* Category & Actions Header */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${cat.color}`}
          >
            <IconComponent className="w-3.5 h-3.5" />
            <span>{cat.label}</span>
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(note)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
              title="تعديل الملاحظة"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(note.id)}
              className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition cursor-pointer"
              title="حذف"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Note Title */}
        <h3 className="font-bold text-white text-sm sm:text-base leading-snug mb-3">
          {note.title}
        </h3>

        {/* Downloader Code Box (Prominent & 1-click copy) */}
        {note.downloaderCode && (
          <div className="bg-slate-900/90 border border-emerald-500/40 rounded-xl p-3 mb-2.5 flex items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0">
                <DownloadCloud className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">كود تطبيق Downloader:</span>
                <span className="font-mono text-base sm:text-lg font-black text-emerald-300 tracking-wider select-all">
                  {note.downloaderCode}
                </span>
              </div>
            </div>

            <button
              onClick={() => copyText(note.downloaderCode!, 'code', 'كود Downloader')}
              className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-95 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer"
              title="نسخ كود التحميل بنقرة واحدة"
            >
              {copiedKey === 'code' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ الكود</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Primary URL / Primary DNS Box */}
        {note.url && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 mb-2 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              {note.category === 'server_info' ? (
                <Server className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              ) : (
                <LinkIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              )}
              <div className="overflow-hidden">
                <span className="text-[10px] text-slate-400 block font-medium">
                  {note.category === 'server_info' ? 'الـ DNS الرئيسي:' : 'رابط التحميل / الموقع:'}
                </span>
                <span
                  className={`font-mono text-xs truncate block select-all ${
                    note.category === 'server_info' ? 'text-purple-300' : 'text-cyan-300'
                  }`}
                  dir="ltr"
                >
                  {note.url}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() =>
                  copyText(
                    note.url!,
                    'url',
                    note.category === 'server_info' ? 'الـ DNS الرئيسي' : 'رابط التطبيق'
                  )
                }
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
                title="نسخ الرابط"
              >
                {copiedKey === 'url' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              <a
                href={note.url.startsWith('http') ? note.url : `http://${note.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-slate-400 hover:text-white"
                title="فتح الرابط"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Secondary URL / Secondary DNS Box (if provided) */}
        {note.secondaryUrl && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 mb-2.5 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <Globe className="w-3.5 h-3.5 text-purple-300 shrink-0" />
              <div className="overflow-hidden">
                <span className="text-[10px] text-slate-400 block font-medium">الـ DNS الثانوي / البديل:</span>
                <span className="font-mono text-xs text-purple-200 truncate block select-all" dir="ltr">
                  {note.secondaryUrl}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => copyText(note.secondaryUrl!, 'secondaryUrl', 'الـ DNS البديل')}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
                title="نسخ الـ DNS البديل"
              >
                {copiedKey === 'secondaryUrl' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              <a
                href={note.secondaryUrl.startsWith('http') ? note.secondaryUrl : `http://${note.secondaryUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-slate-400 hover:text-white"
                title="فتح الرابط"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Content / Notes text */}
        {note.content && (
          <div className="text-xs text-slate-300 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60 whitespace-pre-wrap leading-relaxed mb-3">
            {note.content}
          </div>
        )}
      </div>

      {/* Footer Tools */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
        <span>{new Date(note.createdAt).toLocaleDateString('ar-EG')}</span>
        <button
          onClick={shareToWhatsApp}
          className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
          title="مشاركة الكود والبيانات عبر الواتساب"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>إرسال للعميل عبر واتساب</span>
        </button>
      </div>
    </div>
  );
};

