import React, { useState } from 'react';
import { X, MessageSquare, Save, RotateCcw, Check, Sparkles } from 'lucide-react';
import { DEFAULT_SETTINGS } from '../services/storage';

interface WhatsAppTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplate: string;
  onSaveTemplate: (template: string) => void;
}

export const WhatsAppTemplateModal: React.FC<WhatsAppTemplateModalProps> = ({
  isOpen,
  onClose,
  currentTemplate,
  onSaveTemplate,
}) => {
  const [template, setTemplate] = useState(currentTemplate);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const insertTag = (tag: string) => {
    setTemplate((prev) => prev + tag);
  };

  const resetToDefault = () => {
    setTemplate(DEFAULT_SETTINGS.whatsappTemplate);
  };

  const handleSave = () => {
    onSaveTemplate(template);
    onClose();
  };

  // Preview with mock data
  const previewText = template
    .replace(/{name}/g, 'أحمد محمود')
    .replace(/{server}/g, 'Cobra VIP')
    .replace(/{expiry}/g, '2026-10-10')
    .replace(/{days_left}/g, '6')
    .replace(/{code}/g, 'COBRA-9988');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">تخصيص رسالة تذكير الواتساب</h2>
              <p className="text-xs text-slate-400">
                الرسالة التلقائية التي تُفتح عند الضغط على زر واتساب للتجديد
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
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              نص الرسالة (يمكنك استخدام المتغيرات التلقائية):
            </label>
            <textarea
              rows={4}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-emerald-500 outline-none leading-relaxed"
            />
          </div>

          {/* Quick Insert Tags */}
          <div>
            <span className="text-xs text-slate-400 block mb-1.5 font-medium">
              انقر لإدراج متغير في الرسالة:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { tag: '{name}', label: 'اسم العميل' },
                { tag: '{server}', label: 'نوع السيرفر' },
                { tag: '{expiry}', label: 'تاريخ الانتهاء' },
                { tag: '{days_left}', label: 'الأيام المتبقية' },
                { tag: '{code}', label: 'كود التفعيل' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.tag}
                  onClick={() => insertTag(item.tag)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 text-xs font-mono font-bold transition"
                >
                  +{item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview Box mimicking WhatsApp */}
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-1.5">
              معاينة الرسالة كما ستظهر للعميل:
            </span>
            <div className="bg-[#0b141a] border border-[#202c33] rounded-2xl p-3.5 relative overflow-hidden">
              <div className="bg-[#005c4b] text-white text-xs sm:text-sm rounded-2xl rounded-tr-none p-3 shadow-md whitespace-pre-wrap leading-relaxed">
                {previewText}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 text-left" dir="ltr">
                ✓✓ {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <button
              type="button"
              onClick={resetToDefault}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>استعادة النص الافتراضي</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-1.5 rounded-xl text-xs shadow-md transition"
              >
                <Save className="w-4 h-4" />
                <span>حفظ القالب</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
