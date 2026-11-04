import { app, BrowserWindow } from 'electron';
import path from 'path';
import { AppDatabase } from './database/db';
import { registerIpcHandlers } from './ipc/registry';
import { WebhookServerService } from './services/webhook-server.service';
import { OpenWAManager } from './services/openwa-manager.service';

// تعطيل تسريع العتاد GPU على لينكس لحل مشكلة تشوه البكسلات (Pixelation/Garbage Buffer) والتجميد في بيئات Wayland و XWayland
if (process.platform === 'linux') {
  app.disableHardwareAcceleration();
  app.commandLine.appendSwitch('disable-gpu');
}

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 1024,
    minHeight: 700,
    title: 'منصة المتجر والرد على العملاء والتسويق عبر واتساب',
    backgroundColor: '#0B0F19',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // تسجيل معالجات الـ IPC
  registerIpcHandlers(mainWindow);

  // تحميل الواجهة (في وضع التطوير من خادم Vite، أو من حزمة الإنتاج)
  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  console.log('[Main] App ready. Initializing core services...');

  // 1. تشغيل قاعدة البيانات SQLite والتأكد من الجداول
  AppDatabase.getInstance();

  // 2. تشغيل خادم استقبال Webhooks الداخلي على 127.0.0.1
  try {
    await WebhookServerService.getInstance().start();
  } catch (err) {
    console.error('[Main] Webhook server startup error:', err);
  }

  // 3. التحقق من حالة OpenWA
  await OpenWAManager.getInstance().getStatus();

  // 4. إنشاء النافذة الرئيسية
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  WebhookServerService.getInstance().stop();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
