import { app, BrowserWindow, Menu, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let win;

function createWindow() {
	win = new BrowserWindow({
		width: 800,
		height: 600,
		titleBarStyle: "hiddenInset",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: false,
			contextIsolation: true,
		},
	});

	win.loadURL("http://localhost:5173");

	// win.webContents.openDevTools();
}

const createMenu = () => {
	const menuTemplate = [
		{
			label: "Menu",
			submenu: [
				{
					label: "Open Column Editor",
					click: () => {
						win.webContents.send("open-column-editor");
					},
				},
				{ role: "quit" },
			],
		},
	];

	const menu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(menu);
};

app.on("ready", () => {
	createWindow();
	createMenu();
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

ipcMain.on("open-column-editor", () => {
	win.webContents.send("open-column-editor");
});
