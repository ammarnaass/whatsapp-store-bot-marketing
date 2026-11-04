import { useState, useEffect, useMemo, useCallback } from 'react';
import { Shipment, ShippingZone, LogisticsKPIs, ShipmentFilterState } from '../types/shipping.types';

export function useShipping() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ShipmentFilterState>({
    search: '',
    status: 'ALL',
    carrier: 'ALL',
  });

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [shipmentsRes, zonesRes, ordersRes] = await Promise.all([
        window.api.shipping.listShipments?.() || [],
        window.api.shipping.listZones?.() || [],
        window.api.orders.list?.() || [],
      ]);
      setShipments(shipmentsRes);
      setZones(zonesRes);
      setOrders(ordersRes);
    } catch (err) {
      console.error('Failed to load shipping data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const kpis: LogisticsKPIs = useMemo(() => {
    const total = shipments.length;
    const inTransit = shipments.filter((s) => s.status === 'IN_TRANSIT').length;
    const outForDelivery = shipments.filter((s) => s.status === 'OUT_FOR_DELIVERY').length;
    const delivered = shipments.filter((s) => s.status === 'DELIVERED').length;
    const successRate = total > 0 ? Math.round((delivered / total) * 100) : 100;

    return {
      totalShipments: total,
      inTransit,
      outForDelivery,
      deliveredToday: delivered,
      successRate,
    };
  }, [shipments]);

  const filteredShipments = useMemo(() => {
    return shipments.filter((item) => {
      if (filters.status !== 'ALL' && item.status !== filters.status) return false;
      if (filters.carrier !== 'ALL' && item.carrier !== filters.carrier) return false;
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const tracking = item.tracking_no?.toLowerCase() || '';
        const customer = item.customer_name?.toLowerCase() || '';
        const phone = item.customer_phone?.toLowerCase() || '';
        const orderNo = item.order_number?.toLowerCase() || item.order_id?.toLowerCase() || '';
        const city = item.address?.city?.toLowerCase() || '';
        return (
          tracking.includes(query) ||
          customer.includes(query) ||
          phone.includes(query) ||
          orderNo.includes(query) ||
          city.includes(query)
        );
      }
      return true;
    });
  }, [shipments, filters]);

  return {
    shipments,
    filteredShipments,
    zones,
    orders,
    isLoading,
    filters,
    setFilters,
    kpis,
    refresh: fetchData,
  };
}

