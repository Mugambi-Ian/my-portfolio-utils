/* eslint-disable no-process-exit */
import * as dotenv from 'dotenv';
import express, {Request, Response} from 'express';
import {Browser} from 'puppeteer';
import {request_server} from './utils/types.js';
import {loadBrowser} from './utils/helpers.js';
import {AppReceiptHanndler} from './handlers/app.js';

dotenv.config();
function startup() {
  const app = express();
  const {APP_PORT} = process.env;
  let browser: Browser | void = undefined;

  app.get('/document', (req: Request, res: Response) =>
    request_server(req, res, AppReceiptHanndler.download)
  );

  app.listen(APP_PORT, async () => {
    browser = await loadBrowser();
    console.log('server started at http://localhost:' + APP_PORT);
  });

  process.on('exit', async () => {
    if (browser) await browser.close();
    console.log('server closed');
  });
}

try {
  startup();
} catch (error) {
  startup();
  console.log(error);
}
