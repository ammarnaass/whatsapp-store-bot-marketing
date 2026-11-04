import fs from 'fs';
import path from 'path';
import { spawn, ChildProcess } from 'child_process';
import { OpenWAHttpClient } from './openwa-client';

export class OpenWAProcessManager {
  private childProcess: ChildProcess | null = null;
  public isShuttingDown = false;
  private client: OpenWAHttpClient;
  private openwaPort: number;

  constructor(client: OpenWAHttpClient, port: number = 2785) {
    this.client = client;
    this.openwaPort = port;
  }

  public getOpenWaDir(): string {
    const candidates = [
      process.env.OPENWA_DIR,
      path.resolve(__dirname, '../../OpenWA'),
      path.resolve(__dirname, '../../../OpenWA'),
      path.resolve(__dirname, '../../../../OpenWA'),
      path.resolve(process.cwd(), 'OpenWA'),
      '/home/ammar/whatsapp-store-bot-marketing/OpenWA',
    ];
    for (const c of candidates) {
      if (c && fs.existsSync(c)) {
        return c;
      }
    }
    return '/home/ammar/whatsapp-store-bot-marketing/OpenWA';
  }

  public refreshApiKey(): string {
    try {
      const openwaDir = this.getOpenWaDir();
      const keyPath = path.join(openwaDir, 'data/.api-key');
      if (fs.existsSync(keyPath)) {
        const key = fs.readFileSync(keyPath, 'utf-8').trim();
        if (key) {
          this.client.apiKey = key;
          return key;
        }
      }
    } catch {
      // صامت
    }
    return this.client.apiKey;
  }

  public async ensureGatewayRunning(): Promise<boolean> {
    this.refreshApiKey();
    try {
      await this.client.request('/api/health', 'GET', undefined, 1000);
      return true;
    } catch {
      // البوابة غير متصلة، نحاول تشغيلها
    }

    const openwaDir = this.getOpenWaDir();
    const mainJs = path.join(openwaDir, 'dist/main.js');
    if (!fs.existsSync(mainJs)) {
      console.warn(`[OpenWA] main.js not found at ${mainJs}`);
      return false;
    }

    console.log(`[OpenWA] Launching integrated OpenWA daemon from "${openwaDir}" on Port ${this.openwaPort}...`);
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

    this.childProcess.stdout?.on('data', (chunk) => {
      const line = chunk.toString();
      if (line.includes('OpenWA is running on') || line.includes('Nest application successfully started')) {
        console.log(`[OpenWA-Stdout] ${line.trim()}`);
      }
    });

    this.childProcess.stderr?.on('data', (chunk) => {
      const line = chunk.toString();
      if (line.includes('error') || line.includes('Error')) {
        console.error(`[OpenWA-Stderr] ${line.trim()}`);
      }
    });

    this.childProcess.on('exit', (code, signal) => {
      console.warn(`[OpenWA] Gateway child process exited with code ${code}, signal: ${signal}`);
      this.childProcess = null;
      if (!this.isShuttingDown && code !== 0 && code !== null) {
        console.log('[OpenWA] Gateway crashed unexpectedly. Attempting auto-recovery in 3s...');
        setTimeout(() => {
          if (!this.isShuttingDown) {
            this.ensureGatewayRunning().catch((err) => console.error('[OpenWA] Recovery error:', err));
          }
        }, 3000);
      }
    });

    for (let i = 0; i < 25; i++) {
      await new Promise((r) => setTimeout(r, 600));
      try {
        await this.client.request('/api/health', 'GET', undefined, 800);
        this.refreshApiKey();
        console.log('[OpenWA] Integrated Gateway is now UP and responding in full harmony!');
        return true;
      } catch {
        // مواصلة الانتظار
      }
    }

    return false;
  }

  public stopGateway(): void {
    this.isShuttingDown = true;
    if (this.childProcess) {
      console.log('[OpenWA] Gracefully shutting down OpenWA background process...');
      const proc = this.childProcess;
      this.childProcess = null;
      try {
        proc.kill('SIGTERM');
        setTimeout(() => {
          try {
            if (!proc.killed) proc.kill('SIGKILL');
          } catch {
            // صامت
          }
        }, 3000);
      } catch {
        // صامت
      }
    }
  }
}

