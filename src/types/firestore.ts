import type { Timestamp, FieldValue } from 'firebase/firestore';

export type UserRole = 'student' | 'admin';
export type ComplaintStatus =
  | 'raised'
  | 'under_review'
  | 'in_progress'
  | 'resolved'
  | 'verified'
  | 'reopened'
  | 'closed';
export type ComplaintPriority = 'low' | 'medium' | 'high' | 'critical';

// 1. User Profile Document (/users/{userId})
export interface UserProfileDoc {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  rollNumber?: string;
  department?: string;
  hostelBlock?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  isActive: boolean;
  fcmTokens?: string[];
  createdAt: Timestamp | FieldValue | string;
  updatedAt: Timestamp | FieldValue | string;
}

// 2. Authoritative Complaint Document (/complaints/{complaintId})
export interface AuthoritativeComplaintDoc {
  id: string;
  ticketId: string;
  studentId: string;
  studentIdentity: {
    fullName: string;
    rollNumber?: string;
    email: string;
    maskedUid: string;
  };
  title: string;
  description: string;
  category: string;
  subcategory: string;
  locationZone: string;
  specificDemarcation?: string;
  geotag?: string;
  wifiApIdentifier?: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  assignedDepartmentId?: string;
  assignedDepartmentName?: string;
  assignedTechnicianName?: string;
  assignedTechnicianBadge?: string;
  resolutionSummary?: string;
  resolvedAt?: Timestamp | FieldValue | string | null;
  verifiedAt?: Timestamp | FieldValue | string | null;
  isAnonymousToPublic: boolean;
  isPublic: boolean;
  surgeScore: number;
  affectedCountEst: number;
  endorsementsCount: number;
  followersCount: number;
  isBreached: boolean;
  slaTargetTimestamp?: Timestamp | FieldValue | string;
  evidenceThumbnails?: string[];
  createdAt: Timestamp | FieldValue | string;
  updatedAt: Timestamp | FieldValue | string;
}

// 3. Sanitized Public Complaint Projection (/publicComplaints/{complaintId})
export interface PublicComplaintDoc {
  id: string;
  ticketId: string;
  maskedComplainant: string;
  title: string;
  description: string;
  category: string;
  locationZone: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  assignedDepartmentName?: string;
  endorsementsCount: number;
  affectedCountEst: number;
  photoUrl?: string;
  photoTimestamp?: string;
  isResolved: boolean;
  resolutionNote?: string | null;
  createdAt: Timestamp | FieldValue | string;
  updatedAt: Timestamp | FieldValue | string;
}

// 4. Evidence Subcollection Document (/complaints/{complaintId}/evidence/{evidenceId})
export interface ComplaintEvidenceDoc {
  id: string;
  complaintId: string;
  uploaderId: string;
  stage: 'intake' | 'resolution';
  storagePath: string;
  fileUrl: string;
  fileType: 'image' | 'video' | 'document';
  mimeType: string;
  fileSizeBytes: number;
  caption?: string;
  isPostResolutionProof: boolean;
  createdAt: Timestamp | FieldValue | string;
}

// 5. Status History Subcollection Document (/complaints/{complaintId}/statusHistory/{historyId})
export interface StatusHistoryDoc {
  id: string;
  complaintId: string;
  actorId: string;
  actorRole: UserRole | 'system';
  actorName: string;
  previousStatus: ComplaintStatus;
  newStatus: ComplaintStatus;
  reasonOrNotes?: string;
  createdAt: Timestamp | FieldValue | string;
}

// 6. Internal Note Subcollection Document (/complaints/{complaintId}/internalNotes/{noteId})
export interface InternalNoteDoc {
  id: string;
  complaintId: string;
  authorId: string;
  authorName: string;
  authorRole: 'admin';
  noteText: string;
  isTechnicianLog: boolean;
  createdAt: Timestamp | FieldValue | string;
}

