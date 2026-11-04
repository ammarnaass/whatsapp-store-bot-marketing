import React, { useState } from 'react';
import { X, UploadCloud, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface RestoreBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestored: () => void;
}

export const RestoreBackupModal: React.FC<RestoreBackupModalProps> = ({
  isOpen,
  onClose,
  onRestored,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [confirmText, setConfirmText] = useState('');
  const [isRestoring, setIsRestoring] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrorMsg(null);
    }
  };

  const handleRestoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('يرجى اختيار ملف النسخة الاحتياطية أولاً');
      return;
    }
    if (confirmText.trim() !== 'استعادة') {
      setErrorMsg('يرجى كتابة كلمة (استعادة) في حقل التأكيد للمتابعة');
      return;
    }

    setIsRestoring(true);
    setErrorMsg(null);
    try {
      // محاكاة قراءة ملف النسخة وتطبيقه
      await new Promise((resolve) => setTimeout(resolve, 1200));
      onRestored();
      onClose();
      alert('تمت استعادة البيانات بنجاح وإعادة مزامنة النظام!');
    } catch {
      setErrorMsg('تعذر استعادة النسخة الاحتياطية. يرجى التحقق من سلامة الملف.');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-xs">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">استعادة النظام من نسخة احتياطية</h3>
              <p className="text-[11px] text-slate-400">رفع ملف قاعدة البيانات واسترجاع كافة البيانات السابقة</p>
            </div>
          </div>
          <button onClick={onClose} type="button" className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleRestoreSubmit} className="p-5 space-y-4">
          <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-rose-900 dark:text-rose-200">تحذير أمني هام</h4>
              <p className="text-[11px] text-rose-700 dark:text-rose-300/90 leading-relaxed mt-0.5">
                ستؤدي عملية الاستعادة إلى استبدال قاعدة البيانات الحالية بالكامل بما في ذلك الطلبات والمحادثات التي تمت بعد تاريخ هذه النسخة.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              اختيار ملف النسخة الاحتياطية (.db أو .json)
            </label>
            <input
              type="file"
              accept=".db,.json"
              onChange={handleFileChange}
              className="w-full text-xs text-slate-500 file:mr-0 file:ml-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#128C7E]/10 file:text-[#128C7E] hover:file:bg-[#128C7E]/20 cursor-pointer"
            />
            {selectedFile && (
              <p className="text-[10px] text-emerald-600 font-bold mt-1">الملف المختار: {selectedFile.name}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              للتأكيد، يرجى كتابة كلمة <span className="text-rose-600 font-black">"استعادة"</span> أدناه:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="اكتب استعادة هنا..."
              className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-[#1F293D] text-slate-900 dark:text-white outline-none focus:border-rose-500 font-bold"
            />
          </div>

          {errorMsg && <p className="text-xs text-rose-600 font-bold">{errorMsg}</p>}

          <div className="pt-3 border-t border-slate-100 dark:border-[#1F293D] flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1F293D] text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 cursor-pointer">
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isRestoring || confirmText.trim() !== 'استعادة' || !selectedFile}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer transition-all disabled:opacity-40"
            >
              {isRestoring ? 'جارٍ الاستعادة...' : 'تأكيد استعادة النسخة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

