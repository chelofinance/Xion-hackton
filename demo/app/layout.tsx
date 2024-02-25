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
        <AbstraxionProvider config={{
          contracts: [contracts.icaFactory.address, {
            address: contracts.proxyMultisig.address,
            amounts: [{ denom: "uxion", amount: "1000000000000" }], // I allowed one million xion tokens. Note that this is the maximum amount that can be sent per login. Ex: You can send 1000 times 1000xion tokens.
          }]
        }} > {children} </AbstraxionProvider>
      </body>
    </html>
  );
}
