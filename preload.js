const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel, data) => {
    // whitelist channels
    let validChannels = ['app-version', 'restart-app'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = ['app-version', 'update-message', 'update-ready'];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes sender.
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});