import React from "react";
import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere, Text } from '@react-three/drei';
import { Search, MapPin, Rocket, Zap, Eye, X, Loader } from 'lucide-react';
import { useWeb3 } from './Web3Provider';
import { parseEther, formatEther } from 'ethers';

interface Planet {
  id: string;
  name: string;
  position: [number, number, number];
  size: number;
  color: string;
  biome: string;
  resources: { type: string; abundance: number }[];
  discovered: boolean;
  owned: boolean;
  owner?: string;
}

interface NFT {
  tokenId: string;
  name: string;
  nftType: number;
  speed: number;
}

function PlanetMesh({ planet, onClick, selected }: { planet: Planet; onClick: () => void; selected: boolean }) {
  const meshRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      if (selected || hovered) {
        meshRef.current.scale.x = meshRef.current.scale.x + (1.3 - meshRef.current.scale.x) * 0.1;
        meshRef.current.scale.y = meshRef.current.scale.y + (1.3 - meshRef.current.scale.y) * 0.1;
        meshRef.current.scale.z = meshRef.current.scale.z + (1.3 - meshRef.current.scale.z) * 0.1;
      } else {
        meshRef.current.scale.x = meshRef.current.scale.x + (1 - meshRef.current.scale.x) * 0.1;
        meshRef.current.scale.y = meshRef.current.scale.y + (1 - meshRef.current.scale.y) * 0.1;
        meshRef.current.scale.z = meshRef.current.scale.z + (1 - meshRef.current.scale.z) * 0.1;
      }
    }
  });

  return (
    <group position={planet.position}>
      <Sphere
        ref={meshRef}
        args={[planet.size, 32, 32]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={planet.color}
          emissive={planet.color}
          emissiveIntensity={selected || hovered ? 0.5 : 0.2}
          roughness={0.7}
          metalness={0.3}
        />
      </Sphere>

      {(selected || hovered) && (
        <Text
          position={[0, planet.size + 0.5, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {planet.name}
        </Text>
      )}

      {selected && (
        <>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[planet.size + 0.3, planet.size + 0.35, 32]} />
            <meshBasicMaterial color="#00D4FF" transparent opacity={0.6} />
          </mesh>
        </>
      )}
    </group>
  );
}

function AnimatedStarfield() {
  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Stars radius={100} depth={50} count={2000} factor={6} saturation={0} fade speed={2} />
    </>
  );
}

interface GalaxyExplorerProps {
  onResourceUpdate: (resources: any) => void;
}

