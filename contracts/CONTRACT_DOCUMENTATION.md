# 📜 Cosmic Odyssey Smart Contracts - Technical Documentation

## 🏗️ Architecture Overview

The Cosmic Odyssey DApp consists of three interconnected smart contracts that form a comprehensive blockchain gaming ecosystem:

```
┌─────────────────────────────────────────────────────────────┐
│                    CosmicOdyssey.sol                         │
│              (Main Game Logic Contract)                     │
│                                                              │
│  • Governance System         • Territory Control            │
│  • Alliance Management       • Battle System                │
│  • Technology Research       • Economic Balancing           │
│  • Marketplace              • Seasonal Events              │
└───────────────┬──────────────────────┬──────────────────────┘
                │                       │
        ┌───────▼────────┐      ┌──────▼────────┐
        │ CosmicToken.sol│      │ CosmicNFT.sol │
        │  (ERC-20)      │      │  (ERC-721)    │
        │                │      │               │
        │ • Staking      │      │ • Planets     │
        │ • Governance   │      │ • Spaceships  │
        │ • Mining       │      │ • Aliens      │
        │ • Resources    │      │ • Artifacts   │
        └────────────────┘      └───────────────┘
```

---

## 💎 CosmicToken.sol - The Native Currency

### Contract Type: ERC-20 Token
**Symbol**: COSMIC  
**Decimals**: 18  
**Initial Supply**: 100,000,000 COSMIC  
**Max Supply**: 1,000,000,000 COSMIC (with inflation control)

### Key Features

#### 1. Advanced Staking System
```solidity
function stakeTokens(uint256 _amount) external
```
- Stake COSMIC tokens to earn 15% APR
- Increases governance voting power by 2x
- Time-based multiplier rewards long-term stakers
- Automated reward calculation and distribution

**Benefits:**
- Earn passive income
- Boost voting power for governance
- Time multiplier up to 1.5x after 5 months

#### 2. Complex Unstaking with Penalty System
```solidity
function unstakeTokens(uint256 _amount) external
```
- Early unstaking penalty: 10% if < 7 days
- Reduced penalty: 5% if 7-14 days
- No penalty after 14 days
- Penalties are burned to control inflation

#### 3. Dynamic Resource Mining
```solidity
function mineCosmicTokens() external
```
- Mine tokens based on player activity
- Difficulty adjusts based on total supply
- 1-hour cooldown between mining sessions
- Mining power increases with gameplay

**Mining Formula:**
```
reward = (BASE_REWARD × miningPower × difficultyMultiplier) / 10000
```

#### 4. Multi-Resource Conversion Engine
```solidity
function convertToResources(string memory resourceType, uint256 cosmicAmount) external
```
Convert COSMIC to game resources:
- Energy: 100 units per COSMIC
- Dark Matter: 10 units per COSMIC
- Neutronium: 25 units per COSMIC
- Kryptonite: 5 units per COSMIC

**Note:** Conversion burns COSMIC tokens (deflationary)

#### 5. Quadratic Governance Voting Power
```solidity
function calculateVotePower(address _user) public view returns (uint256)
```
**Formula:**
```
votePower = (baseTokens + stakedTokens × 2) × timeMultiplier / 100
```

Components:
- Base holdings: 1x multiplier
- Staked tokens: 2x multiplier
- Time multiplier: +10% per month staked (max 1.5x)

---

## 🎨 CosmicNFT.sol - Multi-Type NFT System

### Contract Type: ERC-721 NFT
**Name**: Cosmic NFT  
**Symbol**: CNFT

### NFT Types

1. **Planets** - Territory and resource generation
2. **Spaceships** - Combat and travel
3. **Aliens** - Special abilities and bonuses
4. **Artifacts** - Powerful gameplay modifiers

### Rarity System

| Rarity | Probability | Base Power | Color |
|--------|-------------|------------|-------|
| Common | 49% | 500 | Gray |
| Rare | 30% | 1,000 | Blue |
| Epic | 15% | 2,500 | Purple |
| Legendary | 5% | 5,000 | Gold |
| Mythic | 1% | 10,000 | Rainbow |

