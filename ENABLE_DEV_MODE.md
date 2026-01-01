# Enable Windows Developer Mode

The build is failing because Windows needs permission to create symbolic links. Enable Developer Mode:

## Steps:

1. **Open Windows Settings**
   - Press `Windows Key + I`
   - Or click Start → Settings

2. **Go to Privacy & Security**
   - Click "Privacy & Security" in the left menu
   - Or search for "Developer" in Settings

3. **Enable Developer Mode**
   - Click "For developers" (or "Developer settings")
   - Toggle "Developer Mode" to **ON**
   - Accept any prompts

4. **Restart PowerShell** (as Administrator)
   - Close current PowerShell
   - Open new PowerShell as Administrator
   - Navigate to project: `cd "C:\Projects\Task Reminder Desktop App"`
   - Run: `npm run build:win`

## Alternative: Use electron-packager

If Developer Mode doesn't work, we can switch to electron-packager which doesn't have this issue.

