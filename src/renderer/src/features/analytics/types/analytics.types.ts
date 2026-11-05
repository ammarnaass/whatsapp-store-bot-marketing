export type AnalyticsPeriod = 'today' | '7d' | '30d' | 'quarter';

export interface AnalyticsSummaryKpis {
  revenue: number;
  totalOrders: number;
  activeChats: number;
  conversionRate: number;
  automationRate: number;
  avgLatencyMs: number;
  tokenUsage: number;
  estimatedCost: number;
  revenueGrowth: number;
  ordersGrowth: number;
}

export interface FunnelStepItem {
  id: string;
  label: string;
  count: number;
  rate: string;
  color: string;
}

export interface IntentItem {
  label: string;
  percent: number;
  count: number;
  color: string;
}

export interface SentimentMetrics {
  positive: number;
  neutral: number;
  negative: number;
  satisfactionRate: number;
}

export interface AgentQualityMetrics {
  confidenceScore: number;
  humanHandoverRate: number;
  avgLatencyMs: number;
  positiveReviewRate: number;
}

export interface ConversationIntelligenceData {
  intents: IntentItem[];
  sentiment: SentimentMetrics;
  agentQuality: AgentQualityMetrics;
}

export interface HourlyActivity {
  hour: string;
  chats: number;
  orders: number;
}

export interface PeakHoursData {
  peakWindow: string;
  peakConversionBoost: string;
  hourlyData: HourlyActivity[];
}

export interface ActionableInsightItem {
  id: string;
  type: 'growth' | 'timing' | 'automation' | 'alert';
  title: string;
  desc: string;
  impact: string;
}
