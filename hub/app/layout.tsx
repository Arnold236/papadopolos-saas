import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Chatbot } from "@/components/Chatbot";
import { UploadProvider } from "@/components/UploadProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TZANEEN Healthcare Hub - Your Trusted Health Partner",
  description: "Comprehensive healthcare services, telemedicine, and expert medical care in Tzaneen, Limpopo",
  keywords: ["healthcare", "hospital", "doctor", "appointment", "telemedicine", "Tzaneen", "South Africa"],
  authors: [{ name: "TZANEEN Healthcare Hub" }],
  creator: "TZANEEN Healthcare Hub",
  publisher: "TZANEEN Healthcare Hub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "https://tzaneenhub.co.za",
    title: "TZANEEN Healthcare Hub",
    description: "Your trusted healthcare partner in Tzaneen",
    siteName: "TZANEEN Healthcare Hub",
  },
  twitter: {
    card: "summary_large_image",
    title: "TZANEEN Healthcare Hub",
    description: "Your trusted healthcare partner in Tzaneen",
    creator: "@tzaneenhub",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#00BFFF",
          colorText: "hsl(var(--foreground))",
          colorBackground: "hsl(var(--background))",
          colorInputBackground: "hsl(var(--background))",
          colorInputText: "hsl(var(--foreground))",
        },
        elements: {
          formButtonPrimary: "bg-[#00BFFF] hover:bg-[#0099CC]",
          footerActionLink: "text-[#00BFFF] hover:text-[#0099CC]",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="theme-color" content="#00BFFF" />
        </head>
        <body className={`${inter.className} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <UploadProvider>
              <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <Toaster />
                <Chatbot />
              </div>
            </UploadProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}