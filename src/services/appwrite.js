import { Client, Account, Databases } from 'appwrite';
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from '../config';

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// Export service instances
export const account = new Account(client);
export const databases = new Databases(client);

export default client;
