import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Initialize Admin App
const adminApp = getApps().length === 0 ? initializeApp() : getApps()[0];
const db = getFirestore(adminApp);

// Approved Campus Categories
const VALID_CATEGORIES = new Set([
  'infra',
  'infrastructure',
  'living',
  'living quarters',
  'academic',
  'academic labs',
  'network',
  'network & it',
  'sanitation',
]);

const VALID_PRIORITIES = new Set(['low', 'medium', 'high', 'critical']);

/**
 * Callable Cloud Function: createComplaint
 * 
 * Enforces:
 * 1. Authentication and identity verification (cannot submit on behalf of other users).
 * 2. Strict input validation (title, description, category, attachments).
 * 3. Atomic sequential Ticket ID allocation via Firestore Transaction (SNK-YYYY-XXXXX).
 * 4. Idempotency protection against network retries.
 * 5. Complete initial status history and append-only administrative audit log.
 * 6. Automated generation of sanitized /publicComplaints projection (zero private identity leak).
 */
export const createComplaint = onCall(
  {
    cors: true,
    maxInstances: 10,
  },
  async (request) => {
    // 1. Verify Authentication
    if (!request.auth || !request.auth.uid) {
      throw new HttpsError(
        'unauthenticated',
        'Authentication required. Please sign in to submit a complaint.'
      );
    }

    const callerUid = request.auth.uid;
    const data = request.data || {};

    // 2. Identity Verification
    if (data.studentId && data.studentId !== callerUid) {
      throw new HttpsError(
        'permission-denied',
        'Security Violation: Cannot submit a grievance on behalf of another user account.'
      );
    }

    // 3. Field Validation
    const title = (data.title || '').trim();
    if (!title || title.length < 5 || title.length > 150) {
      throw new HttpsError(
        'invalid-argument',
        'Title must be between 5 and 150 characters.'
      );
    }

    const description = (data.description || '').trim();
    if (!description || description.length < 10 || description.length > 2000) {
      throw new HttpsError(
        'invalid-argument',
        'Description must be between 10 and 2000 characters.'
      );
    }

    const category = (data.category || '').trim();
    if (!category || !VALID_CATEGORIES.has(category.toLowerCase())) {
      throw new HttpsError(
        'invalid-argument',
        `Invalid complaint category: '${category}'. Must be an approved campus category.`
      );
    }

    const locationZone = (data.locationZone || '').trim();
    if (!locationZone || locationZone.length < 2) {
      throw new HttpsError(
        'invalid-argument',
        'Location zone is required.'
      );
    }

    const priority = (data.priority || 'medium').toLowerCase();
    if (!VALID_PRIORITIES.has(priority)) {
      throw new HttpsError(
        'invalid-argument',
        `Invalid priority level: '${priority}'.`
      );
    }

    // 4. Attachments Validation (Max 3 files, 2MB each, JPEG/PNG/WebP only)
    const attachments = Array.isArray(data.attachments) ? data.attachments : [];
    if (attachments.length > 3) {
      throw new HttpsError(
        'invalid-argument',
        'Evidence quota exceeded: maximum 3 images allowed per complaint.'
      );
    }

    const validMimes = new Set(['image/jpeg', 'image/png', 'image/webp']);
    const allowedExts = /\.(jpg|jpeg|png|webp)$/i;

    for (let i = 0; i < attachments.length; i++) {
      const att = attachments[i];
      if (!att.fileName || !allowedExts.test(att.fileName)) {
        throw new HttpsError(
          'invalid-argument',
          `Attachment #${i + 1} has an unsupported file format. Allowed: JPG, PNG, WebP.`
        );
      }
      if (att.mimeType && !validMimes.has(att.mimeType.toLowerCase())) {
        throw new HttpsError(
          'invalid-argument',
          `Attachment #${i + 1} MIME type '${att.mimeType}' is not permitted.`
        );
      }
      if (typeof att.fileSizeBytes === 'number' && att.fileSizeBytes > 2 * 1024 * 1024) {
        throw new HttpsError(
          'invalid-argument',
          `Attachment #${i + 1} exceeds the 2MB size limit.`
        );
      }
    }

    // 5. Idempotency Check
    const idempotencyKey = data.idempotencyKey ? String(data.idempotencyKey).trim() : null;
    if (idempotencyKey) {
      const existingSnap = await db
        .collection('complaints')
        .where('studentId', '==', callerUid)
        .where('idempotencyKey', '==', idempotencyKey)
        .limit(1)
        .get();

      if (!existingSnap.empty) {
        const existingDoc = existingSnap.docs[0];
        const existingData = existingDoc.data();
        console.log(`[IDEMPOTENCY] Replaying existing complaint for key ${idempotencyKey}: ${existingData.ticketId}`);
        return {
          success: true,
          complaintId: existingDoc.id,
          ticketId: existingData.ticketId,
          isExisting: true,
          status: existingData.status,
          createdAt: existingData.createdAt,
        };
      }
    }

    // 6. Department Mapping & SLA Configuration
    const catLower = category.toLowerCase();
    let deptId = 'ESTATES';
    let deptName = 'Campus Estates & Works';
    let slaHours = 24;

    if (catLower.includes('net') || catLower.includes('it')) {
      deptId = 'IT_NET';
      deptName = 'IT & Campus Network Services';
      slaHours = 12;
    } else if (catLower.includes('acad') || catLower.includes('lab') || catLower.includes('hvac')) {
      deptId = 'HVAC';
      deptName = 'HVAC & Academic Facilities';
      slaHours = 18;
    } else if (catLower.includes('sanitat') || catLower.includes('waste')) {
      deptId = 'SANITATION';
      deptName = 'Sanitation & Groundskeeping';
      slaHours = 8;
    }

    const nowMs = Date.now();
    const slaTargetDate = new Date(nowMs + slaHours * 3600 * 1000);

    // 7. Atomic Transaction: Allocate Sequential Ticket ID & Persist All Projections
    try {
      const txResult = await db.runTransaction(async (transaction) => {
        // --- READ PHASE (ALL READS MUST PRECEDE ALL WRITES) ---
        // Read 1: Read System Counter
        const counterRef = db.collection('systemCounters').doc('complaints');
        const counterSnap = await transaction.get(counterRef);

        // Read 2: Read Student Profile
        const studentUserRef = db.collection('users').doc(callerUid);
        const studentUserSnap = await transaction.get(studentUserRef);
        const studentProfile = studentUserSnap.exists ? studentUserSnap.data() || {} : {};

        // Compute next sequence count
        const currentYear = new Date().getFullYear();
        let nextCount = 1;
        if (counterSnap.exists) {
          const counterData = counterSnap.data() || {};
          if (counterData.year === currentYear) {
            nextCount = (counterData.currentCount || 0) + 1;
          }
        }
        const ticketId = `SNK-${currentYear}-${String(nextCount).padStart(5, '0')}`;

        // --- WRITE PHASE ---
        // Write 1: Update Counter
        transaction.set(
          counterRef,
          {
            year: currentYear,
            currentCount: nextCount,
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );

        // Step C: Create Authoritative Complaint Document
        const complaintRef = db.collection('complaints').doc();
        const complaintId = complaintRef.id;

        const isAnon = !!data.isAnonymousToPublic;

        const authoritativePayload = {
          id: complaintId,
          ticketId,
          studentId: callerUid,
          studentIdentity: {
            fullName: studentProfile.fullName || request.auth?.token?.name || 'Student Complainant',
            rollNumber: studentProfile.rollNumber || '',
            email: studentProfile.email || request.auth?.token?.email || '',
            maskedUid: `${callerUid.slice(0, 4)}...${callerUid.slice(-4)}`,
          },
          title,
          description,
          category,
          subcategory: (data.subcategory || '').trim(),
          locationZone,
          specificDemarcation: (data.specificDemarcation || '').trim(),
          geotag: data.geotag || null,
          status: 'raised',
          priority,
          assignedDepartmentId: deptId,
          assignedDepartmentName: deptName,
          isAnonymousToPublic: isAnon,
          isPublic: true,
          surgeScore: 10,
          affectedCountEst: Number(data.affectedCountEst) || 1,
          endorsementsCount: 0,
          followersCount: 1, // Student is initial follower
          isBreached: false,
          slaHoursConfigured: slaHours,
          slaTargetTimestamp: slaTargetDate.toISOString(),
          evidenceCount: attachments.length,
          evidenceThumbnails: attachments.map((a) => a.storagePath || a.fileName),
          idempotencyKey,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        };

        transaction.set(complaintRef, authoritativePayload);

        // Step D: Write Initial Status History Entry
        const statusHistoryRef = complaintRef.collection('statusHistory').doc();
        transaction.set(statusHistoryRef, {
          fromStatus: null,
          toStatus: 'raised',
          changedBy: callerUid,
          actorRole: 'student',
          note: 'Grievance officially registered in campus ledger.',
          timestamp: FieldValue.serverTimestamp(),
        });

        // Step E: Write Append-Only Administrative Audit Log
        const auditLogRef = complaintRef.collection('auditLogs').doc();
        transaction.set(auditLogRef, {
          action: 'complaint_created',
          actorUid: callerUid,
          actorRole: 'student',
          details: {
            ticketId,
            category,
            locationZone,
            priority,
            isAnonymousToPublic: isAnon,
            evidenceCount: attachments.length,
          },
          timestamp: FieldValue.serverTimestamp(),
        });

        // Step F: Write Evidence Subcollection Documents
        attachments.forEach((att) => {
          const evidenceRef = complaintRef.collection('evidence').doc();
          transaction.set(evidenceRef, {
            id: evidenceRef.id,
            complaintId,
            uploaderId: callerUid,
            stage: 'intake',
            storagePath: att.storagePath || `evidence/${complaintId}/intake/${callerUid}/${att.fileName}`,
            fileName: att.fileName,
            fileSizeBytes: att.fileSizeBytes || 0,
            mimeType: att.mimeType || 'image/jpeg',
            caption: att.caption || '',
            createdAt: FieldValue.serverTimestamp(),
          });
        });

        // Step G: Generate Sanitized Public Projection (/publicComplaints/{complaintId})
        // CRITICAL PRIVACY SAFEGUARD: Excludes studentId, email, rollNumber, and raw UID
        const publicProjectionRef = db.collection('publicComplaints').doc(complaintId);
        const publicPayload = {
          id: complaintId,
          ticketId,
          maskedComplainant: isAnon
            ? 'Anonymous Student'
            : `${studentProfile.fullName || 'Student'} (${studentProfile.department || 'Campus Community'})`,
          title,
          description,
          category,
          subcategory: (data.subcategory || '').trim(),
          locationZone,
          specificDemarcation: (data.specificDemarcation || '').trim(),
          status: 'raised',
          priority,
          assignedDepartmentName: deptName,
          endorsementsCount: 0,
          affectedCountEst: Number(data.affectedCountEst) || 1,
          isResolved: false,
          isAnonymous: isAnon,
          hasEvidence: attachments.length > 0,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        };

        transaction.set(publicProjectionRef, publicPayload);

        return {
          complaintId,
          ticketId,
        };
      });

      return {
        success: true,
        complaintId: txResult.complaintId,
        ticketId: txResult.ticketId,
        isExisting: false,
      };
    } catch (txErr) {
      console.error('[TRANSACTION ERROR] createComplaint failed:', txErr);
      throw new HttpsError(
        'internal',
        'Database transaction failed while creating complaint and allocating ticket ID.'
      );
    }
  }
);

/**
 * Callable Cloud Function: endorseComplaint
 * Allows students to register +1 Me Too endorsement.
 * Enforces:
 * - User cannot endorse their own complaint.
 * - Idempotent prevention of double endorsement.
 * - Atomic increment of endorsementsCount on authoritative & public projections.
 */
export const endorseComplaint = onCall({ cors: true }, async (request) => {
  if (!request.auth || !request.auth.uid) {
    throw new HttpsError('unauthenticated', 'Sign in required to endorse.');
  }

  const callerUid = request.auth.uid;
  const complaintId = request.data?.complaintId;
  if (!complaintId) {
    throw new HttpsError('invalid-argument', 'complaintId is required.');
  }

  return await db.runTransaction(async (transaction) => {
    // 1. READS
    const complaintRef = db.collection('complaints').doc(complaintId);
    const complaintSnap = await transaction.get(complaintRef);
    if (!complaintSnap.exists) {
      throw new HttpsError('not-found', 'Complaint not found.');
    }
    const complaintData = complaintSnap.data();

    if (complaintData.studentId === callerUid) {
      throw new HttpsError('invalid-argument', 'Cannot endorse your own complaint.');
    }

    const userEndorsementRef = db
      .collection('users')
      .doc(callerUid)
      .collection('endorsedComplaints')
      .doc(complaintId);
    const userEndorsementSnap = await transaction.get(userEndorsementRef);

    if (userEndorsementSnap.exists) {
      return { success: true, alreadyEndorsed: true, endorsementsCount: complaintData.endorsementsCount || 1 };
    }

    const publicRef = db.collection('publicComplaints').doc(complaintId);

    // 2. WRITES
    transaction.set(userEndorsementRef, {
      complaintId,
      ticketId: complaintData.ticketId,
      endorsedAt: FieldValue.serverTimestamp(),
    });

    const complaintEndorsementRef = complaintRef.collection('endorsements').doc(callerUid);
    transaction.set(complaintEndorsementRef, {
      userId: callerUid,
      endorsedAt: FieldValue.serverTimestamp(),
    });

    const newCount = (complaintData.endorsementsCount || 0) + 1;
    const newSurge = 10 + newCount * 5;

    transaction.update(complaintRef, {
      endorsementsCount: newCount,
      surgeScore: newSurge,
      updatedAt: FieldValue.serverTimestamp(),
    });

    transaction.update(publicRef, {
      endorsementsCount: newCount,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return { success: true, alreadyEndorsed: false, endorsementsCount: newCount };
  });
});

/**
 * Callable Cloud Function: updateComplaintStatus
 * Handles complaint lifecycle transitions.
 * Admin: under_review, in_progress, resolved, closed
 * Student: verified, reopened (for own complaints)
 */
export const updateComplaintStatus = onCall({ cors: true }, async (request) => {
  if (!request.auth || !request.auth.uid) {
    throw new HttpsError('unauthenticated', 'Sign in required.');
  }

  const callerUid = request.auth.uid;
  const isAdmin = request.auth.token.role === 'admin' || request.auth.token.admin === true;
  const { complaintId, newStatus, noteText, resolutionSummary, resolutionProof } = request.data || {};

  if (!complaintId || !newStatus) {
    throw new HttpsError('invalid-argument', 'complaintId and newStatus are required.');
  }

  const validStatuses = new Set(['under_review', 'in_progress', 'resolved', 'verified', 'reopened', 'closed']);
  if (!validStatuses.has(newStatus)) {
    throw new HttpsError('invalid-argument', `Invalid status transition: ${newStatus}`);
  }

  return await db.runTransaction(async (transaction) => {
    // 1. READS
    const complaintRef = db.collection('complaints').doc(complaintId);
    const complaintSnap = await transaction.get(complaintRef);
    if (!complaintSnap.exists) {
      throw new HttpsError('not-found', 'Complaint not found.');
    }
    const complaintData = complaintSnap.data();

    // Check permissions
    if (newStatus === 'verified' || newStatus === 'reopened') {
      if (!isAdmin && complaintData.studentId !== callerUid) {
        throw new HttpsError('permission-denied', 'Only the complaint author can verify or reopen.');
      }
    } else {
      if (!isAdmin) {
        throw new HttpsError('permission-denied', 'Administrative privileges required for this status change.');
      }
    }

    const publicRef = db.collection('publicComplaints').doc(complaintId);

    // 2. WRITES
    const updatePayload = {
      status: newStatus,
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (newStatus === 'resolved') {
      updatePayload.resolutionSummary = resolutionSummary || 'Resolved by facilities engineering.';
      updatePayload.resolvedAt = FieldValue.serverTimestamp();
      if (resolutionProof) {
        updatePayload.resolutionProof = resolutionProof;
      }
    } else if (newStatus === 'verified') {
      updatePayload.verifiedAt = FieldValue.serverTimestamp();
    } else if (newStatus === 'reopened') {
      updatePayload.reopenedAt = FieldValue.serverTimestamp();
    }

    transaction.update(complaintRef, updatePayload);

    // Status History
    const historyRef = complaintRef.collection('statusHistory').doc();
    transaction.set(historyRef, {
      fromStatus: complaintData.status,
      toStatus: newStatus,
      changedBy: callerUid,
      actorRole: isAdmin ? 'admin' : 'student',
      note: noteText || `Status transitioned to ${newStatus}`,
      timestamp: FieldValue.serverTimestamp(),
    });

    // Audit Log
    const auditRef = complaintRef.collection('auditLogs').doc();
    transaction.set(auditRef, {
      action: 'STATUS_CHANGE',
      actorUid: callerUid,
      actorRole: isAdmin ? 'admin' : 'student',
      details: {
        fromStatus: complaintData.status,
        toStatus: newStatus,
        note: noteText || '',
      },
      timestamp: FieldValue.serverTimestamp(),
    });

    // Synchronize Public Projection
    transaction.update(publicRef, {
      status: newStatus,
      isResolved: newStatus === 'resolved' || newStatus === 'verified' || newStatus === 'closed',
      resolutionNote: newStatus === 'resolved' ? (resolutionSummary || 'Resolved.') : null,
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Notify author if admin changed status
    if (isAdmin && complaintData.studentId) {
      const notifRef = db.collection('users').doc(complaintData.studentId).collection('notifications').doc();
      transaction.set(notifRef, {
        id: notifRef.id,
        title: `Ticket #${complaintData.ticketId} Updated`,
        body: `Status updated to ${newStatus.replace('_', ' ').toUpperCase()}`,
        type: 'STATUS_UPDATE',
        complaintId,
        read: false,
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    return { success: true, newStatus };
  });
});

/**
 * Callable Cloud Function: assignDepartment (Admin-only)
 */
export const assignDepartment = onCall({ cors: true }, async (request) => {
  if (!request.auth || (!request.auth.token.role === 'admin' && !request.auth.token.admin)) {
    throw new HttpsError('permission-denied', 'Admin access required.');
  }

  const { complaintId, departmentId, departmentName, technicianName, priority } = request.data || {};
  if (!complaintId || !departmentId) {
    throw new HttpsError('invalid-argument', 'complaintId and departmentId are required.');
  }

  return await db.runTransaction(async (transaction) => {
    const complaintRef = db.collection('complaints').doc(complaintId);
    const snap = await transaction.get(complaintRef);
    if (!snap.exists) throw new HttpsError('not-found', 'Complaint not found.');

    const data = snap.data();
    const publicRef = db.collection('publicComplaints').doc(complaintId);

    const updatePayload = {
      assignedDepartmentId: departmentId,
      assignedDepartmentName: departmentName || departmentId,
      updatedAt: FieldValue.serverTimestamp(),
    };
    if (technicianName) updatePayload.assignedTechnicianName = technicianName;
    if (priority) updatePayload.priority = priority;

    transaction.update(complaintRef, updatePayload);
    transaction.update(publicRef, {
      assignedDepartmentName: departmentName || departmentId,
      ...(priority ? { priority } : {}),
      updatedAt: FieldValue.serverTimestamp(),
    });

    const auditRef = complaintRef.collection('auditLogs').doc();
    transaction.set(auditRef, {
      action: 'DEPT_REASSIGN',
      actorUid: request.auth.uid,
      actorRole: 'admin',
      details: { departmentId, departmentName, technicianName, priority },
      timestamp: FieldValue.serverTimestamp(),
    });

    return { success: true, departmentId };
  });
});

/**
 * Callable Cloud Function: addInternalNote (Admin-only)
 */
export const addInternalNote = onCall({ cors: true }, async (request) => {
  if (!request.auth || (!request.auth.token.role === 'admin' && !request.auth.token.admin)) {
    throw new HttpsError('permission-denied', 'Admin access required.');
  }

  const { complaintId, noteText } = request.data || {};
  if (!complaintId || !noteText) {
    throw new HttpsError('invalid-argument', 'complaintId and noteText required.');
  }

  const noteRef = db.collection('complaints').doc(complaintId).collection('internalNotes').doc();
  await noteRef.set({
    id: noteRef.id,
    complaintId,
    authorId: request.auth.uid,
    authorName: request.auth.token.name || 'Admin Officer',
    noteText: noteText.trim(),
    createdAt: FieldValue.serverTimestamp(),
  });

  return { success: true, noteId: noteRef.id };
});

/**
 * Callable Cloud Function: processSlaEscalations
 * Scans active complaints and marks breached SLAs.
 */
export const processSlaEscalations = onCall({ cors: true }, async (request) => {
  const nowIso = new Date().toISOString();
  const snaps = await db
    .collection('complaints')
    .where('status', 'in', ['raised', 'under_review', 'in_progress'])
    .where('isBreached', '==', false)
    .where('slaTargetTimestamp', '<=', nowIso)
    .limit(50)
    .get();

  const batch = db.batch();
  let breachedCount = 0;

  snaps.forEach((docSnap) => {
    breachedCount++;
    batch.update(docSnap.ref, {
      isBreached: true,
      updatedAt: FieldValue.serverTimestamp(),
    });

    const auditRef = docSnap.ref.collection('auditLogs').doc();
    batch.set(auditRef, {
      action: 'SLA_ESCALATION',
      actorUid: 'system_sla_daemon',
      actorRole: 'system',
      details: { reason: 'SLA target elapsed without resolution.' },
      timestamp: FieldValue.serverTimestamp(),
    });
  });

  if (breachedCount > 0) {
    await batch.commit();
  }

  return { success: true, breachedCount };
});
