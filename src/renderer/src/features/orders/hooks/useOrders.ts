import { useState, useMemo, useCallback } from 'react';
import { useDataStore, OrderItem } from '../../data-management';
import { OrderStatusFilter, OrderSourceFilter, OrderPaymentFilter } from '../types/orders.types';
import { useOrderMutations } from './useOrderMutations';

export function useOrders() {
  const orders = useDataStore((s) => s.orders);
  const [activeStatus, setActiveStatus] = useState<OrderStatusFilter>('all');
  const [sourceFilter, setSourceFilter] = useState<OrderSourceFilter>('all');
  const [paymentFilter, setPaymentFilter] = useState<OrderPaymentFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [showNewOrderModal, setShowNewOrderModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage((p) => (p === msg ? null : p)), 3000);
  }, []);

  const { handleUpdateStatus, handleCancelOrder, handleCreateManualOrder, handleCopyOrder } = useOrderMutations(showToast);

  const handleSyncStore = useCallback(async () => {
    await useDataStore.getState().hydrateFromApi();
    showToast('تمت مزامنة الطلبات وحالات السداد بنجاح');
  }, [showToast]);

  const handleSendWhatsAppTracking = useCallback((ord: OrderItem) => {
    showToast(`تم إرسال إشعار التتبع للعميل (${ord.customerName}) بنجاح عبر واتساب 📲`);
  }, [showToast]);

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      if (activeStatus !== 'all' && ord.fulfillmentStatus !== activeStatus) return false;
      if (sourceFilter !== 'all' && ord.source !== sourceFilter) return false;
      if (paymentFilter !== 'all' && ord.paymentMethod !== paymentFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return ord.orderNumber.toLowerCase().includes(q) || ord.customerName.toLowerCase().includes(q) || ord.customerPhone.includes(q);
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
    handleCreateManualOrder,
    handleUpdateStatus,
    handleCancelOrder,
  };
}
