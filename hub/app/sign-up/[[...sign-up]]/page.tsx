"use client";

import { useState } from "react";
import { SignUp } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Calendar,
  MapPin,
  Shield,
  Heart,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export default function SignUpPage() {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("patient");
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Handle custom form submission here
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 2000);
  };

  const steps = [
    { number: 1, title: "Account", description: "Basic information" },
    { number: 2, title: "Profile", description: "Personal details" },
    { number: 3, title: "Health", description: "Medical info" },
  ];

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
              Join Our Healthcare Community
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Start your journey to better health with personalized care and digital convenience
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Secure Registration</h3>
                  <p className="opacity-80">Your information is protected with military-grade encryption</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Instant Access</h3>
                  <p className="opacity-80">Book appointments and access telehealth immediately</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Personalized Care</h3>
                  <p className="opacity-80">Tailored health recommendations and reminders</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="hidden md:block">
          <p className="text-sm opacity-80">
            Over 10,000 patients trust us with their healthcare journey
          </p>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="md:w-1/2 p-8 md:p-12 lg:p-20 flex items-center justify-center bg-background">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join our healthcare community in just a few steps
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((s, index) => (
                <div key={s.number} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      step >= s.number
                        ? "bg-[#00BFFF] text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                    }`}
                  >
                    {step > s.number ? "✓" : s.number}
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">{s.title}</div>
                    <div className="text-xs text-gray-500">{s.description}</div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 w-full absolute top-5 left-1/2 ${
                        step > s.number ? "bg-[#00BFFF]" : "bg-gray-200 dark:bg-gray-700"
                      }`}
                      style={{ width: "100%", transform: "translateX(50%)" }}
                    />
                  )}
                </div>
              ))}
            </div>
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
                  <CardTitle>Patient Registration</CardTitle>
                  <CardDescription>
                    Create your personal health account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SignUp
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
          {step === 1 && (
            <div className="mt-8">
              <Separator className="my-6">
                <span className="px-3 text-sm text-gray-500 bg-background">Or sign up with email</span>
              </Separator>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
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
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+27 12 345 6789"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
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
                  <p className="text-xs text-gray-500">
                    Must be at least 8 characters with uppercase, lowercase, and number
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                      className="mt-1"
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed">
                      I agree to the{" "}
                      <Link href="/terms" className="text-[#00BFFF] hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-[#00BFFF] hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox id="newsletter" className="mt-1" />
                    <Label htmlFor="newsletter" className="text-sm leading-relaxed">
                      I want to receive health tips and updates via email
                    </Label>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-[#00BFFF] hover:bg-[#0099CC]"
                  disabled={isLoading || !acceptedTerms}
                >
                  {isLoading ? "Creating Account..." : "Continue to Profile"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
              
              <div className="mt-6 text-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                </span>
                <Link
                  href="/sign-in"
                  className="font-semibold text-[#00BFFF] hover:text-[#0099CC] hover:underline"
                >
                  Sign in here
                </Link>
              </div>
            </div>
          )}

          {step === 2 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Tell us more about yourself for better care
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="dob"
                      type="date"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      type="text"
                      placeholder="123 Healthcare Street"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Tzaneen" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input id="postalCode" placeholder="0850" />
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 bg-[#00BFFF] hover:bg-[#0099CC]"
                    onClick={() => setStep(3)}
                  >
                    Continue to Health Info
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Health Information (Optional)</CardTitle>
                <CardDescription>
                  This helps us provide better personalized care
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <select
                    id="bloodType"
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select blood type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <textarea
                    id="allergies"
                    placeholder="List any allergies (e.g., Penicillin, Peanuts)"
                    className="w-full px-3 py-2 border rounded-lg min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medications">Current Medications</Label>
                  <textarea
                    id="medications"
                    placeholder="List current medications"
                    className="w-full px-3 py-2 border rounded-lg min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="conditions">Existing Conditions</Label>
                  <textarea
                    id="conditions"
                    placeholder="Any chronic conditions (e.g., Diabetes, Hypertension)"
                    className="w-full px-3 py-2 border rounded-lg min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    placeholder="Name and phone number"
                  />
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800 dark:text-blue-300">
                      This information is encrypted and stored securely. It helps healthcare providers deliver safer, more effective care.
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 bg-[#00BFFF] hover:bg-[#0099CC]"
                    onClick={() => {
                      // Complete registration
                      window.location.href = "/dashboard";
                    }}
                  >
                    Complete Registration
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}