import { useState, useEffect, useCallback } from 'react';
import {
  AnalyticsPeriod,
  AnalyticsSummaryKpis,
  FunnelStepItem,
  ConversationIntelligenceData,
  PeakHoursData,
  ActionableInsightItem,
} from '../types/analytics.types';
import { AnalyticsService } from '../services/analytics.service';
import { exportAnalyticsToCsv } from '../utils/analytics-export.utils';

export function useAnalytics() {
  const [period, setPeriod] = useState<AnalyticsPeriod>('30d');
  const [comparePrevious, setComparePrevious] = useState(true);
  const [loading, setLoading] = useState(false);

  const [kpis, setKpis] = useState<AnalyticsSummaryKpis>({
    revenue: 0, totalOrders: 0, activeChats: 0, conversionRate: 0, automationRate: 85,
    avgLatencyMs: 340, tokenUsage: 0, estimatedCost: 0, revenueGrowth: 14.8, ordersGrowth: 11.2,
  });
  const [funnel, setFunnel] = useState<FunnelStepItem[]>([]);
  const [intelligence, setIntelligence] = useState<ConversationIntelligenceData>({
    intents: [],
    sentiment: { positive: 76, neutral: 18, negative: 6, satisfactionRate: 95 },
    agentQuality: { confidenceScore: 94, humanHandoverRate: 6, avgLatencyMs: 340, positiveReviewRate: 95 },
  });
  const [peakHours, setPeakHours] = useState<PeakHoursData>({
    peakWindow: '08:00 مساءً إلى 11:30 مساءً',
    peakConversionBoost: '+64%',
    hourlyData: [],
  });
  const [insights, setInsights] = useState<ActionableInsightItem[]>([]);

  const loadAll = useCallback(async (p: AnalyticsPeriod) => {
    setLoading(true);
    try {
      const [k, f, i, ph, ins] = await Promise.all([
        AnalyticsService.fetchSummary(p),
        AnalyticsService.fetchFunnel(p),
        AnalyticsService.fetchIntelligence(p),
        AnalyticsService.fetchPeakHours(),
        AnalyticsService.fetchInsights(),
      ]);
      setKpis(k);
      setFunnel(f);
      setIntelligence(i);
      setPeakHours(ph);
      setInsights(ins);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll(period);
  }, [period, loadAll]);

  const exportData = useCallback(() => {
    exportAnalyticsToCsv(period, kpis, funnel, intelligence);
  }, [period, kpis, funnel, intelligence]);

  return {
    period,
    setPeriod,
    comparePrevious,
    toggleCompare: () => setComparePrevious((prev) => !prev),
    loading,
    kpis,
    funnel,
    intelligence,
    peakHours,
    insights,
    refreshData: () => loadAll(period),
    exportData,
  };
}
