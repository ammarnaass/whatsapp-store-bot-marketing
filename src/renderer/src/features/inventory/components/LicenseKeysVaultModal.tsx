import React, { useState, useEffect } from 'react';
import { X, Key, Plus, CheckCircle2 } from 'lucide-react';
import { InventoryItem, LicenseKey } from '../types/inventory.types';
import { api } from '../../../api-bridge';

interface LicenseKeysVaultModalProps {
  product: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onKeysAdded: (count: number) => void;
}

export const LicenseKeysVaultModal: React.FC<LicenseKeysVaultModalProps> = ({
  product, isOpen, onClose, onKeysAdded,
}) => {
  const [keys, setKeys] = useState<LicenseKey[]>([]);
  const [newKeysText, setNewKeysText] = useState('');
  const [showAddBatch, setShowAddBatch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchKeys = () => {
    if (!product) return;
    setIsLoading(true);
    api.inventory.getLicenseKeys({ productId: product.productId })
      .then((res) => setKeys(res || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (isOpen && product) {
      fetchKeys();
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = newKeysText.split('\n').map((k) => k.trim()).filter(Boolean);
    if (parsed.length === 0) return;

    try {
      const res = await api.inventory.addLicenseKeys({ productId: product.productId, keys: parsed });
      if (res.success) {
        setNewKeysText('');
        setShowAddBatch(false);
        fetchKeys();
        onKeysAdded(res.count);
      }
    } catch {
      alert('فشل إضافة المفاتيح');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#1F293D] overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">مستودع مفاتيح التراخيص الرقمية</h3>
              <p className="text-[11px] text-slate-400">{product.productName}</p>
            </div>
          </div>
          <button onClick={onClose} type="button" className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              المفاتيح المسجلة ({keys.length})
            </span>
            <button
              onClick={() => setShowAddBatch(!showAddBatch)}
              className="h-8 px-3 rounded-lg bg-[#128C7E] text-white text-xs font-bold flex items-center gap-1 hover:bg-[#0da08e]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddBatch ? 'إلغاء' : 'إضافة مفاتيح بالجملة'}</span>
            </button>
          </div>

          {showAddBatch && (
            <form onSubmit={handleAddBatch} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">أدخل المفاتيح (مفتاح واحد في كل سطر):</label>
              <textarea
                rows={4}
                value={newKeysText}
                onChange={(e) => setNewKeysText(e.target.value)}
                placeholder={'AAAA-BBBB-CCCC-DDDD\nXXXX-YYYY-ZZZZ-WWWW'}
                className="w-full p-2.5 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-[#1F293D] rounded-lg outline-none"
                required
              />
              <div className="flex justify-end">
                <button type="submit" className="h-8 px-4 bg-[#128C7E] text-white rounded-lg text-xs font-bold">
                  حفظ وزيادة المخزون
                </button>
              </div>
            </form>
          )}

          <div className="divide-y divide-slate-100 dark:divide-[#1F293D] border border-slate-200 dark:border-[#1F293D] rounded-xl overflow-hidden">
            {isLoading ? (
              <p className="text-center py-6 text-xs text-slate-400">جارِ التحميل...</p>
            ) : keys.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-400">لا توجد مفاتيح مسجلة بعد. أضف مفاتيح لتفعيل البيع الآلي.</p>
            ) : (
              keys.map((k) => (
                <div key={k.id} className="p-3 flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{k.key_code}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    k.status === 'available' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                  }`}>
                    {k.status === 'available' ? 'جاهز للتسليم' : 'تم بيعه'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

