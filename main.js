// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, net } = require('electron');
const path = require('path');

const api_temp_mail = "https://www.1secmail.com/api/v1";
const glitch = {
  protocol: "https:",
  hostname: "mirror-ember-check.glitch.me",
  path: {
    getUserProfile: "getUserProfile"
  }
};

function createWindow() {
  const { screen } = require('electron');
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const mainWindow = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
  });
  mainWindow.maximize();
  mainWindow.removeMenu();

  // mainWindow.loadURL("https://eduplax.com");
  mainWindow.loadFile('html/authentication/login.html');
  // mainWindow.loadFile('main_app.html');
  mainWindow.webContents.openDevTools();
  ipcHandler(mainWindow);
};

function ipcHandler(mainWindow) {
  ipcMain.handle(glitch.path.getUserProfile, (event, body) => {
    const req = {
      method: "POST",
      protocol: glitch.protocol,
      hostname: glitch.hostname,
      path: glitch.path.getUserProfile,
      data: body
    };
    callApi(req, body, mainWindow);
  });

  ipcMain.handle('reDirect', (event, path) => {
    mainWindow.loadFile(path);
  });

  ipcMain.handle('direct to sign up', () => mainWindow.loadFile('authentication/register.html'));
}

function callApi(req, body, mainWindow) {

  const request = net.request(req);
  request.setHeader('Content-Type', 'application/json');
  request.write(JSON.stringify(body), 'utf-8');
  request.end();

  request.on('error', (error) => {
    console.log(`ERROR: ${JSON.stringify(error)}`);
  });

  request.on('response', (response) => {
    var dataRespone = null;
    response.on('data', (chunk) => {
      dataRespone = Buffer.concat([chunk]).toString();
    });

    response.on('end', () => {
      mainWindow.webContents.send(req.path, JSON.parse(dataRespone));
    });
  });
};

app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});