import React, { useState } from 'react';
import { Package, Plus } from 'lucide-react';
import { useStoreData } from '../hooks/useStoreData';
import { ProductList } from '../components/ProductList';
import { OrderList } from '../components/OrderList';
import { AddProductModal } from '../components/AddProductModal';

export const StorePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [showAddModal, setShowAddModal] = useState(false);
  const { products, orders, createProduct } = useStoreData();

  return (
    <div className="space-y-6">
      {/* رأس الصفحة وأزرار التبديل */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-[#1F293D] pb-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-[#128C7E]" />
            إدارة المتجر والكتالوج
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            إدارة المنتجات الفيزيائية والرقمية، المخزون، مفاتيح التراخيص والطلبات المكتملة
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-[#1F293D] flex text-xs font-bold">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'products'
                  ? 'bg-[#128C7E] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              المنتجات ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'orders'
                  ? 'bg-[#128C7E] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              الطلبات ({orders.length})
            </button>
          </div>

          {activeTab === 'products' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#128C7E] hover:bg-[#075E54] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              إضافة منتج
            </button>
          )}
        </div>
      </div>

      {/* محتوى التبويب النشط */}
      {activeTab === 'products' ? (
        <ProductList products={products} />
      ) : (
        <OrderList orders={orders} />
      )}

      {/* نافذة إضافة منتج جديد */}
      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={createProduct}
      />
    </div>
  );
};
