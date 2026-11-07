import { StateInfo } from './types';
import { ALGERIA_WILAYAS } from './states-algeria';
import { SAUDI_REGIONS } from './states-saudi';
import { UAE_EMIRATES, EGYPT_GOVERNORATES, MOROCCO_REGIONS, TUNISIA_GOVERNORATES } from './states-gulf-arab';

export function getStatesForCountry(countryCode?: string): StateInfo[] {
  if (!countryCode) return [];
  const upper = countryCode.toUpperCase();
  switch (upper) {
    case 'DZ':
      return ALGERIA_WILAYAS;
    case 'SA':
      return SAUDI_REGIONS;
    case 'AE':
      return UAE_EMIRATES;
    case 'EG':
      return EGYPT_GOVERNORATES;
    case 'MA':
      return MOROCCO_REGIONS;
    case 'TN':
      return TUNISIA_GOVERNORATES;
    default:
      return [];
  }
}

export function getStateName(countryCode: string, stateCode: string): string {
  const states = getStatesForCountry(countryCode);
  const found = states.find((s) => s.code === stateCode);
  return found ? found.name : stateCode;
}

