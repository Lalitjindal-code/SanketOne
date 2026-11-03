import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, connectEmulatorsIfNeeded } from '@/lib/firebase';
import {
  signInUser,
  signUpStudent,
  signOutCurrentUser,
  sendPasswordReset,
  deriveAvatarInitials,
  type StudentSignUpData,
} from '@/lib/authService';
import type { UserRole, DemoUser, UserProfile } from '@/types/user';
import type { UserProfileDoc } from '@/types/firestore';

export const DEMO_PERSONAS: Record<'student' | 'admin', DemoUser> = {
  student: {
    id: 'usr_student_01',
    name: 'Aditi Sharma',
    email: 'aditi.sharma@campus.edu',
    role: 'student',
    meta: {
      rollOrTitle: 'CS • Sem 6 (#22BCS041)',
      department: 'Computer Science & Engineering',
      avatarInitials: 'AS',
    },
  },
  admin: {
    id: 'usr_admin_01',
    name: 'Dr. Sunita Menon',
    email: 'dean.affairs@campus.edu',
    role: 'admin',
    meta: {
      rollOrTitle: 'Dean of Student Affairs',
      department: 'Deanery / Chief Custodian',
      avatarInitials: 'SM',
    },
  },
};

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  isLoading: boolean;
  currentDemoPersona: DemoUser | null;
  switchDemoPersona: (role: UserRole) => void;
  login: (email: string, password?: string, fallbackRole?: UserRole) => Promise<void>;
  signup: (data: StudentSignUpData) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_STORAGE_KEY = 'sanketone_demo_role';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

  const [isLoading, setIsLoading] = useState<boolean>(() => !isDemoMode);
  const [role, setRole] = useState<UserRole | null>(() => {
    if (isDemoMode) {
      const saved = localStorage.getItem(DEMO_STORAGE_KEY) as UserRole | null;
      return saved === 'admin' ? 'admin' : 'student';
    }
    return null;
  });

  const [currentDemoPersona, setCurrentDemoPersona] = useState<DemoUser | null>(() => {
    if (isDemoMode) {
      const activeRole = (localStorage.getItem(DEMO_STORAGE_KEY) as UserRole) || 'student';
      return DEMO_PERSONAS[activeRole] || DEMO_PERSONAS.student;
    }
    return null;
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    if (isDemoMode) {
      const activeRole = (localStorage.getItem(DEMO_STORAGE_KEY) as UserRole) || 'student';
      const persona = DEMO_PERSONAS[activeRole] || DEMO_PERSONAS.student;
      return {
        id: persona.id,
        role: persona.role,
        fullName: persona.name,
        email: persona.email,
        rollNumber: persona.role === 'student' ? '22BCS041' : undefined,
        departmentOrFaculty: persona.meta.department,
        hostelBlock: persona.role === 'student' ? 'Hostel IV (Mahanadi)' : undefined,
        isActive: true,
        avatarInitials: persona.meta.avatarInitials,
        createdAt: '2026-01-15T00:00:00Z',
        updatedAt: '2026-03-01T00:00:00Z',
      };
    }
    return null;
  });

  // Ensure emulators are connected in dev
  useEffect(() => {
    connectEmulatorsIfNeeded();
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Token claims check
          const tokenResult = await firebaseUser.getIdTokenResult();
          const userRole: UserRole =
            tokenResult.claims.role === 'admin' || tokenResult.claims.admin === true
              ? 'admin'
              : 'student';

          // Try fetching Firestore profile doc
          let profileDoc: UserProfileDoc | null = null;
          try {
            const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (snap.exists()) {
              profileDoc = snap.data() as UserProfileDoc;
            }
          } catch (err) {
            console.warn('[SanketOne] Could not fetch user profile:', err);
          }

          const fullName =
            profileDoc?.fullName ||
            firebaseUser.displayName ||
            firebaseUser.email?.split('@')[0] ||
            'Campus User';

          const activeProfile: UserProfile = {
            id: firebaseUser.uid,
            role: userRole,
            fullName,
            email: firebaseUser.email || '',
            rollNumber: profileDoc?.rollNumber,
            departmentOrFaculty:
              profileDoc?.department ||
              (userRole === 'admin' ? 'Deanery / Chief Custodian' : 'General Student Body'),
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

          setUser(activeProfile);
          setRole(userRole);
        } catch (error) {
          console.error('[SanketOne] Auth state resolution error:', error);
        }
      } else {
        // When not logged into Firebase Auth:
        // In Demo mode, preserve or restore the selected demo persona
        if (isDemoMode) {
          const savedRole = (localStorage.getItem(DEMO_STORAGE_KEY) as UserRole) || 'student';
          const persona = DEMO_PERSONAS[savedRole];
          setCurrentDemoPersona(persona);
          setRole(persona.role);
          setUser({
            id: persona.id,
            role: persona.role,
            fullName: persona.name,
            email: persona.email,
            rollNumber: persona.role === 'student' ? '22BCS041' : undefined,
            departmentOrFaculty: persona.meta.department,
            hostelBlock: persona.role === 'student' ? 'Hostel IV (Mahanadi)' : undefined,
            isActive: true,
            avatarInitials: persona.meta.avatarInitials,
            createdAt: '2026-01-15T00:00:00Z',
            updatedAt: '2026-03-01T00:00:00Z',
          });
        } else {
          setUser(null);
          setRole(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [isDemoMode]);

  const switchDemoPersona = (newRole: UserRole) => {
    if (!isDemoMode) {
      console.warn('Persona switching is strictly restricted to Demo Mode.');
      return;
    }
    const persona = DEMO_PERSONAS[newRole];
    setRole(newRole);
    setCurrentDemoPersona(persona);
    setUser({
      id: persona.id,
      role: persona.role,
      fullName: persona.name,
      email: persona.email,
      rollNumber: persona.role === 'student' ? '22BCS041' : undefined,
      departmentOrFaculty: persona.meta.department,
      hostelBlock: persona.role === 'student' ? 'Hostel IV (Mahanadi)' : undefined,
      isActive: true,
      avatarInitials: persona.meta.avatarInitials,
      createdAt: '2026-01-15T00:00:00Z',
      updatedAt: '2026-03-01T00:00:00Z',
    });
    localStorage.setItem(DEMO_STORAGE_KEY, newRole);
  };

  const login = async (email: string, password?: string, fallbackRole?: UserRole) => {
    if (isDemoMode) {
      if (password) {
        try {
          const result = await signInUser(email, password);
          setUser(result.profile);
          setRole(result.role);
          return;
        } catch (err) {
          console.warn('[SanketOne] Firebase Auth unavailable in demo mode, activating demo persona session:', err);
        }
      }
      const effectiveRole = fallbackRole || (email.includes('dean') || email.includes('admin') ? 'admin' : 'student');
      switchDemoPersona(effectiveRole);
      return;
    }

    if (password) {
      // Authenticate against Firebase Auth
      const result = await signInUser(email, password);
      setUser(result.profile);
      setRole(result.role);
      return;
    }

    throw new Error('Password is required for live authentication.');
  };

  const signup = async (data: StudentSignUpData) => {
    if (isDemoMode) {
      try {
        const result = await signUpStudent(data);
        setUser(result.profile);
        setRole('student');
        return;
      } catch (err) {
        console.warn('[SanketOne] Firebase signup unavailable in demo mode, simulating student onboarding:', err);
        const demoUser: UserProfile = {
          id: `usr_${Date.now()}`,
          role: 'student',
          fullName: data.fullName,
          email: data.email,
          rollNumber: data.rollNumber,
          departmentOrFaculty: data.department || 'General Student Body',
          hostelBlock: data.hostelBlock,
          isActive: true,
          avatarInitials: deriveAvatarInitials(data.fullName),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUser(demoUser);
        setRole('student');
        return;
      }
    }
    const result = await signUpStudent(data);
    setUser(result.profile);
    setRole('student');
  };

  const logout = async () => {
    await signOutCurrentUser();
    if (!isDemoMode) {
      setUser(null);
      setRole(null);
    } else {
      // In demo mode, reset to student persona default
      switchDemoPersona('student');
    }
  };

  const resetPassword = async (email: string) => {
    if (isDemoMode) {
      try {
        await sendPasswordReset(email);
      } catch (err) {
        console.warn('[SanketOne] Firebase reset password unavailable in demo mode, simulating reset email transmission:', err);
      }
      return;
    }
    await sendPasswordReset(email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!role,
        isDemoMode,
        isLoading,
        currentDemoPersona,
        switchDemoPersona,
        login,
        signup,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
