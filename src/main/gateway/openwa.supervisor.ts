import { EventEmitter } from 'events';
import http from 'http';
import { ChildProcess, spawn } from 'child_process';

export interface SupervisorConfig {
  host: string;
  port: number;
  apiKey: string;
  healthIntervalMs?: number;
  maxConsecutiveFailures?: number;
  childProcessCommand?: string;
  childProcessArgs?: string[];
}

export type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export class OpenWASupervisor extends EventEmitter {
  private config: SupervisorConfig;
  private childProcess: ChildProcess | null = null;
  private isRunning = false;
  private consecutiveFailures = 0;
  private circuitState: CircuitBreakerState = 'CLOSED';
  private healthTimer: NodeJS.Timeout | null = null;

  constructor(config: SupervisorConfig) {
    super();
    this.config = {
      healthIntervalMs: 10000,
      maxConsecutiveFailures: 5,
      ...config,
    };
  }

  public async start(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;

    // 1. إطلاق العملية الفرعية إن تم تحديد أمر تشغيل
    if (this.config.childProcessCommand) {
      this.spawnChildProcess();
    }

    // 2. بدء مؤشر الفحص الدوري لصحة البوابة
    this.startHealthChecks();
  }

  public stop(): void {
    this.isRunning = false;
    if (this.healthTimer) {
      clearInterval(this.healthTimer);
      this.healthTimer = null;
    }
    if (this.childProcess) {
      try {
        this.childProcess.kill('SIGTERM');
      } catch (err) {
        console.error('[OpenWASupervisor] Error terminating child process:', err);
      }
      this.childProcess = null;
    }
  }

  private spawnChildProcess(): void {
    const cmd = this.config.childProcessCommand!;
    const args = this.config.childProcessArgs || [];

    console.log(`[OpenWASupervisor] Spawning OpenWA child process: ${cmd} ${args.join(' ')}`);

    this.childProcess = spawn(cmd, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: {
        ...process.env,
        PORT: String(this.config.port),
        API_KEY: this.config.apiKey,
        ENGINE_TYPE: 'whatsapp-web.js',
        SEND_PACING_ENABLED: 'true',
      },
    });

    this.childProcess.stdout?.on('data', (data) => {
      console.log(`[OpenWA-Process] ${data.toString().trim()}`);
    });

    this.childProcess.stderr?.on('data', (data) => {
      console.error(`[OpenWA-Process-Err] ${data.toString().trim()}`);
    });

    this.childProcess.on('exit', (code, signal) => {
      console.warn(`[OpenWASupervisor] OpenWA process exited with code ${code}, signal: ${signal}`);
      this.childProcess = null;
      if (this.isRunning) {
        console.log('[OpenWASupervisor] Auto-restarting OpenWA in 3 seconds...');
        setTimeout(() => {
          if (this.isRunning) this.spawnChildProcess();
        }, 3000);
      }
    });
  }

  private startHealthChecks(): void {
    this.checkHealth();
    this.healthTimer = setInterval(() => {
      this.checkHealth();
    }, this.config.healthIntervalMs);
  }

  public async checkHealth(): Promise<boolean> {
    const isHealthy = await this.pingGateway();

    if (isHealthy) {
      if (this.circuitState !== 'CLOSED') {
        console.log('[OpenWASupervisor] Gateway recovered. Closing circuit breaker.');
        this.circuitState = 'CLOSED';
        this.emit('circuit-recovered');
      }
      this.consecutiveFailures = 0;
      this.emit('health', { healthy: true });
      return true;
    } else {
      this.consecutiveFailures++;
      console.warn(`[OpenWASupervisor] Gateway ping failed (${this.consecutiveFailures}/${this.config.maxConsecutiveFailures})`);

      if (this.consecutiveFailures >= (this.config.maxConsecutiveFailures || 5)) {
        if (this.circuitState !== 'OPEN') {
          this.circuitState = 'OPEN';
          console.error('[OpenWASupervisor] CIRCUIT BREAKER TRIPPED: Consecutive OpenWA failures reached cap.');
          this.emit('circuit-tripped', {
            consecutiveFailures: this.consecutiveFailures,
            message: 'بوابة OpenWA لا تستجيب. تم تفعيل قاطع الدائرة لحماية الطابور الصادر.',
          });
        }
      }

      this.emit('health', { healthy: false, consecutiveFailures: this.consecutiveFailures });
      return false;
    }
  }

  private pingGateway(): Promise<boolean> {
    return new Promise((resolve) => {
      const req = http.request(
        {
          hostname: this.config.host,
          port: this.config.port,
          path: '/api/sessions',
          method: 'GET',
          headers: {
            'X-API-Key': this.config.apiKey,
          },
          timeout: 3000,
        },
        (res) => {
          resolve(res.statusCode !== undefined && res.statusCode < 500);
        }
      );

      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });

      req.on('error', () => {
        resolve(false);
      });

      req.end();
    });
  }

  public getCircuitState(): CircuitBreakerState {
    return this.circuitState;
  }
}

