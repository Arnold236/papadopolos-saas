"use client";

import { ReactNode, useEffect } from "react";
import { ErrorHandler } from "@/lib/errors";
import { HealthcareErrorBoundary } from "@/components/ErrorBoundary";
import { ErrorFallback } from "@/components/ErrorFallback";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    // Setup global error handling
    ErrorHandler.setupGlobalErrorHandling();

    // Setup performance monitoring
    if (process.env.NODE_ENV === "production") {
      // Initialize monitoring services
      initializeMonitoring();
    }
  }, []);

  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error("React error boundary caught:", error, errorInfo);
    // You can send to your error tracking service here
  };

  return (
    <HealthcareErrorBoundary
      fallback={<ErrorFallback />}
      onError={handleError}
    >
      {children}
    </HealthcareErrorBoundary>
  );
}

function initializeMonitoring() {
  // Initialize Sentry, LogRocket, etc.
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    import("@sentry/nextjs").then((Sentry) => {
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        tracesSampleRate: 0.1,
        environment: process.env.NODE_ENV,
      });
    });
  }
}