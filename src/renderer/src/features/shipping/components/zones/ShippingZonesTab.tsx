import React, { useState } from 'react';
import { Plus, Globe, Search } from 'lucide-react';
import { useShippingZones } from '../../hooks/useShippingZones';
import { ShippingZoneCard } from './ShippingZoneCard';
import { ShippingZoneFormModal } from './ShippingZoneFormModal';
import { ZoneMethodsModal } from './ZoneMethodsModal';

export const ShippingZonesTab: React.FC = () => {
  const {
    zones,
    selectedZone,
    editingZone,
    isFormOpen,
    isMethodsOpen,
    setIsFormOpen,
    setIsMethodsOpen,
    setEditingZone,
    handleSaveZone,
    handleDeleteZone,
    handleOpenMethods,
    handleSaveMethod,
    handleDeleteMethod,
    handleToggleMethod,
  } = useShippingZones();

  const [search, setSearch] = useState('');

  const filtered = zones.filter((z) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return z.name.toLowerCase().includes(q) || z.country_name.toLowerCase().includes(q) || z.country_code.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-[#128C7E] flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">نظام مناطق ودول الشحن والشركات</h3>
            <p className="text-[11px] text-slate-400">حدد الدولة، وأضف شركات الشحن المعتمدة (سمسا، أرامكس، ياليدين...) مع تكاليفها وعملاتها.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالدولة أو المنطقة..."
              className="w-full pr-9 pl-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
            />
          </div>
          <button
            onClick={() => { setEditingZone(null); setIsFormOpen(true); }}
            className="px-4 py-2 rounded-xl bg-[#128C7E] text-white text-xs font-bold hover:bg-[#0ea593] flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة دولة / منطقة</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((zone) => (
          <ShippingZoneCard
            key={zone.id}
            zone={zone}
            onManageMethods={handleOpenMethods}
            onEdit={(z) => { setEditingZone(z); setIsFormOpen(true); }}
            onDelete={handleDeleteZone}
          />
        ))}
      </div>

      <ShippingZoneFormModal
        isOpen={isFormOpen}
        initialData={editingZone}
        onClose={() => { setIsFormOpen(false); setEditingZone(null); }}
        onSave={handleSaveZone}
      />

      <ZoneMethodsModal
        isOpen={isMethodsOpen}
        zone={selectedZone}
        onClose={() => setIsMethodsOpen(false)}
        onSaveMethod={handleSaveMethod}
        onDeleteMethod={handleDeleteMethod}
        onToggleMethod={handleToggleMethod}
      />
    </div>
  );
};
