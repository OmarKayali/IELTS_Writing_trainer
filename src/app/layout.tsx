import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/lib/ThemeContext";
import ThemeWrapper from "@/components/layout/ThemeWrapper";
import Header from "@/components/layout/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IELTS Writing Trainer | AI-Powered Exam Practice",
  description: "Master the IELTS Writing test with AI-powered feedback, band 9 model answers, and focused typing drills for Task 1 and Task 2.",
  keywords: ["IELTS", "Writing", "Practice", "AI Examiner", "Llama 3", "IELTS Task 1", "IELTS Task 2", "Exam Simulation"],
  authors: [{ name: "Omar Kayali" }],
  openGraph: {
    title: "IELTS Writing Trainer",
    description: "Achieve your target band with professional AI assessments.",
    type: "website",
    url: "https://ielts-writing-trainer.vercel.app", // User can update this
  },
  twitter: {
    card: "summary_large_image",
    title: "IELTS Writing Trainer",
    description: "AI-powered feedback for IELTS Writing tasks.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col transition-colors duration-300`}
      >
        <ThemeProvider>
          <ThemeWrapper>
            <Header />
            <main className="flex-grow">
              {children}
            </main>
          </ThemeWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
