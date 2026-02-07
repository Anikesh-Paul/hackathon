import { ID, Query } from "appwrite";
import { databases } from "./appwrite";
import { DATABASE_ID, COMPLAINTS_COLLECTION_ID, STATUS_HISTORY_COLLECTION_ID, FOLLOWUPS_COLLECTION_ID } from "../config";
import { generateRecoveryPhrase, normalizePhrase } from "../utils/recoveryPhrase";

/**
 * Create a new complaint (anonymous)
 * @param {{title: string, description: string, category?: string, attachments?: string[]}} data
 * @returns {Promise<{trackingId: string}>}
 */
export async function createComplaint({
  title,
  description,
  category,
  attachments,
}) {
  const trackingId = crypto.randomUUID();
  const recoveryPhrase = generateRecoveryPhrase(4);
  const now = new Date().toISOString();

  const documentData = {
    trackingId,
    recoveryPhrase,
    title,
    description,
    category: category || null,
    status: "pending",
    adminNotes: null,
    createdAt: now,
    updatedAt: null,
  };

  // Only include attachments if provided
  if (attachments && attachments.length > 0) {
    documentData.attachments = attachments;
  }

  const doc = await databases.createDocument(
    DATABASE_ID,
    COMPLAINTS_COLLECTION_ID,
    ID.unique(),
    documentData,
  );

  // Record initial status in the status-history collection
  await databases.createDocument(
    DATABASE_ID,
    STATUS_HISTORY_COLLECTION_ID,
    ID.unique(),
    {
      complaintId: doc.$id,
      trackingId,
      status: "pending",
      timestamp: now,
    },
  );

  return { trackingId, recoveryPhrase };
}

/**
 * Get complaint by tracking ID (admin)
 * @param {string} trackingId
 * @returns {Promise<object | null>}
 */
export async function getComplaintByTrackingId(trackingId) {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COMPLAINTS_COLLECTION_ID,
    [Query.equal("trackingId", trackingId), Query.limit(1)],
  );

  if (response.documents.length === 0) {
    return null;
  }

  return mapDocument(response.documents[0]);
}

/**
 * List all complaints (admin)
 * @param {object} [filters]
 * @returns {Promise<object[]>}
 */
export async function listComplaints(filters = {}) {
  const queries = [Query.orderDesc("createdAt")];

  // Apply optional status filter
  if (filters.status) {
    queries.push(Query.equal("status", filters.status));
  }

  const response = await databases.listDocuments(
    DATABASE_ID,
    COMPLAINTS_COLLECTION_ID,
    queries,
  );

  return response.documents.map(mapDocument);
}

/**
 * Update complaint status (admin)
 * Appends a new entry to the status-history collection.
 * @param {string} id - Appwrite document ID
 * @param {"pending" | "reviewing" | "resolved" | "dismissed"} status
 * @returns {Promise<{statusHistory: Array<{status: string, timestamp: string}>}>}
 */
export async function updateComplaintStatus(id, status) {
  const now = new Date().toISOString();

  // Fetch current document to get trackingId
  const doc = await databases.getDocument(
    DATABASE_ID,
    COMPLAINTS_COLLECTION_ID,
    id,
  );

  // Update status on the complaint itself
  await databases.updateDocument(DATABASE_ID, COMPLAINTS_COLLECTION_ID, id, {
    status,
    updatedAt: now,
  });

  // Append a new entry to the status-history collection
  await databases.createDocument(
    DATABASE_ID,
    STATUS_HISTORY_COLLECTION_ID,
    ID.unique(),
    {
      complaintId: id,
      trackingId: doc.trackingId,
      status,
      timestamp: now,
    },
  );

  // Return the full updated history
  const statusHistory = await getStatusHistory(id);
  return { statusHistory };
}

/**
 * Add admin note to complaint (admin) — internal only
 * @param {string} id - Appwrite document ID
 * @param {string} note
 * @returns {Promise<void>}
 */
