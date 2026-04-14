const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("node:path");

const DESKTOP_BG = "#f6f2ea";

function normalizeRequestUrl(rawUrl) {
  const value = String(rawUrl || "").trim();

  if (!value) {
    throw new Error("Request URL is required.");
  }

  const hasProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value);
  if (hasProtocol) {
    return new URL(value).toString();
  }

  if (/^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(?::\d+)?(\/|$)/i.test(value)) {
    return new URL(`http://${value}`).toString();
  }

  return new URL(`https://${value}`).toString();
}

function getNetworkErrorMessage(error) {
  const fallback = "Could not send request.";

  if (error instanceof Error) {
    const normalizedMessage = String(error.message || "").toLowerCase();

    const unknownCause = error.cause;
    if (
      unknownCause &&
      typeof unknownCause === "object" &&
      "code" in unknownCause &&
      typeof unknownCause.code === "string"
    ) {
      return fallback;
    }

    if (
      normalizedMessage.includes("fetch failed") ||
      normalizedMessage.includes("failed to fetch") ||
      normalizedMessage.includes("networkerror") ||
      normalizedMessage.includes("econn") ||
      normalizedMessage.includes("enotfound") ||
      normalizedMessage.includes("eai_again") ||
      normalizedMessage.includes("timed out") ||
      normalizedMessage.includes("socket hang up")
    ) {
      return fallback;
    }

    return error.message;
  }

  return fallback;
}

/**
 * @param {import('electron').IpcMainInvokeEvent} event
 */
function getWindowFromEvent(event) {
  return BrowserWindow.fromWebContents(event.sender) ?? null;
}

/**
 * @param {import('electron').IpcMainInvokeEvent} _event
 * @param {{ url: string; method: string; headers: Record<string, string>; body?: string }} payload
 */
async function handleSendRequest(_event, payload) {
  const startedAt = Date.now();

  try {
    const targetUrl = normalizeRequestUrl(payload.url);

    const requestInit = {
      method: payload.method,
      headers: payload.headers,
    };

    if (payload.body && !["GET", "HEAD"].includes(payload.method)) {
      requestInit.body = payload.body;
    }

    const response = await fetch(targetUrl, requestInit);
    const bodyText = await response.text();
    const headers = {};

    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return {
      ok: true,
      status: response.status,
      statusText: response.statusText,
      headers,
      body: bodyText,
      time: Date.now() - startedAt,
      size: Buffer.byteLength(bodyText, "utf8"),
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      statusText: "Error",
      headers: {},
      body: "",
      time: Date.now() - startedAt,
      size: 0,
      error: getNetworkErrorMessage(error),
    };
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1220,
    height: 780,
    minWidth: 980,
    minHeight: 620,
    backgroundColor: DESKTOP_BG,
    title: "flav",
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  const rendererUrl = process.env.ELECTRON_RENDERER_URL;

  if (rendererUrl) {
    void mainWindow.loadURL(rendererUrl);
  } else {
    void mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(() => {
  app.setName("flav");
  ipcMain.handle("arc:send-request", handleSendRequest);
  ipcMain.handle("arc:window:minimize", (event) => {
    const window = getWindowFromEvent(event);
    window?.minimize();
  });
  ipcMain.handle("arc:window:maximize-toggle", (event) => {
    const window = getWindowFromEvent(event);
    if (!window) {
      return false;
    }

    if (window.isMaximized()) {
      window.unmaximize();
    } else {
      window.maximize();
    }

    return window.isMaximized();
  });
  ipcMain.handle("arc:window:is-maximized", (event) => {
    const window = getWindowFromEvent(event);
    return window ? window.isMaximized() : false;
  });
  ipcMain.handle("arc:window:close", (event) => {
    const window = getWindowFromEvent(event);
    window?.close();
  });
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
