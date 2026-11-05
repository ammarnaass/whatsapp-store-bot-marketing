import React, { useState, useMemo } from 'react';
import { Search, Check, Box } from 'lucide-react';
import { Product } from '../types/collection.types';

interface CollectionProductPickerProps {
  selectedIds: string[];
  onToggleProduct: (productId: string) => void;
  allProducts: Product[];
  className?: string;
}

export const CollectionProductPicker: React.FC<CollectionProductPickerProps> = ({
  selectedIds,
  onToggleProduct,
  allProducts,
  className = '',
}) => {
  const [search, setSearch] = useState('');
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allProducts;
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q))
    );
  }, [allProducts, search]);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          المنتجات المحددة في المجموعة ({selectedIds.length})
        </label>
        <span className="text-[11px] text-slate-500">
          انقر لتحديد أو إلغاء تحديد المنتجات
        </span>
      </div>

      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute right-3 top-2.5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث بالاسم أو القسم..."
          className="w-full h-8 pr-8 pl-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500"
        />
      </div>

      <div className="max-h-48 overflow-y-auto space-y-1.5 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 scrollbar-thin">
        {filtered.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            لا توجد منتجات مطابقة للبحث
          </div>
        ) : (
          filtered.map((prod) => {
            const isSelected = selectedSet.has(prod.id);
            return (
              <div
                key={prod.id}
                onClick={() => onToggleProduct(prod.id)}
                className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-purple-50 dark:bg-purple-950/40 border border-purple-300/80 dark:border-purple-700'
                    : 'bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-purple-600 border-purple-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {prod.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {prod.category || 'بدون قسم'} • {prod.price ? `${prod.price} ر.س` : 'بدون سعر'}
                    </p>
                  </div>
                </div>

                <Box className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

