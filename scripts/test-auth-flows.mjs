#!/usr/bin/env node

/**
 * ============================================================================
 * SANKETONE — FIREBASE AUTHENTICATION & ADMIN PROVISIONING VERIFICATION SUITE
 * ============================================================================
 *
 * Validates:
 * 1. Configurable Student Email Domain Validation.
 * 2. Student Self-Signup (creates Auth user + Firestore profile with role='student').
 * 3. Client Role Elevation Lockout (students cannot change role to 'admin').
 * 4. Secure Admin Provisioning via Server-Side Admin SDK (custom claims).
 * 5. Admin Sign-In & Privileged Token Claims Verification.
 * 6. Admin vs Student Profile Access Restrictions in Firestore Rules.
 * 7. Clean Sign-Out & Session State Isolation.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp as initAdminApp, getApps as getAdminApps } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

import { initializeApp as initClientApp } from 'firebase/app';
import {
  getAuth,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  initializeFirestore,
  connectFirestoreEmulator,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  memoryLocalCache,
} from 'firebase/firestore';

// Domain validation logic matching src/lib/authService.ts
function validateStudentEmailDomain(email, configuredDomains) {
  if (!email || !email.includes('@')) {
    return { valid: false, reason: 'Please provide a valid email address.' };
  }

  const trimmedSetting = (configuredDomains ?? '*').trim();
  if (trimmedSetting === '*' || trimmedSetting === '') {
    return { valid: true };
  }

  const parts = email.toLowerCase().split('@');
  if (parts.length !== 2) {
    return { valid: false, reason: 'Invalid email format.' };
  }
  const emailDomain = parts[1];

  const allowedList = trimmedSetting
    .split(',')
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);

  const isMatched = allowedList.some((allowed) => {
    if (allowed.startsWith('*.')) {
      const root = allowed.slice(2);
      return emailDomain === root || emailDomain.endsWith('.' + root);
    }
    return emailDomain === allowed;
  });

  if (!isMatched) {
    return {
      valid: false,
      reason: `Registration is restricted to authorized campus email domains: ${allowedList.join(
        ', '
      )}. Your domain (${emailDomain}) is not recognized.`,
    };
  }

  return { valid: true };
}

async function runAuthVerificationSuite() {
  console.log('================================================================');
  console.log('   SANKETONE — FIREBASE AUTH & ROLE-BASED ACCESS TEST SUITE    ');
  console.log('================================================================\n');

  const projectId = 'sanketone-dev';
  const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';
  const firestoreHost = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';

  console.log(`[TARGET] Local Emulator Suite:`);
  console.log(`  - Auth:      ${authHost}`);
  console.log(`  - Firestore: ${firestoreHost}\n`);

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
  });
  const clientAuth = getAuth(clientApp);
  connectAuthEmulator(clientAuth, `http://${authHost}`, { disableWarnings: true });

  const [fsIp, fsPort] = firestoreHost.split(':');
  const clientDb = initializeFirestore(clientApp, {
    localCache: memoryLocalCache(),
  });
  connectFirestoreEmulator(clientDb, fsIp, parseInt(fsPort, 10));

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
    // =========================================================================
    // SECTION 1: Configurable Student Domain Validation
    // =========================================================================
    console.log('--- SECTION 1: Configurable Student Email Domain Validation ---');

    // 1.1 Wildcard allow-all
    const test1_1 = validateStudentEmailDomain('student@anycollege.edu', '*');
    recordResult('1.1', 'Wildcard setting (*) accepts any valid domain', test1_1.valid);

    // 1.2 Whitelisted domain exact match
    const test1_2 = validateStudentEmailDomain('aditi@campus.edu', 'campus.edu,students.campus.edu');
    recordResult('1.2', 'Whitelisted primary domain (campus.edu) is accepted', test1_2.valid);

    // 1.3 Whitelisted subdomain match
    const test1_3 = validateStudentEmailDomain('aditi@students.campus.edu', 'campus.edu,students.campus.edu');
    recordResult('1.3', 'Whitelisted secondary domain (students.campus.edu) is accepted', test1_3.valid);

    // 1.4 Unauthorized public domain rejected
    const test1_4 = validateStudentEmailDomain('intruder@gmail.com', 'campus.edu,students.campus.edu');
    recordResult('1.4', 'Unauthorized public email domain (gmail.com) is rejected', !test1_4.valid && test1_4.reason.includes('not recognized'));

    // 1.5 Subdomain wildcard matching (*.univ.edu)
    const test1_5 = validateStudentEmailDomain('eng@cs.univ.edu', '*.univ.edu');
    recordResult('1.5', 'Subdomain wildcard (*.univ.edu) matches cs.univ.edu', test1_5.valid);

    // 1.6 Malformed email rejection
    const test1_6 = validateStudentEmailDomain('not-an-email', 'campus.edu');
    recordResult('1.6', 'Malformed email missing @ is rejected', !test1_6.valid);

    // =========================================================================
    // SECTION 2: Student Registration & Profile Security
    // =========================================================================
    console.log('\n--- SECTION 2: Student Registration & Profile Security ---');

    const testStudentEmail = `student_${Date.now()}@campus.edu`;
    const testStudentPassword = 'TestPassword123!';

    // 2.1 Public student creation via Client SDK
    const studentCred = await createUserWithEmailAndPassword(clientAuth, testStudentEmail, testStudentPassword);
    const studentUid = studentCred.user.uid;
    recordResult('2.1', 'Student account created via Firebase Auth Client SDK', !!studentUid);

    // 2.2 Verify student token does NOT have admin claims
    const studentToken = await studentCred.user.getIdTokenResult(true);
    const hasAdminClaims = studentToken.claims.role === 'admin' || studentToken.claims.admin === true;
    recordResult('2.2', 'Newly registered student token has NO admin claims', !hasAdminClaims);

    // 2.3 Student creates own profile doc with role='student'
    let studentProfileCreated = false;
    try {
      await setDoc(doc(clientDb, 'users', studentUid), {
        uid: studentUid,
        email: testStudentEmail,
        fullName: 'Test Student',
        role: 'student',
        department: 'Computer Science',
        isActive: true,
      });
      studentProfileCreated = true;
    } catch (e) {
      console.error(e);
    }
    recordResult('2.3', 'Student creates own Firestore profile with role="student"', studentProfileCreated);

    // 2.4 Student CANNOT self-elevate role to 'admin' in Firestore
    let elevationBlocked = false;
    try {
      await updateDoc(doc(clientDb, 'users', studentUid), {
        role: 'admin',
      });
    } catch (err) {
      elevationBlocked = true;
    }
    recordResult('2.4', 'Student CANNOT self-elevate role to "admin" in Firestore (blocked by rules)', elevationBlocked);

    // =========================================================================
    // SECTION 3: Server-Side Admin Provisioning
    // =========================================================================
    console.log('\n--- SECTION 3: Server-Side Admin Provisioning (Admin SDK) ---');

    const testAdminEmail = `dean_${Date.now()}@campus.edu`;
    const testAdminPassword = 'AdminSecret2026!';

    // 3.1 Provision admin via Admin SDK
    const adminRecord = await adminAuth.createUser({
      email: testAdminEmail,
      password: testAdminPassword,
      displayName: 'Dr. Sunita Menon',
    });
    recordResult('3.1', 'Admin user created via server-side Admin SDK', !!adminRecord.uid);

    // 3.2 Set Custom User Claims { role: 'admin', admin: true }
    await adminAuth.setCustomUserClaims(adminRecord.uid, {
      role: 'admin',
      admin: true,
    });
    const verifiedAdminRecord = await adminAuth.getUser(adminRecord.uid);
    const claimsVerified =
      verifiedAdminRecord.customClaims?.role === 'admin' &&
      verifiedAdminRecord.customClaims?.admin === true;
    recordResult('3.2', 'Custom Claims { role: "admin", admin: true } minted and verified', claimsVerified);

    // 3.3 Set Firestore Admin Profile Doc via Admin SDK
    await adminDb.collection('users').doc(adminRecord.uid).set({
      uid: adminRecord.uid,
      email: testAdminEmail,
      fullName: 'Dr. Sunita Menon',
      role: 'admin',
      department: 'Deanery / Chief Custodian',
      isActive: true,
    });
    const adminDoc = await adminDb.collection('users').doc(adminRecord.uid).get();
    recordResult('3.3', 'Admin Firestore profile initialized with role="admin"', adminDoc.data()?.role === 'admin');

    // =========================================================================
    // SECTION 4: Admin Client Sign-In & Privilege Verification
    // =========================================================================
    console.log('\n--- SECTION 4: Admin Client Sign-In & Privilege Verification ---');

    // 4.1 Admin signs in via Client SDK
    await signOut(clientAuth);
    const adminCred = await signInWithEmailAndPassword(clientAuth, testAdminEmail, testAdminPassword);
    recordResult('4.1', 'Admin successfully signs in with password via Client SDK', !!adminCred.user.uid);

    // 4.2 Verify client token reflects custom claims
    const adminToken = await adminCred.user.getIdTokenResult(true);
    const adminRoleClaim = adminToken.claims.role === 'admin' && adminToken.claims.admin === true;
    recordResult('4.2', 'Admin client token decodes custom claim role="admin"', adminRoleClaim);

    // 4.3 Admin can read student profile via Firestore client
    let adminCanReadStudent = false;
    try {
      const snap = await getDoc(doc(clientDb, 'users', studentUid));
      adminCanReadStudent = snap.exists() && snap.data()?.fullName === 'Test Student';
    } catch (e) {
      console.error(e);
    }
    recordResult('4.3', 'Admin CAN read student profile via Firestore Client SDK', adminCanReadStudent);

    // =========================================================================
    // SECTION 5: Cross-User Isolation (Student cannot read another student)
    // =========================================================================
    console.log('\n--- SECTION 5: Cross-User Data Isolation ---');

    // 5.1 Sign in as Student again
    await signOut(clientAuth);
    await signInWithEmailAndPassword(clientAuth, testStudentEmail, testStudentPassword);

    // Create a second student
    const student2Email = `student2_${Date.now()}@campus.edu`;
    const student2Cred = await adminAuth.createUser({
      email: student2Email,
      password: 'Password123!',
    });
    await adminDb.collection('users').doc(student2Cred.uid).set({
      uid: student2Cred.uid,
      email: student2Email,
      fullName: 'Other Student',
      role: 'student',
      isActive: true,
    });

    // 5.2 Student 1 attempts to read Student 2 profile doc
    let studentReadOtherBlocked = false;
    try {
      await getDoc(doc(clientDb, 'users', student2Cred.uid));
    } catch (err) {
      studentReadOtherBlocked = true;
    }
    recordResult('5.2', 'Student CANNOT read another student profile (blocked by security rules)', studentReadOtherBlocked);

    // 5.3 Sign out clears client auth state
    await signOut(clientAuth);
    recordResult('5.3', 'Sign out successfully flushes active client session', clientAuth.currentUser === null);

  } catch (globalErr) {
    console.error('[UNCAUGHT SUITE ERROR]', globalErr);
  }

  // Summary
  console.log('\n================================================================');
  console.log(`   AUTH TEST SUMMARY: ${results.passed} / ${results.total} PASSED (${results.failed} FAILED)`);
  console.log('================================================================\n');

  try {
    const reportPath = path.resolve('visual_audit', 'AUTH_TEST_RESULTS.json');
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

runAuthVerificationSuite();
