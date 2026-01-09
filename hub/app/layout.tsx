import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { Chatbot } from "@/components/Chatbot";
import { UploadProvider } from "@/components/UploadProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TZANEEN Healthcare Hub",
  description: "Your trusted healthcare partner in Tzaneen",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <UploadProvider>
            {children}
            <Toaster />
            <Chatbot />
          </UploadProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}