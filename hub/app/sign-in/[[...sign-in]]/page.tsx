"use client";

import { useState } from "react";
import { SignIn } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Phone, 
  ArrowRight,
  Facebook,
  Google,
  Apple,
  Shield,
  Heart
} from "lucide-react";

export default function SignInPage() {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("patient");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Handle custom form submission here
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Brand/Info */}
      <div className="md:w-1/2 bg-gradient-to-br from-[#00BFFF] to-[#0099CC] text-white p-8 md:p-12 lg:p-20 flex flex-col justify-between">
        <div>
          <Link href="/" className="flex items-center space-x-3 mb-12">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">TZANEEN</h1>
              <p className="text-sm opacity-90">Healthcare Hub</p>
            </div>
          </Link>
          
          <div className="max-w-md">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Welcome Back to Healthier Tomorrows
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Access your medical records, appointments, and connect with healthcare professionals
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Secure & Private</h3>
                  <p className="opacity-80">HIPAA compliant, end-to-end encrypted data protection</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">24/7 Access</h3>
                  <p className="opacity-80">Manage your health anytime, anywhere</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="hidden md:block">
          <p className="text-sm opacity-80">
            © {new Date().getFullYear()} TZANEEN Healthcare Hub. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="md:w-1/2 p-8 md:p-12 lg:p-20 flex items-center justify-center bg-background">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Sign In to Your Account</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Access personalized healthcare services
            </p>
          </div>

          <Tabs defaultValue="patient" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="patient">Patient</TabsTrigger>
              <TabsTrigger value="doctor">Doctor</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            
            <TabsContent value="patient">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Portal</CardTitle>
                  <CardDescription>
                    Access your medical records and appointments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SignIn
                    routing="hash"
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "shadow-none border-0 p-0",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "border border-input hover:bg-accent",
                        formButtonPrimary: "bg-[#00BFFF] hover:bg-[#0099CC]",
                        footerActionLink: "text-[#00BFFF] hover:text-[#0099CC]",
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="doctor">
              <Card>
                <CardHeader>
                  <CardTitle>Doctor Portal</CardTitle>
                  <CardDescription>
                    Access patient records and manage appointments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SignIn
                    routing="hash"
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "shadow-none border-0 p-0",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "border border-input hover:bg-accent",
                        formButtonPrimary: "bg-[#00BFFF] hover:bg-[#0099CC]",
                        footerActionLink: "text-[#00BFFF] hover:text-[#0099CC]",
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Custom Form Alternative */}
          <div className="mt-8">
            <Separator className="my-6">
              <span className="px-3 text-sm text-gray-500 bg-background">Or continue with</span>
            </Separator>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button variant="outline" className="w-full">
                <Google className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#00BFFF] hover:text-[#0099CC] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-[#00BFFF] hover:bg-[#0099CC]"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
              </span>
              <Link
                href="/sign-up"
                className="font-semibold text-[#00BFFF] hover:text-[#0099CC] hover:underline"
              >
                Create account
              </Link>
            </div>
            
            <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                🔒 Your health data is protected with bank-level security and HIPAA compliance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}