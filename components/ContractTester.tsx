import React from "react";
import { useState } from 'react';
import { useWeb3 } from './Web3Provider';
import { parseEther, formatEther } from 'ethers';

export function ContractTester() {
  const { cosmicToken, cosmicNFT, account, isConnected } = useWeb3();
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [ownerInfo, setOwnerInfo] = useState('');

  const checkOwnerAndBalance = async () => {
    if (!cosmicToken || !account) return;
    
    setLoading(true);
    setStatus('Checking contract info...');
    
    try {
      // Get contract owner
      const owner = await cosmicToken.owner();
      
      // Get owner's balance
      const ownerBalance = await cosmicToken.balanceOf(owner);
      
      // Get your balance
      const yourBalance = await cosmicToken.balanceOf(account);
      
      // Get your last mining time
      const lastMining = await cosmicToken.lastMiningTime(account);
      const now = Math.floor(Date.now() / 1000);
      const cooldownRemaining = Number(lastMining) + 3600 - now; // 3600 = 1 hour
      
      const info = `
📋 Contract Owner: ${owner}
💰 Owner's Balance: ${formatEther(ownerBalance)} COSMIC
👤 Your Address: ${account}
💵 Your Balance: ${formatEther(yourBalance)} COSMIC
⏰ Last Mining: ${lastMining.toString() === '0' ? 'Never' : new Date(Number(lastMining) * 1000).toLocaleString()}
⏳ Cooldown Remaining: ${cooldownRemaining > 0 ? `${Math.floor(cooldownRemaining / 60)} minutes` : 'Ready to mine!'}
      `;
      
      setOwnerInfo(info);
      setStatus('✅ Info loaded!');
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testMintNFT = async () => {
    if (!cosmicNFT || !account) return;
    
    setLoading(true);
    setStatus('Minting NFT...');
    
    try {
      const tx = await cosmicNFT.mintNFT(0, "ipfs://QmTest123", { 
        value: parseEther("0.01") 
      });
      
      setStatus('Transaction sent! Waiting for confirmation...');
      await tx.wait();
      
      setStatus('✅ NFT Minted Successfully!');
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testStakeTokens = async () => {
    if (!cosmicToken || !account) return;
    
    setLoading(true);
    setStatus('Staking tokens...');
    
    try {
      const tx = await cosmicToken.stakeTokens(parseEther("100"));
      setStatus('Transaction sent! Waiting for confirmation...');
      await tx.wait();
      setStatus('✅ Tokens Staked Successfully!');
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testMineTokens = async () => {
    if (!cosmicToken || !account) return;
    
    setLoading(true);
    setStatus('Mining tokens...');
    
    try {
      const tx = await cosmicToken.mineCosmicTokens();
      setStatus('Transaction sent! Waiting for confirmation...');
      await tx.wait();
      setStatus('✅ Tokens Mined Successfully!');
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return <div className="text-white p-8">Please connect wallet first</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl text-white mb-6">Contract Tester</h2>
      
      <div className="space-y-4">
        <button
          onClick={checkOwnerAndBalance}
          disabled={loading}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          Check Contract Info
        </button>

        {ownerInfo && (
          <div className="p-4 bg-black/80 border border-green-500/30 rounded-lg text-white whitespace-pre-line font-mono text-sm">
            {ownerInfo}
          </div>
        )}

        <button
          onClick={testMintNFT}
          disabled={loading}
          className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          Mint Planet NFT (0.01 ETH)
        </button>

        <button
          onClick={testStakeTokens}
          disabled={loading}
          className="w-full px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50"
        >
          Stake 100 COSMIC Tokens
        </button>

        <button
          onClick={testMineTokens}
          disabled={loading}
          className="w-full px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
        >
          Mine COSMIC Tokens
        </button>

        {status && (
          <div className="mt-6 p-4 bg-black/60 border border-cyan-500/30 rounded-lg text-white">
            {status}
          </div>
        )}
      </div>
    </div>
  );
}