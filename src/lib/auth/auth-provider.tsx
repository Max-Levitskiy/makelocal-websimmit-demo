"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  clearSession,
  ensureValidSession,
  getOrCreateSession,
  getStoredSession,
} from "@/lib/api/anonymous-auth";
import type { AnonymousSession } from "@/types/api";

interface AuthContextValue {
  session: AnonymousSession | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: Error | null;
  refreshSession: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication provider that manages MakeLocal anonymous sessions
 * Ensures valid session exists on app load and route changes
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AnonymousSession | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const pathname = usePathname();

  // Prevent multiple simultaneous initialization attempts
  const isInitializingRef = useRef(false);
  const lastInitAttemptRef = useRef(0);

  // Use ref to store the latest state values to avoid stale closures
  const stateRef = useRef({ session, token, isLoading, isInitialized });
  stateRef.current = { session, token, isLoading, isInitialized };

  /**
   * Initialize or refresh session
   */
  const initializeSession = useCallback(async () => {
    // Prevent multiple simultaneous initialization attempts
    if (isInitializingRef.current) {
      console.log(
        "[AuthProvider] Initialization already in progress, skipping...",
      );
      return;
    }

    // Add cooldown to prevent rapid retries (1 second minimum between attempts)
    const now = Date.now();
    const timeSinceLastAttempt = now - lastInitAttemptRef.current;
    if (timeSinceLastAttempt < 1000) {
      console.log(
        "[AuthProvider] Initialization attempted too soon, skipping...",
      );
      return;
    }

    isInitializingRef.current = true;
    lastInitAttemptRef.current = now;
    setIsLoading(true);
    setError(null);

    try {
      // First check if we have a valid stored session
      const stored = getStoredSession();
      if (stored) {
        console.log("[AuthProvider] Found existing valid session");
        setSession(stored);
        setToken(stored.token);
        setIsInitialized(true);
        return;
      }

      // No valid stored session, create new one
      console.log("[AuthProvider] Creating new session...");

      // Use getOrCreateSession directly to get the session object
      const newSession = await getOrCreateSession();

      console.log("[AuthProvider] Session created successfully", {
        hasToken: !!newSession.token,
        expiresAt: new Date(newSession.expiresAt).toLocaleString(),
      });

      setSession(newSession);
      setToken(newSession.token);
      setIsInitialized(true);
    } catch (err) {
      console.error("[AuthProvider] Failed to initialize session:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to initialize session"),
      );
      // Set initialized to true even on error to prevent infinite retries
      setIsInitialized(true);
    } finally {
      setIsLoading(false);
      isInitializingRef.current = false;
    }
  }, []);

  /**
   * Refresh session (called manually or when needed)
   */
  const refreshSession = useCallback(async () => {
    try {
      const newToken = await ensureValidSession();
      const newSession = getStoredSession();
      setSession(newSession);
      setToken(newToken);
      setError(null);
    } catch (err) {
      console.error("[AuthProvider] Failed to refresh session:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to refresh session"),
      );
      throw err;
    }
  }, []);

  /**
   * Logout (clear session)
   */
  const logout = useCallback(() => {
    clearSession();
    setSession(null);
    setToken(null);
    setError(null);
  }, []);

  // Initialize session on mount
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  // Check session on route change
  useEffect(() => {
    const { isInitialized, isLoading, token } = stateRef.current;

    if (!isInitialized) return;

    // Skip check if we're already loading
    if (isLoading) return;

    // Check if session is still valid on route change
    const stored = getStoredSession();
    if (!stored) {
      // Session expired or cleared, reinitialize
      console.log(
        `[AuthProvider] Session expired on route ${pathname}, reinitializing...`,
      );
      initializeSession();
    } else if (stored.token !== token) {
      // Session changed, update state
      console.log("[AuthProvider] Session updated from storage");
      setSession(stored);
      setToken(stored.token);
    }
  }, [pathname, initializeSession]);

  // Refresh session periodically (every 5 minutes)
  useEffect(() => {
    const { isInitialized, session } = stateRef.current;

    if (!isInitialized || !session) return;

    const interval = setInterval(
      () => {
        const stored = getStoredSession();
        if (!stored) {
          console.log(
            "[AuthProvider] Periodic check: Session expired, reinitializing...",
          );
          initializeSession();
        }
      },
      5 * 60 * 1000,
    ); // 5 minutes

    return () => clearInterval(interval);
  }, [initializeSession]);

  const value: AuthContextValue = {
    session,
    token,
    isLoading,
    isInitialized,
    error,
    refreshSession,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 * @throws Error if used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

/**
 * Hook to get session token (convenience hook)
 * @throws Error if used outside AuthProvider
 */
export function useAuthToken(): string | null {
  const { token } = useAuth();
  return token;
}
