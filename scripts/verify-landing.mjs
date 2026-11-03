import puppeteer from 'puppeteer-core';
import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function verifyLanding() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const outDir = path.resolve(__dirname, '../screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const profileDir = path.resolve(__dirname, '../.edge_profile_verify');
  if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });

  console.log('1. Starting programmatic Vite dev server for React app...');
  const server = await createServer({
    configFile: path.resolve(__dirname, '../vite.config.ts'),
    server: { port: 5174 }
  });
  await server.listen();
  console.log('React app running on http://localhost:5174');

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    userDataDir: profileDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--no-first-run']
  });

  try {
    const page = await browser.newPage();

    // 1. Capture Original 1440px
    console.log('Capturing Original Stitch Landing (1440px)...');
    await page.setViewport({ width: 1440, height: 900 });
    const originalUrl = 'file:///' + path.resolve(__dirname, '../landing page.html').replace(/\\/g, '/');
    await page.goto(originalUrl, { waitUntil: 'load', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500)); // wait for Three.js render
    await page.screenshot({ path: path.join(outDir, 'landing_original_1440.png'), fullPage: true });

    // 2. Capture React 1440px
    console.log('Capturing React Landing (1440px)...');
    await page.goto('http://localhost:5174/', { waitUntil: 'load', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500)); // wait for Three.js render
    await page.screenshot({ path: path.join(outDir, 'landing_react_1440.png'), fullPage: true });

    // 3. Capture Original 375px
    console.log('Capturing Original Stitch Landing (375px mobile)...');
    await page.setViewport({ width: 375, height: 812, isMobile: true });
    await page.goto(originalUrl, { waitUntil: 'load', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(outDir, 'landing_original_375.png'), fullPage: true });

    // 4. Capture React 375px
    console.log('Capturing React Landing (375px mobile)...');
    await page.goto('http://localhost:5174/', { waitUntil: 'load', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(outDir, 'landing_react_375.png'), fullPage: true });

    console.log('Visual verification capture for Landing Page completed successfully.');
  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    await browser.close();
    await server.close();
  }
}

verifyLanding();

