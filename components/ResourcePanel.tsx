import React from "react";
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Zap, DollarSign, Coins, Lock, Unlock, Loader, ArrowUpDown } from 'lucide-react';
import { useWeb3 } from './Web3Provider';
import { parseEther, formatEther } from 'ethers';

interface ResourcePanelProps {
  playerData: {
    credits: number;
    energy: number;
    darkMatter: number;
    neutronium: number;
    kryptonite: number;
  };
  onResourceUpdate: (resources: any) => void;
}

export function ResourcePanel({ playerData, onResourceUpdate }: ResourcePanelProps) {
  const { cosmicToken, account, isConnected } = useWeb3();
  const [activeTab, setActiveTab] = useState<'overview' | 'staking' | 'mining'>('overview');
  
  // Token balances
  const [balance, setBalance] = useState('0');
  const [stakedBalance, setStakedBalance] = useState('0');
  const [stakingRewards, setStakingRewards] = useState('0');
  const [lastMined, setLastMined] = useState('0');
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');

  // Load balances
  useEffect(() => {
    if (isConnected && cosmicToken && account) {
      loadBalances();
    }
  }, [isConnected, cosmicToken, account]);

  const loadBalances = async () => {
    if (!cosmicToken || !account) return;
    
    try {
      const bal = await cosmicToken.balanceOf(account);
      const stakingInfo = await cosmicToken.stakingInfo(account);
      const rewards = await cosmicToken.calculateStakingRewards(account);
      
      setBalance(formatEther(bal));
      setStakedBalance(formatEther(stakingInfo.amount));
      setStakingRewards(formatEther(rewards));
    } catch (error) {
      console.error('Error loading balances:', error);
    }
  };

  const handleMine = async () => {
    if (!cosmicToken) return;
    
    setLoading(true);
    setStatus('Mining COSMIC tokens...');
    
    try {
      const tx = await cosmicToken.mineCosmicTokens();
      setStatus('Transaction sent! Waiting for confirmation...');
      await tx.wait();
      setStatus('✅ Successfully mined tokens!');
      await loadBalances();
      setTimeout(() => setStatus(''), 3000);
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
      setTimeout(() => setStatus(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleStake = async () => {
    if (!cosmicToken || !stakeAmount) return;
    
    setLoading(true);
    setStatus('Staking tokens...');
    
    try {
      const tx = await cosmicToken.stakeTokens(parseEther(stakeAmount));
      setStatus('Transaction sent! Waiting for confirmation...');
      await tx.wait();
      setStatus(`✅ Successfully staked ${stakeAmount} COSMIC tokens!`);
      await loadBalances();
      setStakeAmount('');
      setTimeout(() => setStatus(''), 3000);
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
      setTimeout(() => setStatus(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = async () => {
    if (!cosmicToken || !unstakeAmount) return;
    
    setLoading(true);
    setStatus('Unstaking tokens...');
    
    try {
      const tx = await cosmicToken.unstakeTokens(parseEther(unstakeAmount));
      setStatus('Transaction sent! Waiting for confirmation...');
      await tx.wait();
      setStatus(`✅ Successfully unstaked ${unstakeAmount} COSMIC tokens!`);
      await loadBalances();
      setUnstakeAmount('');
      setTimeout(() => setStatus(''), 3000);
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
      setTimeout(() => setStatus(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!cosmicToken) return;
    
    setLoading(true);
    setStatus('Claiming rewards...');
    
    try {
      const tx = await cosmicToken.claimRewards();
      setStatus('Transaction sent! Waiting for confirmation...');
      await tx.wait();
      setStatus('✅ Rewards claimed successfully!');
      await loadBalances();
      setTimeout(() => setStatus(''), 3000);
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
      setTimeout(() => setStatus(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleGetTestTokens = async () => {
    if (!cosmicToken) return;
    
    setLoading(true);
    setStatus('Checking for test tokens...');
    
    try {
      const owner = await cosmicToken.owner();
      
      if (owner.toLowerCase() === account?.toLowerCase()) {
        setStatus('✅ You are the owner! You have 100M tokens already.');
      } else {
        setStatus('⚠️ You need to wait for mining cooldown or get tokens from the owner.');
        
        const lastMining = await cosmicToken.lastMiningTime(account);
        const now = Math.floor(Date.now() / 1000);
        const cooldownRemaining = Number(lastMining) + 3600 - now;
        
        if (cooldownRemaining > 0) {
          setStatus(`⏳ Mining cooldown: ${Math.floor(cooldownRemaining / 60)} minutes remaining. Try the Mining tab after cooldown ends.`);
        } else {
          setStatus('✅ Mining is ready! Go to the Mining tab to get your first tokens!');
        }
      }
      
      setTimeout(() => setStatus(''), 8000);
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
      setTimeout(() => setStatus(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async () => {
    if (!cosmicToken) return;
    
    setLoading(true);
    setStatus('Converting tokens to credits...');
    
    try {
      // Check balance
      const balance = await cosmicToken.balanceOf(account);
      if (Number(formatEther(balance)) < 10) {
        setStatus('❌ Insufficient COSMIC tokens! Need 10 COSMIC.');
        setTimeout(() => setStatus(''), 5000);
        setLoading(false);
        return;
      }

      // Convert 10 COSMIC to resources
      const tx = await cosmicToken.convertToResources('energy', parseEther('10'));
      setStatus('Transaction sent! Waiting for confirmation...');
      await tx.wait();
      
      // Update local resources (10 COSMIC = 1000 Energy based on contract rate)
      onResourceUpdate({ energy: 1000 });
      
      setStatus('✅ Converted 10 COSMIC to 1000 Energy!');
      await loadBalances();
      setTimeout(() => setStatus(''), 3000);
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
      setTimeout(() => setStatus(''), 5000);
    } finally {
      setLoading(false);
    }
  };
  if (!isConnected) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <Coins className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2">Connect Wallet</h3>
          <p className="text-gray-400">Please connect your wallet to manage resources</p>
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
            <h2 className="text-3xl text-white mb-2">Resource Management</h2>
            <p className="text-gray-400">Manage your COSMIC tokens and resources</p>
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
          {(['overview', 'staking', 'mining'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-3 rounded-lg transition-all capitalize ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-cyan-600/30 to-purple-600/30 border border-cyan-400/50 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Balance Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-6 bg-gradient-to-br from-cyan-600/10 to-transparent border border-cyan-500/30 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <Coins className="w-8 h-8 text-cyan-400" />
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-2">Available Balance</h3>
                <p className="text-3xl text-cyan-400 mb-1">
                  {parseFloat(balance).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">COSMIC Tokens</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-purple-600/10 to-transparent border border-purple-500/30 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <Lock className="w-8 h-8 text-purple-400" />
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-2">Staked Balance</h3>
                <p className="text-3xl text-purple-400 mb-1">
                  {parseFloat(stakedBalance).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">COSMIC Tokens</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-yellow-600/10 to-transparent border border-yellow-500/30 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <DollarSign className="w-8 h-8 text-yellow-400" />
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-2">Staking Rewards</h3>
                <p className="text-3xl text-yellow-400 mb-1">
                  {parseFloat(stakingRewards).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">COSMIC Tokens</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={handleGetTestTokens}
                disabled={loading}
                className="p-6 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg hover:border-green-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Coins className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-lg text-white mb-2">Get Test Tokens</h3>
                <p className="text-sm text-gray-400 mb-3">Check token status & mining cooldown</p>
                <div className="px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
                  Check Status
                </div>
              </button>

              <button
                onClick={handleConvert}
                disabled={loading || parseFloat(balance) < 10}
                className="p-6 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-500/30 rounded-lg hover:border-cyan-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowUpDown className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <h3 className="text-lg text-white mb-2">Convert to Resources</h3>
                <p className="text-sm text-gray-400 mb-3">Convert 10 COSMIC → Energy</p>
                <div className="px-4 py-2 bg-cyan-600/20 border border-cyan-500/30 rounded-lg text-cyan-400 text-sm">
                  Convert Now
                </div>
              </button>

              <button
                onClick={handleClaimRewards}
                disabled={loading || parseFloat(stakingRewards) === 0}
                className="p-6 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-lg hover:border-yellow-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <DollarSign className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <h3 className="text-lg text-white mb-2">Claim Rewards</h3>
                <p className="text-sm text-gray-400 mb-3">Claim your staking rewards</p>
                <div className="px-4 py-2 bg-yellow-600/20 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm">
                  Claim Now
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Staking Tab */}
        {activeTab === 'staking' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Stake Tokens */}
              <div className="p-6 bg-black/40 border border-white/10 rounded-lg">
                <div className="flex items-center gap-3 mb-6">
                  <Lock className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl text-white">Stake Tokens</h3>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">Amount to Stake</label>
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-cyan-400/50 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">Available: {parseFloat(balance).toFixed(2)} COSMIC</p>
                </div>

                <button
                  onClick={handleStake}
                  disabled={loading || !stakeAmount || parseFloat(stakeAmount) > parseFloat(balance)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                  <span>Stake Tokens</span>
                </button>

                <div className="mt-4 p-4 bg-purple-600/10 border border-purple-500/30 rounded-lg">
                  <p className="text-sm text-gray-400">
                    Earn <span className="text-purple-400">15% APR</span> on staked tokens
                  </p>
                </div>
              </div>

              {/* Unstake Tokens */}
              <div className="p-6 bg-black/40 border border-white/10 rounded-lg">
                <div className="flex items-center gap-3 mb-6">
                  <Unlock className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl text-white">Unstake Tokens</h3>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">Amount to Unstake</label>
                  <input
                    type="number"
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-cyan-400/50 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">Staked: {parseFloat(stakedBalance).toFixed(2)} COSMIC</p>
                </div>

                <button
                  onClick={handleUnstake}
                  disabled={loading || !unstakeAmount || parseFloat(unstakeAmount) > parseFloat(stakedBalance)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Unlock className="w-5 h-5" />}
                  <span>Unstake Tokens</span>
                </button>

                <div className="mt-4 p-4 bg-cyan-600/10 border border-cyan-500/30 rounded-lg">
                  <p className="text-sm text-gray-400">
                    Rewards: <span className="text-cyan-400">{parseFloat(stakingRewards).toFixed(2)} COSMIC</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Staking Info */}
            <div className="p-6 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 border border-purple-500/30 rounded-lg">
              <h3 className="text-lg text-white mb-4">Staking Benefits</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Annual Percentage Yield</p>
                  <p className="text-2xl text-purple-400">15%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Staked</p>
                  <p className="text-2xl text-cyan-400">{parseFloat(stakedBalance).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Pending Rewards</p>
                  <p className="text-2xl text-yellow-400">{parseFloat(stakingRewards).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mining Tab */}
        {activeTab === 'mining' && (
          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-cyan-600/10 to-purple-600/10 border border-cyan-500/30 rounded-lg text-center">
              <Zap className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-2xl text-white mb-2">Mine COSMIC Tokens</h3>
              <p className="text-gray-400 mb-6">Mine tokens once every hour</p>

              <div className="max-w-md mx-auto mb-6">
                <div className="p-4 bg-black/40 border border-white/10 rounded-lg mb-4">
                  <p className="text-sm text-gray-400 mb-1">Reward per Mining</p>
                  <p className="text-3xl text-cyan-400">10 COSMIC</p>
                </div>

                <button
                  onClick={handleMine}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6" />}
                  <span className="text-lg">Mine Now</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="p-4 bg-black/40 border border-white/10 rounded-lg">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Cool-down Period</p>
                  <p className="text-lg text-white">1 Hour</p>
                </div>
                <div className="p-4 bg-black/40 border border-white/10 rounded-lg">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Tokens per Mine</p>
                  <p className="text-lg text-cyan-400">10 COSMIC</p>
                </div>
                <div className="p-4 bg-black/40 border border-white/10 rounded-lg">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Current Balance</p>
                  <p className="text-lg text-purple-400">{parseFloat(balance).toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Mining Stats */}
            <div className="p-6 bg-black/40 border border-white/10 rounded-lg">
              <h3 className="text-lg text-white mb-4">Mining Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-3 bg-black/40 border border-white/10 rounded-lg">
                  <span className="text-gray-400">Mining Reward</span>
                  <span className="text-cyan-400">10 COSMIC Tokens</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/40 border border-white/10 rounded-lg">
                  <span className="text-gray-400">Mining Cooldown</span>
                  <span className="text-purple-400">1 Hour</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/40 border border-white/10 rounded-lg">
                  <span className="text-gray-400">Gas Fee</span>
                  <span className="text-yellow-400">~0.001 ETH</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}