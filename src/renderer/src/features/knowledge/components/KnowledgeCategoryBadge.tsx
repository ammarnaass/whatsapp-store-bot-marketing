import React from 'react';
import {
  Truck, RotateCcw, CreditCard, Tag, Clock, HelpCircle,
  BookOpen, FileText, Globe, Sliders, LucideIcon
} from 'lucide-react';
import { KNOWLEDGE_CATEGORIES } from '../constants/knowledge.constants';

const ICON_MAP: Record<string, LucideIcon> = {
  Truck, RotateCcw, CreditCard, Tag, Clock, HelpCircle,
  BookOpen, FileText, Globe, Sliders,
};

interface KnowledgeCategoryBadgeProps {
  category: string;
  sourceType?: string;
  className?: string;
}

export const KnowledgeCategoryBadge: React.FC<KnowledgeCategoryBadgeProps> = ({
  category,
  sourceType,
  className = '',
}) => {
  const catConfig = KNOWLEDGE_CATEGORIES.find((c) => c.value === category) || {
    label: category,
    icon: 'BookOpen',
    color: '#64748B',
  };

  const IconComp = ICON_MAP[catConfig.icon] || BookOpen;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border transition-all"
        style={{
          backgroundColor: `${catConfig.color}15`,
          borderColor: `${catConfig.color}35`,
          color: catConfig.color,
        }}
      >
        <IconComp className="w-3 h-3 shrink-0" />
        <span>{catConfig.label}</span>
      </span>

      {sourceType && (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          {sourceType === 'document' ? '📄 مستند' : sourceType === 'url' ? '🌐 رابط' : sourceType === 'custom_rule' ? '⚡ قاعدة' : '💬 سؤال وجواب'}
        </span>
      )}
    </div>
  );
};
