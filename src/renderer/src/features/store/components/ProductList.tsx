import React, { useState } from 'react';
import { Search, Package } from 'lucide-react';
import { Product } from '../../../../shared/types';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: Product[];
}

export const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'physical' | 'digital'>('all');

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || p.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4">
      {/* فلترة وبحث الكتالوج */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم أو الرمز..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-[#1F293D] rounded-xl pr-9 pl-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#128C7E]"
          />
        </div>

        <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-[#1F293D] text-xs w-full sm:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filterType === 'all' ? 'bg-[#128C7E] text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            الكل ({products.length})
          </button>
          <button
            onClick={() => setFilterType('physical')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filterType === 'physical' ? 'bg-[#128C7E] text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            فيزيائية ({products.filter((p) => p.type === 'physical').length})
          </button>
          <button
            onClick={() => setFilterType('digital')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filterType === 'digital' ? 'bg-[#128C7E] text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            رقمية ({products.filter((p) => p.type === 'digital').length})
          </button>
        </div>
      </div>

      {/* شبكة كروت المنتجات */}
      {filteredProducts.length === 0 ? (
        <div className="wasell-card p-12 text-center text-slate-400 space-y-2">
          <Package className="w-10 h-10 mx-auto opacity-30 text-[#128C7E]" />
          <p className="text-sm font-semibold">لم يتم العثور على أي منتج يطابق البحث</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
