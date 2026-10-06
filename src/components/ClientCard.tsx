import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  Copy,
  Check,
  Calendar,
  DollarSign,
  Edit2,
  Trash2,
  RefreshCw,
  ExternalLink,
  Key,
  User,
  Globe,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { Client } from '../types/client';

interface ClientCardProps {
  client: Client;
  currency: string;
  whatsappTemplate: string;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
  onRenew: (client: Client) => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  currency,
  whatsappTemplate,
  onEdit,
  onDelete,
  onRenew,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Compute days left until expiry
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  let daysLeft = 0;
  let isExpired = false;
  let isToday = false;
  let isWeek = false;

  if (client.expiryDate) {
    const expDate = new Date(client.expiryDate);
    expDate.setHours(0, 0, 0, 0);
    daysLeft = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    isExpired = daysLeft < 0;
    isToday = daysLeft === 0;
    isWeek = daysLeft > 0 && daysLeft <= 7;
  }

  // Copy helper
  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Copy full credentials
  const copyAllCredentials = () => {
    let fullText = `بيانات اشتراك IPTV (${client.subscriptionType}):\n`;
    if (client.accountType === 'code') {
      fullText += `الكود: ${client.code}\n`;
    } else {
      fullText += `سيرفر: ${client.serverUrl || ''}\nاسم المستخدم: ${client.username || ''}\nكلمة المرور: ${client.password || ''}\n`;
    }
    fullText += `تاريخ الانتهاء: ${client.expiryDate}\nشكراً لاشتراككم معنا!`;
    copyToClipboard(fullText, 'all');
  };

