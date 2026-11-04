import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { ProductsHeader } from '../components/ProductsHeader';
import { ProductsKpiCards } from '../components/ProductsKpiCards';
import { ProductsFilterBar } from '../components/ProductsFilterBar';
import { ProductsTable } from '../components/ProductsTable';
import { ProductsGrid } from '../components/ProductsGrid';
import { WhatsAppCardPreviewModal } from '../components/WhatsAppCardPreviewModal';
import { AddProductModal } from '../components/AddProductModal';
import { EditProductModal } from '../components/EditProductModal';

export const ProductsPage: React.FC = () => {
  const {
    products, filteredProducts, viewMode, setViewMode, activeTab, setActiveTab,
    searchQuery, setSearchQuery, previewProduct, setPreviewProduct, editingProduct,
    setEditingProduct, showAddModal, setShowAddModal, toastMessage, handleSync,
    handleExport, handleToggleAi, handleCreateProduct, handleUpdateProduct, handleDeleteProduct,
  } = useProducts();

  const counts = {
    all: products.length,
    demanded: products.filter((p) => p.conversionRate >= 85).length,
    lowStock: products.filter((p) => p.stock <= 10).length,
    aiDisabled: products.filter((p) => !p.aiRecommended).length,
  };

  return (
    <div className="flex flex-col w-full space-y-6 animate-in fade-in duration-200">
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#128C7E] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      <ProductsHeader onExport={handleExport} onSync={handleSync} onAddNew={() => setShowAddModal(true)} totalCount={products.length} />
      <ProductsKpiCards products={products} />
      <ProductsFilterBar searchQuery={searchQuery} onSearchChange={setSearchQuery} activeTab={activeTab} onTabChange={setActiveTab} viewMode={viewMode} onViewModeChange={setViewMode} counts={counts} />

      {viewMode === 'table' ? (
        <ProductsTable products={filteredProducts} onToggleAi={handleToggleAi} onPreview={setPreviewProduct} onAddNew={() => setShowAddModal(true)} onEdit={setEditingProduct} onDelete={handleDeleteProduct} />
      ) : (
        <ProductsGrid products={filteredProducts} onPreview={setPreviewProduct} onAddNew={() => setShowAddModal(true)} onEdit={setEditingProduct} onDelete={handleDeleteProduct} />
      )}

      <WhatsAppCardPreviewModal
        product={previewProduct}
        onClose={() => setPreviewProduct(null)}
        onInstantOrder={(prod) => {
          alert(`تم إرسال رابط الشراء الفوري لمنتج (${prod.name}) بالواتساب`);
          setPreviewProduct(null);
        }}
        onAskDetails={(prod) => {
          alert(`تم بدء محادثة استفسار عن مواصفات (${prod.name})`);
          setPreviewProduct(null);
        }}
      />

      <AddProductModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAddProduct={handleCreateProduct} />
      <EditProductModal product={editingProduct} isOpen={Boolean(editingProduct)} onClose={() => setEditingProduct(null)} onSave={handleUpdateProduct} />
    </div>
  );
};
