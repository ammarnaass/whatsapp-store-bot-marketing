export class WhatsAppCloudClient {
  private static instance: WhatsAppCloudClient;

  public static getInstance(): WhatsAppCloudClient {
    if (!WhatsAppCloudClient.instance) {
      WhatsAppCloudClient.instance = new WhatsAppCloudClient();
    }
    return WhatsAppCloudClient.instance;
  }

  public async testConnection(
    phoneNumberId: string,
    accessToken: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!phoneNumberId || !accessToken) {
      return { success: false, error: 'معرف رقم الهاتف ومفتاح الوصول مطلوبان' };
    }
    try {
      const url = `https://graph.facebook.com/v19.0/${encodeURIComponent(phoneNumberId)}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        return { success: false, error: data.error?.message || `فشل الاتصال: رمز الخطأ ${res.status}` };
      }
      return {
        success: true,
        data: {
          displayPhoneNumber: data.display_phone_number || phoneNumberId,
          verifiedName: data.verified_name || 'حساب واتساب معتمد',
          qualityRating: data.quality_rating || 'GREEN',
        },
      };
    } catch (err: any) {
      return { success: false, error: `تعذر الوصول إلى خوادم Meta Graph API: ${err.message}` };
    }
  }

  public async sendTextMessage(
    phoneNumberId: string,
    accessToken: string,
    to: string,
    text: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!phoneNumberId || !accessToken || !to || !text) {
      return { success: false, error: 'بيانات الإرسال غير مكتملة' };
    }
    const cleanTo = to.replace(/\D/g, '');
    try {
      const url = `https://graph.facebook.com/v19.0/${encodeURIComponent(phoneNumberId)}/messages`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: cleanTo,
          type: 'text',
          text: { preview_url: false, body: text },
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        return { success: false, error: data.error?.message || `فشل الإرسال: ${res.status}` };
      }
      const messageId = data.messages?.[0]?.id || `meta_${Date.now()}`;
      return { success: true, messageId };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  public async sendTemplateMessage(
    phoneNumberId: string,
    accessToken: string,
    to: string,
    templateName: string,
    languageCode = 'ar'
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const cleanTo = to.replace(/\D/g, '');
    try {
      const url = `https://graph.facebook.com/v19.0/${encodeURIComponent(phoneNumberId)}/messages`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: cleanTo,
          type: 'template',
          template: { name: templateName, language: { code: languageCode } },
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        return { success: false, error: data.error?.message || `فشل إرسال القالب: ${res.status}` };
      }
      return { success: true, messageId: data.messages?.[0]?.id };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}

