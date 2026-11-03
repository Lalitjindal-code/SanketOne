import puppeteer from 'puppeteer-core';
import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const auditPages = [
  {
    key: 'landing',
    name: 'Landing Page',
    origFile: 'landing page.html',
    reactRoute: '/',
    role: 'public'
  },
  {
    key: 'auth',
    name: 'Authentication Page',
    origFile: 'auth page.html',
    reactRoute: '/auth',
    role: 'public'
  },
  {
    key: 'dashboard',
    name: 'Student Dashboard',
    origFile: 'dashboard.html',
    reactRoute: '/student/overview',
    role: 'student'
  },
  {
    key: 'problem_report',
    name: 'Problem Report',
    origFile: 'problem report.html',
    reactRoute: '/student/report',
    role: 'student'
  },
  {
    key: 'my_complaint',
    name: 'My Complaints',
    origFile: 'my complaint.html',
    reactRoute: '/student/complaints',
    role: 'student'
  },
  {
    key: 'community',
    name: 'Community Board',
    origFile: 'community.html',
    reactRoute: '/student/community',
    role: 'student'
  },
  {
    key: 'admin_overview',
    name: 'Admin Campus Overview',
    origFile: 'admin portal campus overview.html',
    reactRoute: '/admin/overview',
    role: 'admin'
  },
  {
    key: 'admin_complaint',
    name: 'Admin Complaint Management',
    origFile: 'admin portal complaint.html',
    reactRoute: '/admin/complaints',
    role: 'admin'
  },
  {
    key: 'smart_prioritization',
    name: 'Admin Smart Prioritization',
    origFile: 'admin portal smart priortization.html',
    reactRoute: '/admin/prioritization',
    role: 'admin'
  },
  {
    key: 'sla',
    name: 'Admin SLA Escalations',
    origFile: 'admin portal sla.html',
    reactRoute: '/admin/sla',
    role: 'admin'
  }
];

function readPng(filePath) {
  return PNG.sync.read(fs.readFileSync(filePath));
}

function writePng(filePath, png) {
  fs.writeFileSync(filePath, PNG.sync.write(png));
}

function padImage(srcPng, targetWidth, targetHeight) {
  const dst = new PNG({ width: targetWidth, height: targetHeight });
  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const idx = (targetWidth * y + x) << 2;
      dst.data[idx] = 17;
      dst.data[idx + 1] = 24;
      dst.data[idx + 2] = 23;
      dst.data[idx + 3] = 255;
    }
  }

  for (let y = 0; y < srcPng.height; y++) {
    for (let x = 0; x < srcPng.width; x++) {
      const srcIdx = (srcPng.width * y + x) << 2;
      const dstIdx = (targetWidth * y + x) << 2;
      dst.data[dstIdx] = srcPng.data[srcIdx];
      dst.data[dstIdx + 1] = srcPng.data[srcIdx + 1];
      dst.data[dstIdx + 2] = srcPng.data[srcIdx + 2];
      dst.data[dstIdx + 3] = srcPng.data[srcIdx + 3];
    }
  }
  return dst;
}

function stitchSideBySide(leftPng, rightPng) {
  const width = leftPng.width + rightPng.width;
  const height = Math.max(leftPng.height, rightPng.height);
  const composite = new PNG({ width, height });

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      composite.data[idx] = 17;
      composite.data[idx + 1] = 24;
      composite.data[idx + 2] = 23;
      composite.data[idx + 3] = 255;
    }
  }

  for (let y = 0; y < leftPng.height; y++) {
    for (let x = 0; x < leftPng.width; x++) {
      const srcIdx = (leftPng.width * y + x) << 2;
      const dstIdx = (width * y + x) << 2;
      composite.data[dstIdx] = leftPng.data[srcIdx];
      composite.data[dstIdx + 1] = leftPng.data[srcIdx + 1];
      composite.data[dstIdx + 2] = leftPng.data[srcIdx + 2];
      composite.data[dstIdx + 3] = leftPng.data[srcIdx + 3];
    }
  }

  const offsetX = leftPng.width;
  for (let y = 0; y < rightPng.height; y++) {
    for (let x = 0; x < rightPng.width; x++) {
      const srcIdx = (rightPng.width * y + x) << 2;
      const dstIdx = (width * y + (offsetX + x)) << 2;
      composite.data[dstIdx] = rightPng.data[srcIdx];
      composite.data[dstIdx + 1] = rightPng.data[srcIdx + 1];
      composite.data[dstIdx + 2] = rightPng.data[srcIdx + 2];
      composite.data[dstIdx + 3] = rightPng.data[srcIdx + 3];
    }
  }

  return composite;
}

async function smoothScrollPage(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let currentPosition = 0;
      const distance = 500;
      const timer = setInterval(() => {
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        window.scrollBy(0, distance);
        currentPosition += distance;
        if (currentPosition >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 50);
    });
  });
  await new Promise(r => setTimeout(r, 800));
}

