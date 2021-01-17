const { app, BrowserWindow } = require('electron')

function createWindow() {
    const win = new BrowserWindow({
        width: 1366,
        height: 768,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadFile('index.html')
    win.removeMenu()
    win.webContents.openDevTools()

    // const win2 = new BrowserWindow({
    //     width: 1366,
    //     height: 768,
    //     webPreferences: {
    //         nodeIntegration: true
    //     }
    // })
    // win2.loadFile('group_mean.html')
    // win2.removeMenu()
    // // win2.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
