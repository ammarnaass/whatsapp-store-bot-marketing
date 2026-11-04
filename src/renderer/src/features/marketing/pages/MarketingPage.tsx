import React, { useState } from 'react';
import { MarketingTab } from '../types/marketing.types';
import { useCampaigns } from '../hooks/useCampaigns';
import { useCoupons } from '../hooks/useCoupons';
import { useMarketingStats } from '../hooks/useMarketingStats';
import { MarketingHeader } from '../components/MarketingHeader';
import { AntiBanSafeguardsCard } from '../components/AntiBanSafeguardsCard';
import { CampaignsTab } from '../components/tabs/CampaignsTab';
import { CouponsTab } from '../components/tabs/CouponsTab';
import { BlocklistTab } from '../components/tabs/BlocklistTab';
import { CreateCampaignModal } from '../components/create-campaign-modal/CreateCampaignModal';
import { CreateCouponModal } from '../components/coupons/CreateCouponModal';
import { CampaignRecipientsDrawer } from '../components/campaigns/CampaignRecipientsDrawer';

export const MarketingPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<MarketingTab>('campaigns');
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showCreateCoupon, setShowCreateCoupon] = useState(false);

  const {
    campaigns,
    isLoading: isCampaignsLoading,
    activeRecipientCampaignId,
    setActiveRecipientCampaignId,
    createCampaign,
    controlCampaign,
    deleteCampaign,
  } = useCampaigns();

  const {
    coupons,
    isLoading: isCouponsLoading,
    createCoupon,
    toggleCoupon,
    deleteCoupon,
  } = useCoupons();

  const {
    blocklist,
    isLoading: isBlocklistLoading,
    addToBlocklist,
    removeFromBlocklist,
  } = useMarketingStats();

  return (
    <div className="space-y-5">
      {/* الترويسة الرئيسية والتبويبات وأزرار الإضافة السريعة */}
      <MarketingHeader
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenCreateCampaign={() => setShowCreateCampaign(true)}
        onOpenCreateCoupon={() => setShowCreateCoupon(true)}
        campaignsCount={campaigns.length}
        couponsCount={coupons.length}
        blocklistCount={blocklist.length}
      />

      {/* بطاقات مؤشرات الحماية من الحظر */}
      <AntiBanSafeguardsCard />

      {/* التبويب النشط */}
      {currentTab === 'campaigns' && (
        <CampaignsTab
          campaigns={campaigns}
          isLoading={isCampaignsLoading}
          onControl={controlCampaign}
          onDelete={deleteCampaign}
          onViewRecipients={(id) => setActiveRecipientCampaignId(id)}
          onOpenCreate={() => setShowCreateCampaign(true)}
        />
      )}

      {currentTab === 'coupons' && (
        <CouponsTab
          coupons={coupons}
          isLoading={isCouponsLoading}
          onToggle={toggleCoupon}
          onDelete={deleteCoupon}
          onOpenCreate={() => setShowCreateCoupon(true)}
        />
      )}

      {currentTab === 'blocklist' && (
        <BlocklistTab
          blocklist={blocklist}
          isLoading={isBlocklistLoading}
          onAdd={addToBlocklist}
          onRemove={removeFromBlocklist}
        />
      )}

      {/* نوافذ الإدخال والمودالات */}
      <CreateCampaignModal
        isOpen={showCreateCampaign}
        onClose={() => setShowCreateCampaign(false)}
        onSubmit={createCampaign}
      />

      <CreateCouponModal
        isOpen={showCreateCoupon}
        onClose={() => setShowCreateCoupon(false)}
        onSubmit={createCoupon}
      />

      {/* درج سجل المستلمين */}
      <CampaignRecipientsDrawer
        campaignId={activeRecipientCampaignId}
        onClose={() => setActiveRecipientCampaignId(null)}
      />
    </div>
  );
};
