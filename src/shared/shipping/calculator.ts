import type { HierarchicalRateCalculationInput, CalculatedShippingOption } from './types';

export interface RawShippingZone {
  id: string;
  name: string;
  country_code: string;
  scope_type?: string;
  states_json?: string;
  states?: string[];
  cities_json?: string;
  cities?: string[];
  fee?: number;
  free_over?: number | null;
  is_active?: number;
}

export interface RawShippingMethod {
  id: string;
  zone_id: string;
  name: string;
  carrier_code?: string;
  cost: number;
  desk_cost?: number | null;
  delivery_type?: 'home' | 'desk' | 'both';
  currency: string;
  free_over?: number | null;
  estimated_delivery?: string;
  cod_available?: number;
  cod_fee?: number;
  is_active?: number;
}

function parseList(val: string | string[] | undefined): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return []; }
}

export function matchShippingZone(
  zones: RawShippingZone[],
  input: HierarchicalRateCalculationInput
): RawShippingZone | null {
  const active = zones.filter((z) => (z.is_active ?? 1) === 1);
  const countryZones = active.filter((z) => z.country_code === input.countryCode);

  if (input.stateCode && countryZones.length > 0) {
    const match = countryZones.find((z) => {
      const states = parseList(z.states || z.states_json);
      return (z.scope_type === 'specific_states' || states.length > 0) && states.includes(input.stateCode!);
    });
    if (match) return match;
  }

  if (input.cityName && countryZones.length > 0) {
    const match = countryZones.find((z) =>
      parseList(z.cities || z.cities_json).some((c) => c.toLowerCase() === input.cityName!.toLowerCase())
    );
    if (match) return match;
  }

  return (
    countryZones.find((z) => (z.scope_type || 'all_states') === 'all_states') ||
    active.find((z) => z.country_code === 'GLOBAL') ||
    countryZones[0] ||
    null
  );
}

export function calculateShippingRates(
  zones: RawShippingZone[],
  methods: RawShippingMethod[],
  input: HierarchicalRateCalculationInput
): CalculatedShippingOption[] {
  const matchedZone = matchShippingZone(zones, input);
  if (!matchedZone) return [];

  const zoneMethods = methods.filter(
    (m) => m.zone_id === matchedZone.id && (m.is_active ?? 1) === 1
  );

  const subtotal = input.subtotal ?? 0;
  const targetType = input.deliveryType || 'home';

  return zoneMethods
    .filter((m) => {
      const dType = m.delivery_type || 'both';
      return dType === 'both' || dType === targetType;
    })
    .map((m) => {
      const isDesk = targetType === 'desk';
      let cost = isDesk && m.desk_cost != null ? m.desk_cost : m.cost;
      const freeLimit = m.free_over ?? matchedZone.free_over;
      const isFree = Boolean(freeLimit && freeLimit > 0 && subtotal >= freeLimit);
      if (isFree) cost = 0;

      return {
        carrierId: m.id,
        carrierName: m.name,
        carrierCode: m.carrier_code || 'custom',
        zoneId: matchedZone.id,
        zoneName: matchedZone.name,
        cost: Math.max(0, cost),
        currency: m.currency || 'SAR',
        deliveryType: targetType,
        estimatedDays: m.estimated_delivery || '1-3 أيام عمل',
        codAvailable: Boolean(m.cod_available ?? 1),
        codFee: m.cod_fee ?? 0,
        isFreeShipping: isFree
      };
    })
    .sort((a, b) => a.cost - b.cost);
}
