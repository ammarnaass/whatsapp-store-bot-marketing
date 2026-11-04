import { useState, useMemo, useCallback } from 'react';
import { useDataStore, CustomerItem } from '../../data-management';
import { CustomerSegmentFilter } from '../types/customers.types';

export function useCustomers() {
  const customers = useDataStore((s) => s.customers);
  const setCustomers = useDataStore((s) => s.setCustomers);

  const [activeSegment, setActiveSegment] = useState<CustomerSegmentFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Campaign modal state
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaignTitle, setCampaignTitle] = useState('عرض نهاية الأسبوع لعملاء VIP');
  const [campaignText, setCampaignText] = useState(
    'يا هلا {الاسم}! 🌿 كود خصم حصري (VIP20) بقيمة 20% لك اليوم فقط على جميع باقات المتجر.'
  );

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  const handleSync = useCallback(async () => {
    await useDataStore.getState().hydrateFromApi();
    showToast('تمت مزامنة بيانات العملاء وسجلات الشراء بنجاح مع المتجر وقاعدة البيانات المحلية ⚡');
  }, [showToast]);

  const handleExport = useCallback(() => {
    showToast('تم تصدير ملف العملاء (CSV / Excel) بنجاح');
  }, [showToast]);

  const handleSendSingleWhatsApp = useCallback(
    (cust: CustomerItem) => {
      showToast(`تم فتح نافذة محادثة واتساب المباشرة مع العميل: ${cust.name}`);
    },
    [showToast]
  );

  const handleLaunchCampaign = useCallback(() => {
    setShowCampaignModal(false);
    showToast('تم جدولة وإطلاق حملة الواتساب المستهدفة بنجاح عبر الوكيل الذكي');
  }, [showToast]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (activeSegment !== 'all' && c.segment !== activeSegment) return false;
      if (cityFilter !== 'all' && c.city !== cityFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [customers, activeSegment, cityFilter, searchQuery]);

  return {
    customers,
    filteredCustomers,
    activeSegment,
    setActiveSegment,
    searchQuery,
    setSearchQuery,
    cityFilter,
    setCityFilter,
    selectedCustomer,
    setSelectedCustomer,
    toastMessage,
    showToast,
    showCampaignModal,
    setShowCampaignModal,
    campaignTitle,
    setCampaignTitle,
    campaignText,
    setCampaignText,
    handleSync,
    handleExport,
    handleSendSingleWhatsApp,
    handleLaunchCampaign
  };
}
