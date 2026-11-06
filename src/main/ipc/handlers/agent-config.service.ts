import Database from 'better-sqlite3';
import { encryptSecret, decryptSecret } from '../../utils/secure-vault';

export function getAgentConfigRecord(db: Database.Database) {
  const row = db.prepare('SELECT * FROM agent_config WHERE id = ?').get('default') as any;
  if (!row) return null;

  const decryptedKey = row.api_key ? decryptSecret(row.api_key) : '';
  const apiKeysMap: Record<string, string> = {};

  if (row.api_keys_json) {
    try {
      const parsed = JSON.parse(row.api_keys_json);
      for (const [prov, encVal] of Object.entries(parsed)) {
        if (typeof encVal === 'string' && encVal) {
          apiKeysMap[prov] = decryptSecret(encVal);
        }
      }
    } catch {}
  }
  if (row.provider && decryptedKey) {
    apiKeysMap[row.provider] = decryptedKey;
  }

  const modelName = row.model_name === 'gemini-3.8-flash' ? 'gemini-2.5-flash' : row.model_name;

  return {
    ...row,
    model_name: modelName,
    api_key: decryptedKey,
    api_keys: apiKeysMap,
  };
}

export function updateAgentConfigRecord(db: Database.Database, config: any) {
  const current = db.prepare('SELECT * FROM agent_config WHERE id = ?').get('default') as any || {};

  // 1. Resolve API key
  let storedApiKey: string | null = current.api_key || null;
  if (config.api_key !== undefined) {
    const trimmed = typeof config.api_key === 'string' ? config.api_key.trim() : '';
    storedApiKey = trimmed ? encryptSecret(trimmed) : null;
  }

  // 2. Resolve Multi-Provider keys map
  let providerKeysMap: Record<string, string> = {};
  if (current.api_keys_json) {
    try {
      providerKeysMap = JSON.parse(current.api_keys_json);
    } catch {}
  }

  const activeProvider = config.provider || current.provider || 'gemini';
  if (storedApiKey) {
    providerKeysMap[activeProvider] = storedApiKey;
  } else if (config.api_key === '' || config.api_key === null) {
    delete providerKeysMap[activeProvider];
  }

  if (config.api_keys && typeof config.api_keys === 'object') {
    for (const [prov, plain] of Object.entries(config.api_keys)) {
      if (typeof plain === 'string' && plain.trim()) {
        providerKeysMap[prov] = encryptSecret(plain.trim());
      }
    }
  }

  let modelName = config.model_name ?? current.model_name ?? 'gemini-2.5-flash';
  if (modelName === 'gemini-3.8-flash') modelName = 'gemini-2.5-flash';

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
      api_keys_json = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = 'default'
  `).run(
    config.persona_name ?? current.persona_name ?? 'مساعد المتجر الذكي',
    config.tone ?? current.tone ?? 'friendly',
    config.system_instructions ?? current.system_instructions ?? '',
    config.max_discount_percent ?? current.max_discount_percent ?? 0.0,
    config.max_order_amount_auto ?? current.max_order_amount_auto ?? 200.0,
    config.daily_cost_limit ?? current.daily_cost_limit ?? 10.0,
    activeProvider,
    modelName,
    storedApiKey,
    JSON.stringify(providerKeysMap)
  );

  return { success: true };
}

