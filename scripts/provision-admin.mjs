#!/usr/bin/env node

/**
 * ============================================================================
 * SANKETONE — SECURE ADMIN PROVISIONING UTILITY
 * ============================================================================
 * 
 * SECURITY MANDATE:
 * Public self-registration for Administrative accounts is strictly prohibited.
 * Admin accounts MUST be provisioned out-of-band using the Firebase Admin SDK
 * with privileged Custom Claims ({ role: 'admin', admin: true }).
 *
 * Usage:
 *   node scripts/provision-admin.mjs --email="dean.affairs@campus.edu" --password="Admin@Sanket2026!" --name="Dr. Sunita Menon"
 *
 * Options:
 *   --email        Admin email address (default: dean.affairs@campus.edu)
 *   --password     Admin password (min 8 chars) (default: Admin@Sanket2026!)
 *   --name         Admin full name (default: Dr. Sunita Menon)
 *   --department   Department or office (default: Deanery / Chief Custodian)
 *   --title        Official administrative title (default: Dean of Student Affairs)
 *   --projectId    Firebase project ID (default: sanketone-dev)
 *   --emulator     Force local emulator mode (sets emulator hosts if not already set)
 */

import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    email: 'dean.affairs@campus.edu',
    password: 'Admin@Sanket2026!',
    name: 'Dr. Sunita Menon',
    department: 'Deanery / Chief Custodian',
    title: 'Dean of Student Affairs',
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'sanketone-dev',
    emulator: false,
  };

  for (const arg of args) {
    if (arg.startsWith('--email=')) {
      options.email = arg.split('=')[1].trim();
    } else if (arg.startsWith('--password=')) {
      options.password = arg.split('=')[1].trim();
    } else if (arg.startsWith('--name=')) {
      options.name = arg.split('=')[1].trim();
    } else if (arg.startsWith('--department=')) {
      options.department = arg.split('=')[1].trim();
    } else if (arg.startsWith('--title=')) {
      options.title = arg.split('=')[1].trim();
    } else if (arg.startsWith('--projectId=')) {
      options.projectId = arg.split('=')[1].trim();
    } else if (arg === '--emulator') {
      options.emulator = true;
    }
  }

  return options;
}

export async function provisionAdmin() {
  const options = parseArgs();

  console.log('================================================================');
  console.log('   SANKETONE — SECURE SERVER-SIDE ADMIN PROVISIONING PIPELINE   ');
  console.log('================================================================\n');

  // Emulator configuration
  if (options.emulator || !process.env.FIREBASE_CONFIG) {
    if (!process.env.FIREBASE_AUTH_EMULATOR_HOST) {
      process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
    }
    if (!process.env.FIRESTORE_EMULATOR_HOST) {
      process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
    }
    console.log(`[TARGET] Local Emulator Suite:`);
    console.log(`  - Auth Host:      ${process.env.FIREBASE_AUTH_EMULATOR_HOST}`);
    console.log(`  - Firestore Host: ${process.env.FIRESTORE_EMULATOR_HOST}`);
  } else {
    console.log(`[TARGET] Cloud Project: ${options.projectId}`);
  }

  // Initialize Admin App
  const app = getApps().length === 0 ? initializeApp({ projectId: options.projectId }) : getApps()[0];

  const auth = getAuth(app);
  const db = getFirestore(app);

  console.log(`\n[STEP 1] Validating Admin Account: ${options.email}`);

  let userRecord;
  let isNewUser = false;

  try {
    userRecord = await auth.getUserByEmail(options.email);
    console.log(`  -> Existing user record located (UID: ${userRecord.uid})`);
    
    // Update password and display name
    await auth.updateUser(userRecord.uid, {
      password: options.password,
      displayName: options.name,
    });
    console.log(`  -> Updated credentials and display name`);
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      console.log(`  -> Creating new admin user record...`);
      userRecord = await auth.createUser({
        email: options.email,
        password: options.password,
        displayName: options.name,
        emailVerified: true,
      });
      isNewUser = true;
      console.log(`  -> User created successfully (UID: ${userRecord.uid})`);
    } else {
      throw err;
    }
  }

  console.log(`\n[STEP 2] Minting Privileged Custom Claims`);
  const customClaims = {
    role: 'admin',
    admin: true,
  };

  await auth.setCustomUserClaims(userRecord.uid, customClaims);
  console.log(`  -> Applied Custom Claims:`, JSON.stringify(customClaims));

  console.log(`\n[STEP 3] Synchronizing Firestore Admin Profile Doc (/users/${userRecord.uid})`);
  const userDocRef = db.collection('users').doc(userRecord.uid);
  
  const existingDoc = await userDocRef.get();
  const profilePayload = {
    uid: userRecord.uid,
    email: options.email,
    fullName: options.name,
    role: 'admin',
    department: options.department,
    title: options.title,
    isActive: true,
    avatarUrl: '',
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (!existingDoc.exists) {
    profilePayload.createdAt = FieldValue.serverTimestamp();
  }

  await userDocRef.set(profilePayload, { merge: true });
  console.log(`  -> Firestore document updated with role = 'admin'`);

  console.log(`\n[STEP 4] Verifying Provisioned Access`);
  const verifiedUser = await auth.getUser(userRecord.uid);
  const verifiedDoc = await userDocRef.get();

  const claimsValid =
    verifiedUser.customClaims?.role === 'admin' &&
    verifiedUser.customClaims?.admin === true;
  const docValid = verifiedDoc.data()?.role === 'admin';

  if (claimsValid && docValid) {
    console.log('\n================================================================');
    console.log('   [SUCCESS] ADMIN ACCOUNT PROVISIONED & VERIFIED SECURELY!     ');
    console.log('================================================================');
    console.log(`  Email:       ${options.email}`);
    console.log(`  UID:         ${userRecord.uid}`);
    console.log(`  Name:        ${options.name}`);
    console.log(`  Department:  ${options.department}`);
    console.log(`  Claims:      ${JSON.stringify(verifiedUser.customClaims)}`);
    console.log(`  Doc Role:    ${verifiedDoc.data()?.role}`);
    console.log('================================================================\n');
  } else {
    throw new Error('Verification failed: claims or Firestore doc role mismatch.');
  }

  return {
    uid: userRecord.uid,
    email: options.email,
    isNewUser,
  };
}

// Execute if run directly
if (process.argv[1] && process.argv[1].endsWith('provision-admin.mjs')) {
  provisionAdmin()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('\n[FATAL ERROR] Admin provisioning failed:', err);
      process.exit(1);
    });
}
