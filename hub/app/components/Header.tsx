"use client";

import { useState } from "react";
import { 
  Menu, 
  X, 
  Calendar, 
  User, 
  LogOut,
  Settings,
  Bell,
  FileText,
  Stethoscope
} from "lucide-react";
import { useUser, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  onBookingClick: () => void;
}

export function Header({ onBookingClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();

  const navLinks = [
    { href: "/services", label: "Services" },
    { href: "/specialists", label: "Specialists" },
    { href: "/blog", label: "Blog" },
    { href: "/media", label: "Media" },
    { href: "/contact", label: "Contact" },
  ];

// const navLinks = [
//   // ... existing links
//   { href: "/blog", label: "Blog" },
//   { href: "/media", label: "Media" },
// ];

// // Add create button for authorized users
// {user?.role === "ADMIN" || user?.doctor && (
//   <Link href="/blog/create">
//     <Button variant="ghost" size="sm">
//       <PenSquare className="w-4 h-4 mr-1" />
//       Write
//     </Button>
//   </Link>
// )}

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3">
              <img
                src="https://ucarecdn.com/31120916-9dd6-4689-aa00-5726650e1272/-/format/auto/"
                alt="TZANEEN Healthcare Hub"
                className="h-16 w-auto"
              />
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  TZANEEN Healthcare Hub
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your Health, Our Priority
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 dark:text-gray-300 hover:text-[#00BFFF] dark:hover:text-[#00BFFF] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Guest Booking Button */}
            <Button
              onClick={onBookingClick}
              className="bg-[#00BFFF] hover:bg-[#0099CC] text-white hidden md:flex"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>

            {isSignedIn ? (
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 px-1 py-0.5 min-w-[18px] h-[18px]">
                    3
                  </Badge>
                </Button>

                {/* User Menu */}
                <div className="hidden md:flex items-center space-x-2">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10",
                      },
                    }}
                  />
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium">{user?.fullName}</p>
                    <p className="text-xs text-gray-500">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>

                {/* Quick Links Dropdown */}
                <div className="hidden md:flex items-center space-x-2">
                  <Link href="/dashboard/appointments">
                    <Button variant="ghost" size="sm">
                      <FileText className="w-4 h-4 mr-1" />
                      Appointments
                    </Button>
                  </Link>
                  <Link href="/dashboard/medical-records">
                    <Button variant="ghost" size="sm">
                      <Stethoscope className="w-4 h-4 mr-1" />
                      Records
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <SignInButton mode="modal">
                  <Button variant="ghost">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="bg-[#00BFFF] hover:bg-[#0099CC]">
                    Create Account
                  </Button>
                </SignUpButton>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="px-4 py-3 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-[#00BFFF]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 border-t space-y-3">
              {isSignedIn ? (
                <>
                  <div className="flex items-center space-x-3 py-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.imageUrl} />
                      <AvatarFallback>
                        {user?.firstName?.charAt(0)}
                        {user?.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user?.fullName}</p>
                      <p className="text-xs text-gray-500">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>
                  
                  <Link
                    href="/dashboard"
                    className="flex items-center py-2 text-gray-700 dark:text-gray-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/appointments"
                    className="flex items-center py-2 text-gray-700 dark:text-gray-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Calendar className="w-4 h-4 mr-3" />
                    My Appointments
                  </Link>
                  <Link
                    href="/dashboard/medical-records"
                    className="flex items-center py-2 text-gray-700 dark:text-gray-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FileText className="w-4 h-4 mr-3" />
                    Medical Records
                  </Link>
                </>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <Button 
                      variant="outline" 
                      className="w-full justify-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button 
                      className="w-full justify-center bg-[#00BFFF] hover:bg-[#0099CC]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Create Account
                    </Button>
                  </SignUpButton>
                </>
              )}
              
              <Button
                onClick={() => {
                  onBookingClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-[#00BFFF] hover:bg-[#0099CC]"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}