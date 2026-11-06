import { createServer } from 'vite';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function startDev() {
  console.log('[Dev] 1. Compiling Tailwind CSS & Electron Main...');
  const { execSync } = await import('child_process');
  execSync('node scripts/build-css.mjs', { stdio: 'inherit', cwd: rootDir });
  execSync('node scripts/build-electron.mjs', { stdio: 'inherit', cwd: rootDir });

  console.log('[Dev] 2. Starting Vite Dev Server...');
  const viteServer = await createServer({
    configFile: path.join(rootDir, 'vite.config.ts'),
    server: { port: 5173, host: '127.0.0.1' },
  });
  await viteServer.listen();
  const address = viteServer.httpServer?.address();
  const port = typeof address === 'object' && address ? address.port : 5173;
  const devUrl = `http://127.0.0.1:${port}`;
  console.log(`[Dev] Vite Dev Server listening at ${devUrl}`);

  console.log('[Dev] 3. Launching Electron App...');
  const binCandidates = [
    path.join(rootDir, 'node_modules', '.bin', process.platform === 'win32' ? 'electron.cmd' : 'electron'),
    path.join(rootDir, 'node_modules', 'electron', 'dist', process.platform === 'win32' ? 'electron.exe' : 'electron'),
  ];
  const electronBin = binCandidates.find((p) => fs.existsSync(p)) || binCandidates[0];

  const electronEnv = {
    ...process.env,
    VITE_DEV_SERVER_URL: devUrl,
    NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --no-network-family-autoselection`.trim(),
  };
  delete electronEnv.ELECTRON_RUN_AS_NODE;

  const electronProcess = spawn(electronBin, ['.'], {
    cwd: rootDir,
    stdio: 'inherit',
    env: electronEnv,
  });

  electronProcess.on('close', async (code) => {
    console.log(`[Dev] Electron closed with exit code ${code}. Terminating Vite server...`);
    await viteServer.close();
    process.exit(code || 0);
  });
}

startDev().catch((err) => {
  console.error('[Dev] Error starting dev environment:', err);
  process.exit(1);
});
