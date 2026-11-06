import { ipcMain } from 'electron';
import Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';
import { AIAgentEngine } from '../../agent/agent-engine';
import { AIProviderFactory } from '../../agent/providers/provider-factory';
import { decryptSecret } from '../../utils/secure-vault';
import { getAgentConfigRecord, updateAgentConfigRecord } from './agent-config.service';

export function registerAgentHandlers(db: Database.Database, agent: AIAgentEngine): void {
  // جلب إعدادات الوكيل الذكي وفك تشفير المفاتيح
  ipcMain.handle(IPC_CHANNELS.AGENT_GET_CONFIG, async () => {
    return getAgentConfigRecord(db);
  });

  // تحديث إعدادات الوكيل الذكي مع دمج البيانات وحماية المفاتيح
  ipcMain.handle(IPC_CHANNELS.AGENT_UPDATE_CONFIG, async (_event, config) => {
    return updateAgentConfigRecord(db, config);
  });

  // اختبار الاتصال الفعلي بمزود الذكاء الاصطناعي المحدد
  ipcMain.handle(IPC_CHANNELS.AGENT_TEST_API_CONNECTION, async (_event, payload: { provider?: string; apiKey?: string; modelName?: string }) => {
    const providerId = payload?.provider || 'gemini';
    const provider = AIProviderFactory.getProvider(providerId);

    let keyToTest = payload?.apiKey?.trim() || '';
    if (keyToTest.startsWith('enc:')) {
      keyToTest = decryptSecret(keyToTest);
    }

    if (!keyToTest) {
      const cfg = getAgentConfigRecord(db);
      keyToTest = cfg?.api_keys?.[providerId] || cfg?.api_key || '';
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

    let modelName = payload?.modelName || provider.defaultModel;
    if (modelName === 'gemini-3.8-flash') modelName = 'gemini-2.5-flash';

    const testRes = await provider.testConnection(keyToTest, modelName);
    return {
      ...testRes,
      modelName,
      provider: providerId,
    };
  });

  // جلب وضع تشغيل الوكيل الحالي
  ipcMain.handle(IPC_CHANNELS.AGENT_GET_MODE, async () => {
    const row = db.prepare(`SELECT agent_mode FROM sessions WHERE id = 'wasell-main-store' LIMIT 1`).get() as any;
    return { mode: row?.agent_mode || 'AUTONOMOUS' };
  });

  // تغيير وضع الوكيل (AUTONOMOUS / DISABLED) وإعادة توجيه المحادثات
  ipcMain.handle(IPC_CHANNELS.AGENT_SET_MODE, async (_event, { mode, resetConversations }: { mode: 'AUTONOMOUS' | 'DISABLED' | 'COPILOT'; resetConversations?: boolean }) => {
    const validMode = mode === 'AUTONOMOUS' || mode === 'COPILOT' ? mode : 'DISABLED';
    db.prepare(`UPDATE sessions SET agent_mode = ?`).run(validMode);
    if (validMode === 'AUTONOMOUS') {
      if (resetConversations !== false) {
        db.prepare(`UPDATE conversations SET handler = 'agent', state = 'open' WHERE handler = 'human'`).run();
      }
      console.log(`[IPC] Agent mode set to ${validMode}. Conversations restored to agent.`);
    } else {
      db.prepare(`UPDATE conversations SET handler = 'human', state = 'waiting_human' WHERE handler = 'agent'`).run();
      console.log(`[IPC] Agent mode set to ${validMode}. Conversations switched to human.`);
    }
    return { success: true, mode: validMode };
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
    return db.prepare(`SELECT * FROM agent_runs ORDER BY ts DESC LIMIT 50`).all();
  });
}
