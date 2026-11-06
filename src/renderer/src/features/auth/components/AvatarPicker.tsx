import React, { useRef, useState } from 'react';
import { Camera, Trash2, Loader2, User } from 'lucide-react';
import { processImageToAvatarDataUrl } from '../utils/avatar-helper';

interface AvatarPickerProps {
  avatar: string | null;
  name: string;
  onChange: (avatar: string | null) => void;
  disabled?: boolean;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({ avatar, name, onChange, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    try {
      const dataUrl = await processImageToAvatarDataUrl(file);
      onChange(dataUrl);
    } catch (err: any) {
      setError(err.message || 'فشلت معالجة الصورة');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const getInitials = (n: string) => {
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (n[0] || 'U').toUpperCase();
  };

  return (
    <div className="flex flex-col items-center sm:items-start gap-2.5">
      <div className="flex items-center gap-4">
        <div className="relative group">
          <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-[#128C7E]/15 bg-gradient-to-br from-[#128C7E] to-[#075E54] flex items-center justify-center text-white text-xl font-bold shadow-md">
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            ) : name ? (
              <span>{getInitials(name)}</span>
            ) : (
              <User className="w-8 h-8 opacity-75" />
            )}
            {isProcessing && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center text-white">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isProcessing}
            title="تغيير الصورة الشخصية"
            className="absolute -bottom-1.5 -left-1.5 p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-[#128C7E]" />
          </button>
        </div>

        <div className="space-y-1.5 text-right">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">الصورة الشخصية</h4>
          <p className="text-[10px] text-slate-400">تدعم PNG أو JPG أو WEBP (تُضغط وتُحفظ محلياً)</p>
          <div className="flex items-center gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isProcessing}
              className="text-[11px] font-bold text-[#128C7E] hover:underline cursor-pointer"
            >
              اختيار صورة
            </button>
            {avatar && (
              <>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <button
                  type="button"
                  onClick={() => onChange(null)}
                  disabled={disabled || isProcessing}
                  className="text-[11px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>إزالة</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {error && <p className="text-[11px] font-medium text-rose-500">{error}</p>}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
    </div>
  );
};
