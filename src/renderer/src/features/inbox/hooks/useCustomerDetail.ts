import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../../../api-bridge';
import { CustomerDetailProfile } from '../types/customer-detail.types';

export function useCustomerDetail(phone?: string, contactId?: string) {
  const [profile, setProfile] = useState<CustomerDetailProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notesInput, setNotesInput] = useState<string>('');
  const [isSavingNotes, setIsSavingNotes] = useState<boolean>(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // جلب تفاصيل العميل الحقيقية عند تغير المحادثة أو الهاتف
  const fetchCustomerDetail = useCallback(async () => {
    if (!phone && !contactId) {
      setProfile(null);
      setNotesInput('');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.customers.get({ phone, contactId });
      if (res) {
        setProfile(res);
        setNotesInput(res.notes || '');
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.warn('[useCustomerDetail] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [phone, contactId]);

  useEffect(() => {
    fetchCustomerDetail();
  }, [fetchCustomerDetail]);

  // حفظ ملاحظات الفريق في SQLite مع مؤقت Debounce تلقائي
  const handleNotesChange = (text: string) => {
    setNotesInput(text);
    if (!profile?.id) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setIsSavingNotes(true);
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await api.customers.updateNotes(profile.id, text);
        setProfile((prev) => (prev ? { ...prev, notes: text } : null));
      } catch (err) {
        console.warn('[useCustomerDetail] Save notes error:', err);
      } finally {
        setIsSavingNotes(false);
      }
    }, 800);
  };

  // إضافة أو حذف وسم
  const handleToggleTag = async (tag: string) => {
    if (!profile?.id) return;
    const currentTags = profile.tags || [];
    const nextTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];

    try {
      await api.customers.updateTags(profile.id, nextTags);
      setProfile((prev) => (prev ? { ...prev, tags: nextTags, isVip: nextTags.includes('VIP') } : null));
    } catch (err) {
      console.warn('[useCustomerDetail] Update tags error:', err);
    }
  };

  return {
    profile,
    isLoading,
    notesInput,
    isSavingNotes,
    handleNotesChange,
    handleToggleTag,
    refreshCustomer: fetchCustomerDetail,
  };
}

