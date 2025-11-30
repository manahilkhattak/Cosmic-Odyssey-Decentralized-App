# 🚀 Cosmic Odyssey Smart Contracts - Deployment Guide

This guide will walk you through deploying the Cosmic Odyssey smart contracts to the Sepolia testnet using Remix IDE and Hardhat.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Remix Deployment (Recommended for Beginners)](#remix-deployment)
4. [Hardhat Deployment](#hardhat-deployment)
5. [Contract Verification](#contract-verification)
6. [Testing Contracts](#testing-contracts)

---

## Prerequisites

### Required Tools
- **MetaMask Wallet** - Browser extension for Ethereum interaction
- **Sepolia ETH** - Get testnet ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
- **Node.js v18+** - For Hardhat deployment
- **Remix IDE** - Online Solidity IDE at [remix.ethereum.org](https://remix.ethereum.org)

### Get Testnet ETH
1. Install MetaMask
2. Switch to Sepolia Testnet
3. Visit faucet sites:
   - https://sepoliafaucet.com/
   - https://faucets.chain.link/sepolia
4. Request test ETH (usually need to create account on faucet site)

---

## 🎯 Remix Deployment (Easiest Method)

### Step 1: Open Remix IDE
1. Go to [https://remix.ethereum.org](https://remix.ethereum.org)
2. Create a new workspace

### Step 2: Install OpenZeppelin Contracts
```javascript
// In Remix, go to File Explorer
// Create these files with the following imports:

// CosmicToken.sol
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// CosmicNFT.sol  
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
```

### Step 3: Copy Contract Files
1. Create `contracts/CosmicToken.sol` - Copy from `/contracts/CosmicToken.sol`
2. Create `contracts/CosmicNFT.sol` - Copy from `/contracts/CosmicNFT.sol`
3. Create `contracts/CosmicOdyssey.sol` - Copy from `/contracts/CosmicOdyssey.sol`

### Step 4: Compile Contracts
1. Go to "Solidity Compiler" tab
2. Select Compiler Version: `0.8.20`
3. Enable Optimization: `200 runs`
4. Click "Compile CosmicToken.sol"
5. Repeat for CosmicNFT.sol and CosmicOdyssey.sol

### Step 5: Deploy to Sepolia
1. Go to "Deploy & Run Transactions" tab
2. Select Environment: `Injected Provider - MetaMask`
3. Make sure MetaMask is connected to Sepolia
4. Deploy in this order:

#### A. Deploy CosmicToken
```
Contract: CosmicToken
Click "Deploy"
Wait for transaction confirmation
Copy deployed address → Save for later
```

#### B. Deploy CosmicNFT
```
Contract: CosmicNFT
Click "Deploy"
Wait for transaction confirmation
Copy deployed address → Save for later
```

#### C. Deploy CosmicOdyssey
```
Contract: CosmicOdyssey
Constructor Parameters:
  _cosmicToken: [PASTE COSMIC TOKEN ADDRESS]
  _cosmicNFT: [PASTE COSMIC NFT ADDRESS]
Click "Deploy"
Wait for transaction confirmation
Copy deployed address → Save for later
```

### Step 6: Set Permissions
After all contracts are deployed, grant permissions:

```javascript
// On CosmicToken contract
transferOwnership([COSMIC_ODYSSEY_ADDRESS])

// On CosmicNFT contract  
transferOwnership([COSMIC_ODYSSEY_ADDRESS])
```

### Step 7: Save Contract Addresses
Create a file `contract-addresses.json`:
```json
{
  "network": "sepolia",
  "CosmicToken": "0xYOUR_TOKEN_ADDRESS",
  "CosmicNFT": "0xYOUR_NFT_ADDRESS",
  "CosmicOdyssey": "0xYOUR_MAIN_ADDRESS",
  "deployer": "0xYOUR_WALLET_ADDRESS"
}
```

---

## 💻 Hardhat Deployment (Advanced)

### Step 1: Install Dependencies
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts ethers
```

### Step 2: Configure Environment
Create `.env` file:
```env
SEPOLIA_RPC_URL=https://rpc.sepolia.org
PRIVATE_KEY=your_metamask_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
```

⚠️ **IMPORTANT**: Never commit `.env` file to GitHub!

### Step 3: Deploy Contracts
```bash
# Compile contracts
npx hardhat compile

# Deploy to Sepolia
npx hardhat run contracts/deploy.js --network sepolia
```

The deployment script will:
1. Deploy CosmicToken
2. Deploy CosmicNFT
3. Deploy CosmicOdyssey
4. Set up permissions automatically
5. Save addresses to `contract-addresses.json`

---

## ✅ Contract Verification on Etherscan

### Automatic Verification (Hardhat)
```bash
npx hardhat verify --network sepolia [CONTRACT_ADDRESS]

# For CosmicOdyssey with constructor args:
npx hardhat verify --network sepolia [COSMIC_ODYSSEY_ADDRESS] \
  [COSMIC_TOKEN_ADDRESS] \
  [COSMIC_NFT_ADDRESS]
```

### Manual Verification (Remix)
1. Go to [Sepolia Etherscan](https://sepolia.etherscan.io/)
2. Find your contract address
3. Click "Contract" → "Verify and Publish"
4. Fill in:
   - Compiler Type: Solidity (Single file)
   - Compiler Version: v0.8.20
   - Open Source License: MIT
5. Copy and paste flattened contract code
6. Submit for verification

---

## 🧪 Testing Contracts

### Test CosmicToken Functions
```javascript
// In Remix or Hardhat console

// 1. Check balance
await cosmicToken.balanceOf(YOUR_ADDRESS);

// 2. Stake tokens
await cosmicToken.stakeTokens(ethers.parseEther("100"));

// 3. Mine tokens
await cosmicToken.mineCosmicTokens();

// 4. Check vote power
await cosmicToken.calculateVotePower(YOUR_ADDRESS);

// 5. Convert to resources
await cosmicToken.convertToResources("energy", ethers.parseEther("10"));
```

### Test CosmicNFT Functions
```javascript
// 1. Mint a planet NFT
await cosmicNFT.mintCosmicNFT(
  0, // NFTType.Planet
  "Terra Prime",
  "ipfs://YOUR_METADATA_URI",
  { value: ethers.parseEther("0.01") }
);

// 2. Check your NFTs
await cosmicNFT.getUserNFTs(YOUR_ADDRESS);

// 3. Fuse two NFTs
await cosmicNFT.fuseNFTs(
  1, // tokenId1
  2, // tokenId2
  "Mega Planet",
  "ipfs://FUSED_METADATA_URI",
  { value: ethers.parseEther("0.005") }
);

// 4. Stake NFT
await cosmicNFT.stakeNFT(1);
```

### Test CosmicOdyssey Functions
```javascript
// 1. Create proposal
await cosmicOdyssey.createProposal(
  "Increase Energy Production",
  "Proposal to boost energy output by 20%",
  0 // ProposalType.Economy
);

// 2. Claim territory
await cosmicOdyssey.claimTerritory(1); // planetNFTId

// 3. Create alliance
await cosmicOdyssey.createAlliance("Star Federation");

// 4. Research technology
await cosmicOdyssey.researchTechnology(1);

// 5. Activate synergy
await cosmicOdyssey.activateSynergy(
  1, // planetId
  2, // spaceshipId
  3  // alienId
);
```

---

## 📊 Gas Estimates

Approximate gas costs on Sepolia (testnet):

| Function | Estimated Gas | Notes |
|----------|--------------|-------|
| Deploy CosmicToken | ~3,000,000 | One-time |
| Deploy CosmicNFT | ~4,500,000 | One-time |
| Deploy CosmicOdyssey | ~5,000,000 | One-time |
| Mint NFT | ~200,000 | Per mint |
| Stake Tokens | ~150,000 | Per stake |
| Create Proposal | ~180,000 | Per proposal |
| Vote on Proposal | ~100,000 | Per vote |
| Claim Territory | ~250,000 | Per claim |
| Initiate Battle | ~300,000 | Per battle |

---

## 🔒 Security Checklist

Before mainnet deployment:

- [ ] All contracts audited by professional security firm
- [ ] Comprehensive test coverage (>90%)
- [ ] Tested on testnet for minimum 2 weeks
- [ ] Emergency pause mechanism tested
- [ ] Multi-sig wallet for contract ownership
- [ ] Rate limiting on critical functions
- [ ] Reentrancy guards verified
- [ ] Integer overflow protection confirmed
- [ ] Access control properly implemented
- [ ] Event emission for all state changes

---

## 🌐 Network Information

### Sepolia Testnet
- **Chain ID**: 11155111
- **RPC URL**: https://rpc.sepolia.org
- **Block Explorer**: https://sepolia.etherscan.io
- **Faucets**: 
  - https://sepoliafaucet.com
  - https://faucets.chain.link/sepolia

### Polygon Mumbai Testnet
- **Chain ID**: 80001
- **RPC URL**: https://rpc-mumbai.maticvigil.com
- **Block Explorer**: https://mumbai.polygonscan.com

### Arbitrum Sepolia
- **Chain ID**: 421614
- **RPC URL**: https://sepolia-rollup.arbitrum.io/rpc
- **Block Explorer**: https://sepolia.arbiscan.io

---

## 📱 Frontend Integration

After deployment, update the contract addresses in:

```typescript
// /components/Web3Provider.tsx
const CONTRACT_ADDRESSES = {
  CosmicToken: '0xYOUR_DEPLOYED_TOKEN_ADDRESS',
  CosmicNFT: '0xYOUR_DEPLOYED_NFT_ADDRESS',
  CosmicOdyssey: '0xYOUR_DEPLOYED_MAIN_ADDRESS'
};
```

---

## 🆘 Troubleshooting

### Common Issues

**"Insufficient funds" error**
- Get more Sepolia ETH from faucets
- Check you're on the correct network

**"Nonce too high" error**  
- Reset MetaMask account: Settings → Advanced → Reset Account

**Contract verification failed**
- Ensure exact compiler version (0.8.20)
- Use flattened contract (combine all imports)
- Include constructor parameters for main contract

**Transaction reverted**
- Check require() conditions in contract
- Ensure you have approved token allowances
- Verify you own required NFTs

---

## 📚 Additional Resources

- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Remix IDE](https://remix.ethereum.org/)
- [Ethers.js Docs](https://docs.ethers.org/)
- [Sepolia Faucet](https://sepoliafaucet.com/)

---

## 🎉 Success!

If you've completed all steps:
1. ✅ Contracts deployed to Sepolia
2. ✅ Contracts verified on Etherscan
3. ✅ Frontend updated with addresses
4. ✅ Test transactions successful

**You're ready to launch your Cosmic Odyssey!** 🚀

For issues or questions, create an issue on GitHub.
