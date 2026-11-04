import { useState } from 'react';
import { ShipmentStatus } from '../types/shipping.types';

export function useShippingMutations(onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createShipment = async (data: {
    orderId: string;
    carrier: string;
    trackingNo?: string;
    trackingUrl?: string;
    customerPhone?: string;
    address?: any;
  }) => {
    setIsSubmitting(true);
    try {
      const res = await window.api.shipping.createShipment(data);
      if (res.success) {
        onSuccess?.();
      }
      return res;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStatus = async (shipmentId: string, status: ShipmentStatus) => {
    setIsSubmitting(true);
    try {
      const res = await window.api.shipping.updateStatus({ shipmentId, status });
      if (res.success) {
        onSuccess?.();
      }
      return res;
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveZone = async (zoneData: {
    id?: string;
    name: string;
    cities: string[];
    fee: number;
    freeOver?: number;
  }) => {
    setIsSubmitting(true);
    try {
      const res = await window.api.shipping.saveZone(zoneData);
      if (res.success) {
        onSuccess?.();
      }
      return res;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteZone = async (id: string) => {
    setIsSubmitting(true);
    try {
      const res = await window.api.shipping.deleteZone({ id });
      if (res.success) {
        onSuccess?.();
      }
      return res;
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendTrackingWhatsApp = async (phone: string, trackingNo: string, carrier: string) => {
    const text = `عزيزي العميل، نود تذكيرك بأن شحنتك رقم (${trackingNo}) عبر شركة ${carrier} جاري توصيلها إليك.\nيمكنك متابعة التتبع مباشرة عبر الرابط المُرسل سابقاً.`;
    return window.api.openwa.sendTextMessage?.(phone, text);
  };

  return {
    isSubmitting,
    createShipment,
    updateStatus,
    saveZone,
    deleteZone,
    sendTrackingWhatsApp,
  };
}

