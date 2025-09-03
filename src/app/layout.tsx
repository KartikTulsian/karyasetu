import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import '@fortawesome/fontawesome-free/css/all.min.css';
import { ClerkProvider } from '@clerk/nextjs'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KaryaSetu",
  description: "Create. Collaborate. Celebrate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children} <ToastContainer position="bottom-right"/></body>
      </html>
    </ClerkProvider>
    
  );
}
