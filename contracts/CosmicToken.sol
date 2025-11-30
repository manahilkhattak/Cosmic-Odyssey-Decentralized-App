// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title CosmicToken (COSMIC)
 * @dev Native currency of the Cosmic Odyssey universe
 * Features: Staking, Governance, Resource Conversion, Inflation Control
 */
contract CosmicToken is ERC20, ERC20Burnable, Ownable, ReentrancyGuard {
    
    // Staking structure
    struct StakingInfo {
        uint256 amount;
        uint256 startTime;
        uint256 lastClaimTime;
        uint256 totalRewards;
        bool isStaking;
    }
    
    // Resource conversion rates (1 COSMIC = X resources)
    struct ResourceRates {
        uint256 energyRate;      // Energy per COSMIC
        uint256 darkMatterRate;  // Dark Matter per COSMIC
        uint256 neutroniumRate;  // Neutronium per COSMIC
        uint256 kryptoniteRate;  // Kryptonite per COSMIC
    }
    
    // Governance vote power
    struct VotePower {
        uint256 baseVotes;
        uint256 stakedVotes;
        uint256 timeMultiplier;
    }
    
    mapping(address => StakingInfo) public stakingInfo;
    mapping(address => VotePower) public votePower;
    mapping(address => uint256) public lastMiningTime;
    mapping(address => uint256) public miningPower;
    
    ResourceRates public resourceRates;
    
    uint256 public constant STAKING_APR = 15; // 15% APR
    uint256 public constant MIN_STAKE_TIME = 7 days;
    uint256 public constant MINING_COOLDOWN = 1 hours;
    uint256 public constant BASE_MINING_REWARD = 10 * 10**18; // 10 COSMIC
    uint256 public totalStaked;
    uint256 public inflationCap = 1000000000 * 10**18; // 1 billion cap
    
    event Staked(address indexed user, uint256 amount, uint256 timestamp);
    event Unstaked(address indexed user, uint256 amount, uint256 rewards);
    event RewardsClaimed(address indexed user, uint256 rewards);
    event ResourcesConverted(address indexed user, uint256 cosmicAmount, string resourceType);
    event TokensMined(address indexed user, uint256 amount);
    event VotePowerUpdated(address indexed user, uint256 newPower);
    
    constructor() ERC20("Cosmic Token", "COSMIC") Ownable(msg.sender) {
        // Initial mint for game treasury and rewards
        _mint(msg.sender, 100000000 * 10**decimals()); // 100M initial supply
        
        // Set initial resource conversion rates
        resourceRates = ResourceRates({
            energyRate: 100,
            darkMatterRate: 10,
            neutroniumRate: 25,
            kryptoniteRate: 5
        });
    }
    
    /**
     * @dev GRAND FUNCTION 1: Advanced Staking with Time-Locked Bonuses
     * Stake tokens to earn rewards and increase governance power
     */
    function stakeTokens(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Cannot stake 0 tokens");
        require(balanceOf(msg.sender) >= _amount, "Insufficient balance");
        
        // If already staking, claim existing rewards first
        if (stakingInfo[msg.sender].isStaking) {
            _claimStakingRewards();
        }
        
        _transfer(msg.sender, address(this), _amount);
        
        stakingInfo[msg.sender] = StakingInfo({
            amount: stakingInfo[msg.sender].amount + _amount,
            startTime: block.timestamp,
            lastClaimTime: block.timestamp,
            totalRewards: stakingInfo[msg.sender].totalRewards,
            isStaking: true
        });
        
        totalStaked += _amount;
        _updateVotePower(msg.sender);
        
        emit Staked(msg.sender, _amount, block.timestamp);
    }
    
    /**
     * @dev GRAND FUNCTION 2: Complex Unstaking with Penalty System
     * Unstake tokens with time-based penalty reduction
     */
    function unstakeTokens(uint256 _amount) external nonReentrant {
        require(stakingInfo[msg.sender].isStaking, "Not currently staking");
        require(stakingInfo[msg.sender].amount >= _amount, "Insufficient staked amount");
        
        uint256 rewards = calculateStakingRewards(msg.sender);
        uint256 penalty = 0;
        
        // Early unstaking penalty (reduces over time)
        uint256 stakeDuration = block.timestamp - stakingInfo[msg.sender].startTime;
        if (stakeDuration < MIN_STAKE_TIME) {
            penalty = (_amount * 10) / 100; // 10% penalty
        } else if (stakeDuration < MIN_STAKE_TIME * 2) {
            penalty = (_amount * 5) / 100; // 5% penalty
        }
        
        uint256 amountToReturn = _amount - penalty;
        
        stakingInfo[msg.sender].amount -= _amount;
        stakingInfo[msg.sender].totalRewards += rewards;
        totalStaked -= _amount;
        
        if (stakingInfo[msg.sender].amount == 0) {
            stakingInfo[msg.sender].isStaking = false;
        }
        
        // Burn penalty tokens to control inflation
        if (penalty > 0) {
            _burn(address(this), penalty);
        }
        
        _transfer(address(this), msg.sender, amountToReturn);
        
        if (rewards > 0) {
            _mint(msg.sender, rewards);
        }
        
        _updateVotePower(msg.sender);
        
        emit Unstaked(msg.sender, amountToReturn, rewards);
    }
    
    /**
     * @dev GRAND FUNCTION 3: Dynamic Resource Mining System
     * Mine tokens based on player activity and mining power
     */
    function mineCosmicTokens() external nonReentrant {
        require(
            block.timestamp >= lastMiningTime[msg.sender] + MINING_COOLDOWN,
            "Mining on cooldown"
        );
        require(totalSupply() < inflationCap, "Inflation cap reached");
        
        uint256 playerMiningPower = miningPower[msg.sender];
        if (playerMiningPower == 0) {
            playerMiningPower = 100; // Base mining power
        }
        
        // Calculate mining reward with difficulty adjustment
        uint256 difficultyMultiplier = (inflationCap - totalSupply()) / inflationCap;
        uint256 reward = (BASE_MINING_REWARD * playerMiningPower * difficultyMultiplier) / 10000;
        
        lastMiningTime[msg.sender] = block.timestamp;
        _mint(msg.sender, reward);
        
        emit TokensMined(msg.sender, reward);
    }
    
    /**
     * @dev GRAND FUNCTION 4: Multi-Resource Conversion Engine
     * Convert COSMIC tokens to in-game resources with dynamic rates
     */
    function convertToResources(
        string memory resourceType,
        uint256 cosmicAmount
    ) external nonReentrant {
        require(balanceOf(msg.sender) >= cosmicAmount, "Insufficient COSMIC balance");
        require(cosmicAmount > 0, "Amount must be greater than 0");
        
        uint256 resourceAmount;
        
        if (keccak256(bytes(resourceType)) == keccak256(bytes("energy"))) {
            resourceAmount = cosmicAmount * resourceRates.energyRate;
        } else if (keccak256(bytes(resourceType)) == keccak256(bytes("darkMatter"))) {
            resourceAmount = cosmicAmount * resourceRates.darkMatterRate;
        } else if (keccak256(bytes(resourceType)) == keccak256(bytes("neutronium"))) {
            resourceAmount = cosmicAmount * resourceRates.neutroniumRate;
        } else if (keccak256(bytes(resourceType)) == keccak256(bytes("kryptonite"))) {
            resourceAmount = cosmicAmount * resourceRates.kryptoniteRate;
        } else {
            revert("Invalid resource type");
        }
        
        // Burn COSMIC tokens (deflationary mechanism)
        _burn(msg.sender, cosmicAmount);
        
        emit ResourcesConverted(msg.sender, cosmicAmount, resourceType);
    }
    
    /**
     * @dev GRAND FUNCTION 5: Governance Vote Power Calculation
     * Calculate voting power based on holdings, staking, and time
     */
    function calculateVotePower(address _user) public view returns (uint256) {
        VotePower memory power = votePower[_user];
        
        uint256 baseVotes = balanceOf(_user);
        uint256 stakedVotes = stakingInfo[_user].amount * 2; // 2x multiplier for staked tokens
        
        // Time multiplier (max 1.5x for long-term stakers)
        uint256 timeMultiplier = 100;
        if (stakingInfo[_user].isStaking) {
            uint256 stakeDuration = block.timestamp - stakingInfo[_user].startTime;
            uint256 monthsStaked = stakeDuration / 30 days;
            timeMultiplier = 100 + (monthsStaked * 10); // +10% per month
            if (timeMultiplier > 150) {
                timeMultiplier = 150; // Cap at 1.5x
            }
        }
        
        return (baseVotes + stakedVotes) * timeMultiplier / 100;
    }
    
    /**
     * @dev Helper: Calculate staking rewards
     */
    function calculateStakingRewards(address _user) public view returns (uint256) {
        if (!stakingInfo[_user].isStaking) {
            return 0;
        }
        
        uint256 stakeDuration = block.timestamp - stakingInfo[_user].lastClaimTime;
        uint256 stakedAmount = stakingInfo[_user].amount;
        
        // APR calculation: (amount * APR * duration) / (365 days * 100)
        uint256 rewards = (stakedAmount * STAKING_APR * stakeDuration) / (365 days * 100);
        
        return rewards;
    }
    
    /**
     * @dev Helper: Claim staking rewards
     */
    function _claimStakingRewards() internal {
        uint256 rewards = calculateStakingRewards(msg.sender);
        if (rewards > 0 && totalSupply() + rewards <= inflationCap) {
            _mint(msg.sender, rewards);
            stakingInfo[msg.sender].lastClaimTime = block.timestamp;
            stakingInfo[msg.sender].totalRewards += rewards;
            
            emit RewardsClaimed(msg.sender, rewards);
        }
    }
    
    /**
     * @dev Helper: Update vote power
     */
    function _updateVotePower(address _user) internal {
        uint256 newPower = calculateVotePower(_user);
        votePower[_user].baseVotes = balanceOf(_user);
        votePower[_user].stakedVotes = stakingInfo[_user].amount;
        
        emit VotePowerUpdated(_user, newPower);
    }
    
    /**
     * @dev Increase mining power (called by main game contract)
     */
    function increaseMiningPower(address _user, uint256 _powerIncrease) external onlyOwner {
        miningPower[_user] += _powerIncrease;
    }
    
    /**
     * @dev Update resource conversion rates
     */
    function updateResourceRates(
        uint256 _energyRate,
        uint256 _darkMatterRate,
        uint256 _neutroniumRate,
        uint256 _kryptoniteRate
    ) external onlyOwner {
        resourceRates = ResourceRates({
            energyRate: _energyRate,
            darkMatterRate: _darkMatterRate,
            neutroniumRate: _neutroniumRate,
            kryptoniteRate: _kryptoniteRate
        });
    }
    
    /**
     * @dev Claim staking rewards without unstaking
     */
    function claimRewards() external nonReentrant {
        require(stakingInfo[msg.sender].isStaking, "Not currently staking");
        _claimStakingRewards();
    }
}
