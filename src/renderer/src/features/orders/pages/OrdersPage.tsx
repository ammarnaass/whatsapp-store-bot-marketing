import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { OrdersHeader } from '../components/OrdersHeader';
import { OrdersKpis } from '../components/OrdersKpis';
import { OrdersFilters } from '../components/OrdersFilters';
import { OrdersTable } from '../components/OrdersTable';
import { OrderDetailModal } from '../components/OrderDetailModal';
import { NewOrderModal } from '../components/NewOrderModal';

export const OrdersPage: React.FC = () => {
  const {
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
  } = useOrders();

  const counts = {
    all: orders.length,
    confirmed: orders.filter((o) => o.fulfillmentStatus === 'confirmed').length,
    shipping: orders.filter((o) => o.fulfillmentStatus === 'shipping').length,
    delivered: orders.filter((o) => o.fulfillmentStatus === 'delivered').length
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#128C7E] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header & Actions Bar */}
      <OrdersHeader
        totalOrdersCount={orders.length}
        onExport={() => showToast('تم تصدير ملف الطلبات بصيغة Excel')}
        onSync={handleSyncStore}
        onAddNew={() => setShowNewOrderModal(true)}
      />

      {/* 2. Metric Ribbon Cards */}
      <OrdersKpis orders={orders} />

      {/* 3. Search & Filter Bar */}
      <OrdersFilters
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
        sourceFilter={sourceFilter}
        onSourceChange={setSourceFilter}
        paymentFilter={paymentFilter}
        onPaymentChange={setPaymentFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        counts={counts}
      />

      {/* 4. Orders Table */}
      <OrdersTable
        orders={filteredOrders}
        onCopyOrder={handleCopyOrder}
        onSelectOrder={setSelectedOrder}
        onSendWhatsAppTracking={handleSendWhatsAppTracking}
      />

      {/* 5. Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onSendWhatsAppTracking={handleSendWhatsAppTracking}
        onUpdateStatus={handleUpdateStatus}
        onCancelOrder={handleCancelOrder}
      />

      {/* 6. Create Manual Order Modal */}
      <NewOrderModal
        isOpen={showNewOrderModal}
        onClose={() => setShowNewOrderModal(false)}
        onSubmit={handleCreateManualOrder}
      />
    </div>
  );
};
