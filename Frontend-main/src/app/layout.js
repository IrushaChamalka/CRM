import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LeadFlow CRM - Sales Pipeline Manager",
  description:
    "A modern CRM application for managing sales leads, tracking pipeline progress, and driving revenue growth.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1e293b",
                color: "#e2e8f0",
                border: "1px solid rgba(51, 65, 85, 0.5)",
              },
              success: {
                iconTheme: { primary: "#10b981", secondary: "#1e293b" },
              },
              error: {
                iconTheme: { primary: "#ef4444", secondary: "#1e293b" },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
