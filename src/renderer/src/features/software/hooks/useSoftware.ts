import { useState, useEffect, useCallback, useMemo } from 'react';
import { SoftwareWithInventory, SoftwareKpis } from '../types/software.types';
import { softwareService } from '../services/software.service';

export function useSoftware(onToast?: (msg: string) => void) {
  const [items, setItems] = useState<SoftwareWithInventory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const [activeItem, setActiveItem] = useState<SoftwareWithInventory | null>(null);
  const [isActivationModalOpen, setIsActivationModalOpen] = useState<boolean>(false);
  const [isKeysModalOpen, setIsKeysModalOpen] = useState<boolean>(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<SoftwareWithInventory | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await softwareService.list();
      setItems(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = categoryFilter === 'all' || item.category.toLowerCase().includes(categoryFilter.toLowerCase());
      const matchQuery = !searchQuery.trim() ||
        item.software_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.version && item.version.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [items, categoryFilter, searchQuery]);

  const kpis: SoftwareKpis = useMemo(() => {
    const totalSolutions = items.length;
    const availableKeys = items.reduce((acc, i) => acc + (i.availableKeysCount || 0), 0);
    const soldKeys = items.reduce((acc, i) => acc + (i.soldKeysCount || 0), 0);
    const totalRevenue = items.reduce((acc, i) => acc + ((i.soldKeysCount || 0) * (i.price || 0)), 0);
    return { totalSolutions, availableKeys, soldKeys, totalRevenue };
  }, [items]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا البرنامج؟ سيتم حذف بيانات التفعيل والمنتج الرقمي المرتبط به.')) return;
    const res = await softwareService.delete(id);
    if (res.success) {
      onToast?.('تم حذف البرنامج بنجاح');
      await loadData();
    } else onToast?.(res.error || 'فشل حذف البرنامج');
  };

  const handleAddKeys = async (softwareId: string, keys: string[]) => {
    const res = await softwareService.addKeys(softwareId, keys);
    if (res.success) {
      onToast?.(`تم إضافة ${res.count} مفتاح تفعيل بنجاح وتحديث المخزون`);
      await loadData();
    } else onToast?.(res.error || 'فشل إضافة المفاتيح');
    return res;
  };

  return {
    items: filteredItems, rawItems: items, isLoading, kpis,
    searchQuery, setSearchQuery, categoryFilter, setCategoryFilter,
    activeItem, setActiveItem, isActivationModalOpen, setIsActivationModalOpen,
    isKeysModalOpen, setIsKeysModalOpen, isFormModalOpen, setIsFormModalOpen,
    editingItem, setEditingItem, refresh: loadData, handleDelete, handleAddKeys,
  };
}
