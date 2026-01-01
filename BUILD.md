# Building the Installer

## Quick Build Guide

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build Windows Installer
```bash
npm run build:win
```

### Step 3: Find Your Installer
The installer will be created in the `dist` folder:
- **File**: `Task Reminder Setup.exe`
- **Size**: Approximately 100-150 MB
- **Type**: NSIS Windows Installer

## What Gets Built

The build process creates:
- ✅ Standalone Windows installer
- ✅ All dependencies bundled (no Node.js required)
- ✅ Desktop shortcut
- ✅ Start menu entry
- ✅ Uninstaller included

## Distribution

To share the app:
1. Build the installer: `npm run build:win`
2. Share the `Task Reminder Setup.exe` file from the `dist` folder
3. Users install it like any Windows application

## Build Options

### Build for Current Platform Only
```bash
npm run build:win
```

### Build for All Platforms (if configured)
```bash
npm run build
```

## Troubleshooting Build Issues

### Issue: Build fails with icon error
**Solution**: The icon is optional. Remove the icon path from `package.json` if you don't have an icon file.

### Issue: Build is too large
**Solution**: This is normal for Electron apps. They bundle Chromium and Node.js, so 100-150 MB is expected.

### Issue: Windows Defender flags the installer
**Solution**: This is normal for unsigned apps. Users need to click "More info" → "Run anyway". To avoid this, you need a code-signing certificate.

## Adding an Icon (Optional)

1. Create or download an `.ico` file (256x256 recommended)
2. Place it in `assets/icon.ico`
3. Update `package.json` to include:
   ```json
   "win": {
     "target": "nsis",
     "icon": "assets/icon.ico"
   }
   ```

## Code Signing (Optional, for Production)

To avoid Windows SmartScreen warnings:
1. Obtain a code-signing certificate
2. Add to `package.json`:
   ```json
   "win": {
     "certificateFile": "path/to/certificate.pfx",
     "certificatePassword": "password"
   }
   ```

## Build Time

- First build: 2-5 minutes (downloads dependencies)
- Subsequent builds: 30-60 seconds

