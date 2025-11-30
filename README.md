# 🚀 Cosmic Odyssey DApp

An immersive interstellar governance and resource management decentralized application built with React, Three.js, and Solidity smart contracts.

![Cosmic Odyssey](https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&h=400&fit=crop)

## ✨ Overview

Cosmic Odyssey is a **blockchain-powered space empire management game** combining:
- **3D Galaxy Exploration** with Three.js
- **Complex Smart Contract System** with 20+ grand-scale functions
- **NFT Ecosystem** for planets, spaceships, aliens, and artifacts
- **DAO Governance** with quadratic voting
- **Strategic Warfare** and territory conquest
- **Dynamic Economy** with staking and resource conversion

## 🏗️ Smart Contract Architecture

### Three Interconnected Contracts

#### 1. **CosmicToken.sol** (ERC-20)
The native COSMIC token powering the entire ecosystem.

**Grand Functions:**
1. **Advanced Staking System** - 15% APR with time-locked bonuses
2. **Complex Unstaking** - Penalty system to prevent dumping
3. **Dynamic Mining** - Difficulty-adjusted token generation
4. **Resource Conversion Engine** - Convert tokens to in-game resources
5. **Quadratic Voting Power** - Fair governance participation

**Key Features:**
- Initial Supply: 100M COSMIC
- Max Supply: 1B COSMIC (inflation controlled)
- Deflationary mechanisms through burns
- Vote power multipliers for long-term stakers

#### 2. **CosmicNFT.sol** (ERC-721)
Multi-type NFT system with fusion and leveling mechanics.

**Grand Functions:**
6. **Multi-Type NFT Minting** - Planets, Spaceships, Aliens, Artifacts
7. **NFT Fusion System** - Combine two NFTs for enhanced hybrid
8. **Experience & Leveling** - RPG-style progression (max level 100)
9. **NFT Staking** - Earn passive XP rewards
10. **Batch Genesis Minting** - Deploy entire collections efficiently

**Rarity Tiers:**
- Common (49%) - 500 base power
- Rare (30%) - 1,000 base power
- Epic (15%) - 2,500 base power
- Legendary (5%) - 5,000 base power
- Mythic (1%) - 10,000 base power

#### 3. **CosmicOdyssey.sol** (Main Game)
The core game logic contract orchestrating all mechanics.

**Grand Functions:**
11. **Governance Proposal System** - DAO voting with quadratic mechanism
12. **Territory Conquest** - Claim and control planetary territories
13. **Multi-Phase Battle System** - Strategic warfare with resolution mechanics
14. **Alliance Formation** - Create and manage player alliances
15. **Technology Research** - Unlock advanced capabilities
16. **NFT Marketplace** - Decentralized trading with royalties
17. **Resource Production** - Automated territory-based generation
18. **Cross-NFT Synergy** - Combine different NFT types for bonuses
19. **Economic Balancing** - Auto-adjust rates based on supply/demand
20. **Seasonal Events** - Limited-time campaigns with special rewards

## 🎮 Technology Stack

### Frontend
- **React 18** + **TypeScript** - Type-safe UI development
- **Tailwind CSS** - Utility-first styling
- **Three.js + React Three Fiber** - 3D galaxy visualization
- **Ethers.js v6** - Blockchain interaction
- **Lucide Icons** - Beautiful icon system
- **Audio System** - Background music + 22 categorized sound effects

### Smart Contracts
- **Solidity 0.8.20** - Latest stable version
- **OpenZeppelin Contracts** - Battle-tested security
- **Hardhat** - Development environment
- **Etherscan** - Contract verification

### Blockchain
- **Ethereum Sepolia** - Primary testnet
- **Polygon Mumbai** - Alternative testnet
- **IPFS** - Decentralized metadata storage

## 📊 Smart Contract Features Summary

### CosmicToken Functions
| Function | Purpose | Access |
|----------|---------|--------|
| `stakeTokens` | Stake for rewards & voting power | Public |
| `unstakeTokens` | Withdraw with time-based penalties | Public |
| `mineCosmicTokens` | Mine new tokens (1hr cooldown) | Public |
| `convertToResources` | Burn tokens for game resources | Public |
| `calculateVotePower` | Get governance voting power | View |
| `claimRewards` | Claim staking rewards | Public |

### CosmicNFT Functions
| Function | Purpose | Cost |
|----------|---------|------|
| `mintCosmicNFT` | Mint single NFT | 0.01 ETH |
| `fuseNFTs` | Combine two NFTs | 0.005 ETH |
| `stakeNFT` | Stake for passive XP | Free |
| `unstakeNFT` | Claim XP rewards | Free |
| `batchMintGenesis` | Mint multiple NFTs | 0.01 ETH each |

