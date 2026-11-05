import React, { useState, useMemo } from 'react';
import { X, Copy, Check, MessageSquare, Send } from 'lucide-react';
import { Collection, Product } from '../types/collection.types';

interface CollectionWhatsAppShareModalProps {
  isOpen: boolean;
  collection: Collection | null;
  products: Product[];
  onClose: () => void;
  onSendToChat?: (text: string) => void;
}

export const CollectionWhatsAppShareModal: React.FC<CollectionWhatsAppShareModalProps> = ({
  isOpen, collection, products, onClose, onSendToChat,
}) => {
  const [copied, setCopied] = useState(false);
  const [includePrices, setIncludePrices] = useState(true);

  const messageText = useMemo(() => {
    if (!collection) return '';
    let msg = `✨ *مجموعة متميزة: ${collection.name}* ✨\n`;
    if (collection.description) {
      msg += `📝 ${collection.description}\n`;
    }
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🛍️ *المنتجات المتوفرة:*\n`;

    if (products.length === 0) {
      msg += `(تصفح تشكيلة منتجاتنا المتجددة بالكتالوج)\n`;
    } else {
      products.forEach((p, idx) => {
        const priceStr = includePrices && p.price ? ` - *${p.price} ر.س*` : '';
        msg += `${idx + 1}. ${p.name}${priceStr}\n`;
      });
    }

    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `💬 للطلب أو الاستفسار، تفضل بإرسال اسم المنتج أو رقمه وسأخدمك فوراً! 🚀`;
    return msg;
  }, [collection, products, includePrices]);

  if (!isOpen || !collection) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#111827] w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                مشاركة بطاقة المجموعة عبر واتساب
              </h3>
              <p className="text-[11px] text-slate-400">{collection.name}</p>
            </div>
          </div>
          <button onClick={onClose} type="button" className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <label className="font-medium text-slate-700 dark:text-slate-300">
              معاينة رسالة الواتساب:
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={includePrices}
                onChange={(e) => setIncludePrices(e.target.checked)}
                className="rounded text-emerald-600"
              />
              تضمين الأسعار
            </label>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 whitespace-pre-wrap font-sans text-slate-800 dark:text-slate-200 max-h-56 overflow-y-auto leading-relaxed scrollbar-thin">
            {messageText}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors text-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'تم النسخ للحافظة!' : 'نسخ الرسالة'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl text-slate-500 hover:bg-slate-200/50 text-xs"
            >
              إغلاق
            </button>
            {onSendToChat && (
              <button
                type="button"
                onClick={() => { onSendToChat(messageText); onClose(); }}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm text-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال للمحادثة</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

