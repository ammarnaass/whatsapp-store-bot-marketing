import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import {
  InventoryHeader,
  InventoryKpiCards,
  InventoryFilterBar,
  InventoryTable,
  AdjustStockModal,
  InventoryLogsModal,
  LicenseKeysVaultModal,
} from '../components';
import { useDataStore } from '../../data-management';

export const InventoryPage: React.FC = () => {
  const {
    items, filteredItems, summary, activeTab, setActiveTab, searchQuery, setSearchQuery,
    adjustingItem, setAdjustingItem, selectedDigitalProduct, setSelectedDigitalProduct,
    showLogsModal, setShowLogsModal, toastMessage, handleAdjustStock, showToast,
  } = useInventory();

  const counts = {
    all: items.length,
    low_stock: summary.lowStockCount,
    out_of_stock: summary.outOfStockCount,
    digital: items.filter((i) => i.type === 'digital').length,
    physical: items.filter((i) => i.type === 'physical').length,
  };

  const handleSync = async () => {
    await useDataStore.getState().hydrateFromApi();
    showToast('تمت مزامنة رصيد المخزون مع قاعدة البيانات بنجاح');
  };

  return (
    <div className="flex flex-col w-full space-y-6 animate-in fade-in duration-200">
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#128C7E] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      <InventoryHeader onOpenLogs={() => setShowLogsModal(true)} onSync={handleSync} totalCount={items.length} />
      <InventoryKpiCards summary={summary} />
      <InventoryFilterBar searchQuery={searchQuery} onSearchChange={setSearchQuery} activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />
      <InventoryTable items={filteredItems} onAdjust={setAdjustingItem} onManageKeys={setSelectedDigitalProduct} />

      <AdjustStockModal item={adjustingItem} isOpen={Boolean(adjustingItem)} onClose={() => setAdjustingItem(null)} onConfirm={handleAdjustStock} />
      <InventoryLogsModal isOpen={showLogsModal} onClose={() => setShowLogsModal(false)} />
      <LicenseKeysVaultModal
        product={selectedDigitalProduct}
        isOpen={Boolean(selectedDigitalProduct)}
        onClose={() => setSelectedDigitalProduct(null)}
        onKeysAdded={(count) => showToast(`تمت إضافة ${count} مفتاح ترخيص بنجاح`)}
      />
    </div>
  );
};

