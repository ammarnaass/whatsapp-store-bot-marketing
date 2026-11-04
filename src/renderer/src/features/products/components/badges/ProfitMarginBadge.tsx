import React from 'react';
import { MARGIN_HEALTH_CONFIG } from '../../constants/products.constants';
import { ProfitAnalysis } from '../../types/products.types';

interface ProfitMarginBadgeProps {
  profitAnalysis: ProfitAnalysis;
  size?: 'sm' | 'md';
}

export const ProfitMarginBadge: React.FC<ProfitMarginBadgeProps> = ({
  profitAnalysis,
  size = 'md',
}) => {
  const config = MARGIN_HEALTH_CONFIG[profitAnalysis.marginHealth] || MARGIN_HEALTH_CONFIG.good;
  const isSmall = size === 'sm';

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-xl border ${config.bg} ${config.text} ${config.border} ${
        isSmall ? 'px-2 py-0.5 text-xs' : 'px-3 py-1.5 text-xs font-bold'
      }`}
    >
      <span className="font-mono">
        {profitAnalysis.marginPercent > 0 ? `+${profitAnalysis.marginPercent}%` : `${profitAnalysis.marginPercent}%`}
      </span>
      <span className="opacity-70 font-normal">
        ({profitAnalysis.netProfit} ر.س ربح)
      </span>
    </div>
  );
};

