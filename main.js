const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const path = require('path');

log.transports.file.level = 'info';
autoUpdater.logger = log;
autoUpdater.autoDownload = false;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app-version', (event) => {
  event.sender.send('app-version', app.getVersion());
});

ipcMain.on('restart-app', () => {
  autoUpdater.quitAndInstall();
});

autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...');
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('update-message', 'Checking for updates...');
  }
});

autoUpdater.on('update-available', (info) => {
  log.info('Update available', info);
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('update-message', 'Update available. Downloading...');
  }
});

autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available', info);
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('update-message', 'No new updates found.');
  }
});

autoUpdater.on('error', (err) => {
  log.error('Update error', err);
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('update-message', `Update error: ${err}`);
  }
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded', info);
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('update-message', 'Update downloaded. Restart to install.');
    mainWindow.webContents.send('update-ready');
  }
});