import puppeteer from 'puppeteer-core';
import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function verifySmartPrioritization() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const outDir = path.resolve(__dirname, '../screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const profileDir = path.resolve(__dirname, '../.edge_profile_smart_prioritization');
  if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });

  console.log('Starting Vite server for Smart Prioritization verification...');
  const server = await createServer({
    configFile: path.resolve(__dirname, '../vite.config.ts'),
    server: { port: 5182 }
  });
  await server.listen();
  console.log('React app running on http://localhost:5182');

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    userDataDir: profileDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--no-first-run']
  });

  try {
    const page = await browser.newPage();
    const originalUrl = 'file:///' + path.resolve(__dirname, '../admin portal smart priortization.html').replace(/\\/g, '/');

    // 1. Capture Original 1440px
    console.log('Capturing Original Stitch Smart Prioritization (1440px)...');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(originalUrl, { waitUntil: 'load', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(outDir, 'smart_prioritization_original_1440.png'), fullPage: true });

    // Set demo role to admin for the React app
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('sanketone_demo_role', 'admin');
    });

    // 2. Capture React 1440px
    console.log('Capturing React Smart Prioritization (1440px)...');
    await page.goto('http://localhost:5182/admin/prioritization', { waitUntil: 'load', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(outDir, 'smart_prioritization_react_1440.png'), fullPage: true });

    // 3. Capture Original 375px
    console.log('Capturing Original Stitch Smart Prioritization (375px mobile)...');
    await page.setViewport({ width: 375, height: 812, isMobile: true });
    await page.goto(originalUrl, { waitUntil: 'load', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(outDir, 'smart_prioritization_original_375.png'), fullPage: true });

    // 4. Capture React 375px
    console.log('Capturing React Smart Prioritization (375px mobile)...');
    await page.goto('http://localhost:5182/admin/prioritization', { waitUntil: 'load', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(outDir, 'smart_prioritization_react_375.png'), fullPage: true });

    console.log('Smart Prioritization screenshots captured successfully!');
  } finally {
    await browser.close();
    await server.close();
  }
}

verifySmartPrioritization().catch(err => {
  console.error('Error during Smart Prioritization verification:', err);
  process.exit(1);
});

