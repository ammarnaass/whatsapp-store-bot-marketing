import { EventEmitter } from 'events';
import { AppDatabase } from '../../database/db';
import { IWhatsAppChannelProvider, SendMessageOptions, ChannelStatusResult } from '../channel-provider.interface';
import { SessionStatus, ChannelProviderType } from './openwa-types';
import { OpenWAHttpClient } from './openwa-client';
import { OpenWAResolver } from './openwa-resolver';
import { OpenWAProcessManager } from './openwa-process';
import { OpenWASessionManager } from './openwa-session';
import { OpenWAMessaging } from './openwa-messaging';
import { OpenWAReconciler } from './openwa-reconciler';

export * from './openwa-types';
export * from './openwa-client';
export * from './openwa-resolver';
export * from './openwa-process';
export * from './openwa-session';
export * from './openwa-messaging';
export * from './openwa-reconciler';
export * from './openwa-webhook';

export class OpenWAManager extends EventEmitter implements IWhatsAppChannelProvider {
  private static instance: OpenWAManager;

  public readonly id: ChannelProviderType = 'openwa_gateway';
  public readonly name = 'بوابة OpenWA المفتوحة (Multi-Device QR)';
  public defaultSessionId = 'wasell-main-store';

  private client: OpenWAHttpClient;
  private resolver: OpenWAResolver;
  private processManager: OpenWAProcessManager;
  private sessionManager: OpenWASessionManager;
  private messaging: OpenWAMessaging;
  private reconciler: OpenWAReconciler;

  private constructor() {
    super();
    const db = AppDatabase.getInstance().db;

    this.client = new OpenWAHttpClient('127.0.0.1', 2785, 'owa_k1_ae432e36acd4d1f24bccbd03e0e132606b163780f12985b96c724d3f3a97bcf9');
    this.processManager = new OpenWAProcessManager(this.client, 2785);
    this.resolver = new OpenWAResolver(() => this.processManager.getOpenWaDir());

    this.sessionManager = new OpenWASessionManager(this.client, db, this, this.defaultSessionId);
    this.messaging = new OpenWAMessaging(this.client, () => this.sessionManager.ensureSessionUuid());

    this.reconciler = new OpenWAReconciler({
      client: this.client,
      db,
      resolver: this.resolver,
      emitter: this,
      getOpenWaDir: () => this.processManager.getOpenWaDir(),
      ensureGatewayRunning: () => this.processManager.ensureGatewayRunning(),
      ensureSessionUuid: () => this.sessionManager.ensureSessionUuid(),
      defaultSessionId: this.defaultSessionId,
    });

    this.refreshApiKey();
    this.startReconciler();
  }

  public static getInstance(): OpenWAManager {
    if (!OpenWAManager.instance) {
      OpenWAManager.instance = new OpenWAManager();
    }
    return OpenWAManager.instance;
  }

  // Getters & Setters for full backward compatibility
  public get openwaHost(): string { return this.client.host; }
  public set openwaHost(val: string) { this.client.host = val; }

  public get openwaPort(): number { return this.client.port; }
  public set openwaPort(val: number) { this.client.port = val; }

  public get apiKey(): string { return this.client.apiKey; }
  public set apiKey(val: string) { this.client.apiKey = val; }

  public get currentStatus(): SessionStatus { return this.sessionManager.currentStatus; }
  public set currentStatus(val: SessionStatus) { this.sessionManager.currentStatus = val; }

  public get activeSessionUuid(): string | null { return this.sessionManager.activeSessionUuid; }
  public set activeSessionUuid(val: string | null) { this.sessionManager.activeSessionUuid = val; }

  // Delegated Process Methods
  public getOpenWaDir(): string { return this.processManager.getOpenWaDir(); }
  public refreshApiKey(): string { return this.processManager.refreshApiKey(); }
  public async ensureGatewayRunning(): Promise<boolean> { return this.processManager.ensureGatewayRunning(); }
  public stopGateway(): void {
    this.sessionManager.stopTimer();
    this.reconciler.stopReconciler();
    this.processManager.stopGateway();
  }

  // Delegated Session Methods
  public async ensureWebhookRegistered(uuid: string): Promise<boolean> { return this.sessionManager.ensureWebhookRegistered(uuid); }
  public async ensureSessionUuid(): Promise<string> { return this.sessionManager.ensureSessionUuid(); }
  public async getStatus(): Promise<ChannelStatusResult> { return this.sessionManager.getStatus(); }
  public async getQrCode(): Promise<string> { return this.sessionManager.getQrCode(); }
  public async startSession(sessionName: string = this.defaultSessionId): Promise<{ success: boolean; message: string; qr?: string; isOfflineDemo?: boolean }> {
    return this.sessionManager.startSession(sessionName);
  }
  public async simulatePair(phone: string = '966501234567'): Promise<{ success: boolean; phone: string }> {
    return this.sessionManager.simulatePair(phone);
  }
  public async getPairingCode(phone: string): Promise<{ success: boolean; code?: string; message?: string }> {
    return this.sessionManager.getPairingCode(phone);
  }
  public async getContactProfilePicture(phone: string): Promise<string> {
    return this.sessionManager.getContactProfilePicture(phone);
  }
  public async getContactDetails(phone: string): Promise<{ name?: string; pushName?: string; number?: string } | null> {
    return this.sessionManager.getContactDetails(phone);
  }
  public async logout(sessionName: string = this.defaultSessionId): Promise<boolean> {
    return this.sessionManager.logout(sessionName);
  }
  public async disconnect(): Promise<boolean> { return this.logout(); }

  // Delegated Messaging Methods
  public async sendMessage(options: SendMessageOptions): Promise<{ success: boolean; messageId: string; error?: string }> {
    return this.messaging.sendMessage(options);
  }
  public async sendTextMessage(phone: string, text: string): Promise<boolean> {
    return this.messaging.sendTextMessage(phone, text);
  }
  public async setTypingIndicator(to: string, isTyping: boolean): Promise<void> {
    return this.messaging.setTypingIndicator(to, isTyping);
  }
  public async setChatState(phone: string, state: 'composing' | 'paused'): Promise<void> {
    return this.messaging.setChatState(phone, state);
  }

  // Delegated Resolver & Reconciler Methods
  public resolveChatIdToPhone(chatId: string): string { return this.resolver.resolveChatIdToPhone(chatId); }
  public startReconciler(): void { this.reconciler.startReconciler(); }
  public stopReconciler(): void { this.reconciler.stopReconciler(); }
  public async reconcileLatestMessages(): Promise<number> { return this.reconciler.reconcileLatestMessages(); }
  public async syncChatsFromGateway(): Promise<{ success: boolean; count: number; error?: string }> {
    return this.reconciler.syncChatsFromGateway();
  }
}
