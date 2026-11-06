import { SoftwareItem, SoftwareWithInventory, SoftwareLicenseType } from '../../../../shared/types';

export type { SoftwareItem, SoftwareWithInventory, SoftwareLicenseType };

export interface SoftwareKpis {
  totalSolutions: number;
  availableKeys: number;
  soldKeys: number;
  totalRevenue: number;
}

export type SoftwareCategoryFilter = 'all' | 'pos' | 'rawda' | 'stock' | 'other';

export interface SoftwareFormState {
  software_name: string;
  version: string;
  category: string;
  website_url: string;
  download_url: string;
  license_type: SoftwareLicenseType;
  price: number;
  compare_at_price: number;
  currency: string;
  cover_image: string;
  screenshots: string[];
  activation_guide_images: string[];
  activation_instructions: string;
  system_requirements: string;
  demo_url: string;
  support_contact: string;
  initialKeysText?: string;
}

