import React, { useState } from 'react';
import { Plus, X, Sparkles, RefreshCw } from 'lucide-react';
import { Collection, CollectionFormData, Product } from '../types/collection.types';
import { CollectionCard } from './CollectionCard';
import { CollectionFormModal } from './CollectionFormModal';

interface CollectionsManagerModalProps {
  isOpen: boolean;
  collections: Collection[];
  allProducts: Product[];
  isLoading?: boolean;
  onClose: () => void;
  onSave: (data: CollectionFormData) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onShare: (coll: Collection) => void;
  onRefresh: () => void;
}

export const CollectionsManagerModal: React.FC<CollectionsManagerModalProps> = ({
  isOpen, collections, allProducts, isLoading = false, onClose, onSave, onDelete, onShare, onRefresh,
}) => {
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (!isOpen) return null;

  const handleOpenAdd = () => {
    setEditingCollection(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (coll: Collection) => {
    setEditingCollection(coll);
    setIsFormOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#111827] w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                إدارة المجموعات التسويقية والذكية
              </h2>
              <p className="text-[11px] text-slate-400">
                تجميع المنتجات في باقات وحملات لترويج سريع ومشاركتها بالواتساب
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={onRefresh} type="button" className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200" title="تحديث">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={onClose} type="button" className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-850 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 text-xs">
          <span className="font-bold text-slate-600 dark:text-slate-300">
            إجمالي المجموعات: <span className="font-mono text-purple-600">{collections.length}</span>
          </span>
          <button
            onClick={handleOpenAdd}
            type="button"
            className="h-8 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-1.5 shadow-sm shadow-purple-600/25 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إنشاء مجموعة جديدة</span>
          </button>
        </div>

        {/* Collections Grid */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 scrollbar-thin">
          {collections.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              لا توجد مجموعات تسويقية بعد. انقر على "إنشاء مجموعة جديدة" للبدء.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {collections.map((coll) => (
                <CollectionCard
                  key={coll.id}
                  collection={coll}
                  onEdit={handleOpenEdit}
                  onDelete={onDelete}
                  onShare={onShare}
                />
              ))}
            </div>
          )}
        </div>

        {/* Form Modal */}
        <CollectionFormModal
          isOpen={isFormOpen}
          initialCollection={editingCollection}
          allProducts={allProducts}
          onClose={() => setIsFormOpen(false)}
          onSave={onSave}
        />
      </div>
    </div>
  );
};
