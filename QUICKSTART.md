# Quick Start Guide

## First Time Setup

1. **Install Node.js** (if not already installed)
   - Download from https://nodejs.org/
   - Install version 14 or higher

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the Application**
   ```bash
   npm start
   ```

## First Run

When you first run the app:
- The window will appear on your desktop
- It will automatically minimize to the system tray (check the notification area)
- Right-click the tray icon to access settings
- The app will remember all your tasks automatically

## Adding Your First Task

1. Type a task name in the "Task name" field
2. (Optional) Add notes in the "Message/Notes" field
3. (Optional) Add a link in the "Link" field
4. Click "Add Task" or press Enter

## Key Features

- **Always Visible**: The window stays on your desktop
- **System Tray**: Click the minimize button (➖) to hide to tray
- **Auto-Start**: Enable "Start with Windows" in settings
- **Always on Top**: Keep the window above other windows
- **Persistent**: All tasks are saved automatically

## Troubleshooting

### App doesn't start
- Make sure Node.js is installed: `node --version`
- Reinstall dependencies: `npm install`

### Can't see the app after minimizing
- Check the system tray (notification area) in the bottom-right corner
- Look for a small icon - click it to show the window

### Tasks not saving
- Check if you have write permissions in the app data directory
- Windows: `%APPDATA%\task-reminder-desktop\`

### Auto-start not working
- Make sure you've enabled it in Settings
- On first run, Windows may ask for permission

## Building for Distribution

To create a Windows executable:

```bash
npm run build:win
```

The executable will be in the `dist` folder.

