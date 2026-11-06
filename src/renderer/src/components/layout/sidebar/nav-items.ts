import {
  LayoutDashboard, MessageSquare, ShoppingBag, Package, Boxes, Truck,
  Megaphone, Bot, Users, BarChart2, Settings, Network, Send, AppWindow,
} from 'lucide-react';
import { SidebarNavItem, SidebarNavGroup } from './types';

export const SIDEBAR_NAV_GROUPS: SidebarNavGroup[] = [
  {
    id: 'operations',
    title: 'العمليات والمحادثات',
    items: [
      {
        id: 'dashboard', label: 'الرئيسية', description: 'نظرة شاملة ومؤشرات الأداء',
        icon: LayoutDashboard, iconBgLight: 'bg-emerald-50 text-emerald-600',
        iconBgDark: 'dark:bg-emerald-950/40 dark:text-emerald-400',
        iconColorLight: 'text-emerald-600', iconColorDark: 'dark:text-emerald-400',
      },
      {
        id: 'inbox', label: 'المحادثات', description: 'صندوق رسائل واتساب المباشر',
        icon: MessageSquare, iconBgLight: 'bg-teal-50 text-[#128C7E]',
        iconBgDark: 'dark:bg-teal-950/40 dark:text-emerald-300',
        iconColorLight: 'text-[#128C7E]', iconColorDark: 'dark:text-emerald-300',
      },
      {
        id: 'orders', label: 'الطلبات والمبيعات', description: 'إدارة الفواتير وحالات الدفع',
        icon: ShoppingBag, iconBgLight: 'bg-amber-50 text-amber-600',
        iconBgDark: 'dark:bg-amber-950/40 dark:text-amber-400',
        iconColorLight: 'text-amber-600', iconColorDark: 'dark:text-amber-400',
      },
      {
        id: 'products', label: 'المنتجات والكتالوج', description: 'كتالوج وبطاقات المتجر',
        icon: Package, iconBgLight: 'bg-indigo-50 text-indigo-600',
        iconBgDark: 'dark:bg-indigo-950/40 dark:text-indigo-400',
        iconColorLight: 'text-indigo-600', iconColorDark: 'dark:text-indigo-400',
      },
      {
        id: 'software', label: 'البرمجيات والتراخيص', description: 'برامج نقاط البيع، الروضات والتفعيلات',
        icon: AppWindow, iconBgLight: 'bg-blue-50 text-blue-600',
        iconBgDark: 'dark:bg-blue-950/40 dark:text-blue-400',
        iconColorLight: 'text-blue-600', iconColorDark: 'dark:text-blue-400',
      },
      {
        id: 'inventory', label: 'المخزون والتوريد', description: 'الجرد والمفاتيح الرقمية',
        icon: Boxes, iconBgLight: 'bg-emerald-50 text-emerald-600',
        iconBgDark: 'dark:bg-emerald-950/40 dark:text-emerald-400',
        iconColorLight: 'text-emerald-600', iconColorDark: 'dark:text-emerald-400',
      },
      {
        id: 'shipping', label: 'الشحن واللوجستيات', description: 'تتبع البوالص وشركات التوصيل',
        icon: Truck, iconBgLight: 'bg-cyan-50 text-cyan-600',
        iconBgDark: 'dark:bg-cyan-950/40 dark:text-cyan-400',
        iconColorLight: 'text-cyan-600', iconColorDark: 'dark:text-cyan-400',
      },
    ],
  },
  {
    id: 'growth',
    title: 'الذكاء والتسويق',
    items: [
      {
        id: 'agent', label: 'وكيل الذكاء الاصطناعي', description: 'أتمتة الردود والصفقات الذكية',
        icon: Bot, isAi: true, iconBgLight: 'bg-violet-50 text-[#7C3AED]',
        iconBgDark: 'dark:bg-violet-950/50 dark:text-violet-300',
        iconColorLight: 'text-[#7C3AED]', iconColorDark: 'dark:text-violet-300',
      },
      {
        id: 'marketing', label: 'التسويق والحملات', description: 'بث الرسائل والكوبونات الترويجية',
        icon: Megaphone, iconBgLight: 'bg-pink-50 text-pink-600',
        iconBgDark: 'dark:bg-pink-950/40 dark:text-pink-400',
        iconColorLight: 'text-pink-600', iconColorDark: 'dark:text-pink-400',
      },
      {
        id: 'customers', label: 'إدارة العملاء و CRM', description: 'قاعدة بيانات المشترين وتاريخهم',
        icon: Users, iconBgLight: 'bg-sky-50 text-sky-600',
        iconBgDark: 'dark:bg-sky-950/40 dark:text-sky-400',
        iconColorLight: 'text-sky-600', iconColorDark: 'dark:text-sky-400',
      },
      {
        id: 'analytics', label: 'التحليلات والمؤشرات', description: 'تقارير المبيعات والأداء المالي',
        icon: BarChart2, iconBgLight: 'bg-rose-50 text-rose-600',
        iconBgDark: 'dark:bg-rose-950/40 dark:text-rose-400',
        iconColorLight: 'text-rose-600', iconColorDark: 'dark:text-rose-400',
      },
    ],
  },
  {
    id: 'system',
    title: 'الربط والنظام',
    items: [
      {
        id: 'channels', label: 'قنوات واتساب والربط', description: 'بوابة OpenWA ووثائق Swagger',
        icon: Network, iconBgLight: 'bg-[#128C7E]/10 text-[#128C7E]',
        iconBgDark: 'dark:bg-[#128C7E]/20 dark:text-emerald-300',
        iconColorLight: 'text-[#128C7E]', iconColorDark: 'dark:text-emerald-300',
      },
      {
        id: 'telegram', label: 'بوابة بوت تليغرام', description: 'ربط Telegram Bot API والرد الذكي',
        icon: Send, iconBgLight: 'bg-blue-50 text-[#0088cc]',
        iconBgDark: 'dark:bg-blue-950/40 dark:text-blue-400',
        iconColorLight: 'text-[#0088cc]', iconColorDark: 'dark:text-blue-400',
      },
      {
        id: 'settings', label: 'الإعدادات والتكاملات', description: 'إعدادات المتجر والهوية والمظهر',
        icon: Settings, iconBgLight: 'bg-slate-100 text-slate-600',
        iconBgDark: 'dark:bg-slate-800 dark:text-slate-300',
        iconColorLight: 'text-slate-600', iconColorDark: 'dark:text-slate-300',
      },
    ],
  },
];

export const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = SIDEBAR_NAV_GROUPS.flatMap((g) => g.items);
