import { useState, useEffect, useCallback } from 'react';
import { shippingService } from '../services/shipping.service';
import { ShippingZone, ShippingMethod } from '../types/shipping.types';

export function useShippingZones() {
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedZone, setSelectedZone] = useState<ShippingZone | null>(null);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isMethodsOpen, setIsMethodsOpen] = useState<boolean>(false);

  const refreshZones = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await shippingService.getZones();
      setZones(data);
      if (selectedZone) {
        const updated = data.find((z) => z.id === selectedZone.id);
        if (updated) setSelectedZone(updated);
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedZone?.id]);

  useEffect(() => {
    refreshZones();
  }, []);

  const handleSaveZone = async (payload: Partial<ShippingZone>) => {
    await shippingService.saveZone(payload);
    await refreshZones();
    setIsFormOpen(false);
    setEditingZone(null);
  };

  const handleDeleteZone = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف منطقة الشحن هذه وكافة شركات الشحن المرتبطة بها؟')) return;
    await shippingService.deleteZone(id);
    if (selectedZone?.id === id) {
      setSelectedZone(null);
      setIsMethodsOpen(false);
    }
    await refreshZones();
  };

  const handleOpenMethods = (zone: ShippingZone) => {
    setSelectedZone(zone);
    setIsMethodsOpen(true);
  };

  const handleSaveMethod = async (methodData: Partial<ShippingMethod>) => {
    if (!selectedZone) return;
    await shippingService.saveMethod({ ...methodData, zone_id: selectedZone.id });
    await refreshZones();
  };

  const handleDeleteMethod = async (id: string) => {
    await shippingService.deleteMethod(id);
    await refreshZones();
  };

  const handleToggleMethod = async (id: string, active: boolean) => {
    await shippingService.toggleMethod(id, active);
    await refreshZones();
  };

  return {
    zones,
    isLoading,
    selectedZone,
    editingZone,
    isFormOpen,
    isMethodsOpen,
    setIsFormOpen,
    setIsMethodsOpen,
    setEditingZone,
    refreshZones,
    handleSaveZone,
    handleDeleteZone,
    handleOpenMethods,
    handleSaveMethod,
    handleDeleteMethod,
    handleToggleMethod,
  };
}

