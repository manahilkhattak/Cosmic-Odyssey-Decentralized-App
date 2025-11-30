import React from "react";  
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrowserProvider, Contract, formatEther, parseEther } from 'ethers';

// Import ABIs (these would be generated after contract compilation)
import { CosmicTokenABI } from "../config/CosmicTokenABI.js";
import { CosmicNFTABI } from "../config/CosmicNFTABI.js";
import { CosmicOdysseyABI } from "../config/CosmicOdysseyABI.js";

interface Web3ContextType {
  provider: BrowserProvider | null;
  signer: any | null;
  account: string | null;
  chainId: number | null;
  cosmicToken: Contract | null;
  cosmicNFT: Contract | null;
  cosmicOdyssey: Contract | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnected: boolean;
  error: string | null;
}

const Web3Context = createContext<Web3ContextType>({
  provider: null,
  signer: null,
  account: null,
  chainId: null,
  cosmicToken: null,
  cosmicNFT: null,
  cosmicOdyssey: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isConnected: false,
  error: null
});

export function useWeb3() {
  return useContext(Web3Context);
}

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<any | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [cosmicToken, setCosmicToken] = useState<Contract | null>(null);
  const [cosmicNFT, setCosmicNFT] = useState<Contract | null>(null);
  const [cosmicOdyssey, setCosmicOdyssey] = useState<Contract | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Contract addresses (update these after deployment)
const CONTRACT_ADDRESSES = {
    CosmicToken: '0x6c1870Cf62827BbE05f87f022FE334B91C333B10',
    CosmicNFT: '0xBd9E4c580448F78e47Bb79DE559E255f9E8E1c4C',
    CosmicOdyssey: '0x5E09cC5eB51b6F71ac31de3909d0128173db004a'
  };
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError('MetaMask not installed');
        return;
      }

      const web3Provider = new BrowserProvider(window.ethereum);
      const accounts = await web3Provider.send('eth_requestAccounts', []);
      const web3Signer = await web3Provider.getSigner();
      const network = await web3Provider.getNetwork();

      setProvider(web3Provider);
      setSigner(web3Signer);
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));

      // Initialize contracts
      const tokenContract = new Contract(
        CONTRACT_ADDRESSES.CosmicToken,
        CosmicTokenABI,
        web3Signer
      );
      const nftContract = new Contract(
        CONTRACT_ADDRESSES.CosmicNFT,
        CosmicNFTABI,
        web3Signer
      );
      const mainContract = new Contract(
        CONTRACT_ADDRESSES.CosmicOdyssey,
        CosmicOdysseyABI,
        web3Signer
      );

      setCosmicToken(tokenContract);
      setCosmicNFT(nftContract);
      setCosmicOdyssey(mainContract);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error connecting wallet:', err);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setChainId(null);
    setCosmicToken(null);
    setCosmicNFT(null);
    setCosmicOdyssey(null);
  };

  // Listen for account and chain changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          disconnectWallet();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const value = {
    provider,
    signer,
    account,
    chainId,
    cosmicToken,
    cosmicNFT,
    cosmicOdyssey,
    connectWallet,
    disconnectWallet,
    isConnected: !!account,
    error
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}
