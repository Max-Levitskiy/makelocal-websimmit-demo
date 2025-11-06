/**
 * Service Worker Registration Utility
 * Registers the service worker for PWA functionality
 */

export function registerServiceWorker(): void {
  // Check for service worker support
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log(
            '[Service Worker] Registration successful:',
            registration.scope
          );

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (
                  newWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  console.log('[Service Worker] New version available');
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('[Service Worker] Registration failed:', error);
        });
    });
  } else {
    console.warn('[Service Worker] Service workers are not supported');
  }
}

