// Import console suppression FIRST before anything else
import React from "react";
import './utils/console-suppression';

import { useState, useEffect } from 'react';
import { GalaxyExplorer } from './components/GalaxyExplorer';
import { ResourcePanel } from './components/ResourcePanel';
import { GovernanceHub } from './components/GovernanceHub';
import { NFTGallery } from './components/NFTGallery';
import { DiplomacyCenter } from './components/DiplomacyCenter';
import { MissionControl } from './components/MissionControl';
import { AudioManager } from './components/AudioManager';
import { HUD } from './components/HUD';
import { ConnectWallet } from './components/ConnectWallet';
import { ContractDashboard } from './components/ContractDashboard';
import { ContractTester } from './components/ContractTester';
import { Rocket, Globe, Users, Coins, Vote, Zap, Code } from 'lucide-react';
import { useSound } from './hooks/useSound';

// Suppress Three.js duplicate instance warning immediately at module load time
// This is a harmless warning caused by @react-three/fiber and @react-three/drei both using Three.js
const originalWarn = console.warn;
const originalError = console.error;

console.warn = (...args: any[]) => {
  const message = String(args[0] || '');
  if (message.includes('Multiple instances of Three.js') || 
      message.includes('THREE.') ||
      message.includes('three.js')) {
    return; // Suppress Three.js warnings
  }
  originalWarn.apply(console, args);
};

console.error = (...args: any[]) => {
  const message = String(args[0] || '');
  if (message.includes('Multiple instances of Three.js') ||
      message.includes('THREE.') ||
      message.includes('three.js')) {
    return; // Suppress Three.js errors
  }
  originalError.apply(console, args);
};
export type GameView = 'galaxy' | 'resources' | 'governance' | 'nfts' | 'diplomacy' | 'missions' | 'contracts' | 'tester';

export default function App() {
  const [currentView, setCurrentView] = useState<GameView>('galaxy');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { playSound } = useSound();
  const [playerData, setPlayerData] = useState({
    address: '',
    credits: 10000,
    energy: 500,
    darkMatter: 50,
    neutronium: 25,
    kryptonite: 10,
    influence: 100,
    planets: 1,
    spaceships: 1
  });

  const navigationItems = [
    { id: 'galaxy' as GameView, icon: Globe, label: 'Galaxy Map', color: 'text-cyan-400' },
    { id: 'resources' as GameView, icon: Zap, label: 'Resources', color: 'text-yellow-400' },
    { id: 'governance' as GameView, icon: Vote, label: 'Governance', color: 'text-purple-400' },
    { id: 'tester' as GameView, icon: Code, label: 'Test', color: 'text-green-400' },
    { id: 'nfts' as GameView, icon: Coins, label: 'NFT Gallery', color: 'text-amber-400' },
    { id: 'diplomacy' as GameView, icon: Users, label: 'Diplomacy', color: 'text-emerald-400' },
    { id: 'missions' as GameView, icon: Rocket, label: 'Missions', color: 'text-red-400' },
    { id: 'contracts' as GameView, icon: Code, label: 'Contracts', color: 'text-pink-400' }
  ];

  const handleWalletConnect = (address: string) => {
    setIsWalletConnected(true);
    setPlayerData({ ...playerData, address });
  };

  const updateResources = (resources: Partial<typeof playerData>) => {
    setPlayerData(prev => {
      const updated = { ...prev };
      
      // Add to existing values instead of replacing
      Object.keys(resources).forEach(key => {
        const resourceKey = key as keyof typeof playerData;
        const value = resources[resourceKey];
        
        if (typeof value === 'number' && typeof prev[resourceKey] === 'number') {
          // Add to existing value
          (updated[resourceKey] as number) = (prev[resourceKey] as number) + value;
        } else {
          // Replace non-numeric values
          (updated as any)[resourceKey] = value;
        }
      });
      
      return updated;
    });
  };

  if (!isWalletConnected) {
    return <ConnectWallet onConnect={handleWalletConnect} />;
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Cosmic Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0B0B2D] via-[#1A0B2E] to-black">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black" />
      </div>

      {/* Stars Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>

      {/* Audio Manager */}
      <AudioManager currentView={currentView} />

      {/* HUD Overlay */}
      <HUD playerData={playerData} />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-4 bg-black/40 backdrop-blur-md border-b border-cyan-500/30">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full" />
              <Globe className="relative w-10 h-10 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl text-white tracking-wider font-[Orbitron]">
                COSMIC ODYSSEY
              </h1>
              <p className="text-xs text-cyan-400/70 tracking-widest">INTERSTELLAR GOVERNANCE PROTOCOL</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-lg">
              <p className="text-xs text-purple-300/70 uppercase tracking-wider">Commander ID</p>
              <p className="text-sm text-white font-mono">
                {playerData.address.slice(0, 6)}...{playerData.address.slice(-4)}
              </p>
            </div>
          </div>
        </header>

        {/* Main View Container */}
        <div className="flex-1 overflow-hidden">
          {currentView === 'galaxy' && <GalaxyExplorer onResourceUpdate={updateResources} />}
          {currentView === 'tester' && <ContractTester />}
          {currentView === 'resources' && <ResourcePanel playerData={playerData} onResourceUpdate={updateResources} />}
          {currentView === 'governance' && <GovernanceHub playerData={playerData} />}
          {currentView === 'nfts' && <NFTGallery playerData={playerData} />}
          {currentView === 'diplomacy' && <DiplomacyCenter playerData={playerData} />}
          {currentView === 'missions' && <MissionControl playerData={playerData} onResourceUpdate={updateResources} />}
          {currentView === 'contracts' && <ContractDashboard />}
        </div>

        {/* Bottom Navigation */}
        <nav className="flex items-center justify-around px-8 py-4 bg-black/60 backdrop-blur-xl border-t border-cyan-500/30">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  playSound('navigation');
                  setCurrentView(item.id);
                }}
                className={`relative group flex flex-col items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-t from-cyan-600/30 to-purple-600/30 border border-cyan-400/50' 
                    : 'hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-cyan-400/10 blur-xl rounded-lg" />
                )}
                <Icon className={`relative w-6 h-6 ${isActive ? item.color : 'text-gray-400'} transition-colors`} />
                <span className={`relative text-xs tracking-wider uppercase ${isActive ? 'text-white' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}