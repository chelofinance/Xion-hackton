"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { AbstraxionProvider } from "@burnt-labs/abstraxion";
import "@burnt-labs/abstraxion/styles.css";
import "@burnt-labs/ui/styles.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AbstraxionProvider config={{ contracts: [] }} > {children} </AbstraxionProvider>
      </body>
    </html>
  );
}
