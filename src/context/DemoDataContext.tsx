import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type {
  Complaint,
  ComplaintStatus,
  ComplaintPriority,
  ComplaintEvidence,
  ComplaintAuditLog,
  ComplaintStatusHistory,
} from '@/types/complaint';
import type {
  DuplicateCluster,
  NotificationItem,
  AnnouncementItem,
  NewComplaintInput,
  DemoDataContextType,
} from '@/types/demoData';
import {
  INITIAL_COMPLAINTS,
  INITIAL_CLUSTERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ANNOUNCEMENTS,
} from '@/data/mockSeedData';
import { useAuth } from './AuthContext';

const DemoDataContext = createContext<DemoDataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  COMPLAINTS: 'sanketone_demo_complaints_v1',
  CLUSTERS: 'sanketone_demo_clusters_v1',
  NOTIFICATIONS: 'sanketone_demo_notifications_v1',
  ANNOUNCEMENTS: 'sanketone_demo_announcements_v1',
};

export const DemoDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { role, user } = useAuth();

  // Load from localStorage or fallback to initial seed
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved complaints from localStorage', e);
    }
    return INITIAL_COMPLAINTS;
  });

  const [clusters, setClusters] = useState<DuplicateCluster[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLUSTERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved clusters from localStorage', e);
    }
    return INITIAL_CLUSTERS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved notifications from localStorage', e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved announcements from localStorage', e);
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  }, [complaints]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLUSTERS, JSON.stringify(clusters));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  }, [clusters]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  }, [announcements]);

  // Compute unread count for current role
  const unreadNotificationCount = notifications.filter(
    (n) => !n.isRead && (n.recipientRole === 'all' || n.recipientRole === role)
  ).length;

  // 1. Submit a new complaint (Student)
  const submitComplaint = (input: NewComplaintInput): Complaint => {
    const randomTicketNum = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `SNK-${randomTicketNum}`;
    const now = new Date().toISOString();

    const priority: ComplaintPriority = input.priority || 'medium';
    let slaTier: 'T1' | 'T2' | 'T3' = 'T2';
    let slaHours = 12;

    if (priority === 'critical') {
      slaTier = 'T1';
      slaHours = 4;
    } else if (priority === 'high') {
      slaTier = 'T2';
      slaHours = 12;
    } else if (priority === 'low') {
      slaTier = 'T3';
      slaHours = 48;
    }

    const slaDeadline = new Date(Date.now() + 1000 * 60 * 60 * slaHours).toISOString();

    const evidence: ComplaintEvidence[] = (input.evidenceFiles || []).map((file, idx) => ({
      id: `ev_${ticketId}_${idx + 1}`,
      complaintId: ticketId,
      uploaderId: user?.id || 'usr_student_01',
      stage: 'intake',
      fileUrl: file.url,
      storagePath: `complaints/${ticketId}/${file.name}`,
      fileType: file.type || 'image',
      mimeType: file.type === 'image' ? 'image/jpeg' : 'application/octet-stream',
      fileSizeBytes: file.size,
      caption: `Intake evidence: ${file.name}`,
      createdAt: now,
    }));

    const initialHistory: ComplaintStatusHistory = {
      id: `sh_${ticketId}_1`,
      complaintId: ticketId,
      actorId: user?.id || 'usr_student_01',
      previousStatus: 'raised',
      newStatus: 'raised',
      reasonOrNotes: 'Complaint logged through student intake terminal.',
      createdAt: now,
    };

    const initialAudit: ComplaintAuditLog = {
      id: `al_${ticketId}_1`,
      complaintId: ticketId,
      actorId: user?.id || 'usr_student_01',
      actorName: input.isAnonymous ? 'Anonymous Student' : user?.fullName || 'Aditi Sharma',
      actionType: 'STATUS_CHANGE',
      details: {
        action: 'CREATED',
        category: input.category,
        location: input.locationZone,
        priority,
      },
      createdAt: now,
    };

    const newComplaint: Complaint = {
      id: ticketId,
      ticketId,
      authorId: user?.id || 'usr_student_01',
      authorName: input.isAnonymous ? 'Anonymous Student' : user?.fullName || 'Aditi Sharma',
      authorRollNumber: input.isAnonymous ? undefined : user?.rollNumber,
      isAnonymous: input.isAnonymous,
      category: input.category,
      subcategory: input.subcategory || 'General',
      title: input.title,
      description: input.description,
      priority,
      systemSeverity: priority,
      status: 'raised',
      locationZone: input.locationZone,
      specificDemarcation: input.specificDemarcation,
      geotag: 'Lat: 28.5450° N, Long: 77.1925° E',
      affectedCountEst: 1,
      endorsementsCount: 1,
      endorsedBy: [user?.id || 'usr_student_01'],
      followersCount: 1,
      followedBy: [user?.id || 'usr_student_01'],
      currentSlaTier: slaTier,
      slaDeadline,
      slaHoursTotal: slaHours,
      isBreached: false,
      createdAt: now,
      updatedAt: now,
      evidence,
      statusHistory: [initialHistory],
      auditLogs: [initialAudit],
      internalNotes: [],
      comments: [],
    };

    // Prepend to complaints list
    setComplaints((prev) => [newComplaint, ...prev]);

    // Dispatch notification to Admin
    const adminNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      recipientRole: 'admin',
      title: 'New Complaint Registered',
      message: `Docket #${ticketId} ("${input.title}") reported in ${input.locationZone}. Priority: ${priority.toUpperCase()}.`,
      ticketId,
      type: priority === 'critical' ? 'alert' : 'info',
      isRead: false,
      createdAt: now,
    };

    setNotifications((prev) => [adminNotif, ...prev]);

    return newComplaint;
  };

  // 2. Update status (Admin or system)
  const updateComplaintStatus = (ticketId: string, newStatus: ComplaintStatus, reason?: string) => {
    const now = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.ticketId !== ticketId) return c;

        const historyItem: ComplaintStatusHistory = {
          id: `sh_${ticketId}_${Date.now()}`,
          complaintId: ticketId,
          actorId: user?.id || 'admin_user',
          previousStatus: c.status,
          newStatus,
          reasonOrNotes: reason || `Status updated from ${c.status} to ${newStatus}`,
          createdAt: now,
        };

        const auditItem: ComplaintAuditLog = {
          id: `al_${ticketId}_${Date.now()}`,
          complaintId: ticketId,
          actorId: user?.id || 'admin_user',
          actorName: user?.fullName || 'Dr. Sunita Menon',
          actionType: 'STATUS_CHANGE',
          details: { previousStatus: c.status, newStatus, reason },
          createdAt: now,
        };

        return {
          ...c,
          status: newStatus,
          updatedAt: now,
          statusHistory: [...(c.statusHistory || []), historyItem],
          auditLogs: [...(c.auditLogs || []), auditItem],
        };
      })
    );

    // Notify student of status update
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      recipientRole: 'student',
      title: `Docket #${ticketId} Status Updated`,
      message: `Your ticket has transitioned to "${newStatus.replace('_', ' ').toUpperCase()}". ${reason ? `Notes: ${reason}` : ''}`,
      ticketId,
      type: 'info',
      isRead: false,
      createdAt: now,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // 3. Assign Department & Technician (Admin)
  const assignDepartment = (
    ticketId: string,
    deptId: string,
    deptName: string,
    techName?: string,
    techBadge?: string
  ) => {
    const now = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.ticketId !== ticketId) return c;

        const nextStatus: ComplaintStatus = c.status === 'raised' ? 'in_progress' : c.status;

        const auditItem: ComplaintAuditLog = {
          id: `al_${ticketId}_${Date.now()}`,
          complaintId: ticketId,
          actorId: user?.id || 'admin_user',
          actorName: user?.fullName || 'Dr. Sunita Menon',
          actionType: 'DEPT_REASSIGN',
          details: { department: deptName, technician: techName },
          createdAt: now,
        };

        return {
          ...c,
          assignedDepartmentId: deptId,
          assignedDepartmentName: deptName,
          assignedTechnicianName: techName || 'Dispatched Field Team',
          assignedTechnicianBadge: techBadge || '#TECH-AUTO',
          status: nextStatus,
          updatedAt: now,
          auditLogs: [...(c.auditLogs || []), auditItem],
        };
      })
    );

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      recipientRole: 'student',
      title: `Technician Assigned to #${ticketId}`,
      message: `Assigned to ${deptName} (${techName || 'Field Unit'}). Status is now In Progress.`,
      ticketId,
      type: 'info',
      isRead: false,
      createdAt: now,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // 4. Update Priority (Admin)
  const updatePriority = (ticketId: string, priority: ComplaintPriority, reason?: string) => {
    const now = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.ticketId !== ticketId) return c;

        let slaTier: 'T1' | 'T2' | 'T3' = c.currentSlaTier;
        let slaHours = c.slaHoursTotal || 12;

        if (priority === 'critical') {
          slaTier = 'T1';
          slaHours = 4;
        }

        const auditItem: ComplaintAuditLog = {
          id: `al_${ticketId}_${Date.now()}`,
          complaintId: ticketId,
          actorId: user?.id || 'admin_user',
          actorName: user?.fullName || 'Dr. Sunita Menon',
          actionType: 'PRIORITY_OVERRIDE',
          details: { oldPriority: c.priority, newPriority: priority, reason },
          createdAt: now,
        };

        return {
          ...c,
          priority,
          systemSeverity: priority,
          currentSlaTier: slaTier,
          slaHoursTotal: slaHours,
          updatedAt: now,
          auditLogs: [...(c.auditLogs || []), auditItem],
        };
      })
    );
  };

  // 5. Submit Resolution Evidence (Admin)
  const submitResolutionEvidence = (
    ticketId: string,
    summary: string,
    evidenceFiles?: ComplaintEvidence[]
  ) => {
    const now = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.ticketId !== ticketId) return c;

        const defaultProof: ComplaintEvidence = {
          id: `ev_res_${ticketId}_${Date.now()}`,
          complaintId: ticketId,
          uploaderId: user?.id || 'admin_user',
          stage: 'resolution',
          fileUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAI1Lt-HczKY9boDxlnjBQIXIm51p5uwamvmRrUmaqRBDWFLiqE0ktauzMtfnvhgAkgG2nvlpyGgIEbnV-lIDVDMR5QVUXdkzYZpkZXnLWvKfSERf_jzaPdCPj-2QexVmzm3Y3B39avwpoPYhZeHji_XPREHQBDPlPH8EcY61H0Ffub_x8JiV_n9Mc1M6oAUm4QrUb7rT2l79J9CzJDuGYn3RRLqAy1PrGWUonQYBcu',
          storagePath: `complaints/${ticketId}/resolution_proof.jpg`,
          fileType: 'image',
          mimeType: 'image/jpeg',
          fileSizeBytes: 1540000,
          caption: 'Verified field repair documentation and operational check',
          createdAt: now,
        };

        const resolvedEvidence = evidenceFiles && evidenceFiles.length > 0 ? evidenceFiles : [defaultProof];

        const historyItem: ComplaintStatusHistory = {
          id: `sh_${ticketId}_res_${Date.now()}`,
          complaintId: ticketId,
          actorId: user?.id || 'admin_user',
          previousStatus: c.status,
          newStatus: 'resolved',
          reasonOrNotes: `Technician sign-off: ${summary}`,
          createdAt: now,
        };

        const auditItem: ComplaintAuditLog = {
          id: `al_${ticketId}_res_${Date.now()}`,
          complaintId: ticketId,
          actorId: user?.id || 'admin_user',
          actorName: user?.fullName || 'Dr. Sunita Menon',
          actionType: 'RESOLUTION_SUBMITTED',
          details: { summary, evidenceCount: resolvedEvidence.length },
          createdAt: now,
        };

        return {
          ...c,
          status: 'resolved',
          resolutionSummary: summary,
          resolvedAt: now,
          updatedAt: now,
          evidence: [...c.evidence, ...resolvedEvidence],
          statusHistory: [...(c.statusHistory || []), historyItem],
          auditLogs: [...(c.auditLogs || []), auditItem],
        };
      })
    );

    // Notify student: Verification required!
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      recipientRole: 'student',
      title: `Resolution Sign-off Required: #${ticketId}`,
      message: `Maintenance has been signed off by the assigned technician. Please confirm whether the issue is resolved.`,
      ticketId,
      type: 'success',
      isRead: false,
      createdAt: now,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // 6. Student Verifies Resolution or Reopens (Student)
  const verifyResolution = (ticketId: string, satisfaction: 'confirmed' | 'reopened', feedback?: string) => {
    const now = new Date().toISOString();

    if (satisfaction === 'reopened') {
      reopenComplaint(ticketId, feedback || 'Problem persists after technician sign-off.');
      return;
    }

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.ticketId !== ticketId) return c;

        const historyItem: ComplaintStatusHistory = {
          id: `sh_${ticketId}_ver_${Date.now()}`,
          complaintId: ticketId,
          actorId: user?.id || 'student_user',
          previousStatus: 'resolved',
          newStatus: 'verified',
          reasonOrNotes: feedback || 'Student signed off and confirmed resolution.',
          createdAt: now,
        };

        const auditItem: ComplaintAuditLog = {
          id: `al_${ticketId}_ver_${Date.now()}`,
          complaintId: ticketId,
          actorId: user?.id || 'student_user',
          actorName: user?.fullName || 'Aditi Sharma',
          actionType: 'STUDENT_VERIFIED',
          details: { feedback: feedback || 'Confirmed resolved' },
          createdAt: now,
        };

        return {
          ...c,
          status: 'verified',
          verifiedAt: now,
          updatedAt: now,
          statusHistory: [...(c.statusHistory || []), historyItem],
          auditLogs: [...(c.auditLogs || []), auditItem],
        };
      })
    );

    // Notify Admin of completed verification
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      recipientRole: 'admin',
      title: `Student Verified Resolution: #${ticketId}`,
      message: `Student verified and accepted the resolution for #${ticketId}. Ticket is permanently marked Verified in the civic registry.`,
      ticketId,
      type: 'success',
      isRead: false,
      createdAt: now,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // 7. Student Reopens Issue (Student)
  const reopenComplaint = (ticketId: string, reason: string) => {
    const now = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.ticketId !== ticketId) return c;

        const historyItem: ComplaintStatusHistory = {
          id: `sh_${ticketId}_reopen_${Date.now()}`,
          complaintId: ticketId,
          actorId: user?.id || 'student_user',
          previousStatus: c.status,
          newStatus: 'reopened',
          reasonOrNotes: `Student rejected resolution: ${reason}`,
          createdAt: now,
        };

        const auditItem: ComplaintAuditLog = {
          id: `al_${ticketId}_reopen_${Date.now()}`,
          complaintId: ticketId,
          actorId: user?.id || 'student_user',
          actorName: user?.fullName || 'Aditi Sharma',
          actionType: 'STUDENT_REOPENED',
          details: { reason },
          createdAt: now,
        };

        return {
          ...c,
          status: 'reopened',
          reopenedAt: now,
          priority: 'critical', // Elevate on reopen!
          systemSeverity: 'critical',
          currentSlaTier: 'T1',
          updatedAt: now,
          statusHistory: [...(c.statusHistory || []), historyItem],
          auditLogs: [...(c.auditLogs || []), auditItem],
        };
      })
    );

    // Notify Admin of escalation!
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      recipientRole: 'admin',
      title: `URGENT: Docket #${ticketId} REOPENED`,
      message: `Student rejected resolution for #${ticketId}. Reason: "${reason}". Automatically elevated to Critical Priority (Tier 1).`,
      ticketId,
      type: 'escalation',
      isRead: false,
      createdAt: now,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // 8. Endorse / +1 Me Too (Student)
  const endorseComplaint = (ticketId: string, studentId: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.ticketId !== ticketId) return c;

        const isAlreadyEndorsed = (c.endorsedBy || []).includes(studentId);
        const nextEndorsedBy = isAlreadyEndorsed
          ? (c.endorsedBy || []).filter((id) => id !== studentId)
          : [...(c.endorsedBy || []), studentId];

        const delta = isAlreadyEndorsed ? -1 : 1;

        return {
          ...c,
          endorsementsCount: Math.max(0, c.endorsementsCount + delta),
          affectedCountEst: Math.max(1, c.affectedCountEst + delta * 2),
          endorsedBy: nextEndorsedBy,
        };
      })
    );
  };

  // 9. Add comment or internal note
  const addComment = (
    ticketId: string,
    authorName: string,
    authorRole: 'student' | 'admin',
    text: string,
    isInternal: boolean = false
  ) => {
    const now = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.ticketId !== ticketId) return c;

        if (isInternal) {
          const newNote = {
            id: `in_${Date.now()}`,
            complaintId: ticketId,
            authorId: user?.id || 'admin_user',
            authorName,
            noteText: text,
            isRestricted: true,
            createdAt: now,
          };
          return {
            ...c,
            internalNotes: [...(c.internalNotes || []), newNote],
          };
        } else {
          const newComment = {
            id: `comm_${Date.now()}`,
            authorName,
            authorRole,
            text,
            createdAt: now,
            isInternal: false,
          };
          return {
            ...c,
            comments: [...(c.comments || []), newComment],
          };
        }
      })
    );
  };

  // 10. Merge Cluster (Admin)
  const mergeCluster = (clusterId: string, primaryTicketId: string, secondaryTicketIds: string[]) => {
    const now = new Date().toISOString();

    setClusters((prev) =>
      prev.map((cl) => {
        if (cl.id !== clusterId) return cl;
        return {
          ...cl,
          status: 'merged',
          mergedAt: now,
          mergedBy: user?.fullName || 'Dr. Sunita Menon',
        };
      })
    );

    // Record audit logs on the primary complaint
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.ticketId === primaryTicketId) {
          const auditItem: ComplaintAuditLog = {
            id: `al_${primaryTicketId}_${Date.now()}`,
            complaintId: primaryTicketId,
            actorId: user?.id || 'admin_user',
            actorName: user?.fullName || 'Dr. Sunita Menon',
            actionType: 'MERGE_CLUSTER',
            details: {
              clusterId,
              mergedSecondaryTickets: secondaryTicketIds,
              cumulativeAffectedEstimate: c.affectedCountEst + 250,
            },
            createdAt: now,
          };

          return {
            ...c,
            affectedCountEst: c.affectedCountEst + 250,
            endorsementsCount: c.endorsementsCount + 45,
            auditLogs: [...(c.auditLogs || []), auditItem],
          };
        }
        return c;
      })
    );
  };

  // 11. Accept Suggested Priority (Admin)
  const acceptSuggestedPriority = (
    ticketId: string,
    targetPriority: ComplaintPriority,
    rationale: string
  ) => {
    updatePriority(ticketId, targetPriority, rationale);
  };

  // 12. Dispatch Contractor (Admin)
  const dispatchContractor = (ticketId: string, contractorName: string, notes: string) => {
    const now = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.ticketId !== ticketId) return c;

        const auditItem: ComplaintAuditLog = {
          id: `al_${ticketId}_contractor_${Date.now()}`,
          complaintId: ticketId,
          actorId: user?.id || 'admin_user',
          actorName: user?.fullName || 'Dr. Sunita Menon',
          actionType: 'DEPT_REASSIGN',
          details: { contractor: contractorName, dispatchNotes: notes },
          createdAt: now,
        };

        return {
          ...c,
          assignedTechnicianName: `External Contractor: ${contractorName}`,
          assignedTechnicianBadge: '#CONTR-EXP',
          status: 'in_progress',
          updatedAt: now,
          auditLogs: [...(c.auditLogs || []), auditItem],
        };
      })
    );
  };

  // 13. Record Deferral (Admin)
  const recordDeferral = (ticketId: string, justification: string, hours: number) => {
    const now = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.ticketId !== ticketId) return c;

        const newDeadline = new Date(Date.now() + 1000 * 60 * 60 * hours).toISOString();

        const auditItem: ComplaintAuditLog = {
          id: `al_${ticketId}_deferral_${Date.now()}`,
          complaintId: ticketId,
          actorId: user?.id || 'admin_user',
          actorName: user?.fullName || 'Dr. Sunita Menon',
          actionType: 'SLA_ESCALATION',
          details: { justification, extendedHours: hours, newDeadline },
          createdAt: now,
        };

        return {
          ...c,
          slaDeadline: newDeadline,
          isBreached: false, // Reset breach flag on authorized deferral
          updatedAt: now,
          auditLogs: [...(c.auditLogs || []), auditItem],
        };
      })
    );
  };

  // 14. Notifications operations
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = (targetRole?: 'student' | 'admin') => {
    const roleToMatch = targetRole || role;
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.recipientRole === 'all' || n.recipientRole === roleToMatch) {
          return { ...n, isRead: true };
        }
        return n;
      })
    );
  };

  // 15. Reset Demo Data
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.COMPLAINTS);
    localStorage.removeItem(STORAGE_KEYS.CLUSTERS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENTS);

    setComplaints(INITIAL_COMPLAINTS);
    setClusters(INITIAL_CLUSTERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
  };

  // 16. Query Helpers
  const getComplaintByTicketId = (ticketId: string): Complaint | undefined => {
    const cleanId = ticketId.replace('#', '').trim();
    return complaints.find((c) => c.ticketId === cleanId || c.id === cleanId);
  };

  const getComplaintsByStatus = (status: ComplaintStatus): Complaint[] => {
    return complaints.filter((c) => c.status === status);
  };

  return (
    <DemoDataContext.Provider
      value={{
        complaints,
        clusters,
        notifications,
        announcements,
        unreadNotificationCount,
        submitComplaint,
        updateComplaintStatus,
        assignDepartment,
        updatePriority,
        submitResolutionEvidence,
        verifyResolution,
        reopenComplaint,
        endorseComplaint,
        addComment,
        mergeCluster,
        acceptSuggestedPriority,
        dispatchContractor,
        recordDeferral,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetDemoData,
        getComplaintByTicketId,
        getComplaintsByStatus,
      }}
    >
      {children}
    </DemoDataContext.Provider>
  );
};

export const useDemoData = (): DemoDataContextType => {
  const context = useContext(DemoDataContext);
  if (!context) {
    throw new Error('useDemoData must be used within a DemoDataProvider');
  }
  return context;
};