async function runFullAudit() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const outDir = path.resolve(__dirname, '../visual_audit');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const profileDir = path.resolve(__dirname, '../.edge_profile_full_audit');
  if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });

  console.log('Starting Vite server for Full Audit on port 5195...');
  const server = await createServer({
    configFile: path.resolve(__dirname, '../vite.config.ts'),
    server: { port: 5195 }
  });
  await server.listen();
  console.log('Vite server running on http://localhost:5195');

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    userDataDir: profileDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--no-first-run']
  });

  const auditReport = [];

  try {
    const page = await browser.newPage();

    for (const item of auditPages) {
      console.log(`\n========================================`);
      console.log(`Processing [${item.name}]...`);

      const origUrl = 'file:///' + path.resolve(__dirname, '../', item.origFile).replace(/\\/g, '/');
      const reactUrl = `http://localhost:5195${item.reactRoute}`;

      // Viewports to test
      const viewports = [
        { width: 1440, height: 900, isMobile: false, suffix: '1440', label: '1440px Desktop' },
        { width: 375, height: 812, isMobile: true, suffix: '375', label: '375px Mobile' }
      ];

      for (const vp of viewports) {
        console.log(`--- [${item.name}] ${vp.label} ---`);

        // 1. Capture Original
        await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.isMobile });
        await page.goto(origUrl, { waitUntil: 'load', timeout: 45000 });
        await smoothScrollPage(page);
        const origPngPath = path.join(outDir, `${item.key}_original_${vp.suffix}.png`);
        await page.screenshot({ path: origPngPath, fullPage: true });

        // 2. Set role & capture React
        if (item.role !== 'public') {
          await page.evaluateOnNewDocument((r) => {
            localStorage.setItem('sanketone_demo_role', r);
          }, item.role);
        }

        await page.goto(reactUrl, { waitUntil: 'load', timeout: 45000 });
        if (item.role !== 'public') {
          await page.evaluate((r) => {
            localStorage.setItem('sanketone_demo_role', r);
          }, item.role);
          await page.goto(reactUrl, { waitUntil: 'load', timeout: 45000 });
        }
        await smoothScrollPage(page);
        const reactPngPath = path.join(outDir, `${item.key}_react_${vp.suffix}.png`);
        await page.screenshot({ path: reactPngPath, fullPage: true });

        // 3. Diff Analysis
        const imgOrig = readPng(origPngPath);
        const imgReact = readPng(reactPngPath);

        const targetW = Math.max(imgOrig.width, imgReact.width);
        const targetH = Math.max(imgOrig.height, imgReact.height);

        const normOrig = padImage(imgOrig, targetW, targetH);
        const normReact = padImage(imgReact, targetW, targetH);

        const diffPng = new PNG({ width: targetW, height: targetH });
        const mismatchedPixels = pixelmatch(
          normOrig.data,
          normReact.data,
          diffPng.data,
          targetW,
          targetH,
          {
            threshold: 0.15,
            diffColor: [255, 0, 80],
            alpha: 0.4
          }
        );

        const totalPixels = targetW * targetH;
        const mismatchPct = ((mismatchedPixels / totalPixels) * 100).toFixed(2);
        const matchPct = (100 - parseFloat(mismatchPct)).toFixed(2);

        // Save Diff PNG
        const diffOut = path.join(outDir, `${item.key}_diff_${vp.suffix}.png`);
        writePng(diffOut, diffPng);

        // Save 2-up Side-by-Side: [Original | React]
        const sbsPng = stitchSideBySide(normOrig, normReact);
        const sbsOut = path.join(outDir, `${item.key}_side_by_side_${vp.suffix}.png`);
        writePng(sbsOut, sbsPng);

        // Save 3-up Composite: [Original | React | Diff Overlay]
        const triPng = stitchSideBySide(sbsPng, diffPng);
        const triOut = path.join(outDir, `${item.key}_tri_${vp.suffix}.png`);
        writePng(triOut, triPng);

        console.log(`Original: ${imgOrig.width}x${imgOrig.height} | React: ${imgReact.width}x${imgReact.height}`);
        console.log(`Match: ${matchPct}% | Diff Pixels: ${mismatchedPixels} / ${totalPixels}`);

        auditReport.push({
          key: item.key,
          name: item.name,
          viewport: vp.label,
          suffix: vp.suffix,
          originalFile: item.origFile,
          reactRoute: item.reactRoute,
          origDim: `${imgOrig.width}x${imgOrig.height}`,
          reactDim: `${imgReact.width}x${imgReact.height}`,
          mismatchedPixels,
          totalPixels,
          matchPercentage: parseFloat(matchPct),
          mismatchPercentage: parseFloat(mismatchPct),
          origPng: origPngPath,
          reactPng: reactPngPath,
          diffPng: diffOut,
          sideBySidePng: sbsOut,
          triPng: triOut
        });
      }
    }

    fs.writeFileSync(path.join(outDir, 'full_audit_metrics.json'), JSON.stringify(auditReport, null, 2));
    console.log('\nFULL AUDIT COMPLETE! Metrics written to visual_audit/full_audit_metrics.json');
  } finally {
    await browser.close();
    await server.close();
  }
}

runFullAudit().catch(err => {
  console.error('Audit execution error:', err);
  process.exit(1);
});

