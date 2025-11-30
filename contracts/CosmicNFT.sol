// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title CosmicNFT
 * @dev NFTs for Planets, Spaceships, Aliens, and Artifacts
 * Features: Leveling, Fusion, Breeding, Special Abilities
 */
contract CosmicNFT is ERC721, ERC721URIStorage, ERC721Burnable, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    enum NFTType { Planet, Spaceship, Alien, Artifact }
    enum Rarity { Common, Rare, Epic, Legendary, Mythic }
    
    struct NFTMetadata {
        NFTType nftType;
        Rarity rarity;
        uint256 level;
        uint256 experience;
        uint256 powerRating;
        uint256 birthTime;
        string name;
        bool isStaked;
        uint256 fusionCount;
    }
    
    struct PlanetData {
        string biome;
        uint256 resourceAbundance;
        uint256 population;
        uint256 defenseRating;
        bool hasWormhole;
    }
    
    struct SpaceshipData {
        uint256 speed;
        uint256 cargo;
        uint256 weaponPower;
        uint256 shieldStrength;
        string class;
    }
    
    Counters.Counter private _tokenIds;
    
    mapping(uint256 => NFTMetadata) public nftMetadata;
    mapping(uint256 => PlanetData) public planetData;
    mapping(uint256 => SpaceshipData) public spaceshipData;
    mapping(uint256 => uint256) public stakingStartTime;
    mapping(address => uint256[]) public userNFTs;
    
    uint256 public constant MINT_PRICE = 0.01 ether;
    uint256 public constant FUSION_COST = 0.005 ether;
    uint256 public constant MAX_LEVEL = 100;
    
    event NFTMinted(address indexed owner, uint256 indexed tokenId, NFTType nftType, Rarity rarity);
    event NFTLeveledUp(uint256 indexed tokenId, uint256 newLevel);
    event NFTFused(uint256 indexed tokenId1, uint256 indexed tokenId2, uint256 newTokenId);
    event NFTStaked(uint256 indexed tokenId, address indexed owner);
    event NFTUnstaked(uint256 indexed tokenId, address indexed owner);
    event ExperienceGained(uint256 indexed tokenId, uint256 experience);
    
    constructor() ERC721("Cosmic NFT", "CNFT") {}
    
    /**
     * @dev GRAND FUNCTION 6: Advanced Multi-Type NFT Minting System
     * Mint NFTs with randomized attributes based on type and rarity
     */
    function mintCosmicNFT(
        NFTType _type,
        string memory _name,
        string memory _tokenURI
    ) public payable nonReentrant returns (uint256) {
        require(msg.value >= MINT_PRICE, "Insufficient payment");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        // Generate randomized rarity
        Rarity rarity = _generateRarity(newTokenId);
        
        // Calculate base power rating based on rarity
        uint256 basePower = _calculateBasePower(rarity);
        
        // Mint the NFT
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        
        // Set metadata
        nftMetadata[newTokenId] = NFTMetadata({
            nftType: _type,
            rarity: rarity,
            level: 1,
            experience: 0,
            powerRating: basePower,
            birthTime: block.timestamp,
            name: _name,
            isStaked: false,
            fusionCount: 0
        });
        
        // Set type-specific data
        if (_type == NFTType.Planet) {
            _initializePlanet(newTokenId, rarity);
        } else if (_type == NFTType.Spaceship) {
            _initializeSpaceship(newTokenId, rarity);
        }
        
        userNFTs[msg.sender].push(newTokenId);
        
        emit NFTMinted(msg.sender, newTokenId, _type, rarity);
        
        return newTokenId;
    }
    
    /**
     * @dev GRAND FUNCTION 7: NFT Fusion System
     * Fuse two NFTs to create a more powerful hybrid
     */
    function fuseNFTs(
        uint256 _tokenId1,
        uint256 _tokenId2,
        string memory _newName,
        string memory _newTokenURI
    ) public payable nonReentrant returns (uint256) {
        require(msg.value >= FUSION_COST, "Insufficient fusion fee");
        require(ownerOf(_tokenId1) == msg.sender, "Not owner of token 1");
        require(ownerOf(_tokenId2) == msg.sender, "Not owner of token 2");
        require(
            nftMetadata[_tokenId1].nftType == nftMetadata[_tokenId2].nftType,
            "NFTs must be same type"
        );
        require(!nftMetadata[_tokenId1].isStaked && !nftMetadata[_tokenId2].isStaked, "Cannot fuse staked NFTs");
        
        NFTMetadata memory meta1 = nftMetadata[_tokenId1];
        NFTMetadata memory meta2 = nftMetadata[_tokenId2];
        
        // Burn the two original NFTs
        _burn(_tokenId1);
        _burn(_tokenId2);
        
        // Create new fused NFT
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _newTokenURI);
        
        // Calculate fused attributes
        Rarity newRarity = _upgradedRarity(meta1.rarity, meta2.rarity);
        uint256 newLevel = (meta1.level + meta2.level) / 2 + 5; // Bonus levels
        uint256 newPower = meta1.powerRating + meta2.powerRating + 1000; // Fusion bonus
        
        nftMetadata[newTokenId] = NFTMetadata({
            nftType: meta1.nftType,
            rarity: newRarity,
            level: newLevel > MAX_LEVEL ? MAX_LEVEL : newLevel,
            experience: 0,
            powerRating: newPower,
            birthTime: block.timestamp,
            name: _newName,
            isStaked: false,
            fusionCount: meta1.fusionCount + meta2.fusionCount + 1
        });
        
        // Initialize type-specific data for fused NFT
        if (meta1.nftType == NFTType.Planet) {
            _fusePlanets(_tokenId1, _tokenId2, newTokenId);
        } else if (meta1.nftType == NFTType.Spaceship) {
            _fuseSpaceships(_tokenId1, _tokenId2, newTokenId);
        }
        
        userNFTs[msg.sender].push(newTokenId);
        
        emit NFTFused(_tokenId1, _tokenId2, newTokenId);
        
        return newTokenId;
    }
    
    /**
     * @dev GRAND FUNCTION 8: Experience and Leveling System
     * Gain experience through gameplay and level up NFTs
     */
    function gainExperience(uint256 _tokenId, uint256 _experience) external onlyOwner {
        require(_exists(_tokenId), "Token does not exist");
        
        NFTMetadata storage meta = nftMetadata[_tokenId];
        meta.experience += _experience;
        
        // Check if level up is possible
        uint256 experienceNeeded = _calculateExperienceForLevel(meta.level + 1);
        
        while (meta.experience >= experienceNeeded && meta.level < MAX_LEVEL) {
            meta.level++;
            meta.experience -= experienceNeeded;
            meta.powerRating += _calculatePowerIncrease(meta.rarity);
            
            experienceNeeded = _calculateExperienceForLevel(meta.level + 1);
            
            emit NFTLeveledUp(_tokenId, meta.level);
        }
        
        emit ExperienceGained(_tokenId, _experience);
    }
    
    /**
     * @dev GRAND FUNCTION 9: NFT Staking for Passive Rewards
     * Stake NFTs to earn passive benefits
     */
    function stakeNFT(uint256 _tokenId) external nonReentrant {
        require(ownerOf(_tokenId) == msg.sender, "Not the owner");
        require(!nftMetadata[_tokenId].isStaked, "Already staked");
        
        nftMetadata[_tokenId].isStaked = true;
        stakingStartTime[_tokenId] = block.timestamp;
        
        emit NFTStaked(_tokenId, msg.sender);
    }
    
    /**
     * @dev Unstake NFT and claim rewards
     */
    function unstakeNFT(uint256 _tokenId) external nonReentrant {
        require(ownerOf(_tokenId) == msg.sender, "Not the owner");
        require(nftMetadata[_tokenId].isStaked, "Not staked");
        
        uint256 stakingDuration = block.timestamp - stakingStartTime[_tokenId];
        uint256 experienceGained = (stakingDuration / 1 hours) * 10; // 10 XP per hour
        
        nftMetadata[_tokenId].isStaked = false;
        nftMetadata[_tokenId].experience += experienceGained;
        
        emit NFTUnstaked(_tokenId, msg.sender);
        emit ExperienceGained(_tokenId, experienceGained);
    }
    
    /**
     * @dev GRAND FUNCTION 10: Batch Minting for Genesis Collection
     * Mint multiple NFTs in a single transaction
     */
    function batchMintGenesis(
        NFTType[] memory _types,
        string[] memory _names,
        string[] memory _tokenURIs
    ) public payable nonReentrant returns (uint256[] memory) {
        require(_types.length == _names.length && _names.length == _tokenURIs.length, "Array length mismatch");
        require(msg.value >= MINT_PRICE * _types.length, "Insufficient payment");
        
        uint256[] memory tokenIds = new uint256[](_types.length);
        
        for (uint256 i = 0; i < _types.length; i++) {
            _tokenIds.increment();
            uint256 newTokenId = _tokenIds.current();
            
            Rarity rarity = _generateRarity(newTokenId);
            uint256 basePower = _calculateBasePower(rarity);
            
            _safeMint(msg.sender, newTokenId);
            _setTokenURI(newTokenId, _tokenURIs[i]);
            
            nftMetadata[newTokenId] = NFTMetadata({
                nftType: _types[i],
                rarity: rarity,
                level: 1,
                experience: 0,
                powerRating: basePower,
                birthTime: block.timestamp,
                name: _names[i],
                isStaked: false,
                fusionCount: 0
            });
            
            if (_types[i] == NFTType.Planet) {
                _initializePlanet(newTokenId, rarity);
            } else if (_types[i] == NFTType.Spaceship) {
                _initializeSpaceship(newTokenId, rarity);
            }
            
            userNFTs[msg.sender].push(newTokenId);
            tokenIds[i] = newTokenId;
            
            emit NFTMinted(msg.sender, newTokenId, _types[i], rarity);
        }
        
        return tokenIds;
    }
    
    // Helper functions
    
    function _generateRarity(uint256 _seed) internal view returns (Rarity) {
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, _seed))) % 100;
        
        if (random < 1) return Rarity.Mythic;      // 1%
        if (random < 6) return Rarity.Legendary;   // 5%
        if (random < 21) return Rarity.Epic;       // 15%
        if (random < 51) return Rarity.Rare;       // 30%
        return Rarity.Common;                       // 49%
    }
    
    function _calculateBasePower(Rarity _rarity) internal pure returns (uint256) {
        if (_rarity == Rarity.Mythic) return 10000;
        if (_rarity == Rarity.Legendary) return 5000;
        if (_rarity == Rarity.Epic) return 2500;
        if (_rarity == Rarity.Rare) return 1000;
        return 500;
    }
    
    function _upgradedRarity(Rarity _r1, Rarity _r2) internal pure returns (Rarity) {
        uint256 avg = (uint256(_r1) + uint256(_r2)) / 2;
        if (avg >= uint256(Rarity.Legendary)) return Rarity.Mythic;
        if (avg >= uint256(Rarity.Epic)) return Rarity.Legendary;
        if (avg >= uint256(Rarity.Rare)) return Rarity.Epic;
        return Rarity.Rare;
    }
    
    function _calculateExperienceForLevel(uint256 _level) internal pure returns (uint256) {
        return _level * _level * 100;
    }
    
    function _calculatePowerIncrease(Rarity _rarity) internal pure returns (uint256) {
        if (_rarity == Rarity.Mythic) return 500;
        if (_rarity == Rarity.Legendary) return 250;
        if (_rarity == Rarity.Epic) return 125;
        if (_rarity == Rarity.Rare) return 50;
        return 25;
    }
    
    function _initializePlanet(uint256 _tokenId, Rarity _rarity) internal {
        string[5] memory biomes = ["Jungle", "Desert", "Ocean", "Arctic", "Volcanic"];
        uint256 biomeIndex = uint256(keccak256(abi.encodePacked(_tokenId))) % 5;
        
        planetData[_tokenId] = PlanetData({
            biome: biomes[biomeIndex],
            resourceAbundance: 50 + uint256(_rarity) * 10,
            population: 1000000 * (uint256(_rarity) + 1),
            defenseRating: 100 + uint256(_rarity) * 20,
            hasWormhole: _rarity >= Rarity.Epic
        });
    }
    
    function _initializeSpaceship(uint256 _tokenId, Rarity _rarity) internal {
        string[5] memory classes = ["Fighter", "Cruiser", "Battleship", "Carrier", "Dreadnought"];
        uint256 classIndex = uint256(_rarity);
        
        spaceshipData[_tokenId] = SpaceshipData({
            speed: 100 + uint256(_rarity) * 25,
            cargo: 500 + uint256(_rarity) * 200,
            weaponPower: 50 + uint256(_rarity) * 30,
            shieldStrength: 100 + uint256(_rarity) * 40,
            class: classes[classIndex]
        });
    }
    
    function _fusePlanets(uint256 _id1, uint256 _id2, uint256 _newId) internal {
        PlanetData memory p1 = planetData[_id1];
        PlanetData memory p2 = planetData[_id2];
        
        planetData[_newId] = PlanetData({
            biome: p1.resourceAbundance > p2.resourceAbundance ? p1.biome : p2.biome,
            resourceAbundance: (p1.resourceAbundance + p2.resourceAbundance) / 2 + 20,
            population: p1.population + p2.population,
            defenseRating: (p1.defenseRating + p2.defenseRating) / 2 + 50,
            hasWormhole: p1.hasWormhole || p2.hasWormhole
        });
    }
    
    function _fuseSpaceships(uint256 _id1, uint256 _id2, uint256 _newId) internal {
        SpaceshipData memory s1 = spaceshipData[_id1];
        SpaceshipData memory s2 = spaceshipData[_id2];
        
        spaceshipData[_newId] = SpaceshipData({
            speed: (s1.speed + s2.speed) / 2 + 25,
            cargo: s1.cargo + s2.cargo,
            weaponPower: (s1.weaponPower + s2.weaponPower) / 2 + 30,
            shieldStrength: (s1.shieldStrength + s2.shieldStrength) / 2 + 40,
            class: s1.weaponPower > s2.weaponPower ? s1.class : s2.class
        });
    }
    
    function getUserNFTs(address _user) external view returns (uint256[] memory) {
        return userNFTs[_user];
    }
    
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
