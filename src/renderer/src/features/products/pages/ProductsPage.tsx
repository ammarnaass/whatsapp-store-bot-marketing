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
import { CategoryFilterChips, CategoriesManagerModal } from '../../categories';
import { CollectionsFilterBar, CollectionsManagerModal, CollectionWhatsAppShareModal } from '../../collections';

export const ProductsPage: React.FC = () => {
  const {
    products, filteredProducts, categories, categoriesHook, collections, collectionsHook,
    viewMode, setViewMode, activeTab, setActiveTab, selectedCategoryId, setSelectedCategoryId,
    selectedCollectionId, setSelectedCollectionId, searchQuery, setSearchQuery,
    previewProduct, setPreviewProduct, editingProduct, setEditingProduct,
    showAddModal, setShowAddModal, showCategoriesModal, setShowCategoriesModal,
    showCollectionsModal, setShowCollectionsModal, sharingCollection, setSharingCollection,
    toastMessage, handleSync, handleExport, handleToggleAi,
    handleCreateProduct, handleUpdateProduct, handleDeleteProduct,
  } = useProducts();

  const counts = {
    all: products.length,
    demanded: products.filter((p) => p.conversionRate >= 85).length,
    lowStock: products.filter((p) => p.stock <= 10).length,
    aiDisabled: products.filter((p) => !p.aiRecommended).length,
  };

  return (
    <div className="flex flex-col w-full space-y-3.5 animate-in fade-in duration-200">
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#128C7E] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      <ProductsHeader
        onExport={handleExport}
        onSync={handleSync}
        onAddNew={() => setShowAddModal(true)}
        onOpenCategories={() => setShowCategoriesModal(true)}
        totalCount={products.length}
      />

      <ProductsKpiCards products={products} />

      <ProductsFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        counts={counts}
      />

      {/* شريط الفئات الهرمية */}
      <CategoryFilterChips
        categories={categories}
        selectedId={selectedCategoryId}
        onSelect={setSelectedCategoryId}
        totalProductsCount={products.length}
        onOpenManageModal={() => setShowCategoriesModal(true)}
      />

      {/* شريط المجموعات التسويقية والذكية */}
      {collections.length > 0 && (
        <CollectionsFilterBar
          collections={collections}
          selectedId={selectedCollectionId}
          onSelect={setSelectedCollectionId}
          onManage={() => setShowCollectionsModal(true)}
        />
      )}

      {viewMode === 'table' ? (
        <ProductsTable
          products={filteredProducts}
          onToggleAi={handleToggleAi}
          onPreview={setPreviewProduct}
          onAddNew={() => setShowAddModal(true)}
          onEdit={setEditingProduct}
          onDelete={handleDeleteProduct}
        />
      ) : (
        <ProductsGrid
          products={filteredProducts}
          onPreview={setPreviewProduct}
          onAddNew={() => setShowAddModal(true)}
          onEdit={setEditingProduct}
          onDelete={handleDeleteProduct}
        />
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

      <CategoriesManagerModal
        isOpen={showCategoriesModal}
        categories={categories}
        isLoading={categoriesHook.isLoading}
        onClose={() => setShowCategoriesModal(false)}
        onSaveCategory={categoriesHook.saveCategory}
        onDeleteCategory={categoriesHook.removeCategory}
        onReorder={categoriesHook.reorder}
        onRefresh={categoriesHook.refreshCategories}
      />

      <CollectionsManagerModal
        isOpen={showCollectionsModal}
        collections={collections}
        allProducts={products as any}
        isLoading={collectionsHook.isLoading}
        onClose={() => setShowCollectionsModal(false)}
        onSave={async (data) => collectionsHook.createCollection(data)}
        onDelete={async (id) => collectionsHook.deleteCollection(id)}
        onShare={(coll) => setSharingCollection(coll)}
        onRefresh={collectionsHook.refresh}
      />

      <CollectionWhatsAppShareModal
        isOpen={Boolean(sharingCollection)}
        collection={sharingCollection}
        products={products as any}
        onClose={() => setSharingCollection(null)}
      />
    </div>
  );
};
