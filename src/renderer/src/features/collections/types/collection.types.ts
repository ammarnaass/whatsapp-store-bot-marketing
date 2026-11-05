import { Collection, ProductCollection, CollectionFormData, Product } from '../../../../shared/types';

export type { Collection, ProductCollection, CollectionFormData, Product };

export interface CollectionFormErrors {
  name?: string;
  slug?: string;
}

export type CollectionFilterId = 'all' | string;

export interface WhatsAppShareCardOptions {
  includePrices: boolean;
  includeLinks: boolean;
  customNote?: string;
}

