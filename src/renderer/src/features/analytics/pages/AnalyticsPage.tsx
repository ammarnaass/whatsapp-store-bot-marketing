import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import { AnalyticsHeader } from '../components/AnalyticsHeader';
import { AnalyticsKpiCards } from '../components/AnalyticsKpiCards';
import { FunnelConversionCard } from '../components/FunnelConversionCard';
import { ConversationIntelligenceCard } from '../components/ConversationIntelligenceCard';
import { PeakHoursHeatmapCard } from '../components/PeakHoursHeatmapCard';
import { SmartActionableInsights } from '../components/SmartActionableInsights';

export const AnalyticsPage: React.FC = () => {
  const {
    period,
    setPeriod,
    comparePrevious,
    toggleCompare,
    loading,
    kpis,
    funnel,
    intelligence,
    peakHours,
    insights,
    refreshData,
    exportData,
  } = useAnalytics();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleExport = () => {
    exportData();
    setToastMessage('تم تصدير التقرير التحليلي الشامل بصيغة CSV بنجاح');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRefresh = async () => {
    await refreshData();
    setToastMessage('تم تحديث مؤشرات التحليلات الحية بنجاح');
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#128C7E] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce elevation-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header & Controls */}
      <AnalyticsHeader
        period={period}
        onPeriodChange={setPeriod}
        comparePrevious={comparePrevious}
        onToggleCompare={toggleCompare}
        onExport={handleExport}
        loading={loading}
        onRefresh={handleRefresh}
      />

      {/* 2. Analytics KPI Cards Row */}
      <AnalyticsKpiCards kpis={kpis} comparePrevious={comparePrevious} />

      {/* 3. Conversion Funnel & Intent Intelligence (Bento Row 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <FunnelConversionCard steps={funnel} />
        <ConversationIntelligenceCard intelligence={intelligence} />
      </div>

      {/* 4. Peak Hours Heatmap & Smart Actionable Insights (Bento Row 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <PeakHoursHeatmapCard peakHours={peakHours} />
        <SmartActionableInsights insights={insights} />
      </div>
    </div>
  );
};
