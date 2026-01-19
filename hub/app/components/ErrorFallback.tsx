"use client";

import { AlertTriangle, RefreshCw, Home, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl border-red-200">
        <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-900">
                  Something went wrong
                </CardTitle>
                <p className="text-gray-600">
                  We've encountered an unexpected error
                </p>
              </div>
            </div>
            <div className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              Error
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <HelpCircle className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-2">What happened?</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                      An unexpected error occurred in the application
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                      Our technical team has been notified automatically
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                      You can try refreshing the page or returning home
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {isDevelopment && error && (
              <>
                <Separator />
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">
                    Development Error Details
                  </h4>
                  <pre className="text-xs text-red-700 bg-red-100 p-3 rounded overflow-auto max-h-48">
                    {error.message}
                    {error.stack && `\n\n${error.stack}`}
                  </pre>
                </div>
              </>
            )}

            <Separator />

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={resetErrorBoundary}
                className="flex-1 bg-[#00BFFF] hover:bg-[#0099CC]"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Return Home
                </Button>
              </Link>
              
              <Link href="/contact" className="flex-1">
                <Button variant="outline" className="w-full">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </Link>
            </div>

            <div className="text-center text-sm text-gray-500 pt-4">
              <p>
                If the problem persists, please contact our support team at{" "}
                <a href="mailto:support@tzaneenhub.co.za" className="text-[#00BFFF] hover:underline">
                  support@tzaneenhub.co.za
                </a>{" "}
                or call{" "}
                <a href="tel:+27153073000" className="text-[#00BFFF] hover:underline">
                  +27 15 307 3000
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}