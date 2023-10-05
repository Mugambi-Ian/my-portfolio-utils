import {Request, Response} from 'express';
import {getUrlSearchParams, loadBrowser} from '../utils/helpers.js';

export class DocumentHandler {
  async download(req: Request, res: Response) {
    const params = getUrlSearchParams<{lang: string}>(req.url);
    const page = await (await loadBrowser()).newPage();

    await page.setExtraHTTPHeaders({
      'hide-header': 'true',
    });
    await page.setCookie({
      secure: true,
      name: 'theme',
      value: 'light',
      sameSite: 'Strict',
      domain: process.env['APP_URL'],
    });

    await page.goto(process.env['APP_URL'] + '/resume/?lang=' + params.lang);

    const elem = await page.$('main');
    const main = await elem?.boundingBox();
    const pdf = await page.pdf({
      scale: 0.8,
      width: '803px',
      printBackground: true,
      preferCSSPageSize: true,
      height: `${main!.height * 0.9}px`,
    });
    await page.close();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-height': main?.height,
    });
    return res.send(pdf);
  }
}
