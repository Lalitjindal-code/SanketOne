import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  type User,
  type IdTokenResult,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, clearSessionState } from './firebase';
import type { UserRole, UserProfile } from '@/types/user';
import type { UserProfileDoc } from '@/types/firestore';

/**
 * Validates an email address against configured institutional student domains.
 * Configuration is supplied via VITE_ALLOWED_STUDENT_EMAIL_DOMAINS (comma-separated).
 * If set to '*' or omitted, all standard email formats are accepted (for development/testing).
 */
export function validateStudentEmailDomain(
  email: string,
  configuredDomains?: string
): { valid: boolean; reason?: string } {
  if (!email || !email.includes('@')) {
    return { valid: false, reason: 'Please provide a valid email address.' };
  }

  const rawSetting =
    configuredDomains !== undefined
      ? configuredDomains
      : (import.meta.env.VITE_ALLOWED_STUDENT_EMAIL_DOMAINS || '*');

  const trimmedSetting = rawSetting.trim();

  // Wildcard allows all domains
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

export interface StudentSignUpData {
  email: string;
  password: string;
  fullName: string;
  rollNumber?: string;
  department?: string;
  hostelBlock?: string;
  phoneNumber?: string;
}

export interface AuthSessionResult {
  user: User;
  role: UserRole;
  profile: UserProfile;
}

/**
 * Derives uppercase 2-letter initials from a name or email.
 */
export function deriveAvatarInitials(nameOrEmail: string): string {
  if (!nameOrEmail) return 'U';
  const clean = nameOrEmail.trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

/**
 * Registers a new student account.
 * Public registration is strictly restricted to the 'student' role.
 */
export async function signUpStudent(
  data: StudentSignUpData
): Promise<AuthSessionResult> {
  const domainCheck = validateStudentEmailDomain(data.email);
  if (!domainCheck.valid) {
    throw new Error(domainCheck.reason || 'Unauthorized email domain.');
  }

  if (!data.fullName || data.fullName.trim().length < 2) {
    throw new Error('Full legal name is required (minimum 2 characters).');
  }

  if (!data.password || data.password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }

  // 1. Create Firebase Auth user
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    data.email,
    data.password
  );
  const firebaseUser = userCredential.user;

  // 2. Set Firebase Auth display name
  try {
    await updateProfile(firebaseUser, {
      displayName: data.fullName.trim(),
    });
  } catch (err) {
    console.warn('[SanketOne] Could not update profile display name:', err);
  }

  // 3. Create Firestore User Profile Document
  // Firestore Security Rules strictly enforce request.resource.data.role == 'student' on public create.
  const profileDocData: Record<string, unknown> = {
    uid: firebaseUser.uid,
    email: data.email.trim().toLowerCase(),
    fullName: data.fullName.trim(),
    role: 'student', // Non-negotiable student role
    rollNumber: (data.rollNumber || '').trim(),
    department: (data.department || 'General Student Body').trim(),
    hostelBlock: (data.hostelBlock || '').trim(),
    phoneNumber: (data.phoneNumber || '').trim(),
    avatarUrl: '',
    isActive: true,
    fcmTokens: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const userDocRef = doc(db, 'users', firebaseUser.uid);
  await setDoc(userDocRef, profileDocData);

  const profile: UserProfile = {
    id: firebaseUser.uid,
    role: 'student',
    fullName: data.fullName.trim(),
    email: data.email.trim().toLowerCase(),
    rollNumber: (data.rollNumber || '').trim() || undefined,
    departmentOrFaculty: (data.department || 'General Student Body').trim(),
    hostelBlock: (data.hostelBlock || '').trim() || undefined,
    phoneNumber: (data.phoneNumber || '').trim() || undefined,
    isActive: true,
    avatarInitials: deriveAvatarInitials(data.fullName),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    user: firebaseUser,
    role: 'student',
    profile,
  };
}

/**
 * Authenticates any user (Student or Admin) via email and password.
 * Inspects Custom Claims to determine role.
 */
export async function signInUser(
  email: string,
  password: string
): Promise<AuthSessionResult> {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );
  const firebaseUser = userCredential.user;

  // Refresh token to ensure latest custom claims are fetched
  const tokenResult: IdTokenResult = await firebaseUser.getIdTokenResult(true);
  const role: UserRole =
    tokenResult.claims.role === 'admin' || tokenResult.claims.admin === true
      ? 'admin'
      : 'student';

  // Read Firestore profile
  let profileDoc: UserProfileDoc | null = null;
  try {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      profileDoc = snap.data() as UserProfileDoc;
    }
  } catch (err) {
    console.warn('[SanketOne] Could not load Firestore profile doc:', err);
  }

  const fullName =
    profileDoc?.fullName ||
    firebaseUser.displayName ||
    email.split('@')[0] ||
    'Campus User';

  const profile: UserProfile = {
    id: firebaseUser.uid,
    role,
    fullName,
    email: firebaseUser.email || email,
    rollNumber: profileDoc?.rollNumber,
    departmentOrFaculty:
      profileDoc?.department ||
      (role === 'admin' ? 'Deanery / Custodian' : 'General Student Body'),
    hostelBlock: profileDoc?.hostelBlock,
    phoneNumber: profileDoc?.phoneNumber,
    isActive: profileDoc?.isActive ?? true,
    avatarInitials: deriveAvatarInitials(fullName),
    createdAt:
      typeof profileDoc?.createdAt === 'string'
        ? profileDoc.createdAt
        : new Date().toISOString(),
    updatedAt:
      typeof profileDoc?.updatedAt === 'string'
        ? profileDoc.updatedAt
        : new Date().toISOString(),
  };

  return {
    user: firebaseUser,
    role,
    profile,
  };
}

/**
 * Dispatches password recovery link.
 */
export async function sendPasswordReset(email: string): Promise<void> {
  if (!email || !email.includes('@')) {
    throw new Error('Please enter a valid campus email address.');
  }
  await sendPasswordResetEmail(auth, email.trim());
}

/**
 * Signs out the current user and clears session state.
 */
export async function signOutCurrentUser(): Promise<void> {
  await clearSessionState();
  await firebaseSignOut(auth);
}