  // Build WhatsApp URL
  const getWhatsAppUrl = () => {
    let cleanPhone = client.phone.replace(/[^0-9+]/g, '');
    // If starts with 01 (Egypt local), convert to +201
    if (cleanPhone.startsWith('01') && cleanPhone.length === 11) {
      cleanPhone = '2' + cleanPhone;
    }

    const message = whatsappTemplate
      .replace(/{name}/g, client.name)
      .replace(/{server}/g, client.subscriptionType)
      .replace(/{expiry}/g, client.expiryDate)
      .replace(/{days_left}/g, Math.abs(daysLeft).toString())
      .replace(/{code}/g, client.code || client.username || '');

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-slate-700 transition relative overflow-hidden flex flex-col justify-between group">
      {/* Top Banner Accent Line */}
      <div
        className={`absolute top-0 right-0 left-0 h-1 ${
          isExpired
            ? 'bg-rose-500'
            : isToday
            ? 'bg-red-500 animate-pulse'
            : isWeek
            ? 'bg-amber-400 animate-pulse'
            : 'bg-emerald-500'
        }`}
      />

      {/* Header Info */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-base shrink-0 shadow">
              {client.name.trim().charAt(0) || 'ع'}
            </div>
            <div>
              <h3 className="font-bold text-white text-base leading-snug line-clamp-1">
                {client.name}
              </h3>
              <a
                href={`tel:${client.phone}`}
                className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 font-mono transition"
                dir="ltr"
              >
                <Phone className="w-3 h-3 text-slate-500" />
                <span>{client.phone}</span>
              </a>
            </div>
          </div>

          {/* Server Provider Badge */}
          <span className="shrink-0 bg-slate-800/90 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm">
            {client.subscriptionType}
          </span>
        </div>

        {/* Expiry Status Badge */}
        <div className="mb-3">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
              isExpired
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                : isToday
                ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                : isWeek
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {isExpired
                ? `منتهي منذ ${Math.abs(daysLeft)} يوم (${client.expiryDate})`
                : isToday
                ? `ينتهي اليوم! (${client.expiryDate})`
                : isWeek
                ? `ينتهي قريباً: متبقي ${daysLeft} يوم (${client.expiryDate})`
                : `ساري: متبقي ${daysLeft} يوم (${client.expiryDate})`}
            </span>
          </div>
        </div>

        {/* Account Credentials / Code Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 mb-3 text-xs space-y-2">
          {client.accountType === 'code' ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <Key className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-slate-400 shrink-0">كود التفعيل:</span>
                <span className="font-mono font-bold text-emerald-300 text-xs sm:text-sm truncate select-all">
                  {client.code || '—'}
                </span>
              </div>
              {client.code && (
                <button
                  onClick={() => copyToClipboard(client.code!, 'code')}
                  className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition shrink-0"
                  title="نسخ الكود"
                >
                  {copiedKey === 'code' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-1.5">
              {/* Username */}
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <User className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="text-slate-400 shrink-0">المستخدم:</span>
                  <span className="font-mono text-slate-200 truncate select-all">
                    {client.username || '—'}
                  </span>
                </div>
                {client.username && (
                  <button
                    onClick={() => copyToClipboard(client.username!, 'user')}
                    className="p-1 text-slate-400 hover:text-emerald-400"
                    title="نسخ اسم المستخدم"
                  >
                    {copiedKey === 'user' ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>

              {/* Password */}
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <Key className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="text-slate-400 shrink-0">كلمة المرور:</span>
                  <span className="font-mono text-slate-200 select-all">
                    {showPassword ? client.password : '••••••••'}
                  </span>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-500 hover:text-slate-300 p-0.5"
                    title={showPassword ? 'إخفاء' : 'إظهار'}
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
                {client.password && (
                  <button
                    onClick={() => copyToClipboard(client.password!, 'pass')}
                    className="p-1 text-slate-400 hover:text-emerald-400"
                    title="نسخ كلمة المرور"
                  >
                    {copiedKey === 'pass' ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>

              {/* Server URL */}
              {client.serverUrl && (
                <div className="flex items-center justify-between gap-1 pt-0.5 border-t border-slate-800">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <Globe className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="font-mono text-cyan-300 text-[11px] truncate select-all" dir="ltr">
                      {client.serverUrl}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(client.serverUrl!, 'url')}
                    className="p-1 text-slate-400 hover:text-cyan-400"
                    title="نسخ الرابط"
                  >
                    {copiedKey === 'url' ? (
                      <Check className="w-3 h-3 text-cyan-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              )}

              {/* Copy Full Credentials Button */}
              <div className="pt-1 flex justify-end">
                <button
                  onClick={copyAllCredentials}
                  className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  {copiedKey === 'all' ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>تم نسخ البيانات بالكامل!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>نسخ كل البيانات للعميل</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Profit Row */}
        <div className="flex items-center justify-between bg-slate-900/60 rounded-xl px-3 py-2 mb-3 text-xs border border-slate-800/80">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-[10px] text-slate-400 block">التكلفة</span>
              <span className="font-mono font-bold text-slate-300">
                {client.costPrice} {currency}
              </span>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 block">البيع</span>
              <span className="font-mono font-bold text-white">
                {client.sellingPrice} {currency}
              </span>
            </div>
          </div>
          <div className="text-left">
            <span className="text-[10px] text-emerald-400 font-medium block">صافي الربح</span>
            <span className="font-mono font-black text-emerald-400 text-sm">
              +{client.profit} {currency}
            </span>
          </div>
        </div>

        {/* Notes (if any) */}
        {client.notes && (
          <div className="flex items-start gap-1.5 text-xs text-slate-400 mb-3 bg-slate-900/40 p-2 rounded-lg border border-slate-800/50">
            <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <p className="line-clamp-2">{client.notes}</p>
          </div>
        )}
      </div>

      {/* Action Buttons Toolbar */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1">
          {/* Direct Phone Call */}
          <a
            href={`tel:${client.phone}`}
            className="flex items-center justify-center p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition"
            title="اتصال هاتفي مباشر"
          >
            <Phone className="w-4 h-4" />
          </a>

          {/* WhatsApp Direct Chat & Reminder */}
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition"
            title="فتح محادثة واتساب مع رسالة التذكير"
          >
            <MessageCircle className="w-4 h-4" />
            <span>واتساب</span>
          </a>

          {/* Quick Renewal */}
          <button
            onClick={() => onRenew(client)}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition"
            title="تجديد الاشتراك سريعاً"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>تجديد</span>
          </button>
        </div>

        {/* Edit & Delete Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(client)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            title="تعديل العميل"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(client.id)}
            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
            title="حذف العميل"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
