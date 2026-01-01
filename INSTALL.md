# Installation Guide

## For End Users (Installing the App)

### Option 1: Using the Installer (Recommended)

1. **Download the Installer**
   - Download the `Task Reminder Setup.exe` file from the `dist` folder
   - This is a Windows installer created after building the app

2. **Run the Installer**
   - Double-click `Task Reminder Setup.exe`
   - Follow the installation wizard
   - Choose installation directory (default is recommended)
   - The installer will create:
     - Desktop shortcut
     - Start menu entry
     - Application files

3. **Launch the App**
   - Double-click the desktop shortcut, or
   - Find "Task Reminder" in your Start menu
   - The app will appear on your desktop

4. **First Run**
   - The app window will appear on your desktop
   - It will minimize to the system tray (notification area)
   - Click the tray icon to show/hide the window
   - Right-click the tray icon for settings

### Option 2: Portable Version (No Installation)

1. **Download the Portable Version**
   - Download the portable `.exe` file from the `dist` folder
   - No installation required - just run the `.exe` file

2. **Run the App**
   - Double-click the `.exe` file
   - The app will run directly

**Note:** Portable version won't have auto-start with Windows feature unless you manually set it up.

---

## For Developers (Building the Installer)

### Prerequisites
- Node.js (v14 or higher) installed
- npm installed

### Steps to Build

1. **Install Dependencies** (if not already done)
   ```bash
   npm install
   ```

2. **Build Windows Installer**
   ```bash
   npm run build:win
   ```

3. **Find the Installer**
   - The installer will be in the `dist` folder
   - Look for `Task Reminder Setup.exe` (NSIS installer)
   - File size will be around 100-150 MB

### Build Output

After building, you'll find in the `dist` folder:
- `Task Reminder Setup.exe` - Windows installer (recommended for distribution)
- `Task Reminder Setup.exe.blockmap` - Update metadata
- `latest.yml` - Update information

### Distribution

To share the app with others:
1. Build the installer using `npm run build:win`
2. Share the `Task Reminder Setup.exe` file from the `dist` folder
3. Users can install it like any other Windows application

---

## Troubleshooting

### Build Issues

**Error: "electron-builder not found"**
```bash
npm install electron-builder --save-dev
```

**Error: "Icon not found"**
- The app will work without a custom icon
- To add an icon, place `icon.ico` in the `assets` folder

### Installation Issues

**Windows Defender/SmartScreen Warning**
- This is normal for unsigned applications
- Click "More info" → "Run anyway" if you trust the source
- To avoid this, you need to code-sign the application (requires a certificate)

**App won't start after installation**
- Check if Node.js runtime is required (it shouldn't be for built apps)
- Try running as administrator
- Check Windows Event Viewer for errors

### Runtime Issues

**App doesn't appear in system tray**
- Check if tray icons are hidden in Windows settings
- Right-click taskbar → Taskbar settings → Select which icons appear

**Tasks not saving**
- Check write permissions in: `%APPDATA%\task-reminder-desktop\`
- Run as administrator if needed

---

## Uninstallation

### Using Windows Settings
1. Open Windows Settings
2. Go to Apps → Apps & features
3. Find "Task Reminder"
4. Click Uninstall

### Manual Uninstallation
1. Delete the installation folder (usually `C:\Program Files\Task Reminder`)
2. Delete the data folder: `%APPDATA%\task-reminder-desktop\`
3. Remove desktop shortcut and Start menu entry

---

## System Requirements

- **OS**: Windows 10 or later
- **RAM**: 100 MB minimum
- **Disk Space**: 200 MB for installation
- **No additional software required** (all dependencies bundled)

---

## Notes

- The app runs in the system tray when minimized
- All data is stored locally on your computer
- No internet connection required
- No account or registration needed

