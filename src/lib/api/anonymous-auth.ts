import { getItem, removeItem, setItem } from "@/lib/utils/storage";
import type { AnonymousAuthResponse, AnonymousSession } from "@/types/api";
import { makeLocalRequest } from "./makelocal-client";

const SESSION_STORAGE_KEY = "makelocal-session";

/**
 * Check if session is expired
 */
export function isSessionExpired(session: AnonymousSession): boolean {
  return Date.now() > session.expiresAt;
}

/**
 * Get stored session from localStorage
 */
export function getStoredSession(): AnonymousSession | null {
  try {
    const session = getItem<AnonymousSession>(SESSION_STORAGE_KEY);

    if (!session) {
      return null;
    }

    // Check if expired
    if (isSessionExpired(session)) {
      removeItem(SESSION_STORAGE_KEY);
      return null;
    }

    return session;
  } catch (error) {
    console.error("Failed to get stored session:", error);
    return null;
  }
}

/**
 * Store session in localStorage
 */
export function storeSession(session: AnonymousSession): void {
  try {
    setItem(SESSION_STORAGE_KEY, session);
  } catch (error) {
    console.error("Failed to store session:", error);
    throw error;
  }
}

/**
 * Clear stored session
 */
export function clearSession(): void {
  try {
    removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear session:", error);
  }
}

/**
 * Create anonymous session with MakeLocal API
 */
export async function createAnonymousSession(): Promise<AnonymousSession> {
  try {
    const response = await makeLocalRequest<AnonymousAuthResponse>(
      "/auth-anonymous",
      {
        method: "POST",
      },
    );

    console.log("[AnonymousAuth] Received response from API", {
      hasToken: !!response.token,
      hasUserId: !!response.userId,
      isAnonymous: response.isAnonymous,
      hasExpiresIn: response.expiresIn !== undefined,
    });

    // Validate response
    if (!response.token) {
      throw new Error("API response missing token");
    }

    // Use expiresIn from API if provided, otherwise default to 7 days (as per MakeLocal API docs)
    const expiresIn = response.expiresIn ?? 7 * 24 * 60 * 60; // 7 days in seconds

    const session: AnonymousSession = {
      token: response.token,
      expiresAt: Date.now() + expiresIn * 1000,
      createdAt: Date.now(),
    };

    console.log("[AnonymousAuth] Created session", {
      userId: response.userId,
      expiresIn,
      expiresAt: new Date(session.expiresAt).toLocaleString(),
    });

    // Store in localStorage
    storeSession(session);

    return session;
  } catch (error) {
    console.error("Failed to create anonymous session:", error);
    throw error;
  }
}

/**
 * Get or create anonymous session
 * Returns existing session if valid, otherwise creates new one
 */
export async function getOrCreateSession(): Promise<AnonymousSession> {
  // Check for existing session
  const existing = getStoredSession();
  if (existing) {
    return existing;
  }

  // Create new session
  return await createAnonymousSession();
}

/**
 * Refresh anonymous session if expiring soon (within 1 hour)
 */
export async function refreshSessionIfNeeded(
  session: AnonymousSession,
): Promise<AnonymousSession> {
  const oneHourFromNow = Date.now() + 60 * 60 * 1000;

  if (session.expiresAt < oneHourFromNow) {
    return await createAnonymousSession();
  }

  return session;
}

/**
 * Ensure valid session exists (lazy initialization)
 */
export async function ensureValidSession(): Promise<string> {
  try {
    const session = await getOrCreateSession();
    const refreshedSession = await refreshSessionIfNeeded(session);
    return refreshedSession.token;
  } catch (error) {
    console.error("Failed to ensure valid session:", error);
    throw error;
  }
}
