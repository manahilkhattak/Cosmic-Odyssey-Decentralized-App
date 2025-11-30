import React from "react";
import { useState, useEffect } from 'react';
import { Zap, DollarSign, Atom, Hexagon, Disc, TrendingUp } from 'lucide-react';
import { useWeb3 } from './Web3Provider';
import { formatEther } from 'ethers';

interface HUDProps {
  playerData: {
    credits: number;
    energy: number;
    darkMatter: number;
    neutronium: number;
    kryptonite: number;
    influence: number;
    planets: number;
    spaceships: number;
  };
}

export function HUD({ playerData }: HUDProps) {
  const { cosmicToken, cosmicNFT, account, isConnected } = useWeb3();
  
  // Real blockchain data
  const [cosmicBalance, setCosmicBalance] = useState('0');
  const [nftCounts, setNftCounts] = useState({
    planets: 0,
    spaceships: 0,
    aliens: 0,
    total: 0
  });
  const [discoveredPlanets, setDiscoveredPlanets] = useState(0);

  // Load blockchain data
  useEffect(() => {
    if (isConnected && cosmicToken && cosmicNFT && account) {
      loadBlockchainData();
      
      // Refresh every 10 seconds
      const interval = setInterval(loadBlockchainData, 10000);
      return () => clearInterval(interval);
    }
  }, [isConnected, cosmicToken, cosmicNFT, account]);

  // Load discovered planets from localStorage
  useEffect(() => {
    const savedPlanets = localStorage.getItem('cosmic-planets');
    if (savedPlanets) {
      try {
        const parsed = JSON.parse(savedPlanets);
        const discovered = parsed.filter((p: any) => p.discovered).length;
        setDiscoveredPlanets(discovered);
      } catch (e) {
        setDiscoveredPlanets(0);
      }
    }
  }, []);

  const loadBlockchainData = async () => {
    if (!cosmicToken || !cosmicNFT || !account) return;
    
    try {
      // Get COSMIC token balance
      const balance = await cosmicToken.balanceOf(account);
      setCosmicBalance(formatEther(balance));
      
      // Get NFT counts
      const nftIds = await cosmicNFT.getNFTsByOwner(account);
      let planets = 0;
      let spaceships = 0;
      let aliens = 0;
      
      for (let i = 0; i < nftIds.length; i++) {
        const tokenId = nftIds[i];
        const metadata = await cosmicNFT.nftMetadata(tokenId);
        const nftType = Number(metadata.nftType);
        
        if (nftType === 0) planets++;
        else if (nftType === 1) spaceships++;
        else if (nftType === 2) aliens++;
      }
      
      setNftCounts({
        planets,
        spaceships,
        aliens,
        total: nftIds.length
      });
    } catch (error) {
      console.error('Error loading blockchain data:', error);
    }
  };

  const resources = [
    { 
      icon: DollarSign, 
      label: 'COSMIC', 
      value: parseFloat(cosmicBalance).toFixed(2), 
      color: 'text-yellow-400', 
      bg: 'from-yellow-600/20' 
    },
    { 
      icon: Zap, 
      label: 'Energy', 
      value: playerData.energy.toLocaleString(), 
      color: 'text-cyan-400', 
      bg: 'from-cyan-600/20' 
    },
    { 
      icon: Atom, 
      label: 'Dark Matter', 
      value: playerData.darkMatter.toLocaleString(), 
      color: 'text-purple-400', 
      bg: 'from-purple-600/20' 
    },
    { 
      icon: Hexagon, 
      label: 'Neutronium', 
      value: playerData.neutronium.toLocaleString(), 
      color: 'text-blue-400', 
      bg: 'from-blue-600/20' 
    },
    { 
      icon: Disc, 
      label: 'Kryptonite', 
      value: playerData.kryptonite.toLocaleString(), 
      color: 'text-green-400', 
      bg: 'from-green-600/20' 
    },
    { 
      icon: TrendingUp, 
      label: 'Influence', 
      value: playerData.influence.toLocaleString(), 
      color: 'text-pink-400', 
      bg: 'from-pink-600/20' 
    }
  ];

  if (!isConnected) {
    return null; // Don't show HUD if not connected
  }

  return (
    <div className="fixed top-20 left-8 z-20 space-y-2">
      {resources.map((resource, index) => {
        const Icon = resource.icon;
        return (
          <div
            key={resource.label}
            className={`flex items-center gap-3 px-4 py-2 bg-gradient-to-r ${resource.bg} to-transparent border border-white/10 rounded-lg backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:scale-105`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Icon className={`w-5 h-5 ${resource.color}`} />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">{resource.label}</p>
              <p className={`text-lg ${resource.color}`}>{resource.value}</p>
            </div>
          </div>
        );
      })}
      
      {/* Fleet Status - Real NFT Counts */}
      <div className="mt-4 p-4 bg-gradient-to-br from-purple-600/10 to-cyan-600/10 border border-purple-500/30 rounded-lg backdrop-blur-md">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Fleet Status</p>
        <div className="space-y-1 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Planets:</span>
            <span className="text-cyan-400">{discoveredPlanets}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Spaceships:</span>
            <span className="text-purple-400">{nftCounts.spaceships}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Aliens:</span>
            <span className="text-pink-400">{nftCounts.aliens}</span>
          </div>
          <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/10">
            <span className="text-gray-300 font-semibold">Total NFTs:</span>
            <span className="text-yellow-400 font-semibold">{nftCounts.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}