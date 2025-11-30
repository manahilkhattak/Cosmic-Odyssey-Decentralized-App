import React from "react";
import { useState, useEffect } from 'react';
import { Users, HandMetal, Shield, MessageSquare, Plus, Loader, CheckCircle } from 'lucide-react';
import { useWeb3 } from './Web3Provider';

interface Alliance {
  id: string;
  name: string;
  leader: string;
  memberCount: number;
  isYourAlliance: boolean;
}

interface DiplomacyCenterProps {
  playerData: {
    influence: number;
  };
}

export function DiplomacyCenter({ playerData }: DiplomacyCenterProps) {
  const { cosmicOdyssey, account, isConnected } = useWeb3();
  const [activeTab, setActiveTab] = useState<'alliances' | 'your-alliance' | 'create'>('alliances');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  
  // Alliance data
  const [alliances, setAlliances] = useState<Alliance[]>([]);
  const [yourAllianceId, setYourAllianceId] = useState<string | null>(null);
  const [yourAlliance, setYourAlliance] = useState<Alliance | null>(null);
  const [allianceMembers, setAllianceMembers] = useState<string[]>([]);
  
  // Create alliance form
  const [newAllianceName, setNewAllianceName] = useState('');

  // Load alliances
  useEffect(() => {
    if (isConnected && cosmicOdyssey && account) {
      loadAlliances();
      loadYourAlliance();
    }
  }, [isConnected, cosmicOdyssey, account]);

  const loadAlliances = async () => {
    if (!cosmicOdyssey) return;
    
    try {
      const allianceCount = await cosmicOdyssey.allianceCount();
      const loadedAlliances: Alliance[] = [];
      
      for (let i = 1; i <= Number(allianceCount); i++) {
        try {
          const alliance = await cosmicOdyssey.alliances(i);
          
          if (alliance.exists) {
            const members = await cosmicOdyssey.getAllianceMembers(i);
            
            loadedAlliances.push({
              id: i.toString(),
              name: alliance.name,
              leader: alliance.leader,
              memberCount: members.length,
              isYourAlliance: alliance.leader.toLowerCase() === account?.toLowerCase()
            });
          }
        } catch (err) {
          console.error(`Error loading alliance ${i}:`, err);
        }
      }
      
      setAlliances(loadedAlliances);
    } catch (error) {
      console.error('Error loading alliances:', error);
    }
  };

  const loadYourAlliance = async () => {
    if (!cosmicOdyssey || !account) return;
    
    try {
      const allianceId = await cosmicOdyssey.playerAlliance(account);
      
      if (Number(allianceId) > 0) {
        setYourAllianceId(allianceId.toString());
        
        const alliance = await cosmicOdyssey.alliances(allianceId);
        const members = await cosmicOdyssey.getAllianceMembers(allianceId);
        
        setYourAlliance({
          id: allianceId.toString(),
          name: alliance.name,
          leader: alliance.leader,
          memberCount: members.length,
          isYourAlliance: alliance.leader.toLowerCase() === account.toLowerCase()
        });
        
        setAllianceMembers(members);
      } else {
        setYourAllianceId(null);
        setYourAlliance(null);
        setAllianceMembers([]);
      }
    } catch (error) {
      console.error('Error loading your alliance:', error);
    }
  };

  const handleCreateAlliance = async () => {
    if (!cosmicOdyssey || !newAllianceName.trim()) return;
    
    setLoading(true);
    setStatus('Creating alliance...');
    
    try {
      const tx = await cosmicOdyssey.createAlliance(newAllianceName);
      setStatus('Transaction sent! Waiting for confirmation...');
      await tx.wait();
      
      setStatus('✅ Alliance created successfully!');
      setNewAllianceName('');
      await loadAlliances();
      await loadYourAlliance();
      setActiveTab('your-alliance');
      
      setTimeout(() => setStatus(''), 3000);
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
      setTimeout(() => setStatus(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinAlliance = async (allianceId: string) => {
    if (!cosmicOdyssey) return;
    
    setLoading(true);
    setStatus('Joining alliance...');
    
    try {
      const tx = await cosmicOdyssey.joinAlliance(allianceId);
      setStatus('Transaction sent! Waiting for confirmation...');
      await tx.wait();
      
      setStatus('✅ Successfully joined alliance!');
      await loadAlliances();
      await loadYourAlliance();
      setActiveTab('your-alliance');
      
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
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2">Connect Wallet</h3>
          <p className="text-gray-400">Please connect your wallet to access diplomacy</p>
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
            <h2 className="text-3xl text-white mb-2">Diplomacy Center</h2>
            <p className="text-gray-400">Build alliances and forge diplomatic relations</p>
          </div>

          {!yourAllianceId && (
            <button
              onClick={() => setActiveTab('create')}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg text-white hover:shadow-lg hover:shadow-emerald-500/50 transition-all disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
              <span>Create Alliance</span>
            </button>
          )}
        </div>

        {/* Status Message */}
        {status && (
          <div className="p-4 bg-black/60 border border-cyan-500/30 rounded-lg text-white">
            {status}
          </div>
        )}

        {/* Influence Card */}
        <div className="p-6 bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Diplomatic Influence</p>
              <p className="text-4xl text-purple-400">{playerData.influence}</p>
              <p className="text-sm text-gray-400 mt-2">Use influence for diplomatic actions</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <Users className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Total Alliances</p>
                <p className="text-xl text-cyan-400">{alliances.length}</p>
              </div>
              {yourAllianceId && (
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Your Alliance</p>
                  <p className="text-xl text-green-400">{yourAlliance?.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-black/40 border border-white/10 rounded-lg">
          {(['alliances', 'your-alliance', 'create'] as const).map((tab) => {
            // Hide create tab if already in alliance
            if (tab === 'create' && yourAllianceId) return null;
            // Hide your-alliance tab if not in one
            if (tab === 'your-alliance' && !yourAllianceId) return null;
            
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-3 rounded-lg transition-all capitalize ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border border-emerald-400/50 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            );
          })}
        </div>

        {/* All Alliances Tab */}
        {activeTab === 'alliances' && (
          <div className="space-y-4">
            {alliances.length === 0 ? (
              <div className="p-12 bg-black/40 border border-white/10 rounded-lg text-center">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl text-white mb-2">No Alliances Yet</h3>
                <p className="text-gray-400 mb-6">Be the first to create an alliance!</p>
                {!yourAllianceId && (
                  <button
                    onClick={() => setActiveTab('create')}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg text-white hover:shadow-lg transition-all"
                  >
                    Create Alliance
                  </button>
                )}
              </div>
            ) : (
              alliances.map((alliance) => (
                <div
                  key={alliance.id}
                  className="p-6 bg-black/40 border border-white/10 rounded-lg hover:border-emerald-400/30 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-600/20 to-purple-600/20 border border-cyan-500/30 rounded-lg flex items-center justify-center">
                        <Users className="w-8 h-8 text-cyan-400" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl text-white">{alliance.name}</h3>
                          {alliance.isYourAlliance && (
                            <span className="px-3 py-1 bg-green-600/20 border border-green-500/30 rounded-full text-xs text-green-400 uppercase tracking-wider">
                              Your Alliance
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-400 mb-4">
                          Led by {alliance.leader.slice(0, 6)}...{alliance.leader.slice(-4)}
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Members</p>
                            <p className="text-lg text-cyan-400">{alliance.memberCount}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Alliance ID</p>
                            <p className="text-lg text-purple-400">#{alliance.id}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {!yourAllianceId && !alliance.isYourAlliance && (
                      <button
                        onClick={() => handleJoinAlliance(alliance.id)}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-lg text-white hover:border-emerald-400/50 transition-all disabled:opacity-50"
                      >
                        {loading ? <Loader className="w-4 h-4 animate-spin" /> : <HandMetal className="w-4 h-4" />}
                        <span>Join Alliance</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Your Alliance Tab */}
        {activeTab === 'your-alliance' && yourAlliance && (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-emerald-600/10 to-teal-600/10 border border-emerald-500/30 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-600/30 to-teal-600/30 border border-emerald-500/50 rounded-lg flex items-center justify-center">
                  <Users className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-2xl text-white">{yourAlliance.name}</h3>
                  <p className="text-gray-400">
                    {yourAlliance.isYourAlliance ? 'You are the leader' : 'Member'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-black/40 border border-white/10 rounded-lg">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Alliance ID</p>
                  <p className="text-2xl text-cyan-400">#{yourAlliance.id}</p>
                </div>
                <div className="p-4 bg-black/40 border border-white/10 rounded-lg">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Total Members</p>
                  <p className="text-2xl text-purple-400">{yourAlliance.memberCount}</p>
                </div>
                <div className="p-4 bg-black/40 border border-white/10 rounded-lg">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Your Role</p>
                  <p className="text-2xl text-yellow-400">
                    {yourAlliance.isYourAlliance ? 'Leader' : 'Member'}
                  </p>
                </div>
              </div>
            </div>

            {/* Alliance Members */}
            <div className="p-6 bg-black/40 border border-white/10 rounded-lg">
              <h3 className="text-lg text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                Alliance Members ({allianceMembers.length})
              </h3>
              
              <div className="space-y-3">
                {allianceMembers.map((member, index) => (
                  <div
                    key={member}
                    className="flex items-center justify-between p-4 bg-black/40 border border-white/10 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        member.toLowerCase() === yourAlliance.leader.toLowerCase()
                          ? 'bg-yellow-600/20 border-2 border-yellow-500/50'
                          : 'bg-cyan-600/20 border border-cyan-500/30'
                      }`}>
                        <span className={`text-sm font-bold ${
                          member.toLowerCase() === yourAlliance.leader.toLowerCase()
                            ? 'text-yellow-400'
                            : 'text-cyan-400'
                        }`}>
                          #{index + 1}
                        </span>
                      </div>
                      
                      <div>
                        <p className="text-white font-mono">
                          {member.slice(0, 6)}...{member.slice(-4)}
                          {member.toLowerCase() === account?.toLowerCase() && (
                            <span className="ml-2 text-xs text-cyan-400">(You)</span>
                          )}
                        </p>
                        <p className="text-sm text-gray-400">
                          {member.toLowerCase() === yourAlliance.leader.toLowerCase() ? 'Leader' : 'Member'}
                        </p>
                      </div>
                    </div>

                    {member.toLowerCase() === yourAlliance.leader.toLowerCase() && (
                      <Shield className="w-5 h-5 text-yellow-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Alliance Benefits */}
            <div className="p-6 bg-gradient-to-br from-cyan-600/10 to-purple-600/10 border border-cyan-500/30 rounded-lg">
              <h3 className="text-lg text-white mb-4">Alliance Benefits</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-black/40 border border-white/10 rounded-lg">
                  <p className="text-cyan-400 mb-1">🤝 Shared Resources</p>
                  <p className="text-gray-400">Pool resources with allies</p>
                </div>
                <div className="p-3 bg-black/40 border border-white/10 rounded-lg">
                  <p className="text-purple-400 mb-1">🛡️ Mutual Defense</p>
                  <p className="text-gray-400">Protected by alliance members</p>
                </div>
                <div className="p-3 bg-black/40 border border-white/10 rounded-lg">
                  <p className="text-green-400 mb-1">💰 Shared Treasury</p>
                  <p className="text-gray-400">Contribute to alliance funds</p>
                </div>
                <div className="p-3 bg-black/40 border border-white/10 rounded-lg">
                  <p className="text-yellow-400 mb-1">⚡ Combined Power</p>
                  <p className="text-gray-400">Stronger together</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Alliance Tab */}
        {activeTab === 'create' && !yourAllianceId && (
          <div className="max-w-2xl mx-auto">
            <div className="p-8 bg-gradient-to-br from-emerald-600/10 to-teal-600/10 border border-emerald-500/30 rounded-lg">
              <div className="text-center mb-8">
                <Users className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-2xl text-white mb-2">Create New Alliance</h3>
                <p className="text-gray-400">Start your own alliance and invite others to join</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">Alliance Name</label>
                <input
                  type="text"
                  value={newAllianceName}
                  onChange={(e) => setNewAllianceName(e.target.value)}
                  placeholder="Enter alliance name..."
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-emerald-400/50 outline-none"
                />
              </div>

              <button
                onClick={handleCreateAlliance}
                disabled={loading || !newAllianceName.trim()}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg text-white hover:shadow-lg hover:shadow-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Creating Alliance...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Create Alliance</span>
                  </>
                )}
              </button>

              <div className="mt-6 p-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg">
                <p className="text-sm text-yellow-400">
                  ℹ️ As the alliance leader, you'll be able to manage members and make strategic decisions
                </p>
              </div>
            </div>

            {/* Benefits Info */}
            <div className="mt-6 p-6 bg-black/40 border border-white/10 rounded-lg">
              <h3 className="text-lg text-white mb-4">Why Create an Alliance?</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white mb-1">Lead & Coordinate</p>
                    <p className="text-gray-400">Set strategy and coordinate with your members</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white mb-1">Grow Together</p>
                    <p className="text-gray-400">Build a powerful coalition of players</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white mb-1">Compete for Dominance</p>
                    <p className="text-gray-400">Challenge other alliances for supremacy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}