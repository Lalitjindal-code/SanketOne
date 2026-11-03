import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pages = [
  { key: 'landing', name: 'Public Landing Page' },
  { key: 'auth', name: 'Authentication Portal' },
  { key: 'dashboard', name: 'Student Overview Dashboard' },
  { key: 'problem_report', name: 'Problem Intake & Reporting' },
  { key: 'my_complaint', name: 'Student My Complaints Docket' },
  { key: 'community', name: 'Community Board & Signals' },
  { key: 'admin_overview', name: 'Admin Campus Overview & KPIs' },
  { key: 'admin_complaint', name: 'Admin Complaint Management' },
  { key: 'smart_prioritization', name: 'Smart Prioritization & Clusters' },
  { key: 'sla', name: 'Admin SLA Tracking & Escalations' },
];

const viewports = [
  { suffix: '1440', label: '1440px Desktop' },
  { suffix: '375', label: '375px Mobile' },
];

function readPng(filePath) {
  const data = fs.readFileSync(filePath);
  return PNG.sync.read(data);
}

function writePng(filePath, png) {
  const buffer = PNG.sync.write(png);
  fs.writeFileSync(filePath, buffer);
}

// Pads image to targetWidth x targetHeight with background color #111817
function padImage(srcPng, targetWidth, targetHeight) {
  const dst = new PNG({ width: targetWidth, height: targetHeight });
  // Fill background #111817 (17, 24, 23, 255)
  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const idx = (targetWidth * y + x) << 2;
      dst.data[idx] = 17;
      dst.data[idx + 1] = 24;
      dst.data[idx + 2] = 23;
      dst.data[idx + 3] = 255;
    }
  }

  // Copy src image pixels
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

// Stitch 2 images horizontally side-by-side: [Left | Right]
function stitchSideBySide(leftPng, rightPng) {
  const width = leftPng.width + rightPng.width;
  const height = Math.max(leftPng.height, rightPng.height);
  const composite = new PNG({ width, height });

  // Background #111817
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      composite.data[idx] = 17;
      composite.data[idx + 1] = 24;
      composite.data[idx + 2] = 23;
      composite.data[idx + 3] = 255;
    }
  }

  // Blit left
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

  // Blit right
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

async function runDiffAnalysis() {
  const screenshotsDir = path.resolve(__dirname, '../screenshots');
  const auditDir = path.resolve(__dirname, '../visual_audit');
  if (!fs.existsSync(auditDir)) fs.mkdirSync(auditDir, { recursive: true });

  const results = [];

  for (const page of pages) {
    for (const vp of viewports) {
      const origFile = path.join(screenshotsDir, `${page.key}_original_${vp.suffix}.png`);
      const reactFile = path.join(screenshotsDir, `${page.key}_react_${vp.suffix}.png`);

      if (!fs.existsSync(origFile) || !fs.existsSync(reactFile)) {
        console.warn(`Missing pair: ${origFile} or ${reactFile}`);
        continue;
      }

      const imgOrig = readPng(origFile);
      const imgReact = readPng(reactFile);

      const targetW = Math.max(imgOrig.width, imgReact.width);
      const targetH = Math.max(imgOrig.height, imgReact.height);

      const normOrig = (imgOrig.width === targetW && imgOrig.height === targetH) ? imgOrig : padImage(imgOrig, targetW, targetH);
      const normReact = (imgReact.width === targetW && imgReact.height === targetH) ? imgReact : padImage(imgReact, targetW, targetH);

      const diffPng = new PNG({ width: targetW, height: targetH });

      const mismatchedPixels = pixelmatch(
        normOrig.data,
        normReact.data,
        diffPng.data,
        targetW,
        targetH,
        {
          threshold: 0.15,
          diffColor: [255, 0, 80], // Bright pinkish red
          alpha: 0.4
        }
      );

      const totalPixels = targetW * targetH;
      const mismatchPercentage = ((mismatchedPixels / totalPixels) * 100).toFixed(2);
      const matchPercentage = (100 - parseFloat(mismatchPercentage)).toFixed(2);

      // Save diff
      const diffOut = path.join(auditDir, `${page.key}_diff_${vp.suffix}.png`);
      writePng(diffOut, diffPng);

      // Save side-by-side comparison: [Original | React]
      const sideBySide = stitchSideBySide(normOrig, normReact);
      const sbsOut = path.join(auditDir, `${page.key}_side_by_side_${vp.suffix}.png`);
      writePng(sbsOut, sideBySide);

      // Also stitch [SideBySide | Diff] into 3-up view
      const threeUp = stitchSideBySide(sideBySide, diffPng);
      const threeUpOut = path.join(auditDir, `${page.key}_tri_comparison_${vp.suffix}.png`);
      writePng(threeUpOut, threeUp);

      const res = {
        key: page.key,
        name: page.name,
        viewport: vp.label,
        suffix: vp.suffix,
        origDim: `${imgOrig.width}x${imgOrig.height}`,
        reactDim: `${imgReact.width}x${imgReact.height}`,
        mismatchedPixels,
        totalPixels,
        matchPercentage: parseFloat(matchPercentage),
        mismatchPercentage: parseFloat(mismatchPercentage),
        sideBySidePath: sbsOut,
        diffPath: diffOut,
        triComparisonPath: threeUpOut,
      };

      results.push(res);
      console.log(`[${page.name} - ${vp.label}] Dimensions: Orig(${res.origDim}) React(${res.reactDim}) | Match: ${matchPercentage}% (${mismatchedPixels} diff px)`);
    }
  }

  fs.writeFileSync(path.join(auditDir, 'audit_metrics.json'), JSON.stringify(results, null, 2));
  console.log('\nAudit metrics & diff images saved in visual_audit/');
}

runDiffAnalysis().catch(err => {
  console.error('Diff analysis failed:', err);
  process.exit(1);
});

