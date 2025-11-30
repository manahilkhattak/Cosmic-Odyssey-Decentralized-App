import React from "react";
import { useState, useEffect } from 'react';
import { Rocket, Zap, Users, Globe, TrendingUp, Clock, Award, Loader, Star } from 'lucide-react';
import { useWeb3 } from './Web3Provider';
import { formatEther } from 'ethers';

interface NFT {
  tokenId: string;
  name: string;
  nftType: number;
  level: number;
  power: number;
  experience: number;
}

interface MissionControlProps {
  playerData: {
    credits: number;
    energy: number;
  };
  onResourceUpdate: (resources: any) => void;
}

export function MissionControl({ playerData, onResourceUpdate }: MissionControlProps) {
  const { cosmicNFT, account, isConnected } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  
  // NFT data
  const [userNFTs, setUserNFTs] = useState<NFT[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null);
  
  // Mission types
  const missionTypes = [
    {
      id: 'exploration',
      name: 'Planetary Exploration',
      icon: Globe,
      color: 'cyan',
      expReward: 500,
      description: 'Explore uncharted planets and discover resources',
      requiredType: 0, // Planet
      duration: '2 hours'
    },
    {
      id: 'combat',
      name: 'Space Battle',
      icon: Rocket,
      color: 'red',
      expReward: 1000,
      description: 'Engage in tactical space combat missions',
      requiredType: 1, // Spaceship
      duration: '4 hours'
    },
    {
      id: 'diplomacy',
      name: 'Diplomatic Mission',
      icon: Users,
      color: 'purple',
      expReward: 750,
      description: 'Negotiate with alien civilizations',
      requiredType: 2, // Alien
      duration: '3 hours'
    }
  ];

  // Load user NFTs
  useEffect(() => {
    if (isConnected && cosmicNFT && account) {
      loadUserNFTs();
    }
  }, [isConnected, cosmicNFT, account]);

  const loadUserNFTs = async () => {
    if (!cosmicNFT || !account) return;
    
    try {
      const nftIds = await cosmicNFT.getNFTsByOwner(account);
      const loadedNFTs: NFT[] = [];
      
      for (let i = 0; i < nftIds.length; i++) {
        const tokenId = nftIds[i].toString();
        
        try {
          // Verify ownership before adding to list
          const owner = await cosmicNFT.ownerOf(tokenId);
          
          if (owner.toLowerCase() === account.toLowerCase()) {
            const metadata = await cosmicNFT.nftMetadata(tokenId);
            
            loadedNFTs.push({
              tokenId,
              name: `${['Planet', 'Spaceship', 'Alien'][Number(metadata.nftType)]} #${tokenId}`,
              nftType: Number(metadata.nftType),
              level: Number(metadata.level),
              power: Number(metadata.power),
              experience: Number(metadata.experience)
            });
          }
        } catch (err) {
          console.log(`Skipping NFT ${tokenId} - not owned or error:`, err);
        }
      }
      
      setUserNFTs(loadedNFTs);
    } catch (error) {
      console.error('Error loading NFTs:', error);
    }
  };

  const handleLaunchMission = async (missionType: string, expReward: number) => {
    if (!cosmicNFT || !selectedNFT) return;
    
    setLoading(true);
    setStatus('Launching mission...');
    
    try {
      // Verify ownership before launching
      const owner = await cosmicNFT.ownerOf(selectedNFT);
      if (owner.toLowerCase() !== account?.toLowerCase()) {
        setStatus('❌ Error: You do not own this NFT');
        setTimeout(() => setStatus(''), 5000);
        setLoading(false);
        return;
      }
      
      // Add experience to the selected NFT
      const tx = await cosmicNFT.addExperience(
        selectedNFT,
        expReward,
        'mission'
      );
      
      setStatus('Transaction sent! Waiting for confirmation...');
      await tx.wait();
      
      setStatus(`✅ Mission completed! Earned ${expReward} XP`);
      
      // Refresh NFT list and clear selection
      await loadUserNFTs();
      setSelectedNFT(null);
      
      setTimeout(() => setStatus(''), 3000);
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
      setTimeout(() => setStatus(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const getNFTsByType = (type: number) => {
    return userNFTs.filter(nft => nft.nftType === type);
  };

  const getTypeColor = (type: number) => {
    const colors = ['cyan', 'red', 'purple'];
    return colors[type];
  };

  const getTypeName = (type: number) => {
    const names = ['Planet', 'Spaceship', 'Alien'];
    return names[type];
  };

  if (!isConnected) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <Rocket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2">Connect Wallet</h3>
          <p className="text-gray-400">Please connect your wallet to access missions</p>
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
            <h2 className="text-3xl text-white mb-2">Mission Control</h2>
            <p className="text-gray-400">Launch missions to earn experience for your NFTs</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-4 bg-black/40 border border-white/10 rounded-lg text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Your NFTs</p>
              <p className="text-2xl text-cyan-400">{userNFTs.length}</p>
            </div>
            <div className="p-4 bg-black/40 border border-white/10 rounded-lg text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Missions Available</p>
              <p className="text-2xl text-purple-400">{missionTypes.length}</p>
            </div>
          </div>
        </div>

        {/* Status Message */}
        {status && (
          <div className="p-4 bg-black/60 border border-cyan-500/30 rounded-lg text-white">
            {status}
          </div>
        )}

        {/* No NFTs Warning */}
        {userNFTs.length === 0 && (
          <div className="p-8 bg-gradient-to-br from-yellow-600/10 to-orange-600/10 border border-yellow-500/30 rounded-lg text-center">
            <Rocket className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">No NFTs Found</h3>
            <p className="text-gray-400 mb-4">You need NFTs to launch missions. Go to the NFT Gallery to mint some!</p>
          </div>
        )}

        {/* Mission Selection */}
        {userNFTs.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-2xl text-white">Available Missions</h3>
            
            <div className="grid grid-cols-1 gap-6">
              {missionTypes.map((mission) => {
                const MissionIcon = mission.icon;
                const availableNFTs = getNFTsByType(mission.requiredType);
                const canLaunch = availableNFTs.length > 0;

                return (
                  <div
                    key={mission.id}
                    className={`p-6 rounded-lg border transition-all ${
                      canLaunch
                        ? `bg-gradient-to-br from-${mission.color}-600/10 to-transparent border-${mission.color}-500/30 hover:border-${mission.color}-400/50`
                        : 'bg-black/40 border-white/10 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-6">
                      {/* Mission Icon */}
                      <div className={`w-20 h-20 bg-gradient-to-br from-${mission.color}-600/20 to-${mission.color}-600/5 border border-${mission.color}-500/30 rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <MissionIcon className={`w-10 h-10 text-${mission.color}-400`} />
                      </div>

                      {/* Mission Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h4 className="text-2xl text-white">{mission.name}</h4>
                          <span className={`px-3 py-1 bg-${mission.color}-600/20 border border-${mission.color}-500/30 rounded-full text-xs text-${mission.color}-400 uppercase tracking-wider`}>
                            {getTypeName(mission.requiredType)} Required
                          </span>
                        </div>

                        <p className="text-gray-400 mb-4">{mission.description}</p>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="p-3 bg-black/40 border border-white/10 rounded-lg">
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">XP Reward</p>
                            <p className={`text-lg text-${mission.color}-400 flex items-center gap-1`}>
                              <Award className="w-4 h-4" />
                              {mission.expReward}
                            </p>
                          </div>

                          <div className="p-3 bg-black/40 border border-white/10 rounded-lg">
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Duration</p>
                            <p className="text-lg text-white flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {mission.duration}
                            </p>
                          </div>

                          <div className="p-3 bg-black/40 border border-white/10 rounded-lg">
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Available NFTs</p>
                            <p className={`text-lg ${canLaunch ? 'text-green-400' : 'text-red-400'}`}>
                              {availableNFTs.length}
                            </p>
                          </div>
                        </div>

                        {/* NFT Selection */}
                        {canLaunch && (
                          <div className="space-y-3">
                            <p className="text-sm text-gray-400">Select an NFT for this mission:</p>
                            <div className="grid grid-cols-3 gap-3">
                              {availableNFTs.map((nft) => (
                                <button
                                  key={nft.tokenId}
                                  onClick={() => setSelectedNFT(nft.tokenId)}
                                  className={`p-4 rounded-lg border transition-all ${
                                    selectedNFT === nft.tokenId
                                      ? `bg-${mission.color}-600/20 border-${mission.color}-400 ring-2 ring-${mission.color}-400/50`
                                      : 'bg-black/40 border-white/10 hover:border-white/20'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <Star className={`w-4 h-4 text-${mission.color}-400`} />
                                    <p className="text-sm text-white font-mono">{nft.name}</p>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-400">Level {nft.level}</span>
                                    <span className={`text-${mission.color}-400`}>Power: {nft.power}</span>
                                  </div>
                                  <div className="mt-2 text-xs text-gray-500">
                                    XP: {nft.experience}/1000
                                  </div>
                                </button>
                              ))}
                            </div>

                            {/* Launch Button */}
                            <button
                              onClick={() => handleLaunchMission(mission.id, mission.expReward)}
                              disabled={loading || !selectedNFT}
                              className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-${mission.color}-600 to-${mission.color}-700 rounded-lg text-white hover:shadow-lg hover:shadow-${mission.color}-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {loading ? (
                                <>
                                  <Loader className="w-5 h-5 animate-spin" />
                                  <span>Launching Mission...</span>
                                </>
                              ) : (
                                <>
                                  <Rocket className="w-5 h-5" />
                                  <span>Launch Mission</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        {!canLaunch && (
                          <div className="p-4 bg-red-600/10 border border-red-500/30 rounded-lg">
                            <p className="text-sm text-red-400">
                              ⚠️ You need a {getTypeName(mission.requiredType)} NFT to launch this mission. Go to NFT Gallery to mint one!
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Mission Guide */}
        <div className="p-6 bg-gradient-to-br from-cyan-600/10 to-purple-600/10 border border-cyan-500/30 rounded-lg">
          <h3 className="text-lg text-white mb-4">How Missions Work</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-black/40 border border-white/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-cyan-600/20 border border-cyan-500/30 rounded-full flex items-center justify-center">
                  <span className="text-xs text-cyan-400">1</span>
                </div>
                <p className="text-white">Select Mission</p>
              </div>
              <p className="text-gray-400">Choose a mission type based on your NFT</p>
            </div>

            <div className="p-4 bg-black/40 border border-white/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-purple-600/20 border border-purple-500/30 rounded-full flex items-center justify-center">
                  <span className="text-xs text-purple-400">2</span>
                </div>
                <p className="text-white">Pick NFT</p>
              </div>
              <p className="text-gray-400">Select which NFT will go on the mission</p>
            </div>

            <div className="p-4 bg-black/40 border border-white/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-green-600/20 border border-green-500/30 rounded-full flex items-center justify-center">
                  <span className="text-xs text-green-400">3</span>
                </div>
                <p className="text-white">Earn XP</p>
              </div>
              <p className="text-gray-400">Complete and gain experience to level up</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}