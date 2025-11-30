// Hardhat deployment script for Cosmic Odyssey contracts
// Run: npx hardhat run contracts/deploy.js --network sepolia

const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting Cosmic Odyssey deployment...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString(), "\n");

  // Deploy CosmicToken
  console.log("📦 Deploying CosmicToken...");
  const CosmicToken = await hre.ethers.getContractFactory("CosmicToken");
  const cosmicToken = await CosmicToken.deploy();
  await cosmicToken.deployed();
  console.log("✅ CosmicToken deployed to:", cosmicToken.address, "\n");

  // Deploy CosmicNFT
  console.log("📦 Deploying CosmicNFT...");
  const CosmicNFT = await hre.ethers.getContractFactory("CosmicNFT");
  const cosmicNFT = await CosmicNFT.deploy();
  await cosmicNFT.deployed();
  console.log("✅ CosmicNFT deployed to:", cosmicNFT.address, "\n");

  // Deploy CosmicOdyssey (Main Contract)
  console.log("📦 Deploying CosmicOdyssey...");
  const CosmicOdyssey = await hre.ethers.getContractFactory("CosmicOdyssey");
  const cosmicOdyssey = await CosmicOdyssey.deploy(
    cosmicToken.address,
    cosmicNFT.address
  );
  await cosmicOdyssey.deployed();
  console.log("✅ CosmicOdyssey deployed to:", cosmicOdyssey.address, "\n");

  // Set up permissions
  console.log("⚙️  Setting up contract permissions...");
  
  // Transfer CosmicToken ownership to CosmicOdyssey
  await cosmicToken.transferOwnership(cosmicOdyssey.address);
  console.log("✅ CosmicToken ownership transferred to CosmicOdyssey");
  
  // Transfer CosmicNFT ownership to CosmicOdyssey
  await cosmicNFT.transferOwnership(cosmicOdyssey.address);
  console.log("✅ CosmicNFT ownership transferred to CosmicOdyssey\n");

  // Save contract addresses
  const fs = require("fs");
  const contractAddresses = {
    network: hre.network.name,
    CosmicToken: cosmicToken.address,
    CosmicNFT: cosmicNFT.address,
    CosmicOdyssey: cosmicOdyssey.address,
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };

  fs.writeFileSync(
    "contract-addresses.json",
    JSON.stringify(contractAddresses, null, 2)
  );

  console.log("📝 Contract addresses saved to contract-addresses.json\n");

  // Display summary
  console.log("=" .repeat(60));
  console.log("🎉 DEPLOYMENT SUCCESSFUL!");
  console.log("=" .repeat(60));
  console.log("\nContract Addresses:");
  console.log("-------------------");
  console.log("CosmicToken:   ", cosmicToken.address);
  console.log("CosmicNFT:     ", cosmicNFT.address);
  console.log("CosmicOdyssey: ", cosmicOdyssey.address);
  console.log("\n");
  console.log("Network:       ", hre.network.name);
  console.log("Deployer:      ", deployer.address);
  console.log("=" .repeat(60));
  
  console.log("\n📋 Next Steps:");
  console.log("1. Verify contracts on Etherscan");
  console.log("2. Update frontend with contract addresses");
  console.log("3. Test contract interactions");
  console.log("\n");
  
  // Verification command
  console.log("🔍 To verify contracts on Etherscan, run:");
  console.log(`npx hardhat verify --network ${hre.network.name} ${cosmicToken.address}`);
  console.log(`npx hardhat verify --network ${hre.network.name} ${cosmicNFT.address}`);
  console.log(`npx hardhat verify --network ${hre.network.name} ${cosmicOdyssey.address} ${cosmicToken.address} ${cosmicNFT.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
