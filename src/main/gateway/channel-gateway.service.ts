import { EventEmitter } from 'events';
import { SessionStatus } from '../../shared/types';
import {
  WhatsAppChannel,
  SendOpts,
  SendResult,
  MediaInput,
  ChannelEvent,
} from './whatsapp-channel.interface';
import { OpenWAAdapter } from './openwa.adapter';

export class ChannelGatewayService extends EventEmitter {
  private static instance: ChannelGatewayService;
  private activeChannel: WhatsAppChannel;
  private openwaAdapter: OpenWAAdapter;

  private constructor() {
    super();
    this.openwaAdapter = new OpenWAAdapter();
    this.activeChannel = this.openwaAdapter;

    // إعادة توجيه كافة أحداث القناة
    this.activeChannel.onEvent((event: ChannelEvent) => {
      this.emit('event', event);
      this.emit(event.type, event);
    });
  }

  public static getInstance(): ChannelGatewayService {
    if (!ChannelGatewayService.instance) {
      ChannelGatewayService.instance = new ChannelGatewayService();
    }
    return ChannelGatewayService.instance;
  }

  public getChannel(): WhatsAppChannel {
    return this.activeChannel;
  }

  public setChannel(channel: WhatsAppChannel): void {
    this.activeChannel = channel;
  }

  public getOpenWAAdapter(): OpenWAAdapter {
    return this.openwaAdapter;
  }

  // الواجهات الموحدة للتطبيق بالكامل
  public async startSession(sessionId?: string): Promise<void> {
    return await this.activeChannel.startSession(sessionId || 'wasell_main_store');
  }

  public async getQr(sessionId?: string): Promise<string> {
    return await this.activeChannel.getQr(sessionId || 'wasell_main_store');
  }

  public async getStatus(sessionId?: string): Promise<SessionStatus> {
    return await this.activeChannel.getStatus(sessionId || 'wasell_main_store');
  }

  public async sendText(chatId: string, text: string, opts?: SendOpts): Promise<SendResult> {
    return await this.activeChannel.sendText('wasell_main_store', chatId, text, opts);
  }

  public async sendMedia(chatId: string, media: MediaInput, opts?: SendOpts): Promise<SendResult> {
    return await this.activeChannel.sendMedia('wasell_main_store', chatId, media, opts);
  }

  public onEvent(handler: (e: ChannelEvent) => void): void {
    this.activeChannel.onEvent(handler);
  }
}

