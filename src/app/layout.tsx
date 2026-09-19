import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Storebase | Your Cloud Media Storage',
  description:
    'Upload, preview, organize, and manage your media files in folders. Storebase is your personal media storage solution powered by ImageKit.',
  keywords: [
    'Storebase',
    'Media Storage App',
    'Cloud Storage',
    'Image Storage',
    'PDF Storage',
    'ImageKit',
    'Media Management',
    'Upload Media',
    'Next.js Storage App',
    'Storebase Dashboard',
    'Image Hosting',
    'Folder Media Manager',
    'File Organizer App',
  ],
  authors: [{ name: 'Fahim Khan Alif' }],
  creator: 'Fahim Khan Alif',
  publisher: 'Storebase',
  metadataBase: new URL('https://storebase.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Storebase | Your Cloud Media Storage',
    description:
      'Upload and manage your images and PDFs in organized folders. Storebase is a beautiful and fast cloud-based storage app.',
    url: 'https://storebase.vercel.app',
    siteName: 'Storebase',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Storebase | Your Cloud Media Storage',
    description:
      'Storebase helps you upload and organize your files in folders using ImageKit cloud integration.',
    creator: '@fahimalif077', // update if needed
  },
  category: 'Cloud Storage',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar/>
        <Toaster/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
