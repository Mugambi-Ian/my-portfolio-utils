/* eslint-disable no-process-exit */
import {log} from 'console';
import * as dotenv from 'dotenv';
dotenv.config();
import express, {Request, Response} from 'express';
import puppeteer, {Browser} from 'puppeteer';

const app = express();
const {APP_PORT} = process.env;

function err(err: Error) {
  throw err;
}
let browser: Browser | void = undefined;
app.get('/downloadResume', async (req: Request, res: Response) => {
  try {
    const page = await browser!.newPage();
    const url = req.query['url'] as string;
    await page.setExtraHTTPHeaders({
      'hide-header': 'true',
      'dark-mode': 'false',
    });
    await page.goto(url).catch(err);
    const elem = await page.$('main');
    const main = await elem?.boundingBox();
    const pdf = await page
      .pdf({
        scale: 0.75,
        width: '803px',
        printBackground: true,
        preferCSSPageSize: true,
        height: `${main!.height * 0.68}px`,
      })
      .catch(err);
    await page.close();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="page.pdf"',
      'Content-height': main?.height,
    });

    res.send(pdf);
  } catch (error) {
    log(error);
    res.status(500).send({error});
  }
});

app.listen(APP_PORT, async () => {
  browser = await puppeteer
    .launch({
      headless: true,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-sandbox',
      ],
    })
    .catch(err);
  console.log('App listening on port ' + APP_PORT);
});

process.on('exit', async () => {
  if (browser) await browser.close().catch(err);
  console.log('server closed');
});
