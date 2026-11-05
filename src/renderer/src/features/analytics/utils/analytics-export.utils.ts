import { AnalyticsSummaryKpis, FunnelStepItem, ConversationIntelligenceData } from '../types/analytics.types';

export function exportAnalyticsToCsv(
  period: string,
  kpis: AnalyticsSummaryKpis,
  funnel: FunnelStepItem[],
  intel: ConversationIntelligenceData,
): void {
  const lines: string[] = [];
  lines.push('تقرير التحليلات وذكاء المحادثات - منصة وصّل');
  lines.push(`الفترة الزمنية: ${period}`);
  lines.push(`تاريخ التصدير: ${new Date().toLocaleString('ar-SA')}`);
  lines.push('');

  lines.push('1. مؤشرات الأداء الحيوية (KPIs)');
  lines.push('المؤشر,القيمة,النمو مقارنة بالفترة السابقة');
  lines.push(`إجمالي الإيرادات,"${kpis.revenue.toLocaleString()} ر.س",+${kpis.revenueGrowth}%`);
  lines.push(`إجمالي الطلبات,"${kpis.totalOrders} طلب",+${kpis.ordersGrowth}%`);
  lines.push(`المحادثات النشطة,"${kpis.activeChats}",-`);
  lines.push(`معدل التحويل البيعي,"${kpis.conversionRate}%",-`);
  lines.push(`معدل أتمتة الوكيل,"${kpis.automationRate}%",-`);
  lines.push(`متوسط سرعة استجابة الوكيل,"${kpis.avgLatencyMs} مللي ثانية",-`);
  lines.push(`استهلاك التوكنز,"${kpis.tokenUsage.toLocaleString()}",-`);
  lines.push(`التكلفة المقدرة,"$${kpis.estimatedCost}",-`);
  lines.push('');

  lines.push('2. مراحل قمع التحويل البيعي (Funnel Conversion)');
  lines.push('المرحلة,العدد,النسبة المئوية');
  funnel.forEach((f) => {
    lines.push(`"${f.label}",${f.count},${f.rate}`);
  });
  lines.push('');

  lines.push('3. تصنيف نوايا العملاء (Intent Analysis)');
  lines.push('النية الشرائية أو الاستفسار,النسبة المئوية,عدد الاستفسارات');
  intel.intents.forEach((i) => {
    lines.push(`"${i.label}",${i.percent}%,${i.count}`);
  });

  const csvContent = '\uFEFF' + lines.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `wasell_analytics_report_${period}_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
