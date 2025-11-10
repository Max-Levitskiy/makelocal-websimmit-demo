import type { AnonymousAuthResponse, AnonymousSession } from "@/types/api";
import { makeLocalRequest } from "./makelocal-client";

/**
 * Check if session is expired
 */
export function isSessionExpired(session: AnonymousSession): boolean {
  return Date.now() > session.expiresAt;
}

/**
 * Check if session exists by trying to access protected endpoint
 * API sets HttpOnly cookies automatically, we can't read them directly
 */
export async function hasValidSession(): Promise<boolean> {
  try {
    // Try to access a lightweight protected endpoint
    // If it succeeds, we have a valid session
    await makeLocalRequest("/auth-anonymous", {
      method: "POST",
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Clear stored session
 * Note: HttpOnly cookies set by API cannot be cleared from client-side JavaScript
 * Session clearing should be handled server-side
 */
export function clearSession(): void {
  // HttpOnly cookies cannot be cleared from client-side JavaScript
  // The session will naturally expire based on cookie TTL
  console.log(
    "[AnonymousAuth] Session clearing requested - HttpOnly cookies expire automatically",
  );
}

/**
 * Create anonymous session with MakeLocal API
 */
export async function createAnonymousSession(): Promise<AnonymousSession> {
  // Ensure this only runs on client side
  if (typeof window === "undefined") {
    throw new Error("Anonymous auth can only be created on client side");
  }

  try {
    const response = await makeLocalRequest<AnonymousAuthResponse>(
      "/auth-anonymous",
      {
        method: "POST",
      },
    );

    console.log("[AnonymousAuth] Received response from API", {
      response,
      hasToken: !!response?.token,
      hasUserId: !!response?.userId,
      isAnonymous: response?.isAnonymous,
      hasExpiresIn: response?.expiresIn !== undefined,
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

    // API automatically sets cookies via Set-Cookie header, no need to store manually
    return session;
  } catch (error) {
    console.error("Failed to create anonymous session:", error);
    throw error;
  }
}

/**
 * Check if current session is valid by making a test API request
 */
export async function validateSession(): Promise<boolean> {
  try {
    // Make a lightweight API request to check if session is valid
    // Using a simple endpoint that requires authentication
    await makeLocalRequest("/auth-check", {
      method: "GET",
    });
    return true;
  } catch (error) {
    console.log("[AnonymousAuth] Session validation failed:", error);
    return false;
  }
}

/**
 * Get or create anonymous session
 * Returns existing session if valid, otherwise creates new one
 */
export async function getOrCreateSession(): Promise<AnonymousSession> {
  // Check if we have a valid session in cookies
  const hasSession = await hasValidSession();
  if (hasSession) {
    // Create a session object for the valid cookie
    // We don't know the exact token, but API calls will work with cookies
    const session: AnonymousSession = {
      token: "cookie-based-session", // Placeholder token
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // Assume 7 days
      createdAt: Date.now(),
    };
    console.log("[AnonymousAuth] Found valid session in cookies");
    return session;
  }

  // Create new session
  console.log("[AnonymousAuth] No valid session found, creating new one");
  return await createAnonymousSession();
}

/**
 * Ensure valid session exists (lazy initialization)
 */
export async function ensureValidSession(): Promise<string> {
  try {
    // getOrCreateSession already validates the session via API
    const session = await getOrCreateSession();
    return session.token;
  } catch (error) {
    console.error("Failed to ensure valid session:", error);
    throw error;
  }
}
