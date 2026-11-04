import React, { useState } from 'react';
import { Megaphone, Plus } from 'lucide-react';
import { useMarketingData } from '../hooks/useMarketingData';
import { AntiBanSafeguards } from '../components/AntiBanSafeguards';
import { CampaignList } from '../components/CampaignList';
import { CreateCampaignModal } from '../components/CreateCampaignModal';

export const MarketingPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { campaigns, createCampaign } = useMarketingData();

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-[#1F293D] pb-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#128C7E]" />
            التسويق والحملات المقسمة عبر واتساب
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            إرسال حملات جماعية مجدولة مع خوارزميات مكافحة الحظر وتأخير بشري عشوائي واحترام الانسحاب الفوري
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#128C7E] hover:bg-[#075E54] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          إنشاء حملة تسويقية جديدة
        </button>
      </div>

      {/* بطاقات الإحصائيات لمكافحة الحظر */}
      <AntiBanSafeguards />

      {/* سجل الحملات */}
      <CampaignList campaigns={campaigns} />

      {/* نافذة إنشاء حملة جديدة */}
      <CreateCampaignModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={createCampaign}
      />
    </div>
  );
};
