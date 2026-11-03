import puppeteer from 'puppeteer-core';
import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testHeights() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const server = await createServer({
    configFile: path.resolve(__dirname, '../vite.config.ts'),
    server: { port: 5198 }
  });
  await server.listen();

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Test Original
  const origUrl = 'file:///' + path.resolve(__dirname, '../dashboard.html').replace(/\\/g, '/');
  await page.goto(origUrl, { waitUntil: 'load' });
  const origHeights = await page.evaluate(() => {
    return {
      bodyScroll: document.body.scrollHeight,
      docScroll: document.documentElement.scrollHeight,
      mainScroll: document.querySelector('main')?.scrollHeight,
      footerScroll: document.querySelector('footer')?.scrollHeight,
      gridScroll: document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-12')?.scrollHeight,
    };
  });
  console.log('Original Dashboard heights:', origHeights);

  // Test React
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('sanketone_demo_role', 'student');
  });
  await page.goto('http://localhost:5198/student/overview', { waitUntil: 'load' });
  const reactHeights = await page.evaluate(() => {
    return {
      bodyScroll: document.body.scrollHeight,
      docScroll: document.documentElement.scrollHeight,
      mainScroll: document.querySelector('main')?.scrollHeight,
      footerScroll: document.querySelector('footer')?.scrollHeight,
      gridScroll: document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-12')?.scrollHeight,
      entryCount: document.querySelectorAll('.bg-surface-1.hover\\:bg-surface-2\\/70').length,
    };
  });
  console.log('React Dashboard heights:', reactHeights);

  await browser.close();
  await server.close();
}

testHeights().catch(console.error);

