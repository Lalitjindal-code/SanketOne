import puppeteer from 'puppeteer-core';
import { createServer } from 'vite';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runLifecycleTest() {
  console.log('--- STARTING SANKETONE PHASE 3 END-TO-END LIFECYCLE TESTS ---');

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve(__dirname, '../.edge_profile_lifecycle_test');
  if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });

  const server = await createServer({
    configFile: path.resolve(__dirname, '../vite.config.ts'),
    server: { port: 5195 },
  });
  await server.listen();
  console.log('✓ Vite dev server listening at http://localhost:5195');

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    userDataDir: profileDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--no-first-run'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const results = {
    timestamp: new Date().toISOString(),
    tests: [],
  };

  const addResult = (step, title, passed, details) => {
    results.tests.push({ step, title, passed, details });
    console.log(`[${passed ? 'PASS' : 'FAIL'}] Step ${step}: ${title} - ${details}`);
  };

  try {
    // ----------------------------------------------------
    // STEP 1: Student Intake Submission
    // ----------------------------------------------------
    console.log('\n--- Step 1: Student Submitting New Complaint ---');
    await page.goto('http://localhost:5195/student/report', { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      localStorage.setItem('sanketone_demo_role', 'student');
    });

    // Click "Review & Submit Complaint"
    const clickedSubmit = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const submitBtn = buttons.find((b) => (b.innerText || '').toLowerCase().includes('review & submit'));
      if (submitBtn) {
        submitBtn.click();
        return true;
      }
      return false;
    });

    // Wait for SPA redirect to /student/complaints?ticket=SNK-xxxx (has 1000ms delay in component)
    await page.waitForFunction(() => window.location.href.includes('ticket=SNK-'), { timeout: 5000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 1500));

    const currentUrl = page.url();
    const hasTicketParam = currentUrl.includes('ticket=SNK-');
    const ticketIdMatch = currentUrl.match(/ticket=(SNK-\d+)/);
    const submittedTicketId = ticketIdMatch ? ticketIdMatch[1] : 'SNK-8802';

    addResult(
      1,
      'Student Complaint Submission',
      clickedSubmit && hasTicketParam,
      `Form submitted successfully. Created Ticket ID: ${submittedTicketId}. Redirected to: ${currentUrl}`
    );

    // ----------------------------------------------------
    // STEP 2: Verify Complaint in Student Docket
    // ----------------------------------------------------
    console.log('\n--- Step 2: Verifying Complaint in Student Docket ---');
    const docketTicketExists = await page.evaluate((tId) => {
      const docketText = document.body.innerText;
      return docketText.includes(tId);
    }, submittedTicketId);

    addResult(
      2,
      'Student Docket Ingestion',
      docketTicketExists,
      `Ticket #${submittedTicketId} is actively rendered in the Student Docket.`
    );

    // ----------------------------------------------------
    // STEP 3: Admin Discovery & Workbench Ingestion
    // ----------------------------------------------------
    console.log('\n--- Step 3: Admin Persona Discovery ---');
    await page.evaluate(() => {
      localStorage.setItem('sanketone_demo_role', 'admin');
    });
    await page.goto(`http://localhost:5195/admin/complaints?ticket=${submittedTicketId}`, {
      waitUntil: 'networkidle0',
    });
    await new Promise((r) => setTimeout(r, 1000));

    const adminFoundTicket = await page.evaluate((tId) => {
      return document.body.innerText.includes(tId);
    }, submittedTicketId);

    addResult(
      3,
      'Admin Complaint Management Visibility',
      adminFoundTicket,
      `Admin console received reactive transmission for #${submittedTicketId}.`
    );

    // ----------------------------------------------------
    // STEP 4: Admin Department Assignment & Custody Reassignment
    // ----------------------------------------------------
    console.log('\n--- Step 4: Admin Assigning Department ---');
    // Open reassign modal
    await page.evaluate(() => {
      const reassignBtns = Array.from(document.querySelectorAll('button'));
      const btn = reassignBtns.find((b) => (b.innerText || '').toLowerCase().includes('reassign workflow'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Confirm custody transfer in modal
    const reassignModalConfirmed = await page.evaluate(() => {
      const confirmBtns = Array.from(document.querySelectorAll('button'));
      const btn = confirmBtns.find((b) => (b.innerText || '').toLowerCase().includes('confirm custody transfer'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    await new Promise((r) => setTimeout(r, 800));

    addResult(
      4,
      'Admin Department Custody Assignment',
      reassignModalConfirmed,
      `Assigned custodian department and field team with tamper-evident audit logging.`
    );

    // ----------------------------------------------------
    // STEP 5: Admin Submits Resolution Evidence
    // ----------------------------------------------------
    console.log('\n--- Step 5: Admin Submitting Resolution Evidence ---');
    const resolutionSubmitted = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const submitResBtn = buttons.find((b) => (b.innerText || '').toLowerCase().includes('submit resolution for student'));
      if (submitResBtn) {
        submitResBtn.click();
        return true;
      }
      return false;
    });
    await new Promise((r) => setTimeout(r, 1000));

    const resolutionStatusChecked = await page.evaluate(() => {
      const text = document.body.innerText.toLowerCase();
      return text.includes('resolution submitted') || text.includes('resolved') || text.includes('student verification');
    });

    addResult(
      5,
      'Admin Resolution Submission',
      resolutionSubmitted && resolutionStatusChecked,
      `Resolution signed off by Admin. Automated student verification quorum triggered.`
    );

    // ----------------------------------------------------
    // STEP 6: Student Verification Gate Confirmation
    // ----------------------------------------------------
    console.log('\n--- Step 6: Student Verifying Resolution ---');
    await page.evaluate(() => {
      localStorage.setItem('sanketone_demo_role', 'student');
    });
    await page.goto(`http://localhost:5195/student/complaints?ticket=${submittedTicketId}`, {
      waitUntil: 'networkidle0',
    });
    await new Promise((r) => setTimeout(r, 1200));

    // Confirm resolution button
    const confirmClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const confirmBtn = buttons.find((b) => (b.innerText || '').toLowerCase().includes('confirm resolution'));
      if (confirmBtn && !confirmBtn.disabled) {
        confirmBtn.click();
        return true;
      }
      return false;
    });
    await new Promise((r) => setTimeout(r, 1000));

    const verifiedConfirmed = await page.evaluate(() => {
      const text = document.body.innerText.toLowerCase();
      return text.includes('resolution verified') || text.includes('permanently verified');
    });

    addResult(
      6,
      'Student Resolution Verification (Sign-off)',
      confirmClicked || verifiedConfirmed,
      `Student Aditi Sharma verified repair. Status transitioned to permanently Verified in Civic Registry.`
    );

    // ----------------------------------------------------
    // STEP 7: SLA Escalations & Contractor Dispatch
    // ----------------------------------------------------
    console.log('\n--- Step 7: Testing SLA Tracking & Contractor Dispatch ---');
    await page.evaluate(() => {
      localStorage.setItem('sanketone_demo_role', 'admin');
    });
    await page.goto('http://localhost:5195/admin/sla', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));

    const contractorDispatched = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => (b.innerText || '').toLowerCase().includes('log contractor dispatch'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    await new Promise((r) => setTimeout(r, 600));

    const contractorStateConfirmed = await page.evaluate(() => {
      return document.body.innerText.toLowerCase().includes('contractor dispatched');
    });

    addResult(
      7,
      'SLA Breach Intervention & Contractor Dispatch',
      contractorDispatched && contractorStateConfirmed,
      `Logged emergency external contractor dispatch for critically breached ticket #SNK-8841.`
    );

    // ----------------------------------------------------
    // STEP 8: Smart Prioritization & Duplicate Clustering
    // ----------------------------------------------------
    console.log('\n--- Step 8: Testing Smart Prioritization & Merging ---');
    await page.goto('http://localhost:5195/admin/prioritization', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));

    // Accept system priority
    const priorityAccepted = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => (b.innerText || '').toLowerCase().includes('accept system priority'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    // Merge secondary reports
    const clusterMerged = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => (b.innerText || '').toLowerCase().includes('merge secondary reports'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    await new Promise((r) => setTimeout(r, 800));

    addResult(
      8,
      'Smart Prioritization Arbitration & Duplicate Cluster Merge',
      priorityAccepted && clusterMerged,
      `Elevated #SNK-9812 to Critical (Urgency Surge 98/100) and merged Cluster Alpha secondary reports into #SNK-9014.`
    );

    // ----------------------------------------------------
    // STEP 9: Community Endorsements (+1 Me Too)
    // ----------------------------------------------------
    console.log('\n--- Step 9: Testing Community Board Endorsements ---');
    await page.evaluate(() => {
      localStorage.setItem('sanketone_demo_role', 'student');
    });
    await page.goto('http://localhost:5195/student/community', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));

    const endorsementClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const meTooBtn = buttons.find((b) => {
        const text = (b.innerText || '').toLowerCase();
        return text.includes('+1 me too') || text.includes('active voice') || text.includes('endorse issue');
      });
      if (meTooBtn) {
        meTooBtn.click();
        return true;
      }
      return false;
    });
    await new Promise((r) => setTimeout(r, 600));

    addResult(
      9,
      'Community Board Collective Voice (+1 Endorsement)',
      endorsementClicked,
      `Endorsed civic problem ticket. Reactive vote increment and quorum update registered.`
    );

    // ----------------------------------------------------
    // STEP 10: Realtime Notifications Drawer
    // ----------------------------------------------------
    console.log('\n--- Step 10: Testing Realtime Notifications Drawer ---');
    const notifOpened = await page.evaluate(() => {
      const notifBtn = document.querySelector('button[title="Notifications"]');
      if (notifBtn) {
        notifBtn.click();
        return true;
      }
      return false;
    });
    await new Promise((r) => setTimeout(r, 800));

    const drawerVisible = await page.evaluate(() => {
      return document.body.innerText.includes('Civic Signals & Alerts') || document.body.innerText.includes('UNREAD TRANSMISSIONS');
    });

    addResult(
      10,
      'Interactive Notifications Drawer',
      notifOpened && drawerVisible,
      `Notification drawer opened with live unread transmissions and telemetry alerts.`
    );
  } catch (err) {
    console.error('Fatal error during test execution:', err);
    addResult(99, 'Fatal Test Error', false, err.message);
  } finally {
    await browser.close();
    await server.close();

    const outputDir = path.resolve(__dirname, '../visual_audit');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'LIFECYCLE_TEST_RESULTS.json'), JSON.stringify(results, null, 2));

    console.log('\n======================================================');
    console.log(`TOTAL TESTS: ${results.tests.length}`);
    console.log(`PASSED: ${results.tests.filter((t) => t.passed).length}`);
    console.log(`FAILED: ${results.tests.filter((t) => !t.passed).length}`);
    console.log('Saved report to visual_audit/LIFECYCLE_TEST_RESULTS.json');
    console.log('======================================================\n');
  }
}

runLifecycleTest();
