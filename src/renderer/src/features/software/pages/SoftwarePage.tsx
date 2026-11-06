import React, { useState } from 'react';
import { useSoftware } from '../hooks/useSoftware';
import { SoftwareHeader } from '../components/SoftwareHeader';
import { SoftwareKpiCards } from '../components/SoftwareKpiCards';
import { SoftwareGrid } from '../components/SoftwareGrid';
import { SoftwareActivationModal } from '../components/SoftwareActivationModal';
import { SoftwareKeysVaultModal } from '../components/SoftwareKeysVaultModal';
import { SoftwareFormModal } from '../components/SoftwareFormModal';

export const SoftwarePage: React.FC = () => {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const {
    items, isLoading, kpis, searchQuery, setSearchQuery, categoryFilter, setCategoryFilter,
    activeItem, setActiveItem, isActivationModalOpen, setIsActivationModalOpen,
    isKeysModalOpen, setIsKeysModalOpen, isFormModalOpen, setIsFormModalOpen,
    editingItem, setEditingItem, refresh, handleDelete, handleAddKeys,
  } = useSoftware(showToast);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 left-6 z-50 px-4 py-2.5 rounded-2xl bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-900 text-xs font-bold shadow-xl backdrop-blur-xs flex items-center gap-2">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <SoftwareHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddNew={() => { setEditingItem(null); setIsFormModalOpen(true); }}
        onRefresh={refresh}
        isLoading={isLoading}
      />

      {/* KPI Cards */}
      <SoftwareKpiCards kpis={kpis} />

      {/* Grid of Software Cards */}
      <SoftwareGrid
        items={items}
        categoryFilter={categoryFilter}
        onSelectCategory={setCategoryFilter}
        onOpenActivation={(item) => { setActiveItem(item); setIsActivationModalOpen(true); }}
        onOpenKeys={(item) => { setActiveItem(item); setIsKeysModalOpen(true); }}
        onEdit={(item) => { setEditingItem(item); setIsFormModalOpen(true); }}
        onDelete={handleDelete}
        onAddNew={() => { setEditingItem(null); setIsFormModalOpen(true); }}
      />

      {/* Modals */}
      <SoftwareActivationModal
        item={activeItem}
        isOpen={isActivationModalOpen}
        onClose={() => setIsActivationModalOpen(false)}
      />

      <SoftwareKeysVaultModal
        item={activeItem}
        isOpen={isKeysModalOpen}
        onClose={() => setIsKeysModalOpen(false)}
        onKeysAdded={() => { refresh(); }}
      />

      <SoftwareFormModal
        item={editingItem}
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSaved={() => { showToast('تم حفظ البرنامج بنجاح'); refresh(); }}
      />
    </div>
  );
};
