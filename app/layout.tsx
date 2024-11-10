import localFont from "next/font/local";
import type { Metadata } from "next";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "MasterJi Dashboard App",
  description:
    "A modern, responsive dashboard built with Next.js, featuring weather updates, news feeds, and interactive task management tools. Powered by React, TypeScript, and Tailwind CSS. Made by Sub",
  keywords:
    "dashboard, Next.js, weather, news, task management, responsive, React, TypeScript, Tailwind CSS",
  authors: [{ name: "Subham", url: "https://github.com/Subham-hub" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`dark:bg-gray-950 bg-gray-100 min-h-screen flex flex-col
           ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
