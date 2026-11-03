export type UserRole = 'student' | 'admin';

export interface UserProfile {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  rollNumber?: string;
  departmentOrFaculty: string;
  hostelBlock?: string;
  phoneNumber?: string;
  isActive: boolean;
  avatarInitials: string;
  createdAt: string;
  updatedAt: string;
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  meta: {
    rollOrTitle: string;
    department: string;
    avatarInitials: string;
  };
}

