export type ComplaintStatus =
  | 'raised'
  | 'under_review'
  | 'in_progress'
  | 'resolved'
  | 'verified'
  | 'reopened'
  | 'archived';

export type ComplaintPriority = 'low' | 'medium' | 'high' | 'critical';

export interface ComplaintEvidence {
  id: string;
  complaintId: string;
  uploaderId: string;
  stage: 'intake' | 'resolution';
  fileUrl: string;
  storagePath: string;
  fileType: 'image' | 'audio' | 'document';
  mimeType: string;
  fileSizeBytes: number;
  caption?: string;
  createdAt: string;
}

export interface ComplaintStatusHistory {
  id: string;
  complaintId: string;
  actorId: string;
  previousStatus: ComplaintStatus;
  newStatus: ComplaintStatus;
  reasonOrNotes?: string;
  createdAt: string;
}

export interface ComplaintInternalNote {
  id: string;
  complaintId: string;
  authorId: string;
  authorName: string;
  noteText: string;
  isRestricted: boolean; // Admin only
  createdAt: string;
}

export interface ComplaintAuditLog {
  id: string;
  complaintId: string;
  actorId: string;
  actorName: string;
  actionType:
    | 'PRIORITY_OVERRIDE'
    | 'DEPT_REASSIGN'
    | 'SLA_ESCALATION'
    | 'MERGE_CLUSTER'
    | 'STATUS_CHANGE'
    | 'RESOLUTION_SUBMITTED'
    | 'STUDENT_VERIFIED'
    | 'STUDENT_REOPENED';
  details: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  ticketId: string; // e.g., 'SNK-8802'
  authorId: string;
  authorName: string;
  authorRollNumber?: string;
  isAnonymous: boolean;
  category: string;
  subcategory: string;
  title: string;
  description: string;
  priority: ComplaintPriority;
  systemSeverity: ComplaintPriority;
  status: ComplaintStatus;
  locationZone: string;
  specificDemarcation: string;
  geoLat?: number; // Optional for MVP
  geoLng?: number; // Optional for MVP
  geotag?: string;
  affectedCountEst: number;
  endorsementsCount: number;
  endorsedBy?: string[];
  followersCount: number;
  followedBy?: string[];
  assignedDepartmentId?: string;
  assignedDepartmentName?: string;
  assignedTechnicianName?: string;
  assignedTechnicianBadge?: string;
  currentSlaTier: 'T1' | 'T2' | 'T3';
  slaDeadline?: string;
  slaHoursTotal?: number;
  isBreached: boolean;
  resolutionSummary?: string;
  resolvedAt?: string;
  verifiedAt?: string;
  reopenedAt?: string;
  createdAt: string;
  updatedAt: string;
  evidence: ComplaintEvidence[];
  statusHistory?: ComplaintStatusHistory[];
  internalNotes?: ComplaintInternalNote[];
  auditLogs?: ComplaintAuditLog[];
  comments?: Array<{
    id: string;
    authorName: string;
    authorRole: 'student' | 'admin';
    text: string;
    createdAt: string;
    isInternal?: boolean;
  }>;
}

