import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../api-bridge';
import { Coupon, CreateCouponFormData } from '../types/marketing.types';

export function useCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCoupons = useCallback(async () => {
    try {
      setIsLoading(true);
      const list = await api.coupons.list();
      setCoupons(list);
    } catch (err) {
      console.error('Failed to load coupons:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  const createCoupon = async (formData: CreateCouponFormData) => {
    try {
      const res = await api.coupons.create(formData);
      if (res.success) {
        await loadCoupons();
        return { success: true };
      }
      return { success: false, error: res.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const toggleCoupon = async (id: string, currentStatus: number | boolean) => {
    const nextStatus = currentStatus ? 0 : 1;
    try {
      await api.coupons.toggle(id, nextStatus);
      setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, is_active: nextStatus } : c)));
    } catch (err) {
      console.error('Failed to toggle coupon:', err);
    }
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الكوبون؟')) return;
    try {
      await api.coupons.delete(id);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Failed to delete coupon:', err);
    }
  };

  return {
    coupons,
    isLoading,
    loadCoupons,
    createCoupon,
    toggleCoupon,
    deleteCoupon,
  };
}

