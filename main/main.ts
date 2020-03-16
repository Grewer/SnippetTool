'use strict';

import {app, BrowserWindow} from 'electron'
import debug from 'electron-debug'

debug();

let mainWindow;

(async () => {
  await app.whenReady();
  mainWindow = new BrowserWindow();
})();
