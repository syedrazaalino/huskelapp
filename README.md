# Huskelapp - Oppgavepåminnelse

A desktop task reminder application that stays visible on your desktop like sticky notes. Perfect for keeping track of important tasks, notes, and links that you don't want to forget.

## Features

- ✅ **Always Visible**: Stays on your desktop as a small notebook-style task list
- ✅ **System Tray Integration**: Minimizes to system tray instead of taskbar
- ✅ **Auto-Start**: Option to start automatically with Windows
- ✅ **Persistent Storage**: All tasks are saved and remembered
- ✅ **Task Management**: Add, edit, and delete tasks
- ✅ **Rich Task Data**: Each task can have:
  - Task name
  - Message/notes
  - Link (optional)
- ✅ **Always on Top**: Option to keep window always visible above other windows
- ✅ **Modern UI**: Beautiful gradient design with smooth animations

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Run the application:
```bash
npm start
```

### Building for Windows

To create a distributable Windows installer:

```bash
npm run build:win
```

The built installer will be in the `dist` folder as `Task Reminder Setup.exe`.

**For detailed installation instructions, see [INSTALL.md](INSTALL.md)**

## Usage

1. **Adding Tasks**: 
   - Enter a task name (required)
   - Optionally add a message/notes
   - Optionally add a link
   - Click "Add Task" or press Enter

2. **Editing Tasks**: 
   - Click the edit button (✏️) on any task
   - Modify the fields
   - Click save (💾) or cancel (❌)

3. **Deleting Tasks**: 
   - Click the delete button (🗑️) on any task
   - Confirm deletion

4. **Minimizing**: 
   - Click the minimize button (➖) to hide to system tray
   - Click the tray icon to show/hide the window

5. **Settings**: 
   - Click the settings button (⚙️)
   - Toggle "Always on Top" to keep window above others
   - Toggle "Start with Windows" to auto-start on boot

## Settings

The app stores settings and tasks locally using `electron-store`. Data is saved in:
- Windows: `%APPDATA%\task-reminder-desktop\config.json`

## Project Structure

```
.
├── main.js          # Main Electron process (window, tray, IPC)
├── renderer.js      # Renderer process (UI logic)
├── index.html       # UI structure
├── styles.css       # Styling
├── package.json     # Dependencies and scripts
└── assets/          # Icons and images
```

## Technologies

- **Electron**: Desktop application framework
- **electron-store**: Persistent data storage
- **auto-launch**: Windows auto-start functionality

## Notes

- The app runs in the system tray when minimized
- Tasks are automatically saved when added, edited, or deleted
- Links open in your default browser
- The window can be resized to your preference

## License

MIT

