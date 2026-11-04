import http from 'http';

export class OpenWAHttpClient {
  public host: string;
  public port: number;
  public apiKey: string;

  constructor(host: string = '127.0.0.1', port: number = 2785, apiKey: string = '') {
    this.host = host;
    this.port = port;
    this.apiKey = apiKey;
  }

  public request(path: string, method: string = 'GET', bodyData?: any, timeoutMs: number = 8000): Promise<any> {
    return new Promise((resolve, reject) => {
      const payload = bodyData ? JSON.stringify(bodyData) : null;
      const headers: Record<string, string | number> = {
        'Accept': 'application/json',
        'X-API-Key': this.apiKey,
      };

      if (payload) {
        headers['Content-Type'] = 'application/json';
        headers['Content-Length'] = Buffer.byteLength(payload);
      }

      const req = http.request(
        {
          hostname: this.host,
          port: this.port,
          path,
          method,
          headers,
          timeout: timeoutMs,
        },
        (res) => {
          let rawData = '';
          res.on('data', (chunk) => {
            rawData += chunk;
          });
          res.on('end', () => {
            try {
              const parsed = rawData ? JSON.parse(rawData) : {};
              if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                resolve(parsed);
              } else {
                reject(new Error(parsed.message || `HTTP ${res.statusCode}`));
              }
            } catch {
              resolve(rawData);
            }
          });
        }
      );

      req.on('timeout', () => {
        req.destroy();
        reject(new Error(`OpenWA Gateway connection timeout (${path})`));
      });

      req.on('error', (err) => {
        reject(err);
      });

      if (payload) {
        req.write(payload);
      }
      req.end();
    });
  }
}

