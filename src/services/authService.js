import { account } from "./appwrite";

/**
 * Admin login
 * @param {string} email
 * @param {string} password
 * @returns {Promise<void>}
 */
export async function login(email, password) {
  await account.createEmailPasswordSession(email, password);
}

/**
 * Admin logout
 * @returns {Promise<void>}
 */
export async function logout() {
  await account.deleteSession("current");
}

/**
 * Get current logged-in admin user
 * @returns {Promise<{id: string, email: string} | null>}
 */
export async function getCurrentUser() {
  try {
    const user = await account.get();
    return {
      id: user.$id,
      email: user.email,
    };
  } catch {
    // No active session
    return null;
  }
}
