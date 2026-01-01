# Build Issue Fix

## Problem
The build fails because electron-builder tries to extract code signing tools that require administrator privileges.

## Solution Options

### Option 1: Run as Administrator (Recommended)
1. Right-click PowerShell/Command Prompt
2. Select "Run as Administrator"
3. Navigate to project directory
4. Run: `npm run build:win`

### Option 2: Use Portable Build
Instead of creating an installer, create a portable version:

```bash
npx electron-builder --win --dir
```

This creates an unpacked folder in `dist/win-unpacked/` that can be zipped and distributed.

### Option 3: Disable Code Signing Completely
The package.json already has code signing disabled. If issues persist, you may need to:
1. Enable Developer Mode in Windows (Settings → Update & Security → For developers)
2. Or run the build command as Administrator

## Quick Fix Command (Run as Admin)
```powershell
cd "C:\Projects\Task Reminder Desktop App"
npm run build:win
```

