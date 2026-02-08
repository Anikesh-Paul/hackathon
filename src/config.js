// Appwrite Configuration
// Values are loaded from environment variables
export const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

export const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

export const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;

export const COMPLAINTS_COLLECTION_ID = import.meta.env
  .VITE_COMPLAINTS_COLLECTION_ID;

export const STATUS_HISTORY_COLLECTION_ID = import.meta.env
  .VITE_STATUS_HISTORY_COLLECTION_ID;

export const FOLLOWUPS_COLLECTION_ID = import.meta.env
  .VITE_FOLLOWUPS_COLLECTION_ID;

export const ATTACHMENTS_BUCKET_ID = import.meta.env.VITE_ATTACHMENTS_BUCKET_ID;

// Optional: Log a warning if environment variables are missing
const requiredEnvVars = [
  "VITE_APPWRITE_ENDPOINT",
  "VITE_APPWRITE_PROJECT_ID",
  "VITE_DATABASE_ID",
  "VITE_COMPLAINTS_COLLECTION_ID",
  "VITE_STATUS_HISTORY_COLLECTION_ID",
  "VITE_FOLLOWUPS_COLLECTION_ID",
  "VITE_ATTACHMENTS_BUCKET_ID",
];

requiredEnvVars.forEach((varName) => {
  if (!import.meta.env[varName]) {
    console.warn(`Environment variable ${varName} is missing!`);
  }
});
