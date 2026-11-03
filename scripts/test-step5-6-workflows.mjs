#!/usr/bin/env node

/**
 * ============================================================================
 * SANKETONE — STEP 5 & 6 ADMIN WORKFLOWS & ENDORSEMENTS VERIFICATION SUITE
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp as initAdminApp, getApps as getAdminApps } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

import {
  createComplaint,
  endorseComplaint,
  updateComplaintStatus,
  assignDepartment,
  addInternalNote,
  processSlaEscalations,
} from '../functions/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runStep5And6Suite() {
  console.log('================================================================');
  console.log('   SANKETONE — STEP 5 & 6: ADMIN WORKFLOWS & ENDORSEMENT SUITE  ');
  console.log('================================================================\n');

  const projectId = 'sanketone-dev';
  const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';
  const firestoreHost = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';

  const adminApp =
    getAdminApps().length === 0
      ? initAdminApp({ projectId })
      : getAdminApps()[0];

  const adminAuth = getAdminAuth(adminApp);
  const adminDb = getAdminFirestore(adminApp);

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    tests: [],
  };

  const recordResult = (id, description, passed, details = '') => {
    results.total++;
    if (passed) {
      results.passed++;
      console.log(`[PASS] Test ${id}: ${description}`);
    } else {
      results.failed++;
      console.error(`[FAIL] Test ${id}: ${description} - ${details}`);
    }
    results.tests.push({ id, description, passed, details });
  };

  try {
    // 1. Seed accounts
    const s1Email = `s1_step5_${Date.now()}@campus.edu`;
    const s2Email = `s2_step5_${Date.now()}@campus.edu`;
    const admEmail = `adm_step5_${Date.now()}@campus.edu`;
    const password = 'TestPassword123!';

    const s1 = await adminAuth.createUser({ email: s1Email, password, displayName: 'Aditi Sharma' });
    const s2 = await adminAuth.createUser({ email: s2Email, password, displayName: 'Rahul Verma' });
    const adm = await adminAuth.createUser({ email: admEmail, password, displayName: 'Dr. Sunita Menon' });
    await adminAuth.setCustomUserClaims(adm.uid, { role: 'admin', admin: true });

    await adminDb.collection('users').doc(s1.uid).set({ uid: s1.uid, email: s1Email, fullName: 'Aditi Sharma', role: 'student' });
    await adminDb.collection('users').doc(s2.uid).set({ uid: s2.uid, email: s2Email, fullName: 'Rahul Verma', role: 'student' });
    await adminDb.collection('users').doc(adm.uid).set({ uid: adm.uid, email: admEmail, fullName: 'Dr. Sunita Menon', role: 'admin' });

    // 2. Create base complaint by Student 1
    const createRes = await createComplaint.run({
      data: {
        title: 'Water filter leaking on 2nd floor library reading room',
        description: 'Persistent puddle spreading across linoleum floor near server stacks.',
        category: 'Infrastructure',
        locationZone: 'Central Library',
        priority: 'high',
      },
      auth: { uid: s1.uid, token: { email: s1Email, name: 'Aditi Sharma' } },
    });
    const complaintId = createRes.complaintId;
    recordResult('5.1', 'Baseline complaint created for workflow testing', !!complaintId);

    // =========================================================================
    // SECTION 1: Endorsements (+1 Me Too)
    // =========================================================================
    console.log('--- SECTION 1: Endorsements (+1 Me Too) ---');

    // 1.1 Author cannot endorse own complaint
    let selfEndorseBlocked = false;
    try {
      await endorseComplaint.run({
        data: { complaintId },
        auth: { uid: s1.uid, token: { email: s1Email } },
      });
    } catch (err) {
      selfEndorseBlocked = err.code === 'invalid-argument';
    }
    recordResult('5.2', 'Student CANNOT endorse their own complaint', selfEndorseBlocked);

    // 1.2 Student 2 endorses complaint successfully
    const endorseRes = await endorseComplaint.run({
      data: { complaintId },
      auth: { uid: s2.uid, token: { email: s2Email } },
    });
    recordResult('5.3', 'Peer student can endorse complaint (+1 vote registered)', endorseRes.success && endorseRes.endorsementsCount === 1);

    // 1.3 Double endorsement is idempotent
    const reEndorseRes = await endorseComplaint.run({
      data: { complaintId },
      auth: { uid: s2.uid, token: { email: s2Email } },
    });
    recordResult('5.4', 'Duplicate endorsement attempt is idempotent (no duplicate count)', reEndorseRes.alreadyEndorsed === true);

    // =========================================================================
    // SECTION 2: Admin Workflows & Lifecycle Transitions
    // =========================================================================
    console.log('\n--- SECTION 2: Admin Workflows & Lifecycle Transitions ---');

    // 2.1 Admin reassigns department & technician
    const assignRes = await assignDepartment.run({
      data: {
        complaintId,
        departmentId: 'ESTATES',
        departmentName: 'Campus Estates & Works',
        technicianName: 'Rajesh Kumar (Badge #EST-042)',
        priority: 'critical',
      },
      auth: { uid: adm.uid, token: { email: admEmail, role: 'admin', admin: true } },
    });
    recordResult('5.5', 'Admin successfully reassigns department and technician', assignRes.success);

    // 2.2 Admin transitions status to 'in_progress'
    const progressRes = await updateComplaintStatus.run({
      data: { complaintId, newStatus: 'in_progress', noteText: 'Technician dispatched to shut isolation valve.' },
      auth: { uid: adm.uid, token: { email: admEmail, role: 'admin', admin: true } },
    });
    recordResult('5.6', 'Admin transitions complaint to in_progress', progressRes.success);

    // 2.3 Non-admin CANNOT transition complaint to 'resolved'
    let studentResolveBlocked = false;
    try {
      await updateComplaintStatus.run({
        data: { complaintId, newStatus: 'resolved' },
        auth: { uid: s2.uid, token: { email: s2Email } },
      });
    } catch (err) {
      studentResolveBlocked = err.code === 'permission-denied';
    }
    recordResult('5.7', 'Unauthorized student cannot transition status to resolved', studentResolveBlocked);

    // 2.4 Admin transitions status to 'resolved' with proof
    const resolveRes = await updateComplaintStatus.run({
      data: {
        complaintId,
        newStatus: 'resolved',
        resolutionSummary: 'Fitted replacement stainless isolation valve and dried floor.',
      },
      auth: { uid: adm.uid, token: { email: admEmail, role: 'admin', admin: true } },
    });
    recordResult('5.8', 'Admin transitions complaint to resolved with resolution summary', resolveRes.success);

    // 2.5 Author student verifies resolution
    const verifyRes = await updateComplaintStatus.run({
      data: { complaintId, newStatus: 'verified', noteText: 'Verified on site: floor is dry, valve fixed.' },
      auth: { uid: s1.uid, token: { email: s1Email } },
    });
    recordResult('5.9', 'Complainant author successfully marks complaint as verified', verifyRes.success);

    // 2.6 Admin confidential internal notes
    const noteRes = await addInternalNote.run({
      data: { complaintId, noteText: 'Audit note: Valve corrosion was due to low-grade brass fitting from 2024 batch.' },
      auth: { uid: adm.uid, token: { email: admEmail, role: 'admin', admin: true } },
    });
    recordResult('5.10', 'Admin adds confidential internal note to ticket', noteRes.success);

    // =========================================================================
    // SECTION 3: SLA Escalation Processing
    // =========================================================================
    console.log('\n--- SECTION 3: SLA Escalation Processing ---');

    // Seed a breached complaint in past
    const pastDate = new Date(Date.now() - 3600 * 1000 * 48).toISOString();
    const breachedComplaintRef = adminDb.collection('complaints').doc();
    await breachedComplaintRef.set({
      id: breachedComplaintRef.id,
      ticketId: 'SNK-2026-BREACH01',
      studentId: s1.uid,
      title: 'Overdue Power Outage in CS Server Room',
      category: 'Infrastructure',
      status: 'in_progress',
      isBreached: false,
      slaTargetTimestamp: pastDate,
      createdAt: adminDb.constructor.FieldValue ? adminDb.constructor.FieldValue.serverTimestamp() : new Date(),
    });

    const slaRes = await processSlaEscalations.run({});
    const breachedDocSnap = await breachedComplaintRef.get();
    const isMarkedBreached = breachedDocSnap.data()?.isBreached === true;
    recordResult('5.11', 'SLA escalation engine automatically detects and marks overdue complaints', slaRes.success && isMarkedBreached);

  } catch (err) {
    console.error('[UNCAUGHT ERROR]', err);
  }

  console.log('\n================================================================');
  console.log(`   STEP 5 & 6 TEST SUMMARY: ${results.passed} / ${results.total} PASSED (${results.failed} FAILED)`);
  console.log('================================================================\n');

  try {
    const reportPath = path.resolve('visual_audit', 'STEP_5_6_TEST_RESULTS.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf8');
    console.log(`[ARTIFACT] Test report written to: ${reportPath}`);
  } catch (saveErr) {
    console.warn('Could not write test artifact:', saveErr);
  }

  if (results.failed > 0) process.exit(1);
  else process.exit(0);
}

runStep5And6Suite();
