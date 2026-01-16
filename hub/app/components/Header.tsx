"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import {
  Menu,
  X,
  Calendar,
  User,
  Bell,
  Search,
  Heart,
  Phone,
  MapPin,
  Stethoscope,
  FileText,
  Video,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle, MobileThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: "/", label: "Home", icon: Heart },
  { href: "/services", label: "Services", icon: Stethoscope },
  { href: "/specialists", label: "Specialists", icon: User },
  { href: "/telehealth", label: "Telehealth", icon: Video },
  { href: "/blog", label: "Blog", icon: FileText },
  { href: "/media", label: "Media", icon: Heart },
  { href: "/about", label: "About", icon: Heart },
  { href: "/contact", label: "Contact", icon: Phone },
];

const quickActions = [
  { href: "/appointments", label: "My Appointments", icon: Calendar },
  { href: "/medical-records", label: "Medical Records", icon: FileText },
  { href: "/prescriptions", label: "Prescriptions", icon: Heart },
  { href: "/billing", label: "Billing", icon: FileText },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn, user } = useUser();

  const isActive = (href: string) => {
    if (href === "/") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-[#00BFFF] to-[#0099CC] text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Phone className="w-3 h-3 mr-2" />
                <a href="tel:+27153073000" className="hover:underline">
                  +27 15 307 3000
                </a>
              </div>
              <div className="hidden md:flex items-center">
                <MapPin className="w-3 h-3 mr-2" />
                <span>123 Healthcare Street, Tzaneen</span>
              </div>
              <div className="hidden lg:flex items-center">
                <Calendar className="w-3 h-3 mr-2" />
                <span>Mon-Fri: 8AM-8PM | Sat-Sun: 9AM-5PM</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/emergency"
                className="font-semibold hover:underline flex items-center"
              >
                🚨 Emergency: +27 15 307 3111
              </a>
              <div className="hidden md:block">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#00BFFF] rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="hidden md:block">
                  <h1 className="text-xl font-bold">TZANEEN Healthcare Hub</h1>
                  <p className="text-xs text-muted-foreground">
                    Your Health, Our Priority
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-[#00BFFF]/10 text-[#00BFFF]"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(!searchOpen)}
                className="hidden md:flex"
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Notifications */}
              {isSignedIn && (
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 px-1 py-0.5 min-w-[18px] h-[18px]">
                    3
                  </Badge>
                </Button>
              )}

              {/* Book Appointment Button */}
              <Link href="/book-appointment" className="hidden md:block">
                <Button className="bg-[#00BFFF] hover:bg-[#0099CC]">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
              </Link>

              {/* User Actions */}
              {isSignedIn ? (
                <div className="flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.imageUrl} />
                          <AvatarFallback>
                            {user?.firstName?.charAt(0)}
                            {user?.lastName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">{user?.fullName}</p>
                          <p className="w-[200px] truncate text-sm text-muted-foreground">
                            {user?.primaryEmailAddress?.emailAddress}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">
                          <User className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/appointments">
                          <Calendar className="mr-2 h-4 w-4" />
                          Appointments
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <ThemeToggle />
                        <span className="ml-2">Theme</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <UserButton afterSignOutUrl="/" />
                        <span className="ml-2">Sign Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
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
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <Link
                        href="/"
                        className="flex items-center space-x-3"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="w-10 h-10 bg-[#00BFFF] rounded-lg flex items-center justify-center">
                          <Heart className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h1 className="text-lg font-bold">TZANEEN Healthcare Hub</h1>
                          <p className="text-xs text-muted-foreground">
                            Your Health, Our Priority
                          </p>
                        </div>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      {/* Search */}
                      <div className="mb-6">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search..."
                            className="pl-9"
                          />
                        </div>
                      </div>

                      {/* Navigation */}
                      <nav className="space-y-1 mb-6">
                        {navItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                              isActive(item.href)
                                ? "bg-[#00BFFF]/10 text-[#00BFFF]"
                                : "hover:bg-accent"
                            }`}
                          >
                            <item.icon className="w-4 h-4 mr-3" />
                            {item.label}
                          </Link>
                        ))}
                      </nav>

                      {/* Quick Actions for Signed In Users */}
                      {isSignedIn && (
                        <div className="mb-6">
                          <h3 className="px-3 text-sm font-semibold text-muted-foreground mb-2">
                            Quick Actions
                          </h3>
                          <div className="space-y-1">
                            {quickActions.map((action) => (
                              <Link
                                key={action.href}
                                href={action.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-accent"
                              >
                                <action.icon className="w-4 h-4 mr-3" />
                                {action.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* User Section */}
                      {isSignedIn ? (
                        <div className="mb-6 p-3 bg-accent rounded-lg">
                          <div className="flex items-center space-x-3 mb-3">
                            <Avatar>
                              <AvatarImage src={user?.imageUrl} />
                              <AvatarFallback>
                                {user?.firstName?.charAt(0)}
                                {user?.lastName?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user?.fullName}</p>
                              <p className="text-xs text-muted-foreground">
                                {user?.primaryEmailAddress?.emailAddress}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Link href="/dashboard">
                              <Button variant="outline" size="sm" className="w-full">
                                Dashboard
                              </Button>
                            </Link>
                            <Link href="/profile">
                              <Button variant="outline" size="sm" className="w-full">
                                Profile
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-6 space-y-3">
                          <SignInButton mode="modal">
                            <Button variant="outline" className="w-full">
                              Sign In
                            </Button>
                          </SignInButton>
                          <SignUpButton mode="modal">
                            <Button className="w-full bg-[#00BFFF] hover:bg-[#0099CC]">
                              Create Account
                            </Button>
                          </SignUpButton>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-4">
                      <MobileThemeToggle />
                      <div className="mt-4 text-center text-sm text-muted-foreground">
                        <p>© {new Date().getFullYear()} TZANEEN Healthcare Hub</p>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Search Bar (when open) */}
          {searchOpen && (
            <div className="py-4 border-t">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for doctors, services, articles..."
                  className="pl-9"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0"
                  onClick={() => setSearchOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}