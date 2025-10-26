import { ethers } from 'ethers';

export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
}

export const connectWallet = async (): Promise<WalletState> => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask no está instalado. Por favor, instala MetaMask para continuar.');
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    const network = await provider.getNetwork();
    
    return {
      address: accounts[0],
      chainId: Number(network.chainId),
      isConnected: true,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Error al conectar con la wallet');
  }
};

export const disconnectWallet = (): WalletState => {
  return {
    address: null,
    chainId: null,
    isConnected: false,
  };
};

export const getShortAddress = (address: string): string => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const checkIfWalletIsConnected = async (): Promise<WalletState> => {
  if (typeof window.ethereum === 'undefined') {
    return {
      address: null,
      chainId: null,
      isConnected: false,
    };
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_accounts', []);
    
    if (accounts.length > 0) {
      const network = await provider.getNetwork();
      return {
        address: accounts[0],
        chainId: Number(network.chainId),
        isConnected: true,
      };
    }
  } catch (error) {
    console.error('Error checking wallet connection:', error);
  }

  return {
    address: null,
    chainId: null,
    isConnected: false,
  };
};

declare global {
  interface Window {
    ethereum?: any;
  }
}
