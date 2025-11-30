import React from "react";
import { useState, useEffect } from 'react';
import { Sparkles, Rocket, Globe, Gem, TrendingUp, Eye, ShoppingCart, Loader } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useWeb3 } from './Web3Provider';
import { parseEther, formatEther } from 'ethers';

interface NFT {
  id: string;
  tokenId: number;
  type: 'planet' | 'spaceship' | 'alien';
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  attributes: { trait: string; value: string }[];
  power: number;
  speed: number;
  defense: number;
  level: number;
  image: string;
}

interface NFTGalleryProps {
  playerData: {
    credits: number;
  };
}

export function NFTGallery({ playerData }: NFTGalleryProps) {
  const { cosmicNFT, account, isConnected } = useWeb3();
  const [activeTab, setActiveTab] = useState<'owned' | 'mint'>('owned');
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [filter, setFilter] = useState<'all' | NFT['type']>('all');
  const [myNFTs, setMyNFTs] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [mintLoading, setMintLoading] = useState(false);
  const [status, setStatus] = useState('');

  // NFT type mapping
  const nftTypeMap = ['planet', 'spaceship', 'alien'] as const;
  const rarityMap = ['common', 'rare', 'epic', 'legendary', 'mythic'] as const;

  // Load user's NFTs
  useEffect(() => {
    if (isConnected && cosmicNFT && account) {
      loadMyNFTs();
    }
  }, [isConnected, cosmicNFT, account]);

  const loadMyNFTs = async () => {
    if (!cosmicNFT || !account) return;
    
    setLoading(true);
    try {
      // Get user's NFT token IDs
      const tokenIds = await cosmicNFT.getNFTsByOwner(account);
      
      const nftPromises = tokenIds.map(async (tokenId: bigint) => {
        const metadata = await cosmicNFT.nftMetadata(tokenId);
        
        return {
          id: tokenId.toString(),
          tokenId: Number(tokenId),
          type: nftTypeMap[Number(metadata.nftType)],
          name: `${nftTypeMap[Number(metadata.nftType)].charAt(0).toUpperCase() + nftTypeMap[Number(metadata.nftType)].slice(1)} #${tokenId}`,
          rarity: rarityMap[Number(metadata.rarity)],
          attributes: [
            { trait: 'Power', value: metadata.power.toString() },
            { trait: 'Speed', value: metadata.speed.toString() },
            { trait: 'Defense', value: metadata.defense.toString() },
            { trait: 'Special Ability', value: metadata.specialAbility.toString() },
            { trait: 'Level', value: metadata.level.toString() },
            { trait: 'Experience', value: metadata.experience.toString() }
          ],
          power: Number(metadata.power),
          speed: Number(metadata.speed),
          defense: Number(metadata.defense),
          level: Number(metadata.level),
          image: metadata.ipfsHash
        };
      });
      
      const nfts = await Promise.all(nftPromises);
      setMyNFTs(nfts);
    } catch (error) {
      console.error('Error loading NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  const mintNFT = async (nftType: 0 | 1 | 2) => {
    if (!cosmicNFT || !account) return;
    
    setMintLoading(true);
    setStatus(`Minting ${nftTypeMap[nftType]}...`);
    
    try {
      const prices = ['0.01', '0.015', '0.02'];
      const ipfsHash = `ipfs://Qm${Date.now()}${nftType}`;
      
      const tx = await cosmicNFT.mintNFT(nftType, ipfsHash, {
        value: parseEther(prices[nftType])
      });
      
      setStatus('Transaction sent! Waiting for confirmation...');
      await tx.wait();
      
      setStatus('✅ NFT Minted Successfully!');
      
      // Reload NFTs
      await loadMyNFTs();
      
      setTimeout(() => setStatus(''), 3000);
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
      setTimeout(() => setStatus(''), 5000);
    } finally {
      setMintLoading(false);
    }
  };

  const getRarityColor = (rarity: NFT['rarity']) => {
    const colors = {
      common: 'gray',
      rare: 'blue',
      epic: 'purple',
      legendary: 'yellow',
      mythic: 'pink'
    };
    return colors[rarity];
  };

  const getTypeIcon = (type: NFT['type']) => {
    const icons = {
      planet: Globe,
      spaceship: Rocket,
      alien: Sparkles
    };
    return icons[type];
  };

  const filteredNFTs = myNFTs.filter(nft => {
    if (filter !== 'all' && nft.type !== filter) return false;
    return true;
  });

  if (!isConnected) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2">Connect Wallet</h3>
          <p className="text-gray-400">Please connect your wallet to view your NFTs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl text-white mb-2">NFT Gallery</h2>
            <p className="text-gray-400">Collect and manage your cosmic NFTs</p>
          </div>
        </div>

        {/* Status Message */}
        {status && (
          <div className="p-4 bg-black/60 border border-cyan-500/30 rounded-lg text-white">
            {status}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-black/40 border border-white/10 rounded-lg">
          {(['owned', 'mint'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-3 rounded-lg transition-all capitalize ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-400/50 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'owned' ? 'My Collection' : 'Mint NFT'}
            </button>
          ))}
        </div>

        {activeTab === 'mint' ? (
          /* Mint Section */
          <div className="grid grid-cols-3 gap-6">
            <div className="p-6 bg-black/40 border border-white/10 rounded-lg">
              <Globe className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl text-white mb-2">Planet NFT</h3>
              <p className="text-gray-400 mb-4">Own a cosmic planet with unique attributes</p>
              <div className="mb-4 p-3 bg-cyan-600/10 border border-cyan-500/30 rounded-lg">
                <p className="text-cyan-400 text-lg">0.01 ETH</p>
              </div>
              <button
                onClick={() => mintNFT(0)}
                disabled={mintLoading}
                className="w-full px-4 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {mintLoading ? <Loader className="w-5 h-5 animate-spin" /> : 'Mint Planet'}
              </button>
            </div>

            <div className="p-6 bg-black/40 border border-white/10 rounded-lg">
              <Rocket className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl text-white mb-2">Spaceship NFT</h3>
              <p className="text-gray-400 mb-4">Command a powerful spaceship</p>
              <div className="mb-4 p-3 bg-purple-600/10 border border-purple-500/30 rounded-lg">
                <p className="text-purple-400 text-lg">0.015 ETH</p>
              </div>
              <button
                onClick={() => mintNFT(1)}
                disabled={mintLoading}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {mintLoading ? <Loader className="w-5 h-5 animate-spin" /> : 'Mint Spaceship'}
              </button>
            </div>

            <div className="p-6 bg-black/40 border border-white/10 rounded-lg">
              <Sparkles className="w-12 h-12 text-pink-400 mb-4" />
              <h3 className="text-xl text-white mb-2">Alien NFT</h3>
              <p className="text-gray-400 mb-4">Recruit a unique alien character</p>
              <div className="mb-4 p-3 bg-pink-600/10 border border-pink-500/30 rounded-lg">
                <p className="text-pink-400 text-lg">0.02 ETH</p>
              </div>
              <button
                onClick={() => mintNFT(2)}
                disabled={mintLoading}
                className="w-full px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {mintLoading ? <Loader className="w-5 h-5 animate-spin" /> : 'Mint Alien'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="flex gap-2">
              {(['all', 'planet', 'spaceship', 'alien'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-lg transition-all capitalize ${
                    filter === type
                      ? 'bg-cyan-600/30 border border-cyan-400/50 text-white'
                      : 'bg-black/40 border border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="py-20 text-center">
                <Loader className="w-16 h-16 text-cyan-400 mx-auto mb-4 animate-spin" />
                <p className="text-gray-400">Loading your NFTs...</p>
              </div>
            ) : (
              <>
                {/* NFT Grid */}
                <div className="grid grid-cols-3 gap-6">
                  {filteredNFTs.map((nft) => {
                    const TypeIcon = getTypeIcon(nft.type);
                    const rarityColor = getRarityColor(nft.rarity);

                    return (
                      <div
                        key={nft.id}
                        onClick={() => setSelectedNFT(nft)}
                        className="group cursor-pointer p-4 bg-black/40 border border-white/10 rounded-lg backdrop-blur-sm hover:border-cyan-400/50 transition-all hover:scale-105"
                      >
                        {/* NFT Image */}
                        <div className="relative mb-4 aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-cyan-600/20 to-purple-600/20 flex items-center justify-center">
                          <TypeIcon className="w-24 h-24 text-cyan-400" />

                          {/* Rarity Badge */}
                          <div className={`absolute top-3 right-3 px-3 py-1 bg-${rarityColor}-600/80 backdrop-blur-sm border border-${rarityColor}-400/50 rounded-full`}>
                            <span className={`text-xs text-white uppercase tracking-wider`}>
                              {nft.rarity}
                            </span>
                          </div>

                          {/* Level Badge */}
                          <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/80 backdrop-blur-sm border border-cyan-400/50 rounded-full">
                            <span className="text-xs text-cyan-400">Level {nft.level}</span>
                          </div>

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Eye className="w-8 h-8 text-white" />
                          </div>
                        </div>

                        {/* NFT Info */}
                        <div>
                          <h3 className="text-lg text-white mb-2">{nft.name}</h3>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Power:</span>
                              <span className="text-cyan-400">{nft.power}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Speed:</span>
                              <span className="text-cyan-400">{nft.speed}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Defense:</span>
                              <span className="text-cyan-400">{nft.defense}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Empty State */}
                {filteredNFTs.length === 0 && (
                  <div className="py-20 text-center">
                    <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl text-gray-400 mb-2">No NFTs Found</h3>
                    <p className="text-gray-500">Mint your first NFT to get started!</p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <div
          onClick={() => setSelectedNFT(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-gradient-to-br from-[#0B0B2D] to-[#1A0B2E] border border-cyan-500/30 rounded-lg overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-6 p-8">
              {/* Image */}
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-cyan-600/20 to-purple-600/20 flex items-center justify-center">
                {React.createElement(getTypeIcon(selectedNFT.type), { className: "w-48 h-48 text-cyan-400" })}
              </div>

              {/* Details */}
              <div>
                <div className="mb-6">
                  <h2 className="text-3xl text-white mb-2">{selectedNFT.name}</h2>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 bg-${getRarityColor(selectedNFT.rarity)}-600/20 border border-${getRarityColor(selectedNFT.rarity)}-500/30 rounded-full text-xs text-white uppercase tracking-wider`}>
                      {selectedNFT.rarity}
                    </span>
                    <span className="px-3 py-1 bg-cyan-600/20 border border-cyan-500/30 rounded-full text-xs text-cyan-400 uppercase tracking-wider">
                      {selectedNFT.type}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg text-white mb-3">Attributes</h3>
                  <div className="space-y-3">
                    {selectedNFT.attributes.map((attr, index) => (
                      <div key={index} className="p-3 bg-black/40 border border-white/10 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400 uppercase tracking-wider">{attr.trait}</span>
                          <span className="text-sm text-cyan-400">{attr.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-600/10 to-emerald-600/10 border border-green-500/30 rounded-lg text-center">
                  <p className="text-green-400 mb-1">You own this NFT</p>
                  <p className="text-sm text-gray-400">Token ID: #{selectedNFT.tokenId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}