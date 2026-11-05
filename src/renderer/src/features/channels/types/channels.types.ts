import { WebhookLog, HsmTemplate } from '../../data-management';
export * from './openwa.types';

export type { WebhookLog, HsmTemplate };

export type ChannelSubTab =
  | 'api'
  | 'openwa'
  | 'telegram'
  | 'swagger_docs'
  | 'ai_engine'
  | 'templates'
  | 'compliance'
  | 'logs';
