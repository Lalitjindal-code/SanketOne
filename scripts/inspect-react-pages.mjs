import puppeteer from 'puppeteer-core';
import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesToTest = [
  { name: 'landing', route: '/', role: 'public' },
  { name: 'auth', route: '/auth', role: 'public' },
  { name: 'dashboard', route: '/student/overview', role: 'student' },
  { name: 'problem_report', route: '/student/report', role: 'student' },
  { name: 'my_complaint', route: '/student/complaints', role: 'student' },
  { name: 'community', route: '/student/community', role: 'student' },
  { name: 'admin_overview', route: '/admin/overview', role: 'admin' },
  { name: 'admin_complaint', route: '/admin/complaints', role: 'admin' },
  { name: 'smart_prioritization', route: '/admin/prioritization', role: 'admin' },
  { name: 'sla', route: '/admin/sla', role: 'admin' },
];

async function inspectPages() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const server = await createServer({
    configFile: path.resolve(__dirname, '../vite.config.ts'),
    server: { port: 5190 }
  });
  await server.listen();
  console.log('Server started on 5190');

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  for (const item of routesToTest) {
    if (item.role !== 'public') {
      await page.evaluateOnNewDocument((r) => {
        localStorage.setItem('sanketone_demo_role', r);
      }, item.role);
    }

    await page.goto(`http://localhost:5190${item.route}`, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 1000));

    // Force set in current session too
    if (item.role !== 'public') {
      await page.evaluate((r) => {
        localStorage.setItem('sanketone_demo_role', r);
      }, item.role);
      // reload
      await page.goto(`http://localhost:5190${item.route}`, { waitUntil: 'load' });
      await new Promise(r => setTimeout(r, 1000));
    }

    const currentUrl = page.url();
    const h1 = await page.$eval('h1', el => el.innerText).catch(() => 'NO H1');
    const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    const textPreview = await page.evaluate(() => document.body.innerText.slice(0, 150).replace(/\n/g, ' '));

    console.log(`[${item.name}] Route: ${item.route} | URL: ${currentUrl} | H1: "${h1}" | scrollHeight: ${scrollHeight} | bodyHeight: ${bodyHeight}`);
    console.log(`   Preview: ${textPreview}\n`);
  }

  await browser.close();
  await server.close();
}

inspectPages().catch(console.error);

