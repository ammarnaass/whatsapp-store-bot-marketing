export type DeliveryType = 'home' | 'desk' | 'both';

export type ZoneScopeType = 'all_states' | 'specific_states' | 'specific_cities';

export interface CountryInfo {
  code: string;
  name: string;
  nameEn: string;
  flag: string;
  currency: string;
  phoneCode: string;
}

export interface StateInfo {
  code: string;
  name: string;
  nameEn?: string;
  region?: string;
}

export interface HierarchicalRateCalculationInput {
  countryCode: string;
  stateCode?: string;
  cityName?: string;
  deliveryType?: 'home' | 'desk';
  subtotal?: number;
  weightKg?: number;
}

export interface CalculatedShippingOption {
  carrierId: string;
  carrierName: string;
  carrierCode: string;
  zoneId: string;
  zoneName: string;
  cost: number;
  currency: string;
  deliveryType: 'home' | 'desk';
  estimatedDays: string;
  codAvailable: boolean;
  codFee: number;
  isFreeShipping: boolean;
}

