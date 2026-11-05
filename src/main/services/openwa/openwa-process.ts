import fs from 'fs';
import path from 'path';
import { spawn, ChildProcess } from 'child_process';
import { OpenWAHttpClient } from './openwa-client';

export class OpenWAProcessManager {
  private childProcess: ChildProcess | null = null;
  public isShuttingDown = false;

  constructor(private client: OpenWAHttpClient, private openwaPort: number = 2785) {}

  public getOpenWaDir(): string {
    const candidates = [
      process.env.OPENWA_DIR,
      (process as any).resourcesPath ? path.join((process as any).resourcesPath, 'OpenWA') : null,
      path.resolve(process.cwd(), 'OpenWA'),
      path.resolve(__dirname, '../../OpenWA'),
      path.resolve(__dirname, '../../../OpenWA'),
    ];
    for (const c of candidates) {
      if (c && fs.existsSync(c)) return c;
    }
    return path.resolve(process.cwd(), 'OpenWA');
  }

  public refreshApiKey(): string {
    try {
      const keyPath = path.join(this.getOpenWaDir(), 'data/.api-key');
      if (fs.existsSync(keyPath)) {
        const key = fs.readFileSync(keyPath, 'utf-8').trim();
        if (key) {
          this.client.apiKey = key;
          return key;
        }
      }
    } catch {}
    return this.client.apiKey;
  }

  public async ensureGatewayRunning(): Promise<boolean> {
    this.refreshApiKey();
    try {
      await this.client.request('/api/health', 'GET', undefined, 1000);
      return true;
    } catch {}

    const openwaDir = this.getOpenWaDir();
    const mainJs = path.join(openwaDir, 'dist/main.js');
    if (!fs.existsSync(mainJs)) {
      console.warn(`[OpenWA] main.js not found at ${mainJs}`);
      return false;
    }

    console.log(`[OpenWA] Launching integrated OpenWA daemon on Port ${this.openwaPort}...`);
    this.isShuttingDown = false;
    this.childProcess = spawn('node', ['dist/main.js'], {
      cwd: openwaDir,
      env: {
        ...process.env,
        PORT: String(this.openwaPort),
        DATABASE_TYPE: 'sqlite',
        DATABASE_NAME: './data/openwa.sqlite',
        DATABASE_SYNCHRONIZE: 'true',
        ENGINE_TYPE: 'baileys',
        SESSION_DATA_PATH: './data/sessions',
        STORAGE_TYPE: 'local',
        STORAGE_LOCAL_PATH: './data/media',
        REDIS_ENABLED: 'false',
        QUEUE_ENABLED: 'false',
        CACHE_ENABLED: 'false',
        SEND_PACING_ENABLED: 'true',
        AUTO_START_SESSIONS: 'true',
        WEBHOOK_SSRF_PROTECT: 'false',
        SSRF_ALLOWED_HOSTS: '127.0.0.1,localhost',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    this.childProcess.on('exit', (code, signal) => {
      console.warn(`[OpenWA] Gateway exited code: ${code}, signal: ${signal}`);
      this.childProcess = null;
      if (!this.isShuttingDown && code !== 0 && code !== null) {
        setTimeout(() => {
          if (!this.isShuttingDown) this.ensureGatewayRunning().catch(console.error);
        }, 3000);
      }
    });

    for (let i = 0; i < 25; i++) {
      await new Promise((r) => setTimeout(r, 600));
      try {
        await this.client.request('/api/health', 'GET', undefined, 800);
        this.refreshApiKey();
        console.log('[OpenWA] Integrated Gateway is UP and responding!');
        return true;
      } catch {}
    }

    return false;
  }

  public stopGateway(): void {
    this.isShuttingDown = true;
    if (this.childProcess) {
      console.log('[OpenWA] Gracefully shutting down OpenWA process...');
      const proc = this.childProcess;
      this.childProcess = null;
      try {
        proc.kill('SIGTERM');
        setTimeout(() => { try { if (!proc.killed) proc.kill('SIGKILL'); } catch {} }, 3000);
      } catch {}
    }
  }
}