// 7. Audit Log Subcollection Document (/complaints/{complaintId}/auditLogs/{logId})
export interface AuditLogDoc {
  id: string;
  complaintId: string;
  actorId?: string;
  actorName: string;
  actorRole: UserRole | 'system';
  actionType: string;
  details: Record<string, unknown>;
  createdAt: Timestamp | FieldValue | string;
}

// 8. Endorsement Subcollection Document (/complaints/{complaintId}/endorsements/{studentId})
export interface EndorsementDoc {
  studentId: string;
  endorsedAt: Timestamp | FieldValue | string;
}

// 9. Follower Subcollection Document (/complaints/{complaintId}/followers/{studentId})
export interface FollowerDoc {
  studentId: string;
  followedAt: Timestamp | FieldValue | string;
}

// 10. Discussion Subcollection Document (/complaints/{complaintId}/discussions/{commentId})
export interface DiscussionDoc {
  id: string;
  complaintId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  isOfficialResponse: boolean;
  createdAt: Timestamp | FieldValue | string;
}

// 11. Student Verification Record Subcollection Document (/complaints/{complaintId}/verifications/{verificationId})
export interface VerificationRecordDoc {
  id: string;
  complaintId: string;
  studentId: string;
  studentName: string;
  satisfaction: 'confirmed' | 'reopened';
  feedback?: string;
  quorumRole: 'original_complainant' | 'endorser' | 'peer_verifier';
  verifiedAt: Timestamp | FieldValue | string;
}

// 12. Department Assignment Subcollection Document (/complaints/{complaintId}/assignments/{assignmentId})
export interface DepartmentAssignmentDoc {
  id: string;
  complaintId: string;
  departmentId: string;
  departmentName: string;
  assignedBy: string;
  technicianName: string;
  technicianBadge: string;
  priorityAtAssignment: ComplaintPriority;
  notes?: string;
  isActive: boolean;
  assignedAt: Timestamp | FieldValue | string;
}

// 13. System Counter Document (/systemCounters/ticketCounter)
export interface TicketCounterDoc {
  prefix: string;
  currentSequence: number;
  lastAllocatedTicket: string;
  updatedAt: Timestamp | FieldValue | string;
}

// 14. Department Document (/departments/{deptId})
export interface DepartmentDoc {
  id: string;
  code: string;
  name: string;
  zoneDesk?: string;
  leadOfficerName?: string;
  contactEmail?: string;
  isActive: boolean;
  createdAt: Timestamp | FieldValue | string;
}

// 15. SLA Configuration Document (/slaConfigurations/{configId})
export interface SlaConfigDoc {
  id: string;
  category: string;
  priority: ComplaintPriority;
  targetResolutionHours: number;
  escalationTier1Hours: number;
  escalationTier2Hours: number;
  isActive: boolean;
  createdAt: Timestamp | FieldValue | string;
}

// 16. Duplicate Cluster Document (/duplicateClusters/{clusterId})
export interface DuplicateClusterDoc {
  id: string;
  clusterCode: string;
  title: string;
  primaryComplaintId?: string;
  primaryTicketId?: string;
  category: string;
  similarityScore: number;
  radialRangeMeters: number;
  status: 'detected' | 'merged' | 'dismissed';
  secondaryComplaintIds: string[];
  summary?: string;
  createdAt: Timestamp | FieldValue | string;
  updatedAt: Timestamp | FieldValue | string;
}

// 17. Announcement Document (/announcements/{announcementId})
export interface AnnouncementDoc {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  summary: string;
  tag: string;
  priority: 'normal' | 'urgent' | 'scheduled';
  isActive: boolean;
  createdAt: Timestamp | FieldValue | string;
}

// 18. Notification Document (/users/{userId}/notifications/{notifId})
export interface NotificationDoc {
  id: string;
  recipientRole: UserRole | 'all';
  title: string;
  message: string;
  ticketId?: string;
  complaintId?: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  isRead: boolean;
  createdAt: Timestamp | FieldValue | string;
}
