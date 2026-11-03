import puppeteer from 'puppeteer-core';
import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testViteCapture() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const outDir = path.resolve(__dirname, '../screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const profileDir = path.resolve(__dirname, '../.edge_profile_vite');
  if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });

  console.log('Starting Vite server...');
  const server = await createServer({
    configFile: path.resolve(__dirname, '../vite.config.ts'),
    server: { port: 5173 }
  });
  await server.listen();
  const address = server.httpServer.address();
  const port = address.port;
  console.log(`Vite running on http://localhost:${port}`);

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    userDataDir: profileDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--no-first-run']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle0' });
    const outPath = path.join(outDir, 'react_landing_test_1440.png');
    await page.screenshot({ path: outPath, fullPage: true });
    console.log('Successfully captured React page to:', outPath);
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
    await server.close();
    console.log('Vite server and browser closed.');
  }
}

testViteCapture();

