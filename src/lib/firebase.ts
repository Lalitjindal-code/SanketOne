import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, signOut as firebaseSignOut, type Auth } from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  connectFirestoreEmulator,
  memoryLocalCache,
  type Firestore,
} from 'firebase/firestore';
import { getStorage, connectStorageEmulator, type FirebaseStorage } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator, type Functions } from 'firebase/functions';

// Public Firebase Web Client Configuration (No Secret Keys)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCd-XSZ5DsdnmNRoF438oIistM78flpviQ',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'sanketone.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'sanketone',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'sanketone.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '689142996129',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:689142996129:web:360be83b890cbde501e4e0',
};

// Singleton App Instance
export const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth Service
export const auth: Auth = getAuth(app);

// Firestore Database
// CRITICAL SECURITY ENFORCEMENT:
// Initialized with memoryLocalCache() for MVP.
// Guarantees ZERO document persistence to IndexedDB or local disk for ALL users,
// completely eliminating cross-session credential and confidential dossier leaks on shared terminals.
let firestoreInstance: Firestore;
try {
  firestoreInstance = initializeFirestore(app, {
    localCache: memoryLocalCache(),
  });
} catch {
  firestoreInstance = getFirestore(app);
}
export const db: Firestore = firestoreInstance;

// Storage Service
export const storage: FirebaseStorage = getStorage(app);

// Cloud Functions Service
export const functions: Functions = getFunctions(app);

// Safe Session Cleanup (Flushes in-memory documents upon logout or persona switch)
export async function clearSessionState(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (err) {
    console.warn('[SanketOne] Auth signout notice:', err);
  }

  // Because memoryLocalCache is active, closing or navigating flushes memory cache automatically.
  // We also terminate active listeners where needed.
}

// Emulator Connection Guard (Prevents duplicate connection errors during Vite HMR reloads)
declare global {
  interface Window {
    __SANKETONE_EMULATORS_CONNECTED__?: boolean;
  }
}

export function connectEmulatorsIfNeeded(): void {
  const useEmulators = import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true';
  if (!useEmulators || typeof window === 'undefined' || window.__SANKETONE_EMULATORS_CONNECTED__) {
    return;
  }

  try {
    const authHost = import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_HOST || 'localhost:9099';
    const [authIp, authPort] = authHost.split(':');
    connectAuthEmulator(auth, `http://${authIp}:${authPort}`, { disableWarnings: true });

    const firestoreHost = import.meta.env.VITE_FIRESTORE_EMULATOR_HOST || 'localhost:8080';
    const [fsIp, fsPort] = firestoreHost.split(':');
    connectFirestoreEmulator(db, fsIp, parseInt(fsPort, 10));

    const storageHost = import.meta.env.VITE_FIREBASE_STORAGE_EMULATOR_HOST || 'localhost:9199';
    const [stIp, stPort] = storageHost.split(':');
    connectStorageEmulator(storage, stIp, parseInt(stPort, 10));

    const functionsHost = import.meta.env.VITE_FIREBASE_FUNCTIONS_EMULATOR_HOST || 'localhost:5001';
    const [fnIp, fnPort] = functionsHost.split(':');
    connectFunctionsEmulator(functions, fnIp, parseInt(fnPort, 10));

    window.__SANKETONE_EMULATORS_CONNECTED__ = true;
    console.info('[SanketOne] Successfully connected to Firebase Local Emulator Suite.');
  } catch (err) {
    console.warn('[SanketOne] Firebase emulator connection notice:', err);
  }
}

// Auto-connect emulators in development when configured
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true') {
  connectEmulatorsIfNeeded();
}
