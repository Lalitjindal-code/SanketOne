import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSecurityRulesSuite() {
  console.log('===============================================================');
  console.log('--- SANKETONE FIREBASE FIRESTORE & STORAGE SECURITY RULES TEST ---');
  console.log('===============================================================\n');

  const rulesPath = path.resolve(__dirname, '../firestore.rules');
  const firestoreRules = fs.readFileSync(rulesPath, 'utf8');

  // Initialize test environment connecting to the local Firestore emulator
  const testEnv = await initializeTestEnvironment({
    projectId: 'sanketone-dev',
    firestore: {
      host: '127.0.0.1',
      port: 8080,
      rules: firestoreRules,
    },
  });

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
    // --------------------------------------------------------------------------
    // SEED INITIAL DATABASE STATE (Rules Bypassed)
    // --------------------------------------------------------------------------
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();

      // Seed Student Profiles
      await setDoc(doc(db, 'users/student_aditi'), {
        uid: 'student_aditi',
        role: 'student',
        fullName: 'Aditi Sharma',
        email: 'aditi.sharma@campus.edu',
        rollNumber: '22BCS041',
        department: 'Computer Science',
      });

      await setDoc(doc(db, 'users/student_rahul'), {
        uid: 'student_rahul',
        role: 'student',
        fullName: 'Rahul Verma',
        email: 'rahul@campus.edu',
        rollNumber: '22BCS099',
        department: 'Electrical Engineering',
      });

      // Seed Admin Profile
      await setDoc(doc(db, 'users/admin_sunita'), {
        uid: 'admin_sunita',
        role: 'admin',
        fullName: 'Dr. Sunita Menon',
        email: 'dean.affairs@campus.edu',
        department: 'Deanery of Student Affairs',
      });

      // Seed Authoritative Complaint (Private dossier owned by Aditi)
      await setDoc(doc(db, 'complaints/cmp_8802'), {
        id: 'cmp_8802',
        ticketId: 'SNK-8802',
        studentId: 'student_aditi',
        title: 'Water cooler non-operational on 2nd Floor',
        status: 'in_progress',
        priority: 'high',
        isAnonymousToPublic: true,
        isPublic: true,
      });

      // Seed Internal Note (Confidential Admin note under cmp_8802)
      await setDoc(doc(db, 'complaints/cmp_8802/internalNotes/note_secret_01'), {
        id: 'note_secret_01',
        authorId: 'admin_sunita',
        noteText: 'Compressor requisition requisition #RQ-881 approved by supervisor.',
        authorRole: 'admin',
      });

      // Seed Audit Log under cmp_8802
      await setDoc(doc(db, 'complaints/cmp_8802/auditLogs/log_01'), {
        id: 'log_01',
        actionType: 'STATUS_UPDATED',
        actorName: 'Dr. Sunita Menon',
        actorRole: 'admin',
      });

      // Seed Evidence under cmp_8802
      await setDoc(doc(db, 'complaints/cmp_8802/evidence/ev_01'), {
        id: 'ev_01',
        uploaderId: 'student_aditi',
        stage: 'intake',
        fileUrl: 'https://storage/evidence.jpg',
      });

      // Seed Public Projection
      await setDoc(doc(db, 'publicComplaints/cmp_8802'), {
        id: 'cmp_8802',
        ticketId: 'SNK-8802',
        maskedComplainant: 'UID: #STU-992a***',
        title: 'Water cooler non-operational on 2nd Floor',
        status: 'in_progress',
      });

      // Seed System Counter
      await setDoc(doc(db, 'systemCounters/ticketCounter'), {
        prefix: 'SNK',
        currentSequence: 8802,
      });
    });

    // --------------------------------------------------------------------------
    // CONFIGURE TEST CONTEXTS
    // --------------------------------------------------------------------------
    const unauthDb = testEnv.unauthenticatedContext().firestore();
    const aditiDb = testEnv.authenticatedContext('student_aditi', { role: 'student' }).firestore();
    const rahulDb = testEnv.authenticatedContext('student_rahul', { role: 'student' }).firestore();
    const adminDb = testEnv.authenticatedContext('admin_sunita', { role: 'admin', admin: true }).firestore();

    // --------------------------------------------------------------------------
    // TEST SUITE 1: USER PROFILES & SELF-ELEVATION GUARDS
    // --------------------------------------------------------------------------
    console.log('\n--- Group 1: User Profiles & Role Protection ---');

    // 1.1 Student can read own profile
    try {
      await assertSucceeds(getDoc(doc(aditiDb, 'users/student_aditi')));
      recordResult('1.1', 'Student can read own profile', true);
    } catch (e) {
      recordResult('1.1', 'Student can read own profile', false, e.message);
    }

    // 1.2 Student CANNOT read another student's profile
    try {
      await assertFails(getDoc(doc(aditiDb, 'users/student_rahul')));
      recordResult('1.2', 'Student CANNOT read another student profile', true);
    } catch (e) {
      recordResult('1.2', 'Student CANNOT read another student profile', false, e.message);
    }

    // 1.3 Admin CAN read any student's profile
    try {
      await assertSucceeds(getDoc(doc(adminDb, 'users/student_aditi')));
      recordResult('1.3', 'Admin can read any user profile', true);
    } catch (e) {
      recordResult('1.3', 'Admin can read any user profile', false, e.message);
    }

    // 1.4 Student CANNOT self-elevate role from student to admin
    try {
      await assertFails(updateDoc(doc(aditiDb, 'users/student_aditi'), { role: 'admin' }));
      recordResult('1.4', 'Student CANNOT self-elevate role to admin', true);
    } catch (e) {
      recordResult('1.4', 'Student CANNOT self-elevate role to admin', false, e.message);
    }

    // 1.5 Student can update non-role profile fields (e.g. phone)
    try {
      await assertSucceeds(updateDoc(doc(aditiDb, 'users/student_aditi'), { role: 'student', phoneNumber: '+9199999' }));
      recordResult('1.5', 'Student can update permitted profile fields', true);
    } catch (e) {
      recordResult('1.5', 'Student can update permitted profile fields', false, e.message);
    }

    // --------------------------------------------------------------------------
    // TEST SUITE 2: AUTHORITATIVE COMPLAINTS & PRIVACY
    // --------------------------------------------------------------------------
    console.log('\n--- Group 2: Authoritative Complaints Access ---');

    // 2.1 Author student can read own authoritative complaint
    try {
      await assertSucceeds(getDoc(doc(aditiDb, 'complaints/cmp_8802')));
      recordResult('2.1', 'Author student can read own authoritative complaint', true);
    } catch (e) {
      recordResult('2.1', 'Author student can read own authoritative complaint', false, e.message);
    }

    // 2.2 Other student CANNOT read Aditi private authoritative complaint
    try {
      await assertFails(getDoc(doc(rahulDb, 'complaints/cmp_8802')));
      recordResult('2.2', 'Other student CANNOT read private authoritative complaint', true);
    } catch (e) {
      recordResult('2.2', 'Other student CANNOT read private authoritative complaint', false, e.message);
    }

    // 2.3 Admin CAN read authoritative complaint
    try {
      await assertSucceeds(getDoc(doc(adminDb, 'complaints/cmp_8802')));
      recordResult('2.3', 'Admin can read authoritative complaint', true);
    } catch (e) {
      recordResult('2.3', 'Admin can read authoritative complaint', false, e.message);
    }

    // 2.4 Unauthenticated CANNOT read authoritative complaint
    try {
      await assertFails(getDoc(doc(unauthDb, 'complaints/cmp_8802')));
      recordResult('2.4', 'Unauthenticated CANNOT read authoritative complaint', true);
    } catch (e) {
      recordResult('2.4', 'Unauthenticated CANNOT read authoritative complaint', false, e.message);
    }

    // 2.5 Student CANNOT forge studentId on complaint creation
    try {
      await assertFails(
        setDoc(doc(aditiDb, 'complaints/cmp_fraud_01'), {
          id: 'cmp_fraud_01',
          studentId: 'student_rahul', // Forging another student's identity
          status: 'under_review',
        })
      );
      recordResult('2.5', 'Student CANNOT forge studentId on complaint creation', true);
    } catch (e) {
      recordResult('2.5', 'Student CANNOT forge studentId on complaint creation', false, e.message);
    }

    // 2.6 Student CANNOT alter ticketId on update
    try {
      await assertFails(updateDoc(doc(aditiDb, 'complaints/cmp_8802'), { ticketId: 'SNK-9999' }));
      recordResult('2.6', 'Student CANNOT tamper with ticketId on update', true);
    } catch (e) {
      recordResult('2.6', 'Student CANNOT tamper with ticketId on update', false, e.message);
    }

    // --------------------------------------------------------------------------
    // TEST SUITE 3: CONFIDENTIAL INTERNAL NOTES & AUDIT LOGS
    // --------------------------------------------------------------------------
    console.log('\n--- Group 3: Internal Notes & Audit Logs Confidentiality ---');

    // 3.1 Student CANNOT read internal notes (even for their own complaint)
    try {
      await assertFails(getDoc(doc(aditiDb, 'complaints/cmp_8802/internalNotes/note_secret_01')));
      recordResult('3.1', 'Student CANNOT read confidential internal notes', true);
    } catch (e) {
      recordResult('3.1', 'Student CANNOT read confidential internal notes', false, e.message);
    }

    // 3.2 Student CANNOT write internal notes
    try {
      await assertFails(
        setDoc(doc(aditiDb, 'complaints/cmp_8802/internalNotes/note_hack'), {
          noteText: 'Student trying to inject note',
        })
      );
      recordResult('3.2', 'Student CANNOT write confidential internal notes', true);
    } catch (e) {
      recordResult('3.2', 'Student CANNOT write confidential internal notes', false, e.message);
    }

    // 3.3 Admin CAN read internal notes
    try {
      await assertSucceeds(getDoc(doc(adminDb, 'complaints/cmp_8802/internalNotes/note_secret_01')));
      recordResult('3.3', 'Admin CAN read confidential internal notes', true);
    } catch (e) {
      recordResult('3.3', 'Admin CAN read confidential internal notes', false, e.message);
    }

    // 3.4 Admin CAN write internal notes
    try {
      await assertSucceeds(
        setDoc(doc(adminDb, 'complaints/cmp_8802/internalNotes/note_admin_02'), {
          authorId: 'admin_sunita',
          noteText: 'Technician Verma assigned to field site.',
          authorRole: 'admin',
        })
      );
      recordResult('3.4', 'Admin CAN write confidential internal notes', true);
    } catch (e) {
      recordResult('3.4', 'Admin CAN write confidential internal notes', false, e.message);
    }

    // 3.5 Student CANNOT read audit logs
    try {
      await assertFails(getDoc(doc(aditiDb, 'complaints/cmp_8802/auditLogs/log_01')));
      recordResult('3.5', 'Student CANNOT read administrative audit logs', true);
    } catch (e) {
      recordResult('3.5', 'Student CANNOT read administrative audit logs', false, e.message);
    }

    // 3.6 Admin CAN read audit logs
    try {
      await assertSucceeds(getDoc(doc(adminDb, 'complaints/cmp_8802/auditLogs/log_01')));
      recordResult('3.6', 'Admin CAN read administrative audit logs', true);
    } catch (e) {
      recordResult('3.6', 'Admin CAN read administrative audit logs', false, e.message);
    }

    // 3.7 Client CANNOT directly write audit logs (Server-only)
    try {
      await assertFails(
        setDoc(doc(adminDb, 'complaints/cmp_8802/auditLogs/log_fake'), {
          actionType: 'FAKE_LOG',
        })
      );
      recordResult('3.7', 'Direct client CANNOT write audit logs (server-only)', true);
    } catch (e) {
      recordResult('3.7', 'Direct client CANNOT write audit logs (server-only)', false, e.message);
    }

    // --------------------------------------------------------------------------
    // TEST SUITE 4: PUBLIC PROJECTION & SYSTEM COUNTERS
    // --------------------------------------------------------------------------
    console.log('\n--- Group 4: Public Projections & System Counters ---');

    // 4.1 Authenticated student CAN read public projection
    try {
      await assertSucceeds(getDoc(doc(rahulDb, 'publicComplaints/cmp_8802')));
      recordResult('4.1', 'Authenticated student CAN read public complaint projection', true);
    } catch (e) {
      recordResult('4.1', 'Authenticated student CAN read public complaint projection', false, e.message);
    }

    // 4.2 Client CANNOT write directly to public projection (Cloud Functions only)
    try {
      await assertFails(
        updateDoc(doc(rahulDb, 'publicComplaints/cmp_8802'), {
          title: 'Hacked public title',
        })
      );
      recordResult('4.2', 'Client CANNOT write directly to public projection', true);
    } catch (e) {
      recordResult('4.2', 'Client CANNOT write directly to public projection', false, e.message);
    }

    // 4.3 Client CANNOT read or write system counters directly (Cloud Functions only)
    try {
      await assertFails(getDoc(doc(aditiDb, 'systemCounters/ticketCounter')));
      recordResult('4.3', 'Client CANNOT read system ticket counter doc', true);
    } catch (e) {
      recordResult('4.3', 'Client CANNOT read system ticket counter doc', false, e.message);
    }

    try {
      await assertFails(
        updateDoc(doc(aditiDb, 'systemCounters/ticketCounter'), { currentSequence: 9999 })
      );
      recordResult('4.4', 'Client CANNOT write to system ticket counter doc', true);
    } catch (e) {
      recordResult('4.4', 'Client CANNOT write to system ticket counter doc', false, e.message);
    }

    // --------------------------------------------------------------------------
    // TEST SUITE 5: ENDORSEMENTS (+1 ME TOO)
    // --------------------------------------------------------------------------
    console.log('\n--- Group 5: Endorsements (+1 Me Too) Security ---');

    // 5.1 Student can endorse using own UID
    try {
      await assertSucceeds(
        setDoc(doc(rahulDb, 'complaints/cmp_8802/endorsements/student_rahul'), {
          studentId: 'student_rahul',
          endorsedAt: new Date().toISOString(),
        })
      );
      recordResult('5.1', 'Student can endorse using their own UID', true);
    } catch (e) {
      recordResult('5.1', 'Student can endorse using their own UID', false, e.message);
    }

    // 5.2 Student CANNOT forge endorsement using another student UID
    try {
      await assertFails(
        setDoc(doc(rahulDb, 'complaints/cmp_8802/endorsements/student_aditi'), {
          studentId: 'student_aditi',
          endorsedAt: new Date().toISOString(),
        })
      );
      recordResult('5.2', 'Student CANNOT forge endorsement under another student UID', true);
    } catch (e) {
      recordResult('5.2', 'Student CANNOT forge endorsement under another student UID', false, e.message);
    }

    // --------------------------------------------------------------------------
    // TEST SUITE 6: EVIDENCE ACCESS
    // --------------------------------------------------------------------------
    console.log('\n--- Group 6: Complaint Evidence Access ---');

    // 6.1 Author student can read evidence on own complaint
    try {
      await assertSucceeds(getDoc(doc(aditiDb, 'complaints/cmp_8802/evidence/ev_01')));
      recordResult('6.1', 'Author student can read evidence on own complaint', true);
    } catch (e) {
      recordResult('6.1', 'Author student can read evidence on own complaint', false, e.message);
    }

    // 6.2 Admin can read evidence on complaint
    try {
      await assertSucceeds(getDoc(doc(adminDb, 'complaints/cmp_8802/evidence/ev_01')));
      recordResult('6.2', 'Admin can read evidence on complaint', true);
    } catch (e) {
      recordResult('6.2', 'Admin can read evidence on complaint', false, e.message);
    }

    // 6.3 Other student CANNOT read evidence on private complaint
    try {
      await assertFails(getDoc(doc(rahulDb, 'complaints/cmp_8802/evidence/ev_01')));
      recordResult('6.3', 'Other student CANNOT read evidence on private complaint', true);
    } catch (e) {
      recordResult('6.3', 'Other student CANNOT read evidence on private complaint', false, e.message);
    }
  } catch (err) {
    console.error('Fatal test error:', err);
  } finally {
    await testEnv.clearFirestore();
    await testEnv.cleanup();

    console.log('\n===============================================================');
    console.log(`TOTAL SECURITY TESTS: ${results.total}`);
    console.log(`PASSED: ${results.passed}`);
    console.log(`FAILED: ${results.failed}`);
    console.log('===============================================================\n');

    const outputDir = path.resolve(__dirname, '../visual_audit');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(
      path.join(outputDir, 'SECURITY_RULES_TEST_RESULTS.json'),
      JSON.stringify(results, null, 2)
    );

    if (results.failed > 0) {
      process.exit(1);
    }
  }
}

runSecurityRulesSuite();

