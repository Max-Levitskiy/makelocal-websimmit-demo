import type { ReactNode } from "react";

export interface ErrorMessageProps {
  children: ReactNode;
  className?: string;
}

export function ErrorMessage({ children, className = "" }: ErrorMessageProps) {
  if (!children) return null;

  return (
    <div
      className={`rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <span
          className="material-symbols-outlined text-destructive"
          aria-hidden="true"
        >
          error
        </span>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
