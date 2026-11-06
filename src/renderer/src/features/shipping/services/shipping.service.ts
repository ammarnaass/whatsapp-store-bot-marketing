import { api } from '../../../api';
import { ShippingZone, ShippingMethod } from '../types/shipping.types';

export const shippingService = {
  getShipments: async (): Promise<any[]> => {
    return api.shipping.listShipments();
  },

  createShipment: async (data: any) => {
    return api.shipping.createShipment(data);
  },

  updateStatus: async (shipmentId: string, status: string) => {
    return api.shipping.updateStatus({ shipmentId, status });
  },

  getZones: async (): Promise<ShippingZone[]> => {
    return api.shipping.listZones();
  },

  saveZone: async (zone: Partial<ShippingZone>): Promise<{ success: boolean; id: string }> => {
    return api.shipping.saveZone(zone as any);
  },

  deleteZone: async (id: string): Promise<{ success: boolean }> => {
    return api.shipping.deleteZone({ id });
  },

  getMethods: async (zoneId: string): Promise<ShippingMethod[]> => {
    return api.shipping.listMethods({ zoneId });
  },

  saveMethod: async (method: Partial<ShippingMethod>): Promise<{ success: boolean; id: string }> => {
    return api.shipping.saveMethod(method);
  },

  deleteMethod: async (id: string): Promise<{ success: boolean }> => {
    return api.shipping.deleteMethod({ id });
  },

  toggleMethod: async (id: string, isActive: boolean): Promise<{ success: boolean }> => {
    return api.shipping.toggleMethod({ id, is_active: isActive });
  },
};

