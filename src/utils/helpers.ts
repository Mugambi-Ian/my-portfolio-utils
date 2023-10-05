import {Browser, launch} from 'puppeteer';

/* eslint-disable no-console */
let browser: Browser;
export async function loadBrowser() {
  if (!browser)
    browser = await launch({
      headless: 'new',
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-sandbox',
        '--window-size=1920,1080',
      ],
    });
  return browser;
}
export function extract<T>(Class: any, properties: any): T {
  const c = new Class();
  const result: typeof Class = {};
  for (const property of Object.keys(properties) as Array<keyof typeof Class>) {
    if (property in c) result[property] = properties[property];
  }
  return result as T;
}
export function convertAppURL(x: APPURL): string {
  let path = x.href ? x.href : '';
  const queryParams: string[] = [];
  if (x.query)
    Object.keys(x.query).forEach(key => {
      const encodedKey = encodeURIComponent(key);
      let encodedValue = '';
      if (Array.isArray(x.query![key])) {
        encodedValue = (x.query![key] as string[]).join(`&${encodedKey}=`);
      } else encodedValue = encodeURIComponent(x.query![key] as string);
      const param = `${encodedKey}${x.query![key] ? `=${encodedValue}` : ''}`;
      queryParams.push(param);
    });
  path += queryParams.length !== 0 ? `?${queryParams.join('&')}` : '';
  return path;
}
export interface APPURL {
  href?: string;
  query?: Record<string, string | boolean | number | undefined | string[]>;
}
export function getUrlSearchParams<T>(url: string): T {
  const searchParams = new URLSearchParams(url.split('?')[1]);
  const params: Record<string, string | string[]> = {};

  for (const [key, value] of searchParams.entries()) {
    if (params[key]) {
      if (Array.isArray(params[key])) {
        (params[key] as string[]).push(value);
      } else {
        params[key] = [params[key] as string, value];
      }
    } else {
      params[key] = value;
    }
  }

  return params as T;
}
