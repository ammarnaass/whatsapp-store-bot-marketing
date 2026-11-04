import React, { useState } from 'react';
import { useShipping } from '../hooks/useShipping';
import { useShippingMutations } from '../hooks/useShippingMutations';
import { Shipment } from '../types/shipping.types';
import {
  ShippingHeader,
  ShippingKpis,
  ShipmentsFilterBar,
  ShipmentsTable,
  CreateShipmentModal,
  WaybillPrintModal,
  ShippingZonesModal,
} from '../components';

export const ShippingPage: React.FC = () => {
  const {
    filteredShipments,
    zones,
    orders,
    isLoading,
    filters,
    setFilters,
    kpis,
    refresh,
  } = useShipping();

  const {
    createShipment,
    updateStatus,
    saveZone,
    deleteZone,
    sendTrackingWhatsApp,
  } = useShippingMutations(refresh);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isZonesOpen, setIsZonesOpen] = useState(false);
  const [selectedShipmentForPrint, setSelectedShipmentForPrint] = useState<Shipment | null>(null);

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-200">
      <ShippingHeader
        totalCount={filteredShipments.length}
        isLoading={isLoading}
        onRefresh={refresh}
        onOpenCreateModal={() => setIsCreateOpen(true)}
        onOpenZonesModal={() => setIsZonesOpen(true)}
      />

      <ShippingKpis kpis={kpis} />

      <ShipmentsFilterBar filters={filters} onChange={setFilters} />

      <ShipmentsTable
        shipments={filteredShipments}
        isLoading={isLoading}
        onPrintWaybill={(shipment) => setSelectedShipmentForPrint(shipment)}
        onUpdateStatus={updateStatus}
        onSendWhatsApp={sendTrackingWhatsApp}
      />

      <CreateShipmentModal
        isOpen={isCreateOpen}
        orders={orders}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={createShipment}
      />

      <WaybillPrintModal
        shipment={selectedShipmentForPrint}
        onClose={() => setSelectedShipmentForPrint(null)}
      />

      <ShippingZonesModal
        isOpen={isZonesOpen}
        zones={zones}
        onClose={() => setIsZonesOpen(false)}
        onSaveZone={saveZone}
        onDeleteZone={deleteZone}
      />
    </div>
  );
};

export default ShippingPage;

