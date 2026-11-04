import React, { useState } from 'react';
import { Image, MessageSquare, Tag } from 'lucide-react';
import { ProductFormData } from '../../types/products.types';

interface ProductMediaSectionProps {
  formData: ProductFormData;
  onChange: <K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) => void;
}

export const ProductMediaSection: React.FC<ProductMediaSectionProps> = ({
  formData,
  onChange,
}) => {
  const [tagsInput, setTagsInput] = useState(() => (formData.tags || []).join('، '));
  const mainImage = formData.media?.[0] || '';

  const handleTagsChange = (val: string) => {
    setTagsInput(val);
    const tagsArr = val.split(/[,،]/).map((t) => t.trim()).filter(Boolean);
    onChange('tags', tagsArr);
  };

  const handleImageChange = (val: string) => {
    onChange('media', val.trim() ? [val.trim()] : []);
  };

  return (
    <div className="space-y-4 text-xs">
      <div>
        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
          رابط الصورة الأساسية للمنتج (Image URL)
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={mainImage}
            onChange={(e) => handleImageChange(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-left dir-ltr"
          />
        </div>
        {mainImage && (
          <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100">
            <img src={mainImage} alt="Product Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center gap-1.5 mb-1 font-bold text-slate-700 dark:text-slate-300">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
          <label>عبارة ترويجية قصيرة لكروت واتساب (WhatsApp Tagline)</label>
        </div>
        <input
          type="text"
          value={formData.whatsapp_short_desc || ''}
          onChange={(e) => onChange('whatsapp_short_desc', e.target.value)}
          placeholder="مثال: خصم 20% لفترة محدودة | توصيل مجاني اليوم"
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
        />
        <p className="text-[11px] text-slate-400 mt-1">تظهر هذه العبارة بخط بارز في كروت الواتساب التفاعلية التي يرسلها البوت.</p>
      </div>

      <div>
        <div className="flex items-center gap-1.5 mb-1 font-bold text-slate-700 dark:text-slate-300">
          <Tag className="w-3.5 h-3.5 text-purple-600" />
          <label>الكلمات المفتاحية والوسوم الموجهة لبوت الذكاء الاصطناعي</label>
        </div>
        <input
          type="text"
          value={tagsInput}
          onChange={(e) => handleTagsChange(e.target.value)}
          placeholder="عطور، رجالي، صندل، هدايا فاخرة (مفصولة بفاصلة)"
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
        />
        <p className="text-[11px] text-slate-400 mt-1">تساعد الوكيل الآلي في اقتراح هذا المنتج عندما يسأل العميل عن هذه الكلمات.</p>
      </div>
    </div>
  );
};

