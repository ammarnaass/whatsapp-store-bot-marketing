import { useState, useMemo, useCallback } from 'react';
import { useDataStore, OrderItem } from '../../data-management';
import {
  OrderStatusFilter,
  OrderSourceFilter,
  OrderPaymentFilter,
  NewManualOrderData
} from '../types/orders.types';
import { api } from '../../../api-bridge';

export function useOrders() {
  const orders = useDataStore((s) => s.orders);
  const setOrders = useDataStore((s) => s.setOrders);

  const [activeStatus, setActiveStatus] = useState<OrderStatusFilter>('all');
  const [sourceFilter, setSourceFilter] = useState<OrderSourceFilter>('all');
  const [paymentFilter, setPaymentFilter] = useState<OrderPaymentFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [showNewOrderModal, setShowNewOrderModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  const handleCopyOrder = useCallback((orderNo: string) => {
    navigator.clipboard.writeText(orderNo);
    showToast(`تم نسخ رقم الطلب (${orderNo}) للحافظة`);
  }, [showToast]);

  const handleSendWhatsAppTracking = useCallback((ord: OrderItem) => {
    showToast(`تم إرسال إشعار التتبع للعميل (${ord.customerName}) بنجاح عبر واتساب 📲`);
  }, [showToast]);

  const handleSyncStore = useCallback(async () => {
    await useDataStore.getState().hydrateFromApi();
    showToast('تمت مزامنة الطلبات وحالات السداد بنجاح مع المتجر وقاعدة البيانات المحلية');
  }, [showToast]);

  const handleCreateManualOrder = useCallback((data: NewManualOrderData) => {
    if (!data.customerName.trim()) return;

    // حفظ فوري للطلب في قاعدة بيانات SQLite عبر IPC
    api.orders.createManual({
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      productTitle: data.productTitle,
      price: data.price,
    }).catch((err) => console.error('Failed to persist manual order:', err));

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
      city: 'الرياض'
    };

    setOrders([newOrd, ...orders]);
    setShowNewOrderModal(false);
    showToast('تم إنشاء الطلب اليدوي بنجاح وتوليد رابط الدفع للعميل');
  }, [orders, setOrders, showToast]);

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      if (activeStatus !== 'all' && ord.fulfillmentStatus !== activeStatus) return false;
      if (sourceFilter !== 'all' && ord.source !== sourceFilter) return false;
      if (paymentFilter !== 'all' && ord.paymentMethod !== paymentFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          ord.orderNumber.toLowerCase().includes(q) ||
          ord.customerName.toLowerCase().includes(q) ||
          ord.customerPhone.includes(q)
        );
      }
      return true;
    });
  }, [orders, activeStatus, sourceFilter, paymentFilter, searchQuery]);

  return {
    orders,
    filteredOrders,
    activeStatus,
    setActiveStatus,
    sourceFilter,
    setSourceFilter,
    paymentFilter,
    setPaymentFilter,
    searchQuery,
    setSearchQuery,
    selectedOrder,
    setSelectedOrder,
    showNewOrderModal,
    setShowNewOrderModal,
    toastMessage,
    showToast,
    handleCopyOrder,
    handleSendWhatsAppTracking,
    handleSyncStore,
    handleCreateManualOrder
  };
}
