import { useState, useEffect } from 'react';
import { CARRIERS_LIST } from '../constants/shipping.constants';

export function useCreateShipmentForm(orders: any[], onSubmit: (data: any) => Promise<any>, onClose: () => void) {
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [carrier, setCarrier] = useState(CARRIERS_LIST[0].name);
  const [trackingNo, setTrackingNo] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [city, setCity] = useState('الرياض');
  const [street, setStreet] = useState('');
  const [sendWhatsApp, setSendWhatsApp] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (orders.length > 0 && !selectedOrderId) {
      setSelectedOrderId(orders[0].id);
    }
  }, [orders, selectedOrderId]);

  useEffect(() => {
    const ord = orders.find((o) => o.id === selectedOrderId);
    if (ord) {
      if (ord.customer_phone || ord.phone) setCustomerPhone(ord.customer_phone || ord.phone);
      if (ord.delivery_address) {
        try {
          const addr = typeof ord.delivery_address === 'string' ? JSON.parse(ord.delivery_address) : ord.delivery_address;
          if (addr.city) setCity(addr.city);
          if (addr.street) setStreet(addr.street);
        } catch {}
      }
    }
  }, [selectedOrderId, orders]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId) return;
    setLoading(true);
    try {
      await onSubmit({
        orderId: selectedOrderId,
        carrier,
        trackingNo: trackingNo.trim() || undefined,
        customerPhone: sendWhatsApp ? customerPhone.trim() : undefined,
        address: { city, street },
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return {
    selectedOrderId,
    setSelectedOrderId,
    carrier,
    setCarrier,
    trackingNo,
    setTrackingNo,
    customerPhone,
    setCustomerPhone,
    city,
    setCity,
    street,
    setStreet,
    sendWhatsApp,
    setSendWhatsApp,
    loading,
    handleSubmit,
  };
}

