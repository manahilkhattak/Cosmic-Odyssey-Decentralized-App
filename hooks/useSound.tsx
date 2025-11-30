import { useCallback, useEffect, useState } from 'react';

export type SoundType =
  | 'navigation'      // Section switching
  | 'accept'          // Accept mission, heroic confirmation
  | 'vote-for'        // Vote for, support
  | 'vote-against'    // Vote against, oppose
  | 'travel'          // Warp, move, travel
  | 'mine'            // Mining, harvest, extract
  | 'buy'             // Purchase, buy
  | 'sell'            // Sell, trade
  | 'auto-optimize'   // System actions, auto functions
  | 'submit'          // Submit proposal, create
  | 'alliance-break'  // Break alliance, dramatic
  | 'alliance-form'   // Form alliance, positive
  | 'message'         // Send message, ping
  | 'negotiate';      // Diplomatic actions

// Working sound effects from Mixkit (tested and reliable)
const SOUND_EFFECTS: Record<SoundType, string> = {
  // Navigation - Soft UI click
  navigation: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  
  // Accept/Heroic - Success confirmation
  accept: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',
  
  // Vote For - Positive chime
  'vote-for': 'https://assets.mixkit.co/active_storage/sfx/1468/1468-preview.mp3',
  
  // Vote Against - Negative tone
  'vote-against': 'https://assets.mixkit.co/active_storage/sfx/1471/1471-preview.mp3',
  
  // Travel - Whoosh/warp
  travel: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  
  // Mine - Mechanical/drilling
  mine: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  
  // Buy - Purchase sound
  buy: 'https://assets.mixkit.co/active_storage/sfx/1466/1466-preview.mp3',
  
  // Sell - Transaction complete
  sell: 'https://assets.mixkit.co/active_storage/sfx/1467/1467-preview.mp3',
  
  // Auto-optimize - Digital beep
  'auto-optimize': 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3',
  
  // Submit - Confirm
  submit: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  
  // Alliance Break - Negative/dramatic
  'alliance-break': 'https://assets.mixkit.co/active_storage/sfx/2577/2577-preview.mp3',
  
  // Alliance Form - Positive/uplifting
  'alliance-form': 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  
  // Message - Notification ping
  message: 'https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3',
  
  // Negotiate - Calm UI tone
  negotiate: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'
};

// Audio cache for preloading
const audioCache: Map<SoundType, HTMLAudioElement> = new Map();
let preloadAttempted = false;

export function useSound() {
  const [sfxVolume, setSfxVolume] = useState(60);
  const [sfxMuted, setSfxMuted] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedVolume = localStorage.getItem('cosmic-sfx-volume');
    const savedMuted = localStorage.getItem('cosmic-sfx-muted');

    if (savedVolume !== null) setSfxVolume(Number(savedVolume));
    if (savedMuted !== null) setSfxMuted(savedMuted === 'true');
  }, []);

  // Preload sounds (only once)
  useEffect(() => {
    if (preloadAttempted) return;
    preloadAttempted = true;

    // Preload critical sounds
    const criticalSounds: SoundType[] = ['navigation', 'accept', 'vote-for', 'vote-against'];
    
    criticalSounds.forEach((type) => {
      const url = SOUND_EFFECTS[type];
      if (url && !audioCache.has(type)) {
        const audio = new Audio(url);
        audio.preload = 'auto';
        audio.volume = 0.01; // Very quiet for preload
        audioCache.set(type, audio);
      }
    });
  }, []);

  const playSound = useCallback((type: SoundType, volumeOverride?: number) => {
    if (sfxMuted) {
      console.log('SFX muted, skipping sound:', type);
      return;
    }

    try {
      const soundUrl = SOUND_EFFECTS[type];
      if (!soundUrl) {
        console.warn(`No sound effect found for type: ${type}`);
        return;
      }

      // Create new audio instance for this play
      const audio = new Audio(soundUrl);
      
      // Set volume
      const volume = volumeOverride !== undefined ? volumeOverride : sfxVolume / 100;
      audio.volume = Math.max(0, Math.min(1, volume));
      
      console.log(`Playing sound: ${type} at volume ${volume}`);
      
      // Play sound
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log(`Sound ${type} playing successfully`);
          })
          .catch(error => {
            console.warn(`Failed to play sound ${type}:`, error);
          });
      }

      // Cleanup after playing
      audio.addEventListener('ended', () => {
        audio.remove();
      });
    } catch (error) {
      console.error('Error in playSound:', error);
    }
  }, [sfxMuted, sfxVolume]);

  const updateVolume = useCallback((volume: number) => {
    setSfxVolume(volume);
    localStorage.setItem('cosmic-sfx-volume', String(volume));
    console.log('SFX volume updated to:', volume);
  }, []);

  const toggleMute = useCallback(() => {
    const newMuted = !sfxMuted;
    setSfxMuted(newMuted);
    localStorage.setItem('cosmic-sfx-muted', String(newMuted));
    console.log('SFX muted:', newMuted);
  }, [sfxMuted]);

  return { 
    playSound, 
    sfxVolume, 
    sfxMuted, 
    updateVolume, 
    toggleMute 
  };
}

// Helper hook for creating sound-enabled buttons
export function useSoundButton(soundType: SoundType, volumeOverride?: number) {
  const { playSound } = useSound();

  const handleClick = useCallback((callback?: () => void) => {
    playSound(soundType, volumeOverride);
    if (callback) {
      // Small delay to ensure sound starts before action
      setTimeout(callback, 50);
    }
  }, [playSound, soundType, volumeOverride]);

  return handleClick;
}
