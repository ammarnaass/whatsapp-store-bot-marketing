import { ProfitAnalysis } from '../types/products.types';

export function calculateNetProfit(sellingPrice: number, costPrice: number): number {
  return Math.round(((sellingPrice || 0) - (costPrice || 0)) * 100) / 100;
}

export function calculateProfitMarginPercent(sellingPrice: number, costPrice: number): number {
  if (!sellingPrice || sellingPrice <= 0) return 0;
  const margin = (((sellingPrice || 0) - (costPrice || 0)) / sellingPrice) * 100;
  return Math.round(margin * 10) / 10;
}

export function calculateMarkupPercent(sellingPrice: number, costPrice: number): number {
  if (!costPrice || costPrice <= 0) return 0;
  const markup = (((sellingPrice || 0) - costPrice) / costPrice) * 100;
  return Math.round(markup * 10) / 10;
}

export function calculateTaxAmount(price: number, taxRate: number, isInclusive: boolean): number {
  if (!price || price <= 0 || !taxRate || taxRate <= 0) return 0;
  if (isInclusive) {
    return Math.round((price - price / (1 + taxRate / 100)) * 100) / 100;
  }
  return Math.round((price * (taxRate / 100)) * 100) / 100;
}

export function calculateVolumetricWeight(l?: number, w?: number, h?: number): number {
  if (!l || !w || !h) return 0;
  return Math.round(((l * w * h) / 5000) * 100) / 100;
}

export function analyzeProfitability(
  sellingPrice: number,
  costPrice: number,
  taxRate = 15,
  isInclusive = true,
  length?: number,
  width?: number,
  height?: number
): ProfitAnalysis {
  const netProfit = calculateNetProfit(sellingPrice, costPrice);
  const marginPercent = calculateProfitMarginPercent(sellingPrice, costPrice);
  const markupPercent = calculateMarkupPercent(sellingPrice, costPrice);
  const taxAmount = calculateTaxAmount(sellingPrice, taxRate, isInclusive);
  const volumetricWeight = calculateVolumetricWeight(length, width, height);

  let marginHealth: ProfitAnalysis['marginHealth'] = 'good';
  if (netProfit < 0) {
    marginHealth = 'loss';
  } else if (marginPercent >= 35) {
    marginHealth = 'excellent';
  } else if (marginPercent >= 20) {
    marginHealth = 'good';
  } else {
    marginHealth = 'low';
  }

  return {
    netProfit,
    marginPercent,
    markupPercent,
    taxAmount,
    volumetricWeight,
    marginHealth,
  };
}

