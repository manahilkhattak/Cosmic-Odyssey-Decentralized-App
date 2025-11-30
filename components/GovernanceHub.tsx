import React from "react";
import { useState, useEffect } from 'react';
import { Vote, Users, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, Plus, Loader } from 'lucide-react';
import { useWeb3 } from './Web3Provider';
import { parseEther, formatEther } from 'ethers';

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  votesFor: string;
  votesAgainst: string;
  deadline: number;
  executed: boolean;
  status: 'active' | 'passed' | 'failed';
}

interface GovernanceHubProps {
  playerData: {
    influence: number;
  };
}

export function GovernanceHub({ playerData }: GovernanceHubProps) {
  const { cosmicOdyssey, cosmicToken, account, isConnected } = useWeb3();
  const [activeTab, setActiveTab] = useState<'proposals' | 'council' | 'history'>('proposals');
  const [showCreateProposal, setShowCreateProposal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  
  // Proposal data
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [votingPower, setVotingPower] = useState('0');
  const [tokenBalance, setTokenBalance] = useState('0');
  
  // Create proposal form
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    proposalType: 0
  });

  // Load proposals and voting power
  useEffect(() => {
    if (isConnected && cosmicOdyssey && cosmicToken && account) {
      loadProposals();
      loadVotingPower();
    }
  }, [isConnected, cosmicOdyssey, cosmicToken, account]);

  const loadProposals = async () => {
    if (!cosmicOdyssey) return;
    
    try {
      const proposalCount = await cosmicOdyssey.proposalCount();
      const loadedProposals: Proposal[] = [];
      
      for (let i = 0; i < Number(proposalCount); i++) {
        const proposal = await cosmicOdyssey.proposals(i);
        
        const now = Math.floor(Date.now() / 1000);
        let status: 'active' | 'passed' | 'failed' = 'active';
        
        if (proposal.executed) {
          status = 'passed';
        } else if (now > Number(proposal.deadline)) {
          status = Number(proposal.votesFor) > Number(proposal.votesAgainst) ? 'passed' : 'failed';
        }
        
        loadedProposals.push({
          id: i.toString(),
          title: proposal.title,
          description: proposal.description,
          proposer: proposal.proposer,
          votesFor: formatEther(proposal.votesFor),
          votesAgainst: formatEther(proposal.votesAgainst),
          deadline: Number(proposal.deadline),
          executed: proposal.executed,
          status
        });
      }
      
      setProposals(loadedProposals);
    } catch (error) {
      console.error('Error loading proposals:', error);
    }
  };

  const loadVotingPower = async () => {
    if (!cosmicToken || !account) return;
    
    try {
      const power = await cosmicToken.calculateVotePower(account);
      const balance = await cosmicToken.balanceOf(account);
      
      setVotingPower(formatEther(power));
      setTokenBalance(formatEther(balance));
    } catch (error) {
      console.error('Error loading voting power:', error);
    }
  };

  const handleCreateProposal = async () => {
    if (!cosmicOdyssey || !newProposal.title || !newProposal.description) return;
    
    setLoading(true);
    setStatus('Creating proposal...');
    
    try {
      if (parseFloat(tokenBalance) < 1000) {
        setStatus('❌ You need at least 1000 COSMIC tokens to create a proposal');
        setTimeout(() => setStatus(''), 5000);
        setLoading(false);
        return;
      }
      
      const tx = await cosmicOdyssey.createProposal(
    newProposal.proposalType,  // ✅ proposalType FIRST
    newProposal.title,
    newProposal.description
);
      
      setStatus('Transaction sent! Waiting for confirmation...');
      await tx.wait();
      
      setStatus('✅ Proposal created successfully!');
      setShowCreateProposal(false);
      setNewProposal({ title: '', description: '', proposalType: 0 });
      await loadProposals();
      
      setTimeout(() => setStatus(''), 3000);
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
      setTimeout(() => setStatus(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (proposalId: string, support: boolean) => {
    if (!cosmicOdyssey) return;
    
    setLoading(true);
    setStatus(`Voting ${support ? 'FOR' : 'AGAINST'} proposal...`);
    
    try {
      const voteAmount = parseEther(votingPower);
      const tx = await cosmicOdyssey.voteOnProposal(proposalId, support, voteAmount);
      setStatus('Transaction sent! Waiting for confirmation...');
      await tx.wait();
      
      setStatus(`✅ Vote cast successfully!`);
      await loadProposals();
      await loadVotingPower();
      
      setTimeout(() => setStatus(''), 3000);
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
      setTimeout(() => setStatus(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteProposal = async (proposalId: string) => {
    if (!cosmicOdyssey) return;
    
    setLoading(true);
    setStatus('Executing proposal...');
    
    try {
      const tx = await cosmicOdyssey.executeProposal(proposalId);
      setStatus('Transaction sent! Waiting for confirmation...');
      await tx.wait();
      
      setStatus('✅ Proposal executed successfully!');
      await loadProposals();
      
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
          <Vote className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2">Connect Wallet</h3>
          <p className="text-gray-400">Please connect your wallet to participate in governance</p>
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
            <h2 className="text-3xl text-white mb-2">Governance Hub</h2>
            <p className="text-gray-400">Shape the future of the Cosmic Odyssey</p>
          </div>

          <button
            onClick={() => setShowCreateProposal(true)}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            <span>Create Proposal</span>
          </button>
        </div>

        {/* Status Message */}
        {status && (
          <div className="p-4 bg-black/60 border border-cyan-500/30 rounded-lg text-white">
            {status}
          </div>
        )}

        {/* Voting Power Card */}
        <div className="p-6 bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Your Voting Power</p>
              <p className="text-4xl text-purple-400">{parseFloat(votingPower).toFixed(2)}</p>
              <p className="text-sm text-gray-400 mt-2">
                Based on {parseFloat(tokenBalance).toFixed(2)} COSMIC tokens
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <Vote className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Active Votes</p>
                <p className="text-xl text-cyan-400">{proposals.filter(p => p.status === 'active').length}</p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Passed</p>
                <p className="text-xl text-green-400">{proposals.filter(p => p.status === 'passed').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-black/40 border border-white/10 rounded-lg">
          {(['proposals', 'council', 'history'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-3 rounded-lg transition-all capitalize ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-400/50 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Proposals Tab */}
        {activeTab === 'proposals' && (
          <div className="space-y-4">
            {proposals.length === 0 ? (
              <div className="p-12 bg-black/40 border border-white/10 rounded-lg text-center">
                <Vote className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl text-white mb-2">No Active Proposals</h3>
                <p className="text-gray-400 mb-6">Be the first to create a proposal!</p>
                <button
                  onClick={() => setShowCreateProposal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white hover:shadow-lg transition-all"
                >
                  Create Proposal
                </button>
              </div>
            ) : (
              proposals.filter(p => p.status === 'active').map((proposal) => {
                const totalVotes = parseFloat(proposal.votesFor) + parseFloat(proposal.votesAgainst);
                const forPercentage = totalVotes > 0 ? (parseFloat(proposal.votesFor) / totalVotes) * 100 : 0;
                const againstPercentage = totalVotes > 0 ? (parseFloat(proposal.votesAgainst) / totalVotes) * 100 : 0;
                const timeLeft = Math.max(0, proposal.deadline - Math.floor(Date.now() / 1000));
                const daysLeft = Math.floor(timeLeft / 86400);
                const hoursLeft = Math.floor((timeLeft % 86400) / 3600);

                return (
                  <div
                    key={proposal.id}
                    className="p-6 bg-black/40 border border-white/10 rounded-lg hover:border-purple-400/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl text-white">{proposal.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider ${
                            proposal.status === 'active' ? 'bg-cyan-600/20 border border-cyan-500/30 text-cyan-400' :
                            proposal.status === 'passed' ? 'bg-green-600/20 border border-green-500/30 text-green-400' :
                            'bg-red-600/20 border border-red-500/30 text-red-400'
                          }`}>
                            {proposal.status}
                          </span>
                        </div>
                        <p className="text-gray-400 mb-4">{proposal.description}</p>
                        <p className="text-sm text-gray-500">
                          Proposed by: {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-5 h-5" />
                        <span className="text-sm">
                          {daysLeft}d {hoursLeft}h left
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-green-400">For: {parseFloat(proposal.votesFor).toFixed(2)} ({forPercentage.toFixed(1)}%)</span>
                        <span className="text-red-400">Against: {parseFloat(proposal.votesAgainst).toFixed(2)} ({againstPercentage.toFixed(1)}%)</span>
                      </div>
                      <div className="h-3 bg-black/40 border border-white/10 rounded-full overflow-hidden flex">
                        <div
                          className="bg-gradient-to-r from-green-600 to-emerald-600"
                          style={{ width: `${forPercentage}%` }}
                        />
                        <div
                          className="bg-gradient-to-r from-red-600 to-orange-600"
                          style={{ width: `${againstPercentage}%` }}
                        />
                      </div>
                    </div>

                    {proposal.status === 'active' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleVote(proposal.id, true)}
                          disabled={loading}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg text-white hover:border-green-400/50 transition-all disabled:opacity-50"
                        >
                          {loading ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                          <span>Vote For</span>
                        </button>
                        <button
                          onClick={() => handleVote(proposal.id, false)}
                          disabled={loading}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-lg text-white hover:border-red-400/50 transition-all disabled:opacity-50"
                        >
                          {loading ? <Loader className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                          <span>Vote Against</span>
                        </button>
                      </div>
                    )}

                    {proposal.status === 'passed' && !proposal.executed && timeLeft === 0 && (
                      <button
                        onClick={() => handleExecuteProposal(proposal.id)}
                        disabled={loading}
                        className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        {loading ? <Loader className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
                        <span>Execute Proposal</span>
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Council Tab */}
        {activeTab === 'council' && (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-purple-600/10 to-cyan-600/10 border border-purple-500/30 rounded-lg">
              <h3 className="text-xl text-white mb-2">Cosmic Council</h3>
              <p className="text-gray-400">
                Council members are the top token holders and most active governance participants
              </p>
            </div>

            <div className="p-6 bg-black/40 border border-cyan-500/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Your Voting Power</p>
                  <p className="text-3xl text-cyan-400">{parseFloat(votingPower).toFixed(2)}</p>
                  <p className="text-sm text-gray-400 mt-2">COSMIC Tokens: {parseFloat(tokenBalance).toFixed(2)}</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-lg">
                  <Users className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Your Proposals</p>
                  <p className="text-2xl text-white">
                    {proposals.filter(p => p.proposer.toLowerCase() === account?.toLowerCase()).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-6 bg-black/40 border border-white/10 rounded-lg text-center">
                <Vote className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <p className="text-sm text-gray-400 mb-2">Total Proposals</p>
                <p className="text-3xl text-white">{proposals.length}</p>
              </div>

              <div className="p-6 bg-black/40 border border-white/10 rounded-lg text-center">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <p className="text-sm text-gray-400 mb-2">Passed</p>
                <p className="text-3xl text-green-400">
                  {proposals.filter(p => p.status === 'passed').length}
                </p>
              </div>

              <div className="p-6 bg-black/40 border border-white/10 rounded-lg text-center">
                <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <p className="text-sm text-gray-400 mb-2">Active</p>
                <p className="text-3xl text-purple-400">
                  {proposals.filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-cyan-600/10 to-purple-600/10 border border-cyan-500/30 rounded-lg">
              <h3 className="text-lg text-white mb-4">How to Increase Your Influence</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-black/40 border border-white/10 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-cyan-600/20 border border-cyan-500/30 rounded-full flex items-center justify-center">
                      <span className="text-cyan-400">1</span>
                    </div>
                    <p className="text-white">Hold COSMIC Tokens</p>
                  </div>
                  <p className="text-sm text-gray-400">More tokens = more voting power</p>
                </div>

                <div className="p-4 bg-black/40 border border-white/10 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-purple-600/20 border border-purple-500/30 rounded-full flex items-center justify-center">
                      <span className="text-purple-400">2</span>
                    </div>
                    <p className="text-white">Stake Tokens</p>
                  </div>
                  <p className="text-sm text-gray-400">Staked tokens give 2x power</p>
                </div>

                <div className="p-4 bg-black/40 border border-white/10 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-pink-600/20 border border-pink-500/30 rounded-full flex items-center justify-center">
                      <span className="text-pink-400">3</span>
                    </div>
                    <p className="text-white">Create Proposals</p>
                  </div>
                  <p className="text-sm text-gray-400">Requires 1,000 COSMIC</p>
                </div>

                <div className="p-4 bg-black/40 border border-white/10 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-yellow-600/20 border border-yellow-500/30 rounded-full flex items-center justify-center">
                      <span className="text-yellow-400">4</span>
                    </div>
                    <p className="text-white">Vote on Proposals</p>
                  </div>
                  <p className="text-sm text-gray-400">Participate actively</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {proposals.filter(p => p.status !== 'active').length === 0 ? (
              <div className="p-12 bg-black/40 border border-white/10 rounded-lg text-center">
                <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl text-white mb-2">No Historical Proposals</h3>
                <p className="text-gray-400">Completed proposals will appear here</p>
              </div>
            ) : (
              proposals.filter(p => p.status !== 'active').map((proposal) => (
                <div
                  key={proposal.id}
                  className="p-6 bg-black/40 border border-white/10 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg text-white">{proposal.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider ${
                          proposal.status === 'passed' ? 'bg-green-600/20 border border-green-500/30 text-green-400' :
                          'bg-red-600/20 border border-red-500/30 text-red-400'
                        }`}>
                          {proposal.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{proposal.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-green-400">For: {parseFloat(proposal.votesFor).toFixed(2)}</span>
                        <span className="text-red-400">Against: {parseFloat(proposal.votesAgainst).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Create Proposal Modal */}
      {showCreateProposal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#1A0B2E] to-black border border-purple-500/30 rounded-lg max-w-2xl w-full p-8">
            <h3 className="text-2xl text-white mb-6">Create New Proposal</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Proposal Title</label>
                <input
                  type="text"
                  value={newProposal.title}
                  onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                  placeholder="Enter proposal title"
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-purple-400/50 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Description</label>
                <textarea
                  value={newProposal.description}
                  onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                  placeholder="Describe your proposal..."
                  rows={4}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-purple-400/50 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Proposal Type</label>
                <select
                  value={newProposal.proposalType}
                  onChange={(e) => setNewProposal({ ...newProposal, proposalType: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-purple-400/50 outline-none"
                >
                  <option value={0}>Resource Allocation</option>
                  <option value={1}>System Upgrade</option>
                  <option value={2}>Parameter Change</option>
                  <option value={3}>Emergency Action</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg mb-6">
              <p className="text-sm text-yellow-400">
                ⚠️ Creating a proposal requires 1000 COSMIC tokens
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Your balance: {parseFloat(tokenBalance).toFixed(2)} COSMIC
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateProposal(false)}
                className="flex-1 px-6 py-3 bg-black/40 border border-white/10 rounded-lg text-white hover:border-white/20 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProposal}
                disabled={loading || !newProposal.title || !newProposal.description}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Submit Proposal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}