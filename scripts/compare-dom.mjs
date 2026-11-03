import puppeteer from 'puppeteer-core';
import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function compareDom() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const server = await createServer({
    configFile: path.resolve(__dirname, '../vite.config.ts'),
    server: { port: 5199 }
  });
  await server.listen();

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const origUrl = 'file:///' + path.resolve(__dirname, '../dashboard.html').replace(/\\/g, '/');
  await page.goto(origUrl, { waitUntil: 'load' });
  const origData = await page.evaluate(() => {
    const leftCol = document.querySelector('.lg\\:col-span-8');
    const rightCol = document.querySelector('.lg\\:col-span-4');
    return {
      leftHeight: leftCol?.clientHeight,
      rightHeight: rightCol?.clientHeight,
      leftChildren: Array.from(leftCol?.children || []).map(c => ({
        tag: c.tagName,
        cls: c.className.slice(0, 40),
        h: c.clientHeight,
        text: c.innerText.slice(0, 50).replace(/\n/g, ' ')
      })),
      rightChildren: Array.from(rightCol?.children || []).map(c => ({
        tag: c.tagName,
        cls: c.className.slice(0, 40),
        h: c.clientHeight,
        text: c.innerText.slice(0, 50).replace(/\n/g, ' ')
      }))
    };
  });

  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('sanketone_demo_role', 'student');
  });
  await page.goto('http://localhost:5199/student/overview', { waitUntil: 'load' });
  const reactData = await page.evaluate(() => {
    const leftCol = document.querySelector('.lg\\:col-span-8');
    const rightCol = document.querySelector('.lg\\:col-span-4');
    return {
      leftHeight: leftCol?.clientHeight,
      rightHeight: rightCol?.clientHeight,
      leftChildren: Array.from(leftCol?.children || []).map(c => ({
        tag: c.tagName,
        cls: c.className.slice(0, 40),
        h: c.clientHeight,
        text: c.innerText.slice(0, 50).replace(/\n/g, ' ')
      })),
      rightChildren: Array.from(rightCol?.children || []).map(c => ({
        tag: c.tagName,
        cls: c.className.slice(0, 40),
        h: c.clientHeight,
        text: c.innerText.slice(0, 50).replace(/\n/g, ' ')
      }))
    };
  });

  console.log('ORIGINAL Left Height:', origData.leftHeight, 'Right Height:', origData.rightHeight);
  console.log('Original Left Children:', JSON.stringify(origData.leftChildren, null, 2));
  console.log('Original Right Children:', JSON.stringify(origData.rightChildren, null, 2));

  console.log('\nREACT Left Height:', reactData.leftHeight, 'Right Height:', reactData.rightHeight);
  console.log('React Left Children:', JSON.stringify(reactData.leftChildren, null, 2));
  console.log('React Right Children:', JSON.stringify(reactData.rightChildren, null, 2));

  await browser.close();
  await server.close();
}

compareDom().catch(console.error);

