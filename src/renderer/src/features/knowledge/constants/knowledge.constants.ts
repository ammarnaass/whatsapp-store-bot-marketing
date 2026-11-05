import { KnowledgeFormData } from '../types/knowledge.types';

export const KNOWLEDGE_CATEGORIES = [
  { value: 'shipping', label: 'الشحن والتوصيل', icon: 'Truck', color: '#3B82F6' },
  { value: 'returns_warranty', label: 'الاسترجاع والضمان', icon: 'RotateCcw', color: '#10B981' },
  { value: 'payment_bank', label: 'طرق الدفع والتحصيل', icon: 'CreditCard', color: '#8B5CF6' },
  { value: 'products_offers', label: 'المنتجات والعروض', icon: 'Tag', color: '#EC4899' },
  { value: 'hours_locations', label: 'ساعات العمل والفروع', icon: 'Clock', color: '#F59E0B' },
  { value: 'faq', label: 'أسئلة شائعة', icon: 'HelpCircle', color: '#06B6D4' },
  { value: 'general', label: 'معلومات عامة', icon: 'BookOpen', color: '#64748B' },
] as const;

export const KNOWLEDGE_SOURCE_TYPES = [
  { value: 'text_faq', label: 'نص وأسئلة شائعة', desc: 'نصوص مباشرة وأجوبة نموذجية' },
  { value: 'document', label: 'مستند أو سياسة (PDF/Docs)', desc: 'ملف سياسة أو كتالوج مرفوع' },
  { value: 'url', label: 'رابط خارجي (URL)', desc: 'صفحة ويب مفهرسة للشروط' },
  { value: 'custom_rule', label: 'قاعدة سلوك تجاري', desc: 'توجيه محدد لردود المبيعات' },
] as const;

export const DEFAULT_KNOWLEDGE_FORM: KnowledgeFormData = {
  title: '',
  category: 'shipping',
  source_type: 'text_faq',
  content: '',
  summary: '',
  priority: 3,
  active: true,
};

