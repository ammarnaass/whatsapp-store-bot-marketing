export interface ParsedMetaMessage {
  isMessage: boolean;
  phone: string;
  name: string;
  body: string;
  messageId: string;
  type: string;
  timestamp: number;
  phoneNumberId?: string;
}

export class MetaWebhookParser {
  public static parse(payload: any): ParsedMetaMessage | null {
    if (!payload || payload.object !== 'whatsapp_business_account') return null;

    const entry = payload.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    if (!change || !change.messages || !Array.isArray(change.messages) || change.messages.length === 0) {
      // إما إشعار حالة (delivered / read / sent) أو حزمة غير متعلقة برسالة
      return null;
    }

    const msg = change.messages[0];
    const contact = change.contacts?.[0];
    const phoneNumberId = change.metadata?.phone_number_id;

    const phone = (msg.from || contact?.wa_id || '').replace(/\D/g, '');
    const name = contact?.profile?.name || phone || 'عميل واتساب';
    const messageId = msg.id || `meta_msg_${Date.now()}`;
    const timestamp = Number(msg.timestamp ? msg.timestamp * 1000 : Date.now());

    let body = '';
    const type = msg.type || 'text';

    if (type === 'text' && msg.text?.body) {
      body = msg.text.body;
    } else if (type === 'interactive') {
      const interactive = msg.interactive;
      if (interactive?.button_reply?.title) {
        body = interactive.button_reply.title;
      } else if (interactive?.list_reply?.title) {
        body = interactive.list_reply.title;
      } else {
        body = '[رد تفاعلي]';
      }
    } else if (type === 'button' && msg.button?.text) {
      body = msg.button.text;
    } else if (type === 'image') {
      body = msg.image?.caption || '[صورة]';
    } else if (type === 'document') {
      body = msg.document?.caption || msg.document?.filename || '[مستند]';
    } else if (type === 'audio') {
      body = '[رسالة صوتية]';
    } else if (type === 'video') {
      body = msg.video?.caption || '[فيديو]';
    } else if (type === 'location') {
      body = `[موقع جغرافي: ${msg.location?.latitude}, ${msg.location?.longitude}]`;
    } else {
      body = '[رسالة غير مدعومة]';
    }

    return {
      isMessage: true,
      phone,
      name,
      body: body.trim(),
      messageId,
      type,
      timestamp,
      phoneNumberId,
    };
  }
}

