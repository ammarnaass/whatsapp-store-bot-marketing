import { ChatItem } from '../../data-management';

export type { ChatItem };

export type ChatFilterMode = 'all' | 'human' | 'ai' | 'abandoned' | 'vip';

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'ai' | 'human';
  text: string;
  time: string;
  latency?: string;
  hasProduct?: boolean;
}