### Grand Functions

#### 6. Advanced Multi-Type NFT Minting
```solidity
function mintCosmicNFT(
    NFTType _type,
    string memory _name,
    string memory _tokenURI
) public payable returns (uint256)
```

**Cost:** 0.01 ETH per mint

**Process:**
1. Payment verification
2. Randomized rarity generation
3. Type-specific attribute initialization
4. Metadata storage on IPFS
5. Event emission for indexing

**Example Planet Attributes:**
```javascript
{
  biome: "Jungle | Desert | Ocean | Arctic | Volcanic",
  resourceAbundance: 50-90,
  population: 1M - 5M,
  defenseRating: 100-200,
  hasWormhole: true/false (Epic+)
}
```

#### 7. NFT Fusion System
```solidity
function fuseNFTs(
    uint256 _tokenId1,
    uint256 _tokenId2,
    string memory _newName,
    string memory _newTokenURI
) public payable returns (uint256)
```

**Cost:** 0.005 ETH per fusion

**Mechanics:**
- Burns both original NFTs
- Creates enhanced hybrid NFT
- Upgrades rarity tier
- Combines power ratings
- Bonus levels: +5 levels
- Fusion bonus: +1000 power

**Rarity Upgrade Table:**
```
Common + Common = Rare
Rare + Rare = Epic
Epic + Epic = Legendary
Legendary + Legendary = Mythic
```

#### 8. Experience and Leveling System
```solidity
function gainExperience(uint256 _tokenId, uint256 _experience) external
```

**Leveling Formula:**
```
experienceNeeded = level² × 100
```

**Power Increase per Level:**
- Mythic: +500 power
- Legendary: +250 power
- Epic: +125 power
- Rare: +50 power
- Common: +25 power

#### 9. NFT Staking for Passive Rewards
```solidity
function stakeNFT(uint256 _tokenId) external
function unstakeNFT(uint256 _tokenId) external
```

**Rewards:** 10 XP per hour staked  
**Benefits:**
- Passive experience gain
- Contributes to player power
- No risk (can unstake anytime)

#### 10. Batch Minting Genesis Collection
```solidity
function batchMintGenesis(
    NFTType[] memory _types,
    string[] memory _names,
    string[] memory _tokenURIs
) public payable returns (uint256[] memory)
```

**Features:**
- Mint multiple NFTs in one transaction
- Gas optimization for large collections
- Genesis collection special attributes
- Perfect for initial game launch

---

## 🎮 CosmicOdyssey.sol - Main Game Contract

### Game Mechanics

#### 11. Advanced Governance Proposal System
```solidity
function createProposal(
    string memory _title,
    string memory _description,
    ProposalType _proposalType
) external returns (uint256)
```

**Requirements:**
- Minimum 1,000 COSMIC staked
- Tokens locked during voting period
- 7-day voting duration

**Proposal Types:**
1. Economy - Adjust resource rates
2. Expansion - Enable new territories
3. Defense - Boost security systems
4. Research - Unlock technologies
5. Alliance - Diplomatic agreements

**Voting Mechanism:** Quadratic Voting
```
actualVoteWeight = √(voteAmount)
```

This prevents whale dominance and encourages broader participation.

#### 12. Planetary Territory Conquest
```solidity
function claimTerritory(uint256 _planetNFTId) external returns (uint256)
```

**Cost:** 500 COSMIC tokens  
**Requirements:** Must own the planet NFT

**Territory Benefits:**
- Hourly resource production
- Strategic positioning
- Alliance control
- Battle capabilities

**Resource Generation:**
```
resourceProduction = planetPowerRating / 10 per hour
```

#### 13. Multi-Phase Battle System
```solidity
function initiateBattle(uint256 _territoryId, uint256[] memory _attackingNFTIds) external
function resolveBattle(uint256 _battleId) external
```

**Battle Phases:**

