import { ipcMain, BrowserWindow } from 'electron';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';
import { OpenWAManager } from '../../services/openwa-manager.service';

export function registerSessionHandlers(mainWindow: BrowserWindow, openwa: OpenWAManager): void {
  // بث أحداث OpenWA إلى الواجهة
  openwa.on('qr', (data) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send(IPC_CHANNELS.SESSION_QR_EVENT, data);
    }
  });

  openwa.on('status-changed', (data) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send(IPC_CHANNELS.SESSION_STATUS_CHANGED, data);
    }
  });

  // معالجات الـ IPC
  ipcMain.handle(IPC_CHANNELS.SESSION_GET_STATUS, async () => {
    return await openwa.getStatus();
  });

  ipcMain.handle(IPC_CHANNELS.SESSION_START, async (_event, { sessionName }) => {
    return await openwa.startSession(sessionName || 'default');
  });

  ipcMain.handle(IPC_CHANNELS.SESSION_LOGOUT, async () => {
    return await openwa.logout();
  });

  ipcMain.handle(IPC_CHANNELS.SESSION_SIMULATE_PAIR, async (_event, { phone }) => {
    return await openwa.simulatePair(phone || '966501234567');
  });

  ipcMain.handle(IPC_CHANNELS.SESSION_GET_PAIRING_CODE, async (_event, { phone }) => {
    return await openwa.getPairingCode(phone);
  });
}

