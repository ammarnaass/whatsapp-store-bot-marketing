import React, { useState, useEffect } from 'react';
import { X, KeyRound, Plus, CheckCircle, Clock } from 'lucide-react';
import { SoftwareWithInventory } from '../types/software.types';
import { softwareService } from '../services/software.service';

interface Props {
  item: SoftwareWithInventory | null;
  isOpen: boolean;
  onClose: () => void;
  onKeysAdded: (count: number) => void;
}

export const SoftwareKeysVaultModal: React.FC<Props> = ({ item, isOpen, onClose, onKeysAdded }) => {
  const [keys, setKeys] = useState<any[]>([]);
  const [newKeysText, setNewKeysText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && item) {
      setIsLoading(true);
      softwareService.getKeys(item.id).then(setKeys).finally(() => setIsLoading(false));
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = newKeysText.split('\n').map((k) => k.trim()).filter(Boolean);
    if (parsed.length === 0) return;
    setIsSubmitting(true);
    try {
      const res = await softwareService.addKeys(item.id, parsed);
      if (res.success) {
        setNewKeysText('');
        onKeysAdded(res.count);
        const updated = await softwareService.getKeys(item.id);
        setKeys(updated);
      }
    } finally { setIsSubmitting(false); }
  };

  const available = keys.filter((k) => k.status === 'available');
  const sold = keys.filter((k) => k.status === 'sold');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">خزنة مفاتيح تفعيل: {item.software_name}</h2>
              <p className="text-xs text-slate-500">المتوفر: {available.length} | المباع: {sold.length}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <form onSubmit={handleAddBatch} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">إضافة حزمة مفاتيح تفعيل جديدة (مفتاح في كل سطر):</label>
            <textarea
              rows={3} value={newKeysText} onChange={(e) => setNewKeysText(e.target.value)}
              placeholder="SW-2026-KEY-AAA1-BBB2&#10;SW-2026-KEY-CCC3-DDD4"
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
            />
            <button type="submit" disabled={isSubmitting || !newKeysText.trim()} className="h-8 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 transition-colors">
              <Plus className="w-3.5 h-3.5" /> <span>{isSubmitting ? 'جارٍ الإضافة...' : 'شحن المفاتيح للمخزن'}</span>
            </button>
          </form>

          <div className="space-y-1.5">
            <p className="font-bold text-slate-800 dark:text-slate-200">سجل المفاتيح الحالي ({keys.length}):</p>
            {isLoading ? <p className="text-center py-4 text-slate-400">جارٍ التحميل...</p> : (
              <div className="space-y-1.5 max-h-52 overflow-y-auto">
                {keys.map((k) => (
                  <div key={k.id} className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex items-center justify-between font-mono">
                    <span className="text-slate-800 dark:text-slate-200 text-xs">{k.key_code}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-sans font-bold flex items-center gap-1 ${k.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                      {k.status === 'available' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {k.status === 'available' ? 'جاهز للتسليم' : 'مباع ومفعل'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

