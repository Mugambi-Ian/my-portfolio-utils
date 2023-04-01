import * as dotenv from 'dotenv';
dotenv.config();
import express, {Request, Response} from 'express';
import puppeteer from 'puppeteer';

const app = express();
const {APP_PORT} = process.env;

app.get('/downloadResume', async (req: Request, res: Response) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-sandbox',
      ],
    });
    const page = await browser.newPage();
    const url = req.query['url'] as string;
    await page.setExtraHTTPHeaders({
      'hide-header': 'true',
      'dark-mode': 'false',
    });
    await page.goto(url);
    const elem = await page.$('main');
    const main = await elem?.boundingBox();
    const pdf = await page.pdf({
      scale: 0.75,
      width: '803px',
      height: `${main!.height * 0.68}px`,
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="page.pdf"',
      'Content-height': main?.height,
    });

    res.send(pdf);
  } catch (error) {
    res.status(500).send({error});
  }
});

app.listen(APP_PORT, () => {
  console.log('App listening on port ' + APP_PORT);
});
