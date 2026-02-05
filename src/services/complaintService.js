import { ID, Query } from "appwrite";
import { databases } from "./appwrite";
import { DATABASE_ID, COMPLAINTS_COLLECTION_ID } from "../config";

/**
 * Create a new complaint (anonymous)
 * @param {{title: string, description: string, category?: string}} data
 * @returns {Promise<{trackingId: string}>}
 */
export async function createComplaint({ title, description, category }) {
  const trackingId = crypto.randomUUID();
  const now = new Date().toISOString();

  await databases.createDocument(
    DATABASE_ID,
    COMPLAINTS_COLLECTION_ID,
    ID.unique(),
    {
      trackingId,
      title,
      description,
      category: category || null,
      status: "pending",
      adminNotes: null,
      createdAt: now,
      updatedAt: null,
    },
  );

  return { trackingId };
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
 * @param {string} id - Appwrite document ID
 * @param {"pending" | "reviewing" | "resolved" | "dismissed"} status
 * @returns {Promise<void>}
 */
export async function updateComplaintStatus(id, status) {
  await databases.updateDocument(DATABASE_ID, COMPLAINTS_COLLECTION_ID, id, {
    status,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Add admin note to complaint (admin)
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
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
