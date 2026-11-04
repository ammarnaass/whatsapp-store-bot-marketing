import { ipcMain, safeStorage } from 'electron';
import Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';
import { AIAgentEngine } from '../../agent/agent-engine';
import { AIProviderFactory } from '../../agent/providers/provider-factory';

export function registerAgentHandlers(db: Database.Database, agent: AIAgentEngine): void {
  // جلب إعدادات الوكيل الذكي وفك تشفير مفتاح API
  ipcMain.handle(IPC_CHANNELS.AGENT_GET_CONFIG, async () => {
    const row = db.prepare('SELECT * FROM agent_config WHERE id = ?').get('default') as any;
    if (row && row.api_key && row.api_key.startsWith('enc:')) {
      try {
        if (safeStorage.isEncryptionAvailable()) {
          const encBuf = Buffer.from(row.api_key.slice(4), 'base64');
          row.api_key = safeStorage.decryptString(encBuf);
        }
      } catch (err) {
        console.warn('[IPC] Failed to decrypt API key via safeStorage:', err);
      }
    }
    return row;
  });

  // تحديث إعدادات الوكيل الذكي وتشفير مفتاح API بشكل آمن
  ipcMain.handle(IPC_CHANNELS.AGENT_UPDATE_CONFIG, async (_event, config) => {
    let storedApiKey = config.api_key || '';
    if (storedApiKey && !storedApiKey.startsWith('enc:')) {
      try {
        if (safeStorage.isEncryptionAvailable()) {
          const enc = safeStorage.encryptString(storedApiKey);
          storedApiKey = `enc:${enc.toString('base64')}`;
        }
      } catch (err) {
        console.warn('[IPC] safeStorage encryption unavailable, storing plaintext fallback:', err);
      }
    }

    db.prepare(`
      UPDATE agent_config SET
        persona_name = ?,
        tone = ?,
        system_instructions = ?,
        max_discount_percent = ?,
        max_order_amount_auto = ?,
        daily_cost_limit = ?,
        provider = ?,
        model_name = ?,
        api_key = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 'default'
    `).run(
      config.persona_name,
      config.tone,
      config.system_instructions,
      config.max_discount_percent,
      config.max_order_amount_auto,
      config.daily_cost_limit,
      config.provider || 'gemini',
      config.model_name,
      storedApiKey
    );
    return { success: true };
  });

  // اختبار الاتصال الفعلي بمزود الذكاء الاصطناعي المحدد (Gemini / DeepSeek / Claude / OpenAI)
  ipcMain.handle(IPC_CHANNELS.AGENT_TEST_API_CONNECTION, async (_event, payload: { provider?: string; apiKey?: string; modelName?: string }) => {
    const providerId = payload?.provider || 'gemini';
    const provider = AIProviderFactory.getProvider(providerId);

    let keyToTest = payload?.apiKey?.trim() || '';

    // إذا لم يُمرر مفتاح صريح، جلب المفتاح المخزن في قاعدة البيانات مع فك تشفيره
    if (!keyToTest) {
      const row = db.prepare('SELECT api_key FROM agent_config WHERE id = ?').get('default') as any;
      if (row?.api_key) {
        if (row.api_key.startsWith('enc:')) {
          try {
            if (safeStorage.isEncryptionAvailable()) {
              const encBuf = Buffer.from(row.api_key.slice(4), 'base64');
              keyToTest = safeStorage.decryptString(encBuf);
            }
          } catch {
            keyToTest = '';
          }
        } else {
          keyToTest = row.api_key;
        }
      }
    }

    if (!keyToTest) {
      if (providerId === 'gemini') keyToTest = process.env.GEMINI_API_KEY || '';
      else if (providerId === 'deepseek') keyToTest = process.env.DEEPSEEK_API_KEY || '';
      else if (providerId === 'claude') keyToTest = process.env.ANTHROPIC_API_KEY || '';
      else if (providerId === 'openai') keyToTest = process.env.OPENAI_API_KEY || '';
    }

    if (!keyToTest) {
      return {
        success: false,
        error: `لم يتم إدخال مفتاح API لمزود ${provider.name}. يرجى إدخال المفتاح أولاً.`,
      };
    }

    const testRes = await provider.testConnection(keyToTest, payload?.modelName);
    return {
      ...testRes,
      modelName: payload?.modelName || provider.defaultModel,
      provider: providerId,
    };
  });

  // الإيقاف الطارئ الفوري للوكيل وتحويل كافة المحادثات إلى بشري
  ipcMain.handle(IPC_CHANNELS.AGENT_EMERGENCY_STOP, async () => {
    db.prepare(`UPDATE sessions SET agent_mode = 'DISABLED'`).run();
    db.prepare(`UPDATE conversations SET handler = 'human', state = 'waiting_human' WHERE handler = 'agent'`).run();
    console.warn('[IPC] EMERGENCY STOP TRIGGERED: Agent disabled across all sessions.');
    return { stopped: true };
  });

  // اختبار الوكيل في صندوق الرمل التجريبي
  ipcMain.handle(IPC_CHANNELS.AGENT_SANDBOX_TEST, async (_event, { prompt }) => {
    return await agent.processMessage({
      conversationId: 'sandbox_test_conv',
      contactPhone: '+966500000000',
      messageText: prompt,
    });
  });

  // سجل تشغيلات الوكيل
  ipcMain.handle(IPC_CHANNELS.AGENT_LIST_RUNS, async () => {
    return db.prepare(`
      SELECT * FROM agent_runs ORDER BY ts DESC LIMIT 50
    `).all();
  });
}
