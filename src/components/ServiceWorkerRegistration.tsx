"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/register-sw";

/**
 * Client component to register service worker on app initialization
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null; // This component doesn't render anything
}
