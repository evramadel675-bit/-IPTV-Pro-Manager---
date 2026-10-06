import React, { useState, useMemo } from 'react';
import {
  DownloadCloud,
  Search,
  Plus,
  X,
  Link as LinkIcon,
  FileText,
  Server,
  Sparkles
} from 'lucide-react';
import { ToolNote, NoteCategory } from '../types/client';
import { ToolNoteCard } from './ToolNoteCard';

interface ToolsSectionProps {
  notes: ToolNote[];
  onAddNew: () => void;
  onEdit: (note: ToolNote) => void;
  onDelete: (id: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ToolsSection: React.FC<ToolsSectionProps> = ({
  notes,
  onAddNew,
  onEdit,
  onDelete,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | NoteCategory>('all');

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      // Category filter
      if (selectedCategory !== 'all' && n.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = n.title.toLowerCase().includes(q);
        const matchesCode = n.downloaderCode ? n.downloaderCode.includes(q) : false;
        const matchesUrl = n.url ? n.url.toLowerCase().includes(q) : false;
        const matchesContent = n.content.toLowerCase().includes(q);

        return matchesTitle || matchesCode || matchesUrl || matchesContent;
      }

      return true;
    });
  }, [notes, searchQuery, selectedCategory]);

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner & Quick Intro */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl shrink-0">
            <DownloadCloud className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              الأدوات والملاحظات وأكواد التحميل (Downloader Codes)
            </h2>
            <p className="text-xs text-slate-300">
              قسمك الشخصي السريع لحفظ أكواد برامج الشاشات، روابط الـ APK، وتدوينات السيرفرات لنسخها ومشاركتها مع العملاء فوراً
            </p>
          </div>
        </div>

        <button
          onClick={onAddNew}
          className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-md transition shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>إضافة أداة / كود جديد</span>
        </button>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم التطبيق، كود Downloader، الرابط، أو الملاحظة..."
            className="w-full bg-slate-900/90 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pr-10 pl-9 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 transition outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'downloader', label: '📲 أكواد Downloader' },
            { id: 'app_link', label: '🔗 روابط التطبيقات' },
            { id: 'server_info', label: '🌐 سيرفرات و DNS' },
            { id: 'note', label: '📝 ملاحظات عامة' },
          ].map((tab) => {
            const isSelected = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}

          <span className="mr-auto text-[11px] text-slate-500 whitespace-nowrap">
            عرض {filteredNotes.length} من {notes.length} أداة
          </span>
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredNotes.map((note) => (
            <ToolNoteCard
              key={note.id}
              note={note}
              onEdit={onEdit}
              onDelete={onDelete}
              onShowToast={onShowToast}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-8 text-center my-6 border border-slate-800 flex flex-col items-center justify-center max-w-md mx-auto">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl mb-3">
            <DownloadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            {notes.length === 0 ? 'لا توجد أدوات وملاحظات بعد' : 'لا توجد نتائج مطابقة'}
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            {notes.length === 0
              ? 'أضف أكواد التحميل الخاصة بتطبيق Downloader وروابط المشغلات لتجدها في أي وقت'
              : 'جرب البحث بكلمة مختلفة أو اختر تصنيفاً آخر'}
          </p>
          {notes.length === 0 ? (
            <button
              onClick={onAddNew}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition"
            >
              + إضافة أول أداة الآن
            </button>
          ) : (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-xs text-emerald-400 hover:underline"
            >
              عرض جميع الأدوات
            </button>
          )}
        </div>
      )}
    </div>
  );
};