**Phase 1: Initiation**
- Attacker sends NFT fleet
- Calculates total attacking power
- Locks territory as "disputed"
- 24-hour battle duration begins

**Phase 2: Resolution**
```
attackerChance = (attackerPower × 100) / (attackerPower + defenderPower)
random = randomNumber(0-99)
winner = random < attackerChance ? attacker : defender
```

**Rewards:**
- Winner: +100 reputation, territory control
- Loser: Territory loss or defense success
- Both: Experience and battle statistics

#### 14. Dynamic Alliance System
```solidity
function createAlliance(string memory _name) external returns (uint256)
function joinAlliance(uint256 _allianceId) external
function contributeToAlliance(uint256 _amount) external
```

**Alliance Features:**
- Shared treasury
- Combined military power
- Coordinated attacks
- Resource sharing
- Diplomatic bonuses

**Alliance Power:**
```
totalPower = Σ(memberTokenBalance + territoryPower + votePower)
```

#### 15. Advanced Technology Research
```solidity
function researchTechnology(uint256 _technologyId) external
```

**Available Technologies:**

| ID | Technology | Cost | Time | Effect |
|----|------------|------|------|--------|
| 1 | Wormhole Navigation | 5,000 | 3d | +50 mining power |
| 2 | Quantum Shields | 10,000 | 5d | Boost defenses |
| 3 | Dark Matter Reactors | 15,000 | 7d | Increase production |
| 4 | Planetary Terraforming | 20,000 | 10d | Expand territories |
| 5 | Galactic Diplomacy | 25,000 | 14d | Alliance bonuses |

**Research Process:**
1. Pay research cost
2. Wait for research time
3. Claim completed technology
4. Gain permanent benefits
5. Earn +200 reputation

#### 16. Decentralized NFT Marketplace
```solidity
function createMarketOrder(uint256 _nftId, uint256 _price) external
function purchaseFromMarket(uint256 _orderId) external
```

**Fee Structure:**
- Marketplace fee: 2% of sale price
- Creator royalty: 5% of sale price
- Seller receives: 93% of sale price

**Example:**
```
Sale Price: 1,000 COSMIC
Marketplace: 20 COSMIC (2%)
Creator: 50 COSMIC (5%)
Seller: 930 COSMIC (93%)
```

#### 17. Automated Resource Production
```solidity
function claimTerritoryResources(uint256 _territoryId) external
```

**Production Mechanics:**
```
hourlyProduction = territoryResourceProduction
cycles = (currentTime - lastClaimTime) / 1 hour
totalResources = hourlyProduction × cycles
```

**Additional Benefits:**
- Mining power increase
- Reputation gain
- Alliance treasury contribution

#### 18. Cross-NFT Synergy System
```solidity
function activateSynergy(
    uint256 _planetId,
    uint256 _spaceshipId,
    uint256 _alienId
) external returns (uint256)
```

**Requirements:**
- Own all three NFT types
- Specific type combination

**Synergy Bonus:**
```
synergyBonus = (planetPower + shipPower + alienPower) / 10
```

**Rewards:**
- Bonus COSMIC tokens
- +1000 XP to each NFT
- +500 reputation

#### 19. Dynamic Economy Balancing
```solidity
function rebalanceEconomy() external onlyOwner
```

**Auto-Balancing Algorithm:**
```javascript
stakingRatio = (totalStaked × 100) / totalSupply

if (stakingRatio > 70%) {
  // Too much staking - encourage spending
  increaseConversionRates(20%)
} else if (stakingRatio < 30%) {
  // Too little staking - encourage holding
  decreaseConversionRates(20%)
} else {
  // Balanced economy
  normalRates()
}
```

#### 20. Seasonal Event System
```solidity
function launchSeasonalEvent(
    string memory _eventName,
    uint256 _duration,
    uint256 _rewardPool
) external onlyOwner
```

**Event Features:**
- Limited-time gameplay modes
- Exclusive rewards
- Special NFT drops
- Community challenges
- Leaderboard competitions

---

