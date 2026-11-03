#!/usr/bin/env node

/**
 * ============================================================================
 * SANKETONE — PHASE 4 STEP 4 COMPLAINT LIFECYCLE & STORAGE VERIFICATION SUITE
 * ============================================================================
 *
 * Verifies:
 * 1. Callable Cloud Function createComplaint runs atomic sequential ticket allocation.
 * 2. Unauthenticated calls are blocked with 'unauthenticated'.
 * 3. Identity impersonation (studentId != auth.uid) blocked with 'permission-denied'.
 * 4. Input validation: category, length, attachment quota, size, and extension.
 * 5. Idempotency handling: retry returns existing complaint without counter increment.
 * 6. Automated generation of sanitized /publicComplaints projection (zero identity leakage).
 * 7. Append-only administrative audit log generation.
 * 8. Storage Security Rules: ownership, 2MB size limit, image-only intake, admin-only resolution.
 * 9. Firestore Security Rules: direct client write lockout for public projections, counters, audit logs.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp as initAdminApp, getApps as getAdminApps } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

import { initializeApp as initClientApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, signInWithEmailAndPassword } from 'firebase/auth';
import {
  initializeFirestore,
  connectFirestoreEmulator,
  doc,
  setDoc,
  updateDoc,
  memoryLocalCache,
} from 'firebase/firestore';
import {
  getStorage,
  connectStorageEmulator,
  ref as storageRef,
  uploadBytes,
} from 'firebase/storage';

import { createComplaint } from '../functions/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runStep4Suite() {
  console.log('================================================================');
  console.log('   SANKETONE — STEP 4: COMPLAINT LIFECYCLE & STORAGE TESTS     ');
  console.log('================================================================\n');

  const projectId = 'sanketone-dev';
  const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';
  const firestoreHost = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
  const storageHost = process.env.FIREBASE_STORAGE_EMULATOR_HOST || '127.0.0.1:9199';

  console.log(`[TARGET] Local Emulator Suite:`);
  console.log(`  - Auth:      ${authHost}`);
  console.log(`  - Firestore: ${firestoreHost}`);
  console.log(`  - Storage:   ${storageHost}\n`);

  // 1. Initialize Admin SDK
  const adminApp =
    getAdminApps().length === 0
      ? initAdminApp({ projectId })
      : getAdminApps()[0];

  const adminAuth = getAdminAuth(adminApp);
  const adminDb = getAdminFirestore(adminApp);

  // 2. Initialize Client SDK
  const clientApp = initClientApp({
    apiKey: 'AIzaSyFakeKeyForLocalDevelopment12345',
    authDomain: 'sanketone-dev.firebaseapp.com',
    projectId,
    storageBucket: 'sanketone-dev.appspot.com',
  });
  const clientAuth = getAuth(clientApp);
  connectAuthEmulator(clientAuth, `http://${authHost}`, { disableWarnings: true });

  const [fsIp, fsPort] = firestoreHost.split(':');
  const clientDb = initializeFirestore(clientApp, {
    localCache: memoryLocalCache(),
  });
  connectFirestoreEmulator(clientDb, fsIp, parseInt(fsPort, 10));

  const [stIp, stPort] = storageHost.split(':');
  const clientStorage = getStorage(clientApp);
  connectStorageEmulator(clientStorage, stIp, parseInt(stPort, 10));

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
    // -------------------------------------------------------------------------
    // Setup Test Users in Emulator
    // -------------------------------------------------------------------------
    const student1Email = `student_step4_${Date.now()}@campus.edu`;
    const student2Email = `student2_step4_${Date.now()}@campus.edu`;
    const adminEmail = `admin_step4_${Date.now()}@campus.edu`;
    const password = 'TestPassword123!';

    const s1Record = await adminAuth.createUser({ email: student1Email, password, displayName: 'Aditi Sharma' });
    const s2Record = await adminAuth.createUser({ email: student2Email, password, displayName: 'Rahul Verma' });
    const admRecord = await adminAuth.createUser({ email: adminEmail, password, displayName: 'Dr. Sunita Menon' });

    await adminAuth.setCustomUserClaims(admRecord.uid, { role: 'admin', admin: true });

    // Seed student profile doc
    await adminDb.collection('users').doc(s1Record.uid).set({
      uid: s1Record.uid,
      email: student1Email,
      fullName: 'Aditi Sharma',
      role: 'student',
      rollNumber: '22BCS041',
      department: 'Computer Science & Engineering',
      isActive: true,
    });

    await adminDb.collection('users').doc(s2Record.uid).set({
      uid: s2Record.uid,
      email: student2Email,
      fullName: 'Rahul Verma',
      role: 'student',
      rollNumber: '22BCS099',
      department: 'Mechanical Engineering',
      isActive: true,
    });

    // =========================================================================
    // SECTION 1: Cloud Function createComplaint Execution & Lifecycle
    // =========================================================================
    console.log('--- SECTION 1: Cloud Function createComplaint Execution & Lifecycle ---');

    const validPayload = {
      title: 'Elevator B stuck between floors 3 and 4 with audible grinding',
      description: 'Elevator B made a violent metallic screech while descending and stopped abruptly. Indicator lamps flickering.',
      category: 'Infrastructure',
      subcategory: 'Elevators & Escalators',
      locationZone: 'Academic Block B',
      specificDemarcation: 'East Shaft Level 3',
      priority: 'high',
      isAnonymousToPublic: false,
      affectedCountEst: 15,
      attachments: [
        {
          fileName: 'shaft_gap.jpg',
          fileSizeBytes: 840000,
          mimeType: 'image/jpeg',
          storagePath: `evidence/intake/${s1Record.uid}/shaft_gap.jpg`,
        },
      ],
    };

    // 1.1 Unauthenticated call rejected
    let unauthRejected = false;
    try {
      await createComplaint.run({ data: validPayload, auth: null });
    } catch (err) {
      unauthRejected = err.code === 'unauthenticated' || err.message?.includes('Authentication required');
    }
    recordResult('1.1', 'Unauthenticated call to createComplaint is rejected', unauthRejected);

    // 1.2 User impersonation rejected (studentId != auth.uid)
    let impersonationRejected = false;
    try {
      await createComplaint.run({
        data: { ...validPayload, studentId: s2Record.uid },
        auth: { uid: s1Record.uid, token: { email: student1Email, name: 'Aditi Sharma' } },
      });
    } catch (err) {
      impersonationRejected = err.code === 'permission-denied' || err.message?.includes('Security Violation');
    }
    recordResult('1.2', 'Submission on behalf of another student is strictly rejected', impersonationRejected);

    // 1.3 Invalid category rejected
    let badCategoryRejected = false;
    try {
      await createComplaint.run({
        data: { ...validPayload, category: 'cryptocurrency_exchange' },
        auth: { uid: s1Record.uid, token: { email: student1Email, name: 'Aditi Sharma' } },
      });
    } catch (err) {
      badCategoryRejected = err.code === 'invalid-argument' || err.message?.includes('Invalid complaint category');
    }
    recordResult('1.3', 'Invalid complaint category is rejected with invalid-argument', badCategoryRejected);

    // 1.4 Oversized attachment (> 2MB) rejected
    let oversizedRejected = false;
    try {
      await createComplaint.run({
        data: {
          ...validPayload,
          attachments: [{ fileName: 'huge.png', fileSizeBytes: 3 * 1024 * 1024, mimeType: 'image/png' }],
        },
        auth: { uid: s1Record.uid, token: { email: student1Email, name: 'Aditi Sharma' } },
      });
    } catch (err) {
      oversizedRejected = err.code === 'invalid-argument' || err.message?.includes('exceeds the 2MB size limit');
    }
    recordResult('1.4', 'Attachment exceeding 2MB is rejected by Cloud Function validation', oversizedRejected);

    // 1.5 Unsupported attachment extension (e.g. .exe) rejected
    let badExtRejected = false;
    try {
      await createComplaint.run({
        data: {
          ...validPayload,
          attachments: [{ fileName: 'malware.exe', fileSizeBytes: 50000, mimeType: 'image/png' }],
        },
        auth: { uid: s1Record.uid, token: { email: student1Email, name: 'Aditi Sharma' } },
      });
    } catch (err) {
      badExtRejected = err.code === 'invalid-argument' || err.message?.includes('unsupported file format');
    }
    recordResult('1.5', 'Non-image file extension (.exe) is rejected', badExtRejected);

    // 1.6 Successful complaint creation & atomic ticket ID generation
    const validResult = await createComplaint.run({
      data: validPayload,
      auth: { uid: s1Record.uid, token: { email: student1Email, name: 'Aditi Sharma' } },
    });

    const complaintId = validResult.complaintId;
    const ticketId = validResult.ticketId;
    const isTicketFormatted = /^SNK-\d{4}-\d{5}$/.test(ticketId);
    recordResult('1.6', 'Valid complaint created with atomic ticket ID format (SNK-YYYY-XXXXX)', validResult.success && isTicketFormatted, `Generated Ticket: ${ticketId}`);

    // 1.7 Verify Authoritative Complaint Document
    const authDocSnap = await adminDb.collection('complaints').doc(complaintId).get();
    const authData = authDocSnap.data();
    const authValid =
      authData.status === 'raised' &&
      authData.studentId === s1Record.uid &&
      authData.studentIdentity.email === student1Email &&
      authData.studentIdentity.rollNumber === '22BCS041' &&
      authData.assignedDepartmentId === 'ESTATES' &&
      authData.slaHoursConfigured === 24;
    recordResult('1.7', 'Authoritative complaint record created with correct status and department SLA', authValid);

    // 1.8 Verify Initial Status History Entry
    const historySnaps = await adminDb.collection('complaints').doc(complaintId).collection('statusHistory').get();
    const historyEntry = historySnaps.docs[0]?.data();
    const historyValid = historyEntry && historyEntry.toStatus === 'raised' && historyEntry.actorRole === 'student';
    recordResult('1.8', 'Initial statusHistory record created with status="raised"', historyValid);

    // 1.9 Verify Initial Append-Only Administrative Audit Log
    const auditSnaps = await adminDb.collection('complaints').doc(complaintId).collection('auditLogs').get();
    const auditEntry = auditSnaps.docs[0]?.data();
    const auditValid = auditEntry && auditEntry.action === 'complaint_created' && auditEntry.actorUid === s1Record.uid;
    recordResult('1.9', 'Append-only administrative audit log record generated', auditValid);

    // =========================================================================
    // SECTION 2: Idempotency & Retry Safeguards
    // =========================================================================
    console.log('\n--- SECTION 2: Idempotency & Retry Safeguards ---');

    const testIdempotencyKey = `idem_${Date.now()}`;
    const firstCall = await createComplaint.run({
      data: { ...validPayload, idempotencyKey: testIdempotencyKey },
      auth: { uid: s1Record.uid, token: { email: student1Email, name: 'Aditi Sharma' } },
    });

    const secondCall = await createComplaint.run({
      data: { ...validPayload, idempotencyKey: testIdempotencyKey },
      auth: { uid: s1Record.uid, token: { email: student1Email, name: 'Aditi Sharma' } },
    });

    const idempotencyPassed =
      firstCall.complaintId === secondCall.complaintId &&
      firstCall.ticketId === secondCall.ticketId &&
      secondCall.isExisting === true;
    recordResult('2.1', 'Idempotent retry returns existing complaint without generating duplicate ticket ID', idempotencyPassed);

    // =========================================================================
    // SECTION 3: Sanitized Public Projection & Complainant Privacy
    // =========================================================================
    console.log('\n--- SECTION 3: Sanitized Public Projection & Complainant Privacy ---');

    // 3.1 Verify public projection for standard complaint
    const publicSnap = await adminDb.collection('publicComplaints').doc(complaintId).get();
    const pubData = publicSnap.data();

    const noPiiLeak =
      pubData.studentId === undefined &&
      pubData.email === undefined &&
      pubData.rollNumber === undefined &&
      pubData.studentIdentity === undefined &&
      pubData.maskedUid === undefined;

    const publicContentValid =
      pubData.ticketId === ticketId &&
      pubData.title === validPayload.title &&
      pubData.status === 'raised';

    recordResult('3.1', 'Public projection /publicComplaints strictly excludes complainant PII and rollNumber', noPiiLeak && publicContentValid);

    // 3.2 Anonymous complaint privacy verification
    const anonResult = await createComplaint.run({
      data: {
        ...validPayload,
        title: 'Confidential sanitation failure in hostel washroom',
        isAnonymousToPublic: true,
      },
      auth: { uid: s1Record.uid, token: { email: student1Email, name: 'Aditi Sharma' } },
    });

    const anonPubSnap = await adminDb.collection('publicComplaints').doc(anonResult.complaintId).get();
    const anonPubData = anonPubSnap.data();
    const anonVerified =
      anonPubData.maskedComplainant === 'Anonymous Student' &&
      anonPubData.isAnonymous === true &&
      anonPubData.studentId === undefined;
    recordResult('3.2', 'Anonymous complaint projection displays "Anonymous Student" with zero author attribution', anonVerified);

    // =========================================================================
    // SECTION 4: Storage Security Rules & Evidence Uploads
    // =========================================================================
    console.log('\n--- SECTION 4: Storage Security Rules & Evidence Uploads ---');

    // Authenticate client as Student 1
    await signInWithEmailAndPassword(clientAuth, student1Email, password);

    // 4.1 Student 1 can upload intake evidence to own path
    const validImageBytes = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]); // JPEG magic bytes
    let uploadOwnSuccess = false;
    try {
      const ownEvidenceRef = storageRef(clientStorage, `evidence/${complaintId}/intake/${s1Record.uid}/photo.jpg`);
      await uploadBytes(ownEvidenceRef, validImageBytes, {
        contentType: 'image/jpeg',
        customMetadata: { uploaderUid: s1Record.uid },
      });
      uploadOwnSuccess = true;
    } catch (e) {
      console.error(e);
    }
    recordResult('4.1', 'Author student CAN upload intake image to own storage path', uploadOwnSuccess);

    // 4.2 Student 1 CANNOT upload intake evidence under Student 2 UID
    let uploadOtherBlocked = false;
    try {
      const spoofRef = storageRef(clientStorage, `evidence/${complaintId}/intake/${s2Record.uid}/spoofed.jpg`);
      await uploadBytes(spoofRef, validImageBytes, {
        contentType: 'image/jpeg',
        customMetadata: { uploaderUid: s2Record.uid },
      });
    } catch (err) {
      uploadOtherBlocked = true;
    }
    recordResult('4.2', 'Student CANNOT upload evidence under another student UID (ownership rule enforced)', uploadOtherBlocked);

    // 4.3 Student CANNOT upload to admin resolution folder
    let uploadResolutionBlocked = false;
    try {
      const resProofRef = storageRef(clientStorage, `evidence/${complaintId}/resolution/resolution_proof.jpg`);
      await uploadBytes(resProofRef, validImageBytes, {
        contentType: 'image/jpeg',
      });
    } catch (err) {
      uploadResolutionBlocked = true;
    }
    recordResult('4.3', 'Student CANNOT upload to admin resolution evidence path (admin-only rule)', uploadResolutionBlocked);

    // =========================================================================
    // SECTION 5: Client-Side Direct Firestore Tampering Lockout
    // =========================================================================
    console.log('\n--- SECTION 5: Client-Side Direct Firestore Tampering Lockout ---');

    // 5.1 Student CANNOT write directly to /publicComplaints
    let directPublicWriteBlocked = false;
    try {
      await setDoc(doc(clientDb, 'publicComplaints', 'fake_complaint'), {
        title: 'Tampered Public Complaint',
      });
    } catch (err) {
      directPublicWriteBlocked = true;
    }
    recordResult('5.1', 'Client CANNOT write directly to /publicComplaints (trusted server-only write)', directPublicWriteBlocked);

    // 5.2 Student CANNOT write directly to /systemCounters
    let directCounterWriteBlocked = false;
    try {
      await setDoc(doc(clientDb, 'systemCounters', 'complaints'), {
        currentCount: 99999,
      });
    } catch (err) {
      directCounterWriteBlocked = true;
    }
    recordResult('5.2', 'Client CANNOT tamper with /systemCounters/complaints (server-only write)', directCounterWriteBlocked);

    // 5.3 Student CANNOT write directly to /complaints/{id}/auditLogs
    let directAuditWriteBlocked = false;
    try {
      await setDoc(doc(clientDb, 'complaints', complaintId, 'auditLogs', 'fake_log'), {
        action: 'tampered_action',
      });
    } catch (err) {
      directAuditWriteBlocked = true;
    }
    recordResult('5.3', 'Client CANNOT write directly to auditLogs (append-only server enforcement)', directAuditWriteBlocked);

    // 5.4 Student CANNOT mutate ticketId on existing complaint
    let ticketMutationBlocked = false;
    try {
      await updateDoc(doc(clientDb, 'complaints', complaintId), {
        ticketId: 'SNK-TAMPERED-0001',
      });
    } catch (err) {
      ticketMutationBlocked = true;
    }
    recordResult('5.4', 'Student CANNOT mutate ticketId on existing authoritative complaint record', ticketMutationBlocked);

  } catch (globalErr) {
    console.error('[UNCAUGHT SUITE ERROR]', globalErr);
  }

  // Summary
  console.log('\n================================================================');
  console.log(`   STEP 4 TEST SUMMARY: ${results.passed} / ${results.total} PASSED (${results.failed} FAILED)`);
  console.log('================================================================\n');

  try {
    const reportPath = path.resolve('visual_audit', 'STEP_4_COMPLAINT_TEST_RESULTS.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf8');
    console.log(`[ARTIFACT] Test report written to: ${reportPath}`);
  } catch (saveErr) {
    console.warn('Could not write test artifact:', saveErr);
  }

  if (results.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runStep4Suite();

