import { app, BrowserWindow, shell } from 'electron';
import path from 'path';
import { AppDatabase } from './database/db';
import { registerIpcHandlers } from './ipc/registry';
import { WebhookServerService } from './services/webhook-server.service';
import { OpenWAManager } from './services/openwa-manager.service';
import { IPC_CHANNELS } from '../shared/ipc-channels';

// تعطيل تسريع العتاد GPU على لينكس لحل مشكلة تشوه البكسلات (Pixelation/Garbage Buffer) والتجميد في بيئات Wayland و XWayland
if (process.platform === 'linux' && app && !app.isReady()) {
  app.disableHardwareAcceleration();
  app.commandLine.appendSwitch('disable-gpu');
}

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    minWidth: 700,
    minHeight: 450,
    title: 'منصة المتجر والرد على العملاء والتسويق عبر واتساب',
    backgroundColor: '#0B0F19',
    icon: path.resolve(__dirname, process.platform === 'win32' ? '../../build/icon.ico' : '../../build/icon.png'),
    show: false,
    frame: false,
    autoHideMenuBar: true,
    resizable: true,
    maximizable: true,
    minimizable: true,
    fullscreenable: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // إخفاء شريط القوائم الافتراضي على لينكس وويندوز لتوفير مساحة الشاشة بالكامل
  mainWindow.setMenuBarVisibility(false);

  // تسجيل معالجات الـ IPC
  registerIpcHandlers(mainWindow);

  // توجيه أخطاء واجهة Renderer إلى الطرفية لسهولة التشخيص الفوري
  mainWindow.webContents.on('console-message', (_event, level, message, line, sourceId) => {
    if (level >= 2) {
      console.error(`[Renderer-Error] ${message} (${sourceId}:${line})`);
    }
  });

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
    console.error(`[MainWindow] Failed to load: ${errorCode} - ${errorDescription}`);
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    mainWindow?.maximize();
  });

  // صمام أمان لإظهار النافذة دون تأخير
  setTimeout(() => {
    if (mainWindow && !mainWindow.isVisible()) {
      mainWindow.show();
      mainWindow.maximize();
    }
  }, 1000);

  // فتح الروابط الخارجية في المتصفح الافتراضي للنظام (مثل توثيق Swagger على المنفذ 2785)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

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

  // 3. إنشاء النافذة الرئيسية فوراً لتجربة مستخدم سريعة
  createWindow();

  // 4. تشغيل وضمان إقلاع بوابة OpenWA المدمجة في الخلفية تلقائياً
  OpenWAManager.getInstance()
    .ensureGatewayRunning()
    .then(async (running) => {
      if (running) {
        console.log('[Main] OpenWA is up and running automatically on Port 2785.');
        await OpenWAManager.getInstance().ensureSessionUuid();
        const status = await OpenWAManager.getInstance().getStatus();
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send(IPC_CHANNELS.SESSION_STATUS_CHANGED, {
            status: status.isConnected ? 'CONNECTED' : status.statusText?.includes('QR') ? 'QR_READY' : 'DISCONNECTED',
            phone: status.phone,
          });
        }
      } else {
        console.warn('[Main] OpenWA auto-launch returned false. Will retry on demand.');
      }
    })
    .catch((err) => {
      console.warn('[Main] OpenWA auto-launch error:', err);
    });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  WebhookServerService.getInstance().stop();
  OpenWAManager.getInstance().stopGateway();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  WebhookServerService.getInstance().stop();
  OpenWAManager.getInstance().stopGateway();
});
