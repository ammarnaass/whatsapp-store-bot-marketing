import crypto from 'crypto';

const VAULT_SECRET = `wasell_vault_${process.env.USER || 'app'}_${process.platform}_secret`;
const VAULT_KEY = crypto.createHash('sha256').update(VAULT_SECRET).digest();

function getSafeStorage() {
  try {
    const electron = require('electron');
    if (typeof electron === 'object' && electron !== null && electron.safeStorage) {
      return electron.safeStorage;
    }
  } catch {}
  return null;
}

export function encryptSecret(plaintext: string): string {
  if (!plaintext || typeof plaintext !== 'string') return '';
  const trimmed = plaintext.trim();
  if (!trimmed) return '';

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', VAULT_KEY, iv);
  const enc = Buffer.concat([cipher.update(trimmed, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `enc:aes:${iv.toString('hex')}:${tag.toString('hex')}:${enc.toString('hex')}`;
}

export function decryptSecret(ciphertext: string): string {
  if (!ciphertext || typeof ciphertext !== 'string') return '';
  if (!ciphertext.startsWith('enc:')) return ciphertext;

  // 1. AES-256-GCM format
  if (ciphertext.startsWith('enc:aes:')) {
    try {
      const parts = ciphertext.split(':');
      if (parts.length === 5) {
        const iv = Buffer.from(parts[2], 'hex');
        const tag = Buffer.from(parts[3], 'hex');
        const data = Buffer.from(parts[4], 'hex');
        const decipher = crypto.createDecipheriv('aes-256-gcm', VAULT_KEY, iv);
        decipher.setAuthTag(tag);
        return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
      }
    } catch (err) {
      console.warn('[SecureVault] Failed to decrypt AES-GCM secret:', err);
    }
    return '';
  }

  // 2. safeStorage format fallback
  const storage = getSafeStorage();
  if (ciphertext.startsWith('enc:safe:')) {
    try {
      if (storage && storage.isEncryptionAvailable()) {
        const buf = Buffer.from(ciphertext.slice(9), 'base64');
        return storage.decryptString(buf);
      }
    } catch {}
    return '';
  }

  // 3. Legacy enc:base64 format fallback
  try {
    if (storage && storage.isEncryptionAvailable()) {
      const buf = Buffer.from(ciphertext.slice(4), 'base64');
      return storage.decryptString(buf);
    }
  } catch {}

  return '';
}
