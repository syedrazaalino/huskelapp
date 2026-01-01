const { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage } = require('electron');
const path = require('path');
const Store = require('electron-store');
const AutoLaunch = require('auto-launch');

const store = new Store();
let mainWindow = null;
let tray = null;
let isQuitting = false;

// Create a default icon if none exists
function createDefaultIcon() {
  // Create a simple colored square icon programmatically
  // This creates a 16x16 icon with a purple background
  const size = 16;
  const canvas = Buffer.alloc(size * size * 4);
  for (let i = 0; i < canvas.length; i += 4) {
    canvas[i] = 102;     // R
    canvas[i + 1] = 126; // G
    canvas[i + 2] = 234; // B
    canvas[i + 3] = 255; // A
  }
  return nativeImage.createFromBuffer(canvas, { width: size, height: size });
}

// Configure auto-launch
const autoLauncher = new AutoLaunch({
  name: 'Huskelapp',
  path: app.getPath('exe'),
});

// Check and set auto-launch
async function setupAutoLaunch() {
  const isEnabled = await autoLauncher.isEnabled();
  const shouldAutoLaunch = store.get('autoLaunch', true);
  
  if (shouldAutoLaunch && !isEnabled) {
    await autoLauncher.enable();
  } else if (!shouldAutoLaunch && isEnabled) {
    await autoLauncher.disable();
  }
}

function createWindow() {
  // Get window position and size from store if available
  const windowState = store.get('windowState', {});
  const showFrame = store.get('showFrame', false); // Default to frameless
  
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: windowState.width || 400,
    height: windowState.height || 600,
    x: windowState.x,
    y: windowState.y,
    minWidth: 300,
    minHeight: 400,
    frame: showFrame, // Toggle between framed and frameless
    titleBarStyle: showFrame ? 'default' : 'hidden',
    autoHideMenuBar: !showFrame, // Hide menu bar when frameless
    resizable: true,
    movable: true,
    alwaysOnTop: store.get('alwaysOnTop', true),
    skipTaskbar: true, // Hide from taskbar
    transparent: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    // icon: path.join(__dirname, 'assets', 'icon.png') // Optional icon
  });

  // Load the index.html
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Handle window close - minimize to tray instead
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      return false;
    }
  });

  // Show window when clicked from tray
  mainWindow.on('show', () => {
    mainWindow.setAlwaysOnTop(store.get('alwaysOnTop', true));
  });

  // Save window state on move/resize
  mainWindow.on('moved', () => {
    if (mainWindow) {
      const bounds = mainWindow.getBounds();
      store.set('windowState', bounds);
    }
  });

  mainWindow.on('resized', () => {
    if (mainWindow) {
      const bounds = mainWindow.getBounds();
      store.set('windowState', bounds);
    }
  });
}

function createTray() {
  // Create a simple tray icon
  const iconPath = path.join(__dirname, 'assets', 'tray-icon.png');
  let trayIcon = nativeImage.createEmpty();
  
  try {
    trayIcon = nativeImage.createFromPath(iconPath);
    if (trayIcon.isEmpty()) {
      // Create a simple colored icon if file doesn't exist or is empty
      trayIcon = createDefaultIcon();
    }
  } catch (error) {
    // If icon doesn't exist, create a simple one
    trayIcon = createDefaultIcon();
  }

  tray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Vis Huskelapp',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    {
      label: 'Always on Top',
      type: 'checkbox',
      checked: store.get('alwaysOnTop', true),
      click: (item) => {
        store.set('alwaysOnTop', item.checked);
        if (mainWindow) {
          mainWindow.setAlwaysOnTop(item.checked);
        }
      }
    },
    {
      label: 'Start with Windows',
      type: 'checkbox',
      checked: store.get('autoLaunch', true),
      click: async (item) => {
        store.set('autoLaunch', item.checked);
        if (item.checked) {
          await autoLauncher.enable();
        } else {
          await autoLauncher.disable();
        }
      }
    },
    {
      label: 'Show Window Frame',
      type: 'checkbox',
      checked: store.get('showFrame', false),
      click: (item) => {
        store.set('showFrame', item.checked);
        if (mainWindow) {
          const bounds = mainWindow.getBounds();
          store.set('windowState', bounds);
          mainWindow.destroy();
          createWindow();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Huskelapp');
  tray.setContextMenu(contextMenu);

  // Show window on tray icon click
  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });
}

// IPC handlers for task management
ipcMain.handle('get-tasks', () => {
  return store.get('tasks', []);
});

ipcMain.handle('save-tasks', (event, tasks) => {
  store.set('tasks', tasks);
  return true;
});

ipcMain.handle('get-settings', () => {
  return {
    alwaysOnTop: store.get('alwaysOnTop', true),
    autoLaunch: store.get('autoLaunch', true),
    showFrame: store.get('showFrame', false)
  };
});

ipcMain.handle('update-setting', (event, key, value) => {
  store.set(key, value);
  if (key === 'alwaysOnTop' && mainWindow) {
    mainWindow.setAlwaysOnTop(value);
  }
  if (key === 'autoLaunch') {
    if (value) {
      autoLauncher.enable();
    } else {
      autoLauncher.disable();
    }
  }
  if (key === 'showFrame' && mainWindow) {
    // Recreate window with new frame setting
    const bounds = mainWindow.getBounds();
    store.set('windowState', bounds);
    mainWindow.destroy();
    createWindow();
  }
  return true;
});

ipcMain.handle('minimize-window', () => {
  if (mainWindow) {
    mainWindow.hide();
  }
  return true;
});

// App event handlers
app.whenReady().then(async () => {
  await setupAutoLaunch();
  createTray();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else if (mainWindow) {
      mainWindow.show();
    }
  });
});

app.on('window-all-closed', (event) => {
  event.preventDefault();
  // Don't quit - keep running in tray
});

app.on('before-quit', () => {
  isQuitting = true;
});

