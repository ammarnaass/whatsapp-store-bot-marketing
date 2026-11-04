import { useCallback } from 'react';
import { useDataStore, OrderItem } from '../../data-management';
import { NewManualOrderData } from '../types/orders.types';
import { api } from '../../../api-bridge';

export function useOrderMutations(showToast: (msg: string) => void) {
  const orders = useDataStore((s) => s.orders);
  const setOrders = useDataStore((s) => s.setOrders);

  const handleUpdateStatus = useCallback(async (orderId: string, status: string, trackingNo?: string, trackingUrl?: string) => {
    try {
      await api.orders.updateStatus(orderId, status, trackingNo, trackingUrl);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId || o.orderNumber === orderId ? { ...o, fulfillmentStatus: status as any } : o))
      );
      showToast(`تم تحديث حالة الطلب إلى (${status}) وإرسال إشعار للعميل عبر واتساب 📲`);
    } catch {
      showToast('تعذر تحديث حالة الطلب');
    }
  }, [setOrders, showToast]);

  const handleCancelOrder = useCallback(async (orderId: string, reason?: string) => {
    if (!confirm('هل أنت متأكد من إلغاء هذا الطلب وإرجاع المنتجات إلى رصيد المخزون؟')) return;
    try {
      await api.orders.cancel?.({ orderId, reason });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId || o.orderNumber === orderId ? { ...o, fulfillmentStatus: 'cancelled' as any } : o))
      );
      showToast('تم إلغاء الطلب واسترجاع المخزون بنجاح');
    } catch {
      showToast('فشل إلغاء الطلب');
    }
  }, [setOrders, showToast]);

  const handleCreateManualOrder = useCallback((data: NewManualOrderData) => {
    if (!data.customerName.trim()) return;

    api.orders.createManual({
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      productTitle: data.productTitle,
      price: data.price,
      notes: data.notes,
    }).catch(console.error);

    const newOrd: OrderItem = {
      id: `ord_${Date.now()}`,
      orderNumber: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      items: [{ title: data.productTitle, qty: 1, price: data.price, icon: '📦' }],
      source: 'human',
      sourceLabel: 'إنشاء يدوي بالواتساب',
      paymentMethod: 'apple_pay',
      paymentMethodLabel: 'Apple Pay',
      paymentStatus: 'paid',
      fulfillmentStatus: 'confirmed',
      fulfillmentStatusLabel: 'مؤكد وجاهز للتجهيز',
      total: data.price,
      timeAgo: 'الآن',
      city: 'الرياض',
    };

    setOrders([newOrd, ...orders]);
    showToast('تم إنشاء الطلب بنجاح وتوليد رابط الدفع للعميل');
  }, [orders, setOrders, showToast]);

  const handleCopyOrder = useCallback((orderNo: string) => {
    navigator.clipboard.writeText(orderNo);
    showToast(`تم نسخ رقم الطلب (${orderNo}) للحافظة`);
  }, [showToast]);

  return { handleUpdateStatus, handleCancelOrder, handleCreateManualOrder, handleCopyOrder };
}

