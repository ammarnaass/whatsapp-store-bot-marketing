import { build } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function buildElectron() {
  console.log('[Build] 1/3 Building Main Process (src/main/index.ts)...');
  await build({
    configFile: false,
    build: {
      ssr: path.join(rootDir, 'src/main/index.ts'),
      outDir: path.join(rootDir, 'dist/main'),
      emptyOutDir: true,
      rollupOptions: {
        external: ['electron', 'better-sqlite3'],
        output: {
          entryFileNames: 'index.js',
          format: 'cjs',
        },
      },
    },
  });

  // نسخ مخطط قاعدة البيانات إلى dist/main/schema.sql لضمان توفره للتشغيل المكتبي
  console.log('[Build] 2/3 Copying schema.sql to dist/main/schema.sql...');
  const schemaSrc = path.join(rootDir, 'src/main/database/schema.sql');
  const schemaDest = path.join(rootDir, 'dist/main/schema.sql');
  fs.copyFileSync(schemaSrc, schemaDest);

  console.log('[Build] 3/3 Building Preload Script (src/preload/index.ts)...');
  await build({
    configFile: false,
    build: {
      ssr: path.join(rootDir, 'src/preload/index.ts'),
      outDir: path.join(rootDir, 'dist/preload'),
      emptyOutDir: true,
      rollupOptions: {
        external: ['electron'],
        output: {
          entryFileNames: 'index.js',
          format: 'cjs',
        },
      },
    },
  });

  console.log('✓ Electron Main & Preload built successfully!');
}

buildElectron().catch((err) => {
  console.error('✗ Build failed:', err);
  process.exit(1);
});
