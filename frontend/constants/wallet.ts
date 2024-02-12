import type { Wallet, WalletType } from "@/types/wallet";
import BURNT_LABS_LOGO_URL from '@/resources/logos/burnt_logo.svg';

export const abstraxion: Wallet = {
    type: 'abstraxion',
    name: 'Abstraxion',
    logoURL: BURNT_LABS_LOGO_URL,
    onNoConnector: () => {
      window.open('https://dashboard.burnt.com/', '_blank');
    }, 
}

export const wallets: Record<WalletType, Wallet> = { abstraxion };