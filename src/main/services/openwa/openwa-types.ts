import { SessionStatus, ChannelProviderType } from '../../../shared/types';
import { ChannelStatusResult, SendMessageOptions } from '../channel-provider.interface';

export interface OpenWAConfig {
  host: string;
  port: number;
  apiKey: string;
  defaultSessionId: string;
}

export type { SessionStatus, ChannelProviderType, ChannelStatusResult, SendMessageOptions };

