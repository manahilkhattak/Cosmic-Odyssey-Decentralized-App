// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CosmicToken.sol";
import "./CosmicNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title CosmicOdyssey
 * @dev Main game contract with governance, territories, and gameplay mechanics
 */
contract CosmicOdyssey is Ownable, ReentrancyGuard {
    
    CosmicToken public cosmicToken;
    CosmicNFT public cosmicNFT;
    
    // Governance structures
    enum ProposalType { ResourceAllocation, SystemUpgrade, ParameterChange, EmergencyAction }
    
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        ProposalType proposalType;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;
        bool executed;
        mapping(address => bool) hasVoted;
    }
    
    // Territory structures
    struct Territory {
        uint256 id;
        address owner;
        uint256 planetNFTId;
        uint256 resourceProduction;
        uint256 lastClaimed;
        bool exists;
    }
    
    // Alliance structures
    struct Alliance {
        uint256 id;
        string name;
        address leader;
        address[] members;
        uint256 treasury;
        bool exists;
    }
    
    // Mappings
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => Territory) public territories;
    mapping(uint256 => Alliance) public alliances;
    mapping(address => uint256) public playerAlliance;
    
    uint256 public proposalCount;
    uint256 public territoryCount;
    uint256 public allianceCount;
    
    // Constants
    uint256 public constant PROPOSAL_DURATION = 7 days;
    uint256 public constant MIN_PROPOSAL_TOKENS = 1000 * 10**18;
    uint256 public constant TERRITORY_CLAIM_COOLDOWN = 1 hours;
    
    // Events
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);
    event TerritoryClaimed(uint256 indexed territoryId, address indexed owner, uint256 planetId);
    event ResourcesClaimed(uint256 indexed territoryId, address indexed owner, uint256 amount);
    event AllianceCreated(uint256 indexed allianceId, string name, address indexed leader);
    event AllianceMemberJoined(uint256 indexed allianceId, address indexed member);
    
    constructor(address _cosmicToken, address _cosmicNFT) Ownable(msg.sender) {
        cosmicToken = CosmicToken(_cosmicToken);
        cosmicNFT = CosmicNFT(_cosmicNFT);
    }
    
    // ===== GOVERNANCE FUNCTIONS =====
    
    /**
     * @dev Create a new governance proposal
     */
    function createProposal(
        string memory _title,
        string memory _description,
        ProposalType _proposalType
    ) external nonReentrant returns (uint256) {
        require(
            cosmicToken.balanceOf(msg.sender) >= MIN_PROPOSAL_TOKENS,
            "Insufficient tokens to create proposal"
        );
        
        uint256 proposalId = proposalCount++;
        Proposal storage proposal = proposals[proposalId];
        
        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.title = _title;
        proposal.description = _description;
        proposal.proposalType = _proposalType;
        proposal.deadline = block.timestamp + PROPOSAL_DURATION;
        proposal.executed = false;
        
        emit ProposalCreated(proposalId, msg.sender, _title);
        
        return proposalId;
    }
    
    /**
     * @dev Vote on a proposal
     */
    function voteOnProposal(
        uint256 _proposalId,
        bool _support,
        uint256 _voteAmount
    ) external nonReentrant {
        Proposal storage proposal = proposals[_proposalId];
        
        require(block.timestamp < proposal.deadline, "Voting period ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        require(_voteAmount > 0, "Vote amount must be > 0");
        
        uint256 votingPower = cosmicToken.calculateVotePower(msg.sender);
        require(votingPower >= _voteAmount, "Insufficient voting power");
        
        proposal.hasVoted[msg.sender] = true;
        
        if (_support) {
            proposal.votesFor += _voteAmount;
        } else {
            proposal.votesAgainst += _voteAmount;
        }
        
        emit VoteCast(_proposalId, msg.sender, _support, _voteAmount);
    }
    
    /**
     * @dev Execute a passed proposal
     */
    function executeProposal(uint256 _proposalId) external nonReentrant {
        Proposal storage proposal = proposals[_proposalId];
        
        require(block.timestamp >= proposal.deadline, "Voting still active");
        require(!proposal.executed, "Already executed");
        require(proposal.votesFor > proposal.votesAgainst, "Proposal did not pass");
        
        proposal.executed = true;
        
        // Execute proposal effects based on type
        _executeProposalEffect(proposal);
        
        emit ProposalExecuted(_proposalId);
    }
    
    /**
     * @dev Internal function to execute proposal effects
     */
    function _executeProposalEffect(Proposal storage _proposal) internal {
        // Implement specific effects based on proposal type
        // This is simplified - add your custom logic here
        if (_proposal.proposalType == ProposalType.ResourceAllocation) {
            // Allocate resources
        } else if (_proposal.proposalType == ProposalType.SystemUpgrade) {
            // Upgrade system
        }
    }
    
    // ===== TERRITORY FUNCTIONS =====
    
    /**
     * @dev Claim a territory with a planet NFT
     */
    function claimTerritory(uint256 _planetNFTId) external nonReentrant returns (uint256) {
        require(cosmicNFT.ownerOf(_planetNFTId) == msg.sender, "Not NFT owner");
        
        (CosmicNFT.NFTType nftType,,,,,,,,) = cosmicNFT.nftMetadata(_planetNFTId);
        require(nftType == CosmicNFT.NFTType.Planet, "Must be a planet NFT");
        
        uint256 territoryId = territoryCount++;
        
        territories[territoryId] = Territory({
            id: territoryId,
            owner: msg.sender,
            planetNFTId: _planetNFTId,
            resourceProduction: 100, // Base production
            lastClaimed: block.timestamp,
            exists: true
        });
        
        emit TerritoryClaimed(territoryId, msg.sender, _planetNFTId);
        
        return territoryId;
    }
    
    /**
     * @dev Claim resources from a territory
     */
    function claimTerritoryResources(uint256 _territoryId) external nonReentrant {
        Territory storage territory = territories[_territoryId];
        
        require(territory.exists, "Territory does not exist");
        require(territory.owner == msg.sender, "Not territory owner");
        require(
            block.timestamp >= territory.lastClaimed + TERRITORY_CLAIM_COOLDOWN,
            "Cooldown not finished"
        );
        
        uint256 timePassed = block.timestamp - territory.lastClaimed;
        uint256 resourceAmount = (territory.resourceProduction * timePassed) / 1 hours;
        
        territory.lastClaimed = block.timestamp;
        
        // Mint resources to player (simplified - mint tokens)
        cosmicToken.increaseMiningPower(msg.sender, resourceAmount);
        
        emit ResourcesClaimed(_territoryId, msg.sender, resourceAmount);
    }
    
    // ===== ALLIANCE FUNCTIONS =====
    
    /**
     * @dev Create a new alliance
     */
    function createAlliance(string memory _name) external nonReentrant returns (uint256) {
        require(playerAlliance[msg.sender] == 0, "Already in an alliance");
        
        uint256 allianceId = allianceCount++;
        
        Alliance storage alliance = alliances[allianceId];
        alliance.id = allianceId;
        alliance.name = _name;
        alliance.leader = msg.sender;
        alliance.members.push(msg.sender);
        alliance.exists = true;
        
        playerAlliance[msg.sender] = allianceId;
        
        emit AllianceCreated(allianceId, _name, msg.sender);
        
        return allianceId;
    }
    
    /**
     * @dev Join an alliance
     */
    function joinAlliance(uint256 _allianceId) external nonReentrant {
        require(playerAlliance[msg.sender] == 0, "Already in an alliance");
        require(alliances[_allianceId].exists, "Alliance does not exist");
        
        Alliance storage alliance = alliances[_allianceId];
        alliance.members.push(msg.sender);
        playerAlliance[msg.sender] = _allianceId;
        
        emit AllianceMemberJoined(_allianceId, msg.sender);
    }
    
    // ===== SYNERGY FUNCTIONS =====
    
    /**
     * @dev Activate synergy bonus with Planet + Spaceship + Alien combo
     */
    function activateSynergy(
        uint256 _planetId,
        uint256 _spaceshipId,
        uint256 _alienId
    ) external nonReentrant returns (uint256) {
        require(cosmicNFT.ownerOf(_planetId) == msg.sender, "Not planet owner");
        require(cosmicNFT.ownerOf(_spaceshipId) == msg.sender, "Not spaceship owner");
        require(cosmicNFT.ownerOf(_alienId) == msg.sender, "Not alien owner");
        
        (CosmicNFT.NFTType planetType,,,,,,,,) = cosmicNFT.nftMetadata(_planetId);
        (CosmicNFT.NFTType shipType,,,,,,,,) = cosmicNFT.nftMetadata(_spaceshipId);
        (CosmicNFT.NFTType alienType,,,,,,,,) = cosmicNFT.nftMetadata(_alienId);
        
        require(planetType == CosmicNFT.NFTType.Planet, "First must be planet");
        require(shipType == CosmicNFT.NFTType.Spaceship, "Second must be spaceship");
        require(alienType == CosmicNFT.NFTType.Alien, "Third must be alien");
        
        // Award synergy bonus
        uint256 synergyBonus = 1000 * 10**18; // 1000 COSMIC tokens
        cosmicToken.increaseMiningPower(msg.sender, synergyBonus);
        
        // Add experience to NFTs
        cosmicNFT.addExperience(_planetId, 1000, "synergy");
        cosmicNFT.addExperience(_spaceshipId, 1000, "synergy");
        cosmicNFT.addExperience(_alienId, 1000, "synergy");
        
        return synergyBonus;
    }
    
    // ===== VIEW FUNCTIONS =====
    
    /**
     * @dev Get proposal details
     */
    function getProposal(uint256 _proposalId) external view returns (
        uint256 id,
        address proposer,
        string memory title,
        string memory description,
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 deadline,
        bool executed
    ) {
        Proposal storage proposal = proposals[_proposalId];
        return (
            proposal.id,
            proposal.proposer,
            proposal.title,
            proposal.description,
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.deadline,
            proposal.executed
        );
    }
    
    /**
     * @dev Get alliance members
     */
    function getAllianceMembers(uint256 _allianceId) external view returns (address[] memory) {
        return alliances[_allianceId].members;
    }
    
    // ===== ADMIN FUNCTIONS =====
    
    /**
     * @dev Update contract addresses (owner only)
     */
    function updateContracts(address _cosmicToken, address _cosmicNFT) external onlyOwner {
        cosmicToken = CosmicToken(_cosmicToken);
        cosmicNFT = CosmicNFT(_cosmicNFT);
    }
    
    /**
     * @dev Withdraw contract balance (owner only)
     */
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    // Allow contract to receive ETH
    receive() external payable {}
}