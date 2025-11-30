import React from "react";
import { useState } from 'react';
import { Rocket, Zap, Globe, Sparkles } from 'lucide-react';
import { useWeb3 } from './Web3Provider';

interface ConnectWalletProps {
  onConnect: (address: string) => void;
}

export function ConnectWallet({ onConnect }: ConnectWalletProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const { connectWallet, error } = useWeb3();

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
      
      // Get the connected account
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts[0]) {
          onConnect(accounts[0]);
        }
      }
    } catch (err) {
      console.error('Connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B0B2D] via-[#1A0B2E] to-black">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80')] bg-cover bg-center opacity-20" />
      </div>

      {/* Animated Stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(150)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.8 + 0.2
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        {/* Logo and Title */}
        <div className="mb-12">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-cyan-400/30 blur-3xl rounded-full animate-pulse" />
            <Globe className="relative w-24 h-24 text-cyan-400 mx-auto animate-spin-slow" />
          </div>

          <h1 className="text-6xl mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-[Orbitron] tracking-wider">
            COSMIC ODYSSEY
          </h1>

          <p className="text-xl text-cyan-300/80 tracking-widest mb-2 font-[Rajdhani]">
            INTERSTELLAR GOVERNANCE PROTOCOL
          </p>

          <div className="flex items-center justify-center gap-2 text-gray-400">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-500/50" />
            <span className="text-sm tracking-wider">v1.0.0 GENESIS</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-500/50" />
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="p-4 bg-gradient-to-b from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-lg backdrop-blur-sm">
            <Rocket className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <p className="text-sm text-gray-300">Explore Galaxies</p>
          </div>

          <div className="p-4 bg-gradient-to-b from-purple-500/10 to-transparent border border-purple-500/20 rounded-lg backdrop-blur-sm">
            <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-gray-300">Manage Resources</p>
          </div>

          <div className="p-4 bg-gradient-to-b from-pink-500/10 to-transparent border border-pink-500/20 rounded-lg backdrop-blur-sm">
            <Sparkles className="w-8 h-8 text-pink-400 mx-auto mb-2" />
            <p className="text-sm text-gray-300">Govern Cosmos</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Connect Button */}
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="group relative px-12 py-5 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity" />

          <div className="relative flex items-center justify-center gap-3">
            {isConnecting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-lg text-white tracking-wider uppercase font-[Rajdhani]">
                  Connecting to MetaMask...
                </span>
              </>
            ) : (
              <>
                <Rocket className="w-6 h-6 text-white" />
                <span className="text-lg text-white tracking-wider uppercase font-[Rajdhani]">
                  Connect MetaMask
                </span>
              </>
            )}
          </div>
        </button>

        <p className="mt-6 text-sm text-gray-500">
          Connect your MetaMask wallet to begin your interstellar journey
        </p>

        {/* Info Box */}
        <div className="mt-12 p-6 bg-black/40 border border-cyan-500/20 rounded-lg backdrop-blur-sm">
          <h3 className="text-lg text-cyan-400 mb-3 tracking-wider">Genesis Mission Rewards</h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <span className="text-yellow-400">⚡</span> 500 Energy Units
            </div>
            <div>
              <span className="text-cyan-400">🚀</span> Genesis Spaceship NFT
            </div>
            <div>
              <span className="text-purple-400">🌌</span> Starter Planet
            </div>
            <div>
              <span className="text-green-400">💰</span> 10,000 Credits
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}