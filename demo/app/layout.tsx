"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { AbstraxionProvider } from "@burnt-labs/abstraxion";
import "@burnt-labs/abstraxion/dist/index.css";
import "@burnt-labs/ui/dist/index.css";
import Contracts from "@/config/contracts.config";

const contracts = Contracts["xion-testnet"];
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AbstraxionProvider config={{ contracts: [contracts.icaFactory.address, contracts.hardcodedIcaMultisig.address] }} > {children} </AbstraxionProvider>
      </body>
    </html>
  );
}
