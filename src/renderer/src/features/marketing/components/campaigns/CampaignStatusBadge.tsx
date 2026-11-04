import React from 'react';
import { CampaignStatus } from '../../types/marketing.types';
import { CAMPAIGN_STATUS_CONFIG } from '../../constants/marketing.constants';

interface CampaignStatusBadgeProps {
  status: CampaignStatus;
}

export const CampaignStatusBadge: React.FC<CampaignStatusBadgeProps> = ({ status }) => {
  const config = CAMPAIGN_STATUS_CONFIG[status] || CAMPAIGN_STATUS_CONFIG.DRAFT;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

