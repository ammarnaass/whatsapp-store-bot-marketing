import React from 'react';
import { Package } from 'lucide-react';
import { CatalogProduct } from '../types/products.types';
import { EmptyState } from '../../data-management';
import { ProductTableRow } from './ProductTableRow';

interface ProductsTableProps {
  products: CatalogProduct[];
  onToggleAi: (id: string) => void;
  onPreview: (product: CatalogProduct) => void;
  onAddNew: () => void;
  onEdit?: (product: CatalogProduct) => void;
  onDelete?: (id: string, name: string) => void;
}

export const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  onToggleAi,
  onPreview,
  onAddNew,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-right text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-[#1F293D]">
            <tr>
              <th className="py-3 px-4">المنتج والـ SKU</th>
              <th className="py-3 px-4">الفئة والنوع</th>
              <th className="py-3 px-4 text-center">سعر البيع / التكلفة</th>
              <th className="py-3 px-4 text-center">المخزون والشحن</th>
              <th className="py-3 px-4 text-center">الوكيل (AI)</th>
              <th className="py-3 px-4 text-center">المبيعات</th>
              <th className="py-3 px-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8">
                  <EmptyState
                    icon={<Package className="w-8 h-8 text-[#128C7E]" />}
                    title="كتالوج المنتجات فارغ حالياً"
                    description="لم تقم بإضافة منتجات بعد."
                    sectionKey="products"
                    actionButton={
                      <button onClick={onAddNew} className="h-9 px-4 rounded-xl bg-[#128C7E] text-white text-xs font-bold">
                        إضافة أول منتج
                      </button>
                    }
                  />
                </td>
              </tr>
            ) : (
              products.map((prod) => (
                <ProductTableRow
                  key={prod.id}
                  prod={prod}
                  onToggleAi={onToggleAi}
                  onPreview={onPreview}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
