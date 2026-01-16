    "use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Home,
  Heart,
  AlertTriangle,
  ArrowLeft,
  Stethoscope,
  Phone,
} from "lucide-react";

export default function NotFound() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-[#00BFFF] rounded-lg flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold">TZANEEN Healthcare Hub</h1>
              <p className="text-sm text-muted-foreground">Your Health, Our Priority</p>
            </div>
          </Link>
        </div>

        <Card className="border-0 shadow-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Side - Illustration */}
              <div className="bg-gradient-to-br from-[#00BFFF]/10 to-[#0099CC]/10 p-8 lg:p-12 flex flex-col items-center justify-center">
                <div className="relative w-64 h-64 mb-8">
                  <div className="absolute inset-0 bg-[#00BFFF]/20 rounded-full animate-pulse"></div>
                  <div className="absolute inset-8 bg-[#00BFFF]/30 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                  <div className="absolute inset-16 bg-[#00BFFF]/40 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <AlertTriangle className="w-32 h-32 text-[#00BFFF]" />
                  </div>
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    The page you're looking for doesn't exist or has been moved.
                  </p>
                </div>
              </div>

              {/* Right Side - Content */}
              <div className="p-8 lg:p-12">
                <div className="mb-8">
                  <div className="inline-flex items-center px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-full mb-4">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Error 404
                  </div>
                  <h1 className="text-4xl font-bold mb-4">
                    Oops! We couldn't find that page
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Don't worry, you can find your way back to health services below.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Search className="w-4 h-4 mr-2" />
                      Search our website
                    </h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="search"
                        placeholder="Search for doctors, services, articles..."
                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <h3 className="font-semibold mb-3">Quick Links</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Link href="/">
                        <Button variant="outline" className="w-full justify-start">
                          <Home className="w-4 h-4 mr-2" />
                          Home
                        </Button>
                      </Link>
                      <Link href="/services">
                        <Button variant="outline" className="w-full justify-start">
                          <Stethoscope className="w-4 h-4 mr-2" />
                          Services
                        </Button>
                      </Link>
                      <Link href="/specialists">
                        <Button variant="outline" className="w-full justify-start">
                          <Heart className="w-4 h-4 mr-2" />
                          Specialists
                        </Button>
                      </Link>
                      <Link href="/contact">
                        <Button variant="outline" className="w-full justify-start">
                          <Phone className="w-4 h-4 mr-2" />
                          Contact
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Emergency Section */}
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-800 dark:text-red-300 mb-1">
                          Medical Emergency?
                        </h4>
                        <p className="text-sm text-red-700 dark:text-red-400 mb-2">
                          If this is a medical emergency, please call immediately:
                        </p>
                        <a
                          href="tel:+27153073111"
                          className="text-lg font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        >
                          🚨 +27 15 307 3111
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Link href="/" className="flex-1">
                      <Button className="w-full">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                      </Button>
                    </Link>
                    <Link href="/contact" className="flex-1">
                      <Button variant="outline" className="w-full">
                        Contact Support
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Help */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Common Issues</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Check the URL for typos</li>
                <li>• Clear your browser cache</li>
                <li>• Try refreshing the page</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Our support team is here to help
              </p>
              <a
                href="mailto:support@tzaneenhub.co.za"
                className="text-[#00BFFF] hover:underline text-sm"
              >
                support@tzaneenhub.co.za
              </a>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Operating Hours</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Emergency: 24/7
                <br />
                General: Mon-Fri 8AM-8PM
                <br />
                Weekends: 9AM-5PM
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}