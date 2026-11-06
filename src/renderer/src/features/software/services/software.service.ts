import { api } from '../../../api-bridge';
import { SoftwareItem, SoftwareWithInventory } from '../types/software.types';

export const softwareService = {
  async list(params?: { category?: string; query?: string }): Promise<SoftwareWithInventory[]> {
    try {
      return (await api.software.list(params)) || [];
    } catch (err) {
      console.error('[softwareService] list error:', err);
      return [];
    }
  },

  async get(id: string): Promise<SoftwareWithInventory | null> {
    try {
      return await api.software.get(id);
    } catch (err) {
      console.error('[softwareService] get error:', err);
      return null;
    }
  },

  async create(data: Partial<SoftwareItem> & { initialKeys?: string[] }): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      return await api.software.create(data);
    } catch (err: any) {
      return { success: false, error: err.message || 'فشل حفظ البرنامج' };
    }
  },

  async update(id: string, data: Partial<SoftwareItem>): Promise<{ success: boolean; error?: string }> {
    try {
      return await api.software.update(id, data);
    } catch (err: any) {
      return { success: false, error: err.message || 'فشل تعديل البرنامج' };
    }
  },

  async delete(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      return await api.software.delete(id);
    } catch (err: any) {
      return { success: false, error: err.message || 'فشل حذف البرنامج' };
    }
  },

  async addKeys(softwareId: string, keys: string[]): Promise<{ success: boolean; count: number; error?: string }> {
    try {
      return await api.software.addKeys({ softwareId, keys });
    } catch (err: any) {
      return { success: false, count: 0, error: err.message || 'فشل إضافة المفاتيح' };
    }
  },

  async getKeys(softwareId: string): Promise<any[]> {
    try {
      return (await api.software.getKeys(softwareId)) || [];
    } catch (err) {
      console.error('[softwareService] getKeys error:', err);
      return [];
    }
  },
};

