import { ID } from "appwrite";
import { storage } from "./appwrite";
import { ATTACHMENTS_BUCKET_ID } from "../config";

/**
 * Upload a single file to Appwrite Storage
 * @param {File} file - The file to upload
 * @returns {Promise<string>} - The file ID
 */
export async function uploadFile(file) {
  const result = await storage.createFile(
    ATTACHMENTS_BUCKET_ID,
    ID.unique(),
    file,
  );
  return result.$id;
}

/**
 * Upload multiple files to Appwrite Storage
 * @param {File[]} files - Array of files to upload
 * @returns {Promise<string[]>} - Array of file IDs
 */
export async function uploadFiles(files) {
  const fileIds = [];
  for (const file of files) {
    const fileId = await uploadFile(file);
    fileIds.push(fileId);
  }
  return fileIds;
}

/**
 * Get file preview URL (for images)
 * @param {string} fileId - The file ID
 * @returns {string} - Preview URL
 */
export function getFilePreviewUrl(fileId) {
  return storage.getFilePreview(ATTACHMENTS_BUCKET_ID, fileId);
}

/**
 * Get file view URL
 * @param {string} fileId - The file ID
 * @returns {string} - View URL
 */
export function getFileViewUrl(fileId) {
  return storage.getFileView(ATTACHMENTS_BUCKET_ID, fileId);
}
