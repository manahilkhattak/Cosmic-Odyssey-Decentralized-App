import React from "react";  
import { useState } from 'react';
import { Code, Zap, Coins, Rocket, Users, Vote, Shield, TrendingUp, Package } from 'lucide-react';

export function ContractDashboard() {
  const [activeContract, setActiveContract] = useState<'token' | 'nft' | 'game'>('token');

  const contracts = [
    {
      id: 'token' as const,
      name: 'CosmicToken.sol',
      type: 'ERC-20',
      icon: Coins,
      color: 'yellow',
      address: '0x0000...0000',
      functions: [
        {
          name: 'stakeTokens',
          description: 'Stake COSMIC tokens to earn 15% APR and increase voting power',
          params: ['amount: uint256'],
          returns: 'void',
          category: 'Grand Function #1',
          example: 'stakeTokens(parseEther("100"))'
        },
        {
          name: 'unstakeTokens',
          description: 'Unstake with time-based penalty reduction (10% < 7days, 5% < 14days)',
          params: ['amount: uint256'],
          returns: 'void',
          category: 'Grand Function #2',
          example: 'unstakeTokens(parseEther("50"))'
        },
        {
          name: 'mineCosmicTokens',
          description: 'Mine new tokens based on player activity (1hr cooldown)',
          params: [],
          returns: 'void',
          category: 'Grand Function #3',
          example: 'mineCosmicTokens()'
        },
        {
          name: 'convertToResources',
          description: 'Convert COSMIC to game resources (burns tokens)',
          params: ['resourceType: string', 'amount: uint256'],
          returns: 'void',
          category: 'Grand Function #4',
          example: 'convertToResources("energy", parseEther("10"))'
        },
        {
          name: 'calculateVotePower',
          description: 'Calculate governance voting power with time multipliers',
          params: ['user: address'],
          returns: 'uint256',
          category: 'Grand Function #5',
          example: 'calculateVotePower(userAddress)'
        }
      ]
    },
    {
      id: 'nft' as const,
      name: 'CosmicNFT.sol',
      type: 'ERC-721',
      icon: Rocket,
      color: 'purple',
      address: '0x0000...0000',
      functions: [
        {
          name: 'mintCosmicNFT',
          description: 'Mint NFT with randomized rarity (Planet, Spaceship, Alien, Artifact)',
          params: ['nftType: NFTType', 'name: string', 'tokenURI: string'],
          returns: 'uint256',
          category: 'Grand Function #6',
          example: 'mintCosmicNFT(0, "Terra Prime", "ipfs://...", { value: "0.01" })'
        },
        {
          name: 'fuseNFTs',
          description: 'Fuse two NFTs for enhanced hybrid with upgraded rarity',
          params: ['tokenId1: uint256', 'tokenId2: uint256', 'name: string', 'uri: string'],
          returns: 'uint256',
          category: 'Grand Function #7',
          example: 'fuseNFTs(1, 2, "Mega Planet", "ipfs://...", { value: "0.005" })'
        },
        {
          name: 'gainExperience',
          description: 'Gain XP and auto-level up NFTs (max level 100)',
          params: ['tokenId: uint256', 'experience: uint256'],
          returns: 'void',
          category: 'Grand Function #8',
          example: 'gainExperience(1, 1000)'
        },
        {
          name: 'stakeNFT',
          description: 'Stake NFT to earn passive XP (10 XP per hour)',
          params: ['tokenId: uint256'],
          returns: 'void',
          category: 'Grand Function #9',
          example: 'stakeNFT(1)'
        },
        {
          name: 'batchMintGenesis',
          description: 'Mint multiple NFTs in single transaction (gas efficient)',
          params: ['types: NFTType[]', 'names: string[]', 'uris: string[]'],
          returns: 'uint256[]',
          category: 'Grand Function #10',
          example: 'batchMintGenesis([0,1,2], ["P1","S1","A1"], ["uri1","uri2","uri3"])'
        }
      ]
    },
    {
      id: 'game' as const,
      name: 'CosmicOdyssey.sol',
      type: 'Main Game Logic',
      icon: Shield,
      color: 'cyan',
      address: '0x0000...0000',
      functions: [
        {
          name: 'createProposal',
          description: 'Create governance proposal (requires 1,000 COSMIC stake)',
          params: ['title: string', 'description: string', 'proposalType: ProposalType'],
          returns: 'uint256',
          category: 'Grand Function #11',
          example: 'createProposal("Increase Energy", "Boost production 20%", 0)'
        },
        {
          name: 'claimTerritory',
          description: 'Claim planetary territory for resource production',
          params: ['planetNFTId: uint256'],
          returns: 'uint256',
          category: 'Grand Function #12',
          example: 'claimTerritory(1)'
        },
        {
          name: 'initiateBattle',
          description: 'Start battle for territory control (24hr resolution)',
          params: ['territoryId: uint256', 'attackingNFTIds: uint256[]'],
          returns: 'uint256',
          category: 'Grand Function #13',
          example: 'initiateBattle(1, [2, 3, 4])'
        },
        {
          name: 'createAlliance',
          description: 'Form strategic alliance with shared treasury',
          params: ['name: string'],
          returns: 'uint256',
          category: 'Grand Function #14',
          example: 'createAlliance("Star Federation")'
        },
        {
          name: 'researchTechnology',
          description: 'Research tech tree for permanent bonuses',
          params: ['technologyId: uint256'],
          returns: 'void',
          category: 'Grand Function #15',
          example: 'researchTechnology(1)'
        },
        {
          name: 'createMarketOrder',
          description: 'List NFT on marketplace (2% fee, 5% royalty)',
          params: ['nftId: uint256', 'price: uint256'],
          returns: 'uint256',
          category: 'Grand Function #16',
          example: 'createMarketOrder(1, parseEther("1000"))'
        },
        {
          name: 'claimTerritoryResources',
          description: 'Claim hourly resource production from territories',
          params: ['territoryId: uint256'],
          returns: 'void',
          category: 'Grand Function #17',
          example: 'claimTerritoryResources(1)'
        },
        {
          name: 'activateSynergy',
          description: 'Combine Planet + Spaceship + Alien for massive bonuses',
          params: ['planetId: uint256', 'spaceshipId: uint256', 'alienId: uint256'],
          returns: 'uint256',
          category: 'Grand Function #18',
          example: 'activateSynergy(1, 2, 3)'
        },
        {
          name: 'rebalanceEconomy',
          description: 'Auto-adjust game economics based on supply/demand',
          params: [],
          returns: 'void',
          category: 'Grand Function #19',
          example: 'rebalanceEconomy() // Owner only'
        },
        {
          name: 'launchSeasonalEvent',
          description: 'Launch limited-time event with special rewards',
          params: ['eventName: string', 'duration: uint256', 'rewardPool: uint256'],
          returns: 'void',
          category: 'Grand Function #20',
          example: 'launchSeasonalEvent("Cosmic Conquest", 604800, parseEther("10000"))'
        }
      ]
    }
  ];

  const selectedContract = contracts.find(c => c.id === activeContract)!;
  const Icon = selectedContract.icon;

  return (
    <div className="w-full h-full p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Code className="w-10 h-10 text-cyan-400" />
            <h2 className="text-4xl text-white">Smart Contract Dashboard</h2>
          </div>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Explore all 20 grand-scale functions across the Cosmic Odyssey smart contract system. 
            Each function represents complex blockchain interactions designed for an immersive gaming experience.
          </p>
        </div>

        {/* Contract Selector */}
        <div className="grid grid-cols-3 gap-4">
          {contracts.map((contract) => {
            const ContractIcon = contract.icon;
            const isActive = activeContract === contract.id;
            
            return (
              <button
                key={contract.id}
                onClick={() => setActiveContract(contract.id)}
                className={`p-6 rounded-lg border-2 transition-all ${
                  isActive
                    ? `border-${contract.color}-400 bg-gradient-to-br from-${contract.color}-600/20 to-${contract.color}-600/5`
                    : 'border-white/10 bg-black/40 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-3 bg-${contract.color}-600/20 border border-${contract.color}-500/30 rounded-lg`}>
                    <ContractIcon className={`w-6 h-6 text-${contract.color}-400`} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg text-white">{contract.name}</h3>
                    <p className="text-sm text-gray-400">{contract.type}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500 font-mono mb-2">Contract Address</p>
                  <p className="text-xs text-gray-400 font-mono bg-black/40 px-3 py-2 rounded">
                    {contract.address}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm text-gray-400">
                    {contract.functions.length} Grand Functions
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Contract Info */}
        <div className={`p-6 bg-gradient-to-br from-${selectedContract.color}-600/10 to-transparent border border-${selectedContract.color}-500/30 rounded-lg`}>
          <div className="flex items-center gap-4 mb-4">
            <Icon className={`w-12 h-12 text-${selectedContract.color}-400`} />
            <div>
              <h3 className="text-2xl text-white">{selectedContract.name}</h3>
              <p className="text-gray-400">{selectedContract.type}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-black/40 border border-white/10 rounded-lg">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Functions</p>
              <p className={`text-2xl text-${selectedContract.color}-400`}>{selectedContract.functions.length}</p>
            </div>
            <div className="p-4 bg-black/40 border border-white/10 rounded-lg">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Compiler</p>
              <p className={`text-2xl text-${selectedContract.color}-400`}>0.8.20</p>
            </div>
            <div className="p-4 bg-black/40 border border-white/10 rounded-lg">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Status</p>
              <p className="text-2xl text-green-400">Verified</p>
            </div>
          </div>
        </div>

        {/* Functions List */}
        <div className="space-y-4">
          <h3 className="text-2xl text-white mb-4">Contract Functions</h3>
          {selectedContract.functions.map((func, index) => (
            <div
              key={index}
              className="p-6 bg-black/40 border border-white/10 rounded-lg hover:border-cyan-400/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 bg-${selectedContract.color}-600/20 border border-${selectedContract.color}-500/30 rounded-full text-xs text-${selectedContract.color}-400 uppercase tracking-wider`}>
                      {func.category}
                    </span>
                  </div>
                  <h4 className="text-xl text-white mb-2 font-mono">{func.name}()</h4>
                  <p className="text-gray-400 mb-4">{func.description}</p>
                </div>
                <div className="p-2 bg-green-600/20 border border-green-500/30 rounded-lg">
                  <Zap className="w-5 h-5 text-green-400" />
                </div>
              </div>

              {/* Parameters */}
              <div className="mb-4">
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Parameters</p>
                <div className="space-y-2">
                  {func.params.length > 0 ? (
                    func.params.map((param, i) => (
                      <div key={i} className="px-4 py-2 bg-black/40 border border-white/10 rounded font-mono text-sm text-cyan-400">
                        {param}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 bg-black/40 border border-white/10 rounded text-sm text-gray-500">
                      No parameters
                    </div>
                  )}
                </div>
              </div>

              {/* Returns */}
              <div className="mb-4">
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Returns</p>
                <div className="px-4 py-2 bg-black/40 border border-white/10 rounded font-mono text-sm text-purple-400">
                  {func.returns}
                </div>
              </div>

              {/* Example Usage */}
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Example Usage</p>
                <div className="p-4 bg-black/60 border border-cyan-500/30 rounded-lg overflow-x-auto">
                  <code className="text-sm text-green-400 font-mono">
                    {func.example}
                  </code>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-4 border-t border-white/10 flex gap-3">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-500/30 rounded-lg text-white hover:border-cyan-400/50 transition-all text-sm">
                  <Code className="w-4 h-4 inline mr-2" />
                  View Source
                </button>
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg text-white hover:border-green-400/50 transition-all text-sm">
                  <Package className="w-4 h-4 inline mr-2" />
                  Test Function
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Deployment Info */}
        <div className="p-6 bg-gradient-to-br from-purple-600/10 to-cyan-600/10 border border-purple-500/30 rounded-lg">
          <h3 className="text-xl text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            Deployment Information
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-2">Network</p>
              <p className="text-white">Ethereum Sepolia Testnet</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">Chain ID</p>
              <p className="text-white">11155111</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">Compiler Version</p>
              <p className="text-white">Solidity 0.8.20</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">Optimization</p>
              <p className="text-white">Enabled (200 runs)</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-black/40 border border-white/10 rounded-lg">
            <p className="text-sm text-gray-400 mb-2">Deployment Guide</p>
            <p className="text-gray-300 mb-3">
              Follow the comprehensive deployment guide in <code className="text-cyan-400">/contracts/DEPLOYMENT_GUIDE.md</code>
            </p>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all text-sm">
                View Deployment Guide
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-lg text-white hover:border-yellow-400/50 transition-all text-sm">
                Contract Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