### CosmicOdyssey Functions
| Function | Purpose | Requirement |
|----------|---------|-------------|
| `createProposal` | Submit governance proposal | 1,000 COSMIC |
| `voteOnProposal` | Vote on active proposals | Vote power |
| `claimTerritory` | Claim planetary territory | 500 COSMIC + Planet NFT |
| `initiateBattle` | Attack enemy territory | NFT fleet |
| `createAlliance` | Form new alliance | Not in alliance |
| `researchTechnology` | Unlock tech tree | Varies |
| `createMarketOrder` | List NFT for sale | NFT ownership |
| `activateSynergy` | Combine NFT types | 3 different NFTs |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cosmic-odyssey-dapp.git
cd cosmic-odyssey-dapp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## 🎯 Gameplay Guide

### Getting Started
1. **Connect Wallet** - Launch your odyssey by connecting
2. **Explore Galaxy** - Navigate the 3D star map to discover planets
3. **Manage Resources** - Build facilities and optimize production
4. **Complete Missions** - Earn rewards and increase your influence
5. **Participate in Governance** - Vote on proposals and shape the cosmos

### Resource Types
- **Energy** ⚡ - Powers all operations and travel
- **Credits** 💰 - Universal currency for trading
- **Dark Matter** ⚫ - Rare resource for advanced technology
- **Neutronium** 🔷 - Heavy element for construction
- **Kryptonite** 💎 - Exotic mineral with special properties
- **Influence** 📈 - Voting power in governance

### Navigation
- **Galaxy Map** - 3D exploration and planet discovery
- **Resources** - Production, trading, and facility management
- **Governance** - Proposals, voting, and council activities
- **NFT Gallery** - View, trade, and manage your digital assets
- **Diplomacy** - Alliances, treaties, and inter-faction relations
- **Missions** - Available quests and active objectives

## 🏗️ Project Structure

```
cosmic-odyssey-dapp/
├── components/
│   ├── AudioManager.tsx       # Sound and music management
│   ├── ConnectWallet.tsx      # Wallet connection screen
│   ├── DiplomacyCenter.tsx    # Alliance and treaty management
│   ├── GalaxyExplorer.tsx     # 3D galaxy map with Three.js
│   ├── GovernanceHub.tsx      # DAO voting and proposals
│   ├── HUD.tsx                # Heads-up display overlay
│   ├── MissionControl.tsx     # Quest and mission system
│   ├── NFTGallery.tsx         # NFT viewing and marketplace
│   └── ResourcePanel.tsx      # Resource management interface
├── styles/
│   └── globals.css            # Global styles and animations
├── App.tsx                    # Main application component
└── README.md                  # This file
```

## 🎨 Key Features Breakdown

### 3D Galaxy Visualization
- Interactive star map using Three.js
- Rotatable, zoomable camera controls
- Real-time planet rendering with orbit mechanics
- Particle system for stars and nebulae
- Dynamic lighting and shadows

### Governance System
- Proposal creation and submission
- Time-limited voting periods
- Quorum requirements
- Vote delegation
- Proposal history tracking
- Council member management

### Economic Model
- Multi-resource economy
- Dynamic market pricing
- Supply and demand mechanics
- Production chains
- Trading system
- Resource conversion

### NFT Integration
- ERC-721 standard tokens
- Unique metadata and attributes
- Rarity tiers (Common, Rare, Epic, Legendary)
- On-chain ownership verification
- Marketplace for peer-to-peer trading

## 🔮 Future Enhancements

### Phase 2 Features
- [ ] Smart contract integration
- [ ] Real wallet connection (MetaMask, WalletConnect)
- [ ] On-chain governance implementation
- [ ] IPFS metadata storage
- [ ] Mobile responsive optimization
- [ ] Multiplayer real-time features

### Phase 3 Features
- [ ] Advanced 3D graphics and shaders
- [ ] Spatial audio system
- [ ] VR/AR support
- [ ] Cross-chain compatibility
- [ ] Social features and guilds
- [ ] Seasonal events and campaigns

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Testing
```bash
npm run test
```

### Building for Production
```bash
npm run build
```

## 🎮 Game Mechanics

### Planetary Discovery
1. Navigate to unexplored systems
2. Scan for planets
3. Discover unique attributes
4. Claim ownership via NFT

### Resource Production
1. Build production facilities
2. Upgrade for efficiency
3. Manage energy distribution
4. Trade surplus on marketplace

### Governance Participation
1. Earn influence through gameplay
2. Submit improvement proposals
3. Vote on active proposals
4. Join the Interstellar Council

### Alliance Diplomacy
1. Form or join alliances
2. Negotiate treaties
3. Share resources
4. Coordinate strategies

**Built with ❤️ for the cosmic community**

*Embark on your interstellar journey today!* 🚀✨
