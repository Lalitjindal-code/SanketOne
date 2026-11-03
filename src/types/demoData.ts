import type {
  Complaint,
  ComplaintStatus,
  ComplaintPriority,
  ComplaintEvidence,
} from './complaint';
import type { UserRole } from './user';

export interface DuplicateCluster {
  id: string;
  name: string;
  location: string;
  primaryTicketId: string;
  secondaryTicketIds: string[];
  similarityScore: number;
  status: 'active' | 'merged' | 'dismissed';
  mergedAt?: string;
  mergedBy?: string;
  description: string;
}

export interface NotificationItem {
  id: string;
  recipientRole: UserRole | 'all';
  recipientId?: string;
  title: string;
  message: string;
  ticketId?: string;
  type: 'info' | 'alert' | 'success' | 'escalation';
  isRead: boolean;
  createdAt: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  body: string;
  author: string;
  authorRole: string;
  category: string;
  publishedAt: string;
  isPinned: boolean;
}

export interface NewComplaintInput {
  title: string;
  category: string;
  subcategory?: string;
  locationZone: string;
  specificDemarcation: string;
  description: string;
  priority?: ComplaintPriority;
  isAnonymous: boolean;
  evidenceFiles?: Array<{
    name: string;
    url: string;
    size: number;
    type: 'image' | 'audio' | 'document';
  }>;
}

export interface DemoDataContextType {
  complaints: Complaint[];
  clusters: DuplicateCluster[];
  notifications: NotificationItem[];
  announcements: AnnouncementItem[];
  unreadNotificationCount: number;

  // Complaint Lifecycle Mutations
  submitComplaint: (input: NewComplaintInput) => Complaint;
  updateComplaintStatus: (ticketId: string, status: ComplaintStatus, reason?: string) => void;
  assignDepartment: (
    ticketId: string,
    deptId: string,
    deptName: string,
    techName?: string,
    techBadge?: string
  ) => void;
  updatePriority: (ticketId: string, priority: ComplaintPriority, reason?: string) => void;
  submitResolutionEvidence: (ticketId: string, summary: string, evidenceFiles?: ComplaintEvidence[]) => void;
  verifyResolution: (ticketId: string, satisfaction: 'confirmed' | 'reopened', feedback?: string) => void;
  reopenComplaint: (ticketId: string, reason: string) => void;
  endorseComplaint: (ticketId: string, studentId: string) => void;
  addComment: (
    ticketId: string,
    authorName: string,
    authorRole: 'student' | 'admin',
    text: string,
    isInternal?: boolean
  ) => void;

  // Admin Smart Prioritization Mutations
  mergeCluster: (clusterId: string, primaryTicketId: string, secondaryTicketIds: string[]) => void;
  acceptSuggestedPriority: (ticketId: string, targetPriority: ComplaintPriority, rationale: string) => void;

  // Admin SLA Escalation Mutations
  dispatchContractor: (ticketId: string, contractorName: string, notes: string) => void;
  recordDeferral: (ticketId: string, justification: string, hours: number) => void;

  // Notification Operations
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: (role?: UserRole) => void;

  // State Management
  resetDemoData: () => void;

  // Query Helpers
  getComplaintByTicketId: (ticketId: string) => Complaint | undefined;
  getComplaintsByStatus: (status: ComplaintStatus) => Complaint[];
}