export async function addAdminNote(id, note) {
  await databases.updateDocument(DATABASE_ID, COMPLAINTS_COLLECTION_ID, id, {
    adminNotes: note,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Update public message on complaint (admin) — visible to anonymous users
 * @param {string} id - Appwrite document ID
 * @param {string} message
 * @returns {Promise<void>}
 */
export async function updatePublicMessage(id, message) {
  await databases.updateDocument(DATABASE_ID, COMPLAINTS_COLLECTION_ID, id, {
    publicMessage: message,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Recover a complaint using a recovery phrase (anonymous)
 * @param {string} phrase - The recovery phrase (case-insensitive)
 * @returns {Promise<{trackingId: string} | null>}
 */
export async function recoverByPhrase(phrase) {
  const normalized = normalizePhrase(phrase);
  const response = await databases.listDocuments(
    DATABASE_ID,
    COMPLAINTS_COLLECTION_ID,
    [Query.equal("recoveryPhrase", normalized), Query.limit(1)],
  );

  if (response.documents.length === 0) {
    return null;
  }

  // Only return trackingId — do NOT expose internal details
  return { trackingId: response.documents[0].trackingId };
}

// Map Appwrite document to Complaint model
function mapDocument(doc) {
  return {
    id: doc.$id,
    trackingId: doc.trackingId,
    title: doc.title,
    description: doc.description,
    category: doc.category,
    status: doc.status,
    adminNotes: doc.adminNotes,
    publicMessage: doc.publicMessage || null,
    statusHistory: [],  // loaded separately via getStatusHistory
    attachments: doc.attachments || [],
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

/**
 * Get status history for a complaint by document ID (admin)
 * @param {string} complaintId - Appwrite document ID
 * @returns {Promise<Array<{status: string, timestamp: string}>>}
 */
export async function getStatusHistory(complaintId) {
  const response = await databases.listDocuments(
    DATABASE_ID,
    STATUS_HISTORY_COLLECTION_ID,
    [Query.equal("complaintId", complaintId), Query.orderAsc("timestamp"), Query.limit(100)],
  );
  return response.documents.map((d) => ({
    status: d.status,
    timestamp: d.timestamp,
  }));
}

/**
 * Get status history for a complaint by tracking ID (anonymous)
 * @param {string} trackingId
 * @returns {Promise<Array<{status: string, timestamp: string}>>}
 */
export async function getStatusHistoryByTrackingId(trackingId) {
  const response = await databases.listDocuments(
    DATABASE_ID,
    STATUS_HISTORY_COLLECTION_ID,
    [Query.equal("trackingId", trackingId), Query.orderAsc("timestamp"), Query.limit(100)],
  );
  return response.documents.map((d) => ({
    status: d.status,
    timestamp: d.timestamp,
  }));
}

// ── Follow-up Replies ──────────────────────────────────────

/**
 * Send a follow-up message (admin or anonymous)
 * @param {{complaintId?: string, trackingId: string, sender: "admin"|"anonymous", message: string}} data
 * @returns {Promise<{id: string, sender: string, message: string, timestamp: string}>}
 */
export async function sendFollowUp({ complaintId, trackingId, sender, message }) {
  const now = new Date().toISOString();

  // If complaintId is not provided (anonymous path), look it up
  let cId = complaintId;
  if (!cId) {
    const complaint = await getComplaintByTrackingId(trackingId);
    if (!complaint) throw new Error("Complaint not found");
    cId = complaint.id;
  }

  const doc = await databases.createDocument(
    DATABASE_ID,
    FOLLOWUPS_COLLECTION_ID,
    ID.unique(),
    {
      complaintId: cId,
      trackingId,
      sender,
      message,
      timestamp: now,
    },
  );

  return {
    id: doc.$id,
    sender: doc.sender,
    message: doc.message,
    timestamp: doc.timestamp,
  };
}

/**
 * Get follow-up messages by complaint document ID (admin)
 * @param {string} complaintId
 * @returns {Promise<Array<{id: string, sender: string, message: string, timestamp: string}>>}
 */
export async function getFollowUps(complaintId) {
  const response = await databases.listDocuments(
    DATABASE_ID,
    FOLLOWUPS_COLLECTION_ID,
    [Query.equal("complaintId", complaintId), Query.orderAsc("timestamp"), Query.limit(100)],
  );
  return response.documents.map((d) => ({
    id: d.$id,
    sender: d.sender,
    message: d.message,
    timestamp: d.timestamp,
  }));
}

/**
 * Get follow-up messages by tracking ID (anonymous)
 * @param {string} trackingId
 * @returns {Promise<Array<{id: string, sender: string, message: string, timestamp: string}>>}
 */
export async function getFollowUpsByTrackingId(trackingId) {
  const response = await databases.listDocuments(
    DATABASE_ID,
    FOLLOWUPS_COLLECTION_ID,
    [Query.equal("trackingId", trackingId), Query.orderAsc("timestamp"), Query.limit(100)],
  );
  return response.documents.map((d) => ({
    id: d.$id,
    sender: d.sender,
    message: d.message,
    timestamp: d.timestamp,
  }));
}
