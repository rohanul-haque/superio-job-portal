import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Hirenest — Smart Job Discovery & Hiring Platform",
  description:
    "Next-generation job discovery and recruitment platform connecting ambitious talent with world-class employers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body
        className={`${outfit.className} min-h-screen bg-white text-slate-900 antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
