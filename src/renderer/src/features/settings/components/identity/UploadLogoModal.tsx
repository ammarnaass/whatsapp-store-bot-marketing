import React, { useState } from 'react';
import { X, Image, Upload, Check } from 'lucide-react';

interface UploadLogoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLogoUrl: string;
  onSaveLogo: (url: string) => void;
}

export const UploadLogoModal: React.FC<UploadLogoModalProps> = ({
  isOpen,
  onClose,
  currentLogoUrl,
  onSaveLogo,
}) => {
  const [logoInput, setLogoInput] = useState(currentLogoUrl);
  const [previewUrl, setPreviewUrl] = useState(currentLogoUrl);

  if (!isOpen) return null;

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoInput(e.target.value);
    setPreviewUrl(e.target.value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const res = event.target.result as string;
          setLogoInput(res);
          setPreviewUrl(res);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (logoInput.trim()) {
      onSaveLogo(logoInput.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col text-xs">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#128C7E]/10 text-[#128C7E] flex items-center justify-center">
              <Image className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">تحديث وتخصيص شعار المتجر</h3>
              <p className="text-[11px] text-slate-400">معاينة الشعار في فواتير وبروفايل واتساب</p>
            </div>
          </div>
          <button onClick={onClose} type="button" className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4">
          {/* Live Preview Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center justify-center gap-6">
            <div className="text-center space-y-1.5">
              <img
                src={previewUrl || currentLogoUrl}
                alt="Square Preview"
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#128C7E]/30 mx-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = currentLogoUrl;
                }}
              />
              <span className="text-[10px] text-slate-400 block font-bold">معاينة البطاقة</span>
            </div>
            <div className="text-center space-y-1.5">
              <img
                src={previewUrl || currentLogoUrl}
                alt="Circle Preview"
                className="w-16 h-16 rounded-full object-cover ring-2 ring-[#128C7E]/30 mx-auto"
              />
              <span className="text-[10px] text-slate-400 block font-bold">بروفايل الواتساب</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              رابط الصورة المباشر (URL)
            </label>
            <input
              type="url"
              dir="ltr"
              value={logoInput}
              onChange={handleUrlChange}
              placeholder="https://example.com/logo.png"
              className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-[#1F293D] text-slate-900 dark:text-white outline-none focus:border-[#128C7E] font-mono text-left"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              أو اختر ملف صورة من جهازك (PNG / JPG / SVG)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full text-xs text-slate-500 file:mr-0 file:ml-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#128C7E]/10 file:text-[#128C7E] hover:file:bg-[#128C7E]/20 cursor-pointer"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-[#1F293D] flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1F293D] text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 cursor-pointer">
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-white font-bold cursor-pointer transition-all flex items-center gap-1.5"
              style={{ backgroundColor: 'var(--color-brand-primary)' }}
            >
              <Check className="w-3.5 h-3.5" />
              <span>اعتماد الشعار</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