export function GalaxyExplorer({ onResourceUpdate }: GalaxyExplorerProps) {
  const { cosmicNFT, cosmicToken, account, isConnected } = useWeb3();
  
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [userNFTs, setUserNFTs] = useState<NFT[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  // Initialize planets with persistence
  useEffect(() => {
    const initialPlanets: Planet[] = [
      {
        id: '1',
        name: 'Terra Nova',
        position: [-5, 0, 0],
        size: 1,
        color: '#4CAF50',
        biome: 'Lush Jungle',
        resources: [
          { type: 'Energy', abundance: 85 },
          { type: 'Minerals', abundance: 60 }
        ],
        discovered: false,
        owned: false
      },
      {
        id: '2',
        name: 'Cryo Primus',
        position: [8, 3, -4],
        size: 0.8,
        color: '#64B5F6',
        biome: 'Arctic Ice',
        resources: [
          { type: 'Dark Matter', abundance: 45 },
          { type: 'Kryptonite', abundance: 30 }
        ],
        discovered: false,
        owned: false
      },
      {
        id: '3',
        name: 'Pyro Ignis',
        position: [3, -4, 8],
        size: 1.2,
        color: '#FF5722',
        biome: 'Volcanic',
        resources: [
          { type: 'Neutronium', abundance: 90 },
          { type: 'Energy', abundance: 75 }
        ],
        discovered: false,
        owned: false
      },
      {
        id: '4',
        name: 'Techtonica',
        position: [-7, 5, 6],
        size: 0.9,
        color: '#9C27B0',
        biome: 'Ancient Ruins',
        resources: [
          { type: 'Dark Matter', abundance: 95 },
          { type: 'Artifacts', abundance: 80 }
        ],
        discovered: false,
        owned: false
      },
      {
        id: '5',
        name: 'Aqua Sphere',
        position: [0, -6, -8],
        size: 1.1,
        color: '#00BCD4',
        biome: 'Ocean World',
        resources: [
          { type: 'Energy', abundance: 70 },
          { type: 'Minerals', abundance: 55 }
        ],
        discovered: false,
        owned: false
      }
    ];

    // Load saved planet states from localStorage
    const savedPlanets = localStorage.getItem('cosmic-planets');
    if (savedPlanets) {
      try {
        const parsed = JSON.parse(savedPlanets);
        // Merge saved states with initial data
        const merged = initialPlanets.map(planet => {
          const saved = parsed.find((p: Planet) => p.id === planet.id);
          return saved ? { ...planet, discovered: saved.discovered, owned: saved.owned, owner: saved.owner } : planet;
        });
        setPlanets(merged);
      } catch (e) {
        setPlanets(initialPlanets);
      }
    } else {
      setPlanets(initialPlanets);
    }
  }, []);

  // Save planets to localStorage whenever they change
  useEffect(() => {
    if (planets.length > 0) {
      localStorage.setItem('cosmic-planets', JSON.stringify(planets));
    }
  }, [planets]);

  // Load user's spaceships
  useEffect(() => {
    if (isConnected && cosmicNFT && account) {
      loadUserSpaceships();
    }
  }, [isConnected, cosmicNFT, account]);

  const loadUserSpaceships = async () => {
    if (!cosmicNFT || !account) return;
    
    try {
      const nftIds = await cosmicNFT.getNFTsByOwner(account);
      const spaceships: NFT[] = [];
      
      for (let i = 0; i < nftIds.length; i++) {
        const tokenId = nftIds[i].toString();
        const metadata = await cosmicNFT.nftMetadata(tokenId);
        
        // Only spaceships (type 1)
        if (Number(metadata.nftType) === 1) {
          spaceships.push({
            tokenId,
            name: `Spaceship #${tokenId}`,
            nftType: Number(metadata.nftType),
            speed: Number(metadata.speed)
          });
        }
      }
      
      setUserNFTs(spaceships);
      if (spaceships.length > 0 && !selectedNFT) {
        setSelectedNFT(spaceships[0]);
      }
    } catch (error) {
      console.error('Error loading spaceships:', error);
    }
  };

  const handleDiscover = async () => {
    if (!selectedPlanet || !cosmicNFT || !account) return;
    
    if (selectedPlanet.discovered) {
      setStatus('⚠️ Planet already discovered!');
      setTimeout(() => setStatus(''), 3000);
      return;
    }

    if (userNFTs.length === 0) {
      setStatus('⚠️ You need a Spaceship NFT to discover planets!');
      setTimeout(() => setStatus(''), 5000);
      return;
    }

    setLoading(true);
    setStatus('🔍 Scanning planet...');
    
    try {
      // Add exploration experience to NFT
      const tx = await cosmicNFT.addExperience(
        selectedNFT!.tokenId,
        100,
        'exploration'
      );
      
      setStatus('Transaction sent! Waiting for confirmation...');
      await tx.wait();
      
      // Update local state
      setPlanets(prev => prev.map(p => 
        p.id === selectedPlanet.id ? { ...p, discovered: true } : p
      ));
      
      setStatus('✅ Planet discovered! Earned 100 XP');
      setTimeout(() => setStatus(''), 3000);
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
      setTimeout(() => setStatus(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleTravel = async () => {
    if (!selectedPlanet || !selectedNFT || !cosmicToken) return;
    
    if (!selectedPlanet.discovered) {
      setStatus('⚠️ Discover the planet first!');
      setTimeout(() => setStatus(''), 3000);
      return;
    }

    setLoading(true);
    setStatus('🚀 Traveling to planet...');
    
    try {
      // Travel costs 10 COSMIC tokens
      const balance = await cosmicToken.balanceOf(account);
      if (Number(formatEther(balance)) < 10) {
        setStatus('❌ Insufficient COSMIC tokens! Need 10 COSMIC to travel.');
        setTimeout(() => setStatus(''), 5000);
        setLoading(false);
        return;
      }

      // Burn tokens for travel
      const tx = await cosmicToken.burn(parseEther('10'));
      setStatus('Transaction sent! Waiting for confirmation...');
      await tx.wait();
      
      // Add travel experience
      await cosmicNFT.addExperience(selectedNFT.tokenId, 50, 'mission');
      
      setStatus('✅ Arrived! Earned 50 XP');
      setTimeout(() => setStatus(''), 3000);
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
      setTimeout(() => setStatus(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleMine = async () => {
    if (!selectedPlanet || !cosmicToken || !account) return;
    
    if (!selectedPlanet.discovered) {
      setStatus('⚠️ Discover the planet first!');
      setTimeout(() => setStatus(''), 3000);
      return;
    }

    setLoading(true);
    setStatus('⛏️ Mining resources...');
    
    try {
      // Mining earns COSMIC tokens based on planet resources
      const resource = selectedPlanet.resources[0];
      const miningReward = Math.floor(resource.abundance / 10); // 10-95 tokens
      
      // Mine tokens (requires waiting period)
      const lastMined = await cosmicToken.lastMiningTime(account);
      const now = Math.floor(Date.now() / 1000);
      const cooldown = Number(lastMined) + 3600 - now;
      
      if (cooldown > 0) {
        setStatus(`⏳ Mining cooldown: ${Math.floor(cooldown / 60)} minutes remaining`);
        setTimeout(() => setStatus(''), 5000);
        setLoading(false);
        return;
      }

      const tx = await cosmicToken.mineCosmicTokens();
      setStatus('Transaction sent! Waiting for confirmation...');
      await tx.wait();
      
      setStatus(`✅ Mined ${miningReward} COSMIC tokens!`);
      setTimeout(() => setStatus(''), 3000);
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
      setTimeout(() => setStatus(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimPlanet = async () => {
    if (!selectedPlanet || !cosmicToken || !account) return;
    
    if (!selectedPlanet.discovered) {
      setStatus('⚠️ Discover the planet first!');
      setTimeout(() => setStatus(''), 3000);
      return;
    }

    if (selectedPlanet.owned) {
      setStatus('⚠️ Planet already claimed!');
      setTimeout(() => setStatus(''), 3000);
      return;
    }

    setLoading(true);
    setStatus('🏴 Claiming planet...');
    
    try {
      // Claiming costs 100 COSMIC tokens
      const balance = await cosmicToken.balanceOf(account);
      if (Number(formatEther(balance)) < 100) {
        setStatus('❌ Insufficient COSMIC tokens! Need 100 COSMIC to claim.');
        setTimeout(() => setStatus(''), 5000);
        setLoading(false);
        return;
      }

      const tx = await cosmicToken.burn(parseEther('100'));
      setStatus('Transaction sent! Waiting for confirmation...');
      await tx.wait();
      
      // Update local state
      setPlanets(prev => prev.map(p => 
        p.id === selectedPlanet.id ? { ...p, owned: true, owner: account } : p
      ));
      
      setStatus('✅ Planet claimed successfully!');
      setTimeout(() => setStatus(''), 3000);
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
      setTimeout(() => setStatus(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlanets = planets.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.biome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isConnected) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2">Connect Wallet</h3>
          <p className="text-gray-400">Please connect your wallet to explore the galaxy</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* 3D Galaxy Canvas */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6B46C1" />

          <AnimatedStarfield />

          {filteredPlanets.map((planet) => (
            <PlanetMesh
              key={planet.id}
              planet={planet}
              onClick={() => setSelectedPlanet(planet)}
              selected={selectedPlanet?.id === planet.id}
            />
          ))}

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={30}
          />
        </Canvas>
      </div>

      {/* Galaxy Controls Overlay */}
      <div className="absolute top-6 right-6 w-96 space-y-4">
        {/* Status Message */}
        {status && (
          <div className="p-4 bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-lg text-white">
            {status}
          </div>
        )}

        {/* Search Bar */}
        <div className="p-4 bg-black/60 backdrop-blur-xl border border-cyan-500/30 rounded-lg">
          <div className="flex items-center gap-3 px-4 py-3 bg-black/40 border border-white/10 rounded-lg">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search star systems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-white outline-none placeholder-gray-500"
            />
          </div>
        </div>

        {/* Spaceship Selector */}
        <div className="p-4 bg-black/60 backdrop-blur-xl border border-purple-500/30 rounded-lg">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Active Spaceship</p>
          {userNFTs.length > 0 ? (
            <select
              value={selectedNFT?.tokenId || ''}
              onChange={(e) => setSelectedNFT(userNFTs.find(n => n.tokenId === e.target.value) || null)}
              className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white outline-none"
            >
              {userNFTs.map(nft => (
                <option key={nft.tokenId} value={nft.tokenId}>
                  {nft.name} (Speed: {nft.speed})
                </option>
              ))}
            </select>
          ) : (
            <p className="text-sm text-gray-400">No spaceships found. Mint one in NFT Gallery!</p>
          )}
        </div>

        {/* Selected Planet Info */}
        {selectedPlanet && (
          <div className="relative p-6 bg-black/60 backdrop-blur-xl border border-cyan-500/30 rounded-lg">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPlanet(null)}
              className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-red-500/90 hover:bg-red-600 border-2 border-red-400 rounded-full text-white transition-all hover:scale-110 active:scale-95 shadow-lg shadow-red-500/50 z-10"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl text-white mb-1">{selectedPlanet.name}</h3>
                <p className="text-sm text-cyan-400">{selectedPlanet.biome}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs ${
                selectedPlanet.owned
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : selectedPlanet.discovered
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              }`}>
                {selectedPlanet.owned ? 'OWNED' : selectedPlanet.discovered ? 'DISCOVERED' : 'UNKNOWN'}
              </div>
            </div>

            {selectedPlanet.discovered ? (
              <>
                <div className="mb-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Resources</p>
                  <div className="space-y-2">
                    {selectedPlanet.resources.map((resource, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-300">{resource.type}</span>
                          <span className="text-sm text-cyan-400">{resource.abundance}%</span>
                        </div>
                        <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-600 to-purple-600 rounded-full"
                            style={{ width: `${resource.abundance}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button
                    onClick={handleTravel}
                    disabled={loading || !selectedNFT}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-500/30 rounded-lg text-white hover:border-cyan-400/50 transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
                    <span className="text-sm">Travel (10)</span>
                  </button>

                  <button
                    onClick={handleMine}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-lg text-white hover:border-yellow-400/50 transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    <span className="text-sm">Mine</span>
                  </button>
                </div>

                {!selectedPlanet.owned && (
                  <button
                    onClick={handleClaimPlanet}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-white hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                    <span>Claim Planet (100 COSMIC)</span>
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={handleDiscover}
                disabled={loading || !selectedNFT}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50"
              >
                {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Eye className="w-5 h-5" />}
                <span>Discover Planet</span>
              </button>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="p-4 bg-black/60 backdrop-blur-xl border border-cyan-500/30 rounded-lg">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Galaxy Legend</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-300">Owned Planets</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-gray-300">Discovered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500" />
              <span className="text-gray-300">Unknown</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
        <div className="px-6 py-3 bg-black/60 backdrop-blur-xl border border-cyan-500/30 rounded-lg">
          <p className="text-xs text-gray-400 uppercase mb-1">Planets Discovered</p>
          <p className="text-2xl text-cyan-400">{planets.filter(p => p.discovered).length}/{planets.length}</p>
        </div>

        <div className="px-6 py-3 bg-black/60 backdrop-blur-xl border border-purple-500/30 rounded-lg">
          <p className="text-xs text-gray-400 uppercase mb-1">Planets Owned</p>
          <p className="text-2xl text-purple-400">{planets.filter(p => p.owned).length}/{planets.length}</p>
        </div>

        <div className="px-6 py-3 bg-black/60 backdrop-blur-xl border border-green-500/30 rounded-lg">
          <p className="text-xs text-gray-400 uppercase mb-1">Active Spaceship</p>
          <p className="text-lg text-green-400">{selectedNFT ? `#${selectedNFT.tokenId}` : 'None'}</p>
        </div>
      </div>
    </div>
  );
}