## 🔐 Security Features

### Access Control
- **Ownable**: Admin functions protected
- **ReentrancyGuard**: Prevents reentrancy attacks
- **Pausable**: Emergency stop mechanism

### Safety Mechanisms
```solidity
// Token approval checks
require(token.allowance(user, contract) >= amount);

// NFT ownership verification  
require(nft.ownerOf(tokenId) == msg.sender);

// Balance verification
require(balance >= amount);

// Time locks
require(block.timestamp >= unlockTime);

// State validation
require(!battle.resolved);
```

### Economic Safeguards
- Inflation cap: 1 billion tokens maximum
- Burn mechanisms on conversions
- Penalty burns for early unstaking
- Transaction cooldowns
- Rate limiting

---

## 📊 Gas Optimization

### Techniques Used
1. **Packing Storage Variables**
   ```solidity
   struct NFTMetadata {
       uint256 level;      // slot 0
       uint256 experience; // slot 1
       bool isStaked;      // packed with next uint
   }
   ```

2. **Batch Operations**
   - Batch minting saves ~40% gas
   - Combined transactions
   - Efficient loops

3. **View Functions**
   - Read-only operations cost no gas
   - Off-chain calculations where possible

4. **Events for Indexing**
   - Store data in events rather than storage
   - Frontend can index event history

---

## 🎯 Integration Guide

### Frontend Connection
```typescript
import { ethers } from 'ethers';

// Connect to contract
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const contract = new ethers.Contract(address, abi, signer);

// Call functions
await contract.stakeTokens(ethers.parseEther("100"));
await contract.mintCosmicNFT(0, "Terra Prime", "ipfs://...", {
  value: ethers.parseEther("0.01")
});
```

### Event Listening
```typescript
contract.on("NFTMinted", (owner, tokenId, nftType, rarity) => {
  console.log(`NFT #${tokenId} minted!`);
  console.log(`Type: ${nftType}, Rarity: ${rarity}`);
});
```

---

## 🚀 Upgrade Path

### Future Enhancements
- [ ] Layer 2 scaling (Arbitrum/Optimism)
- [ ] Cross-chain bridge
- [ ] DAO treasury management
- [ ] NFT rental system
- [ ] Automated market maker for resources
- [ ] VRF for true randomness
- [ ] Time-lock governance
- [ ] Multi-sig admin controls

---

## 📈 Tokenomics

### COSMIC Token Distribution
```
Total Supply: 1,000,000,000 COSMIC

Initial Distribution:
- Game Treasury: 100,000,000 (10%)
- Staking Rewards: 300,000,000 (30%)
- Team: 100,000,000 (10%) - 4yr vest
- Community: 200,000,000 (20%)
- Ecosystem: 150,000,000 (15%)
- Liquidity: 150,000,000 (15%)
```

### Deflationary Mechanisms
- Resource conversions: 100% burn
- Unstaking penalties: 50% burn
- Territory claims: 50% burn
- NFT fusion: 10% burn

---

## 🌟 Best Practices

### For Players
1. Stake tokens for maximum voting power
2. Research technologies early
3. Form alliances for defense
4. Fuse NFTs strategically
5. Claim territory resources regularly

### For Developers
1. Always use try-catch for contract calls
2. Implement proper error handling
3. Cache contract data when possible
4. Use multicall for batch reads
5. Monitor gas prices before transactions

---

## 🆘 Emergency Procedures

### Contract Pausing
```solidity
function pause() external onlyOwner {
    _pause();
}

function unpause() external onlyOwner {
    _unpause();
}
```

### Emergency Withdrawal
```solidity
function emergencyWithdraw() external onlyOwner {
    // Owner can rescue funds in emergency
}
```

---

## 📞 Support & Resources

- **Documentation**: `/contracts/DEPLOYMENT_GUIDE.md`
- **GitHub**: [repository_link]
- **Discord**: [community_link]
- **Bug Reports**: [issues_link]

---

**Built with ❤️ for the cosmic community** 🚀✨
