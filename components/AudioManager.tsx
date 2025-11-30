import React from "react";  
import { useEffect, useState, useRef } from "react";
import { Volume2, VolumeX, Music, Speaker } from "lucide-react";
import { useSound } from "../hooks/useSound";

interface AudioManagerProps {
  currentView: string;
}

export function AudioManager({
  currentView,
}: AudioManagerProps) {
  const [musicMuted, setMusicMuted] = useState(false);
  const [musicVolume, setMusicVolume] = useState(35);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [musicHovered, setMusicHovered] = useState(false);
  const [sfxHovered, setSfxHovered] = useState(false);
  const {
    playSound,
    sfxVolume,
    sfxMuted,
    updateVolume,
    toggleMute,
  } = useSound();

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedMusicMuted = localStorage.getItem(
      "cosmic-music-muted",
    );
    const savedMusicVolume = localStorage.getItem(
      "cosmic-music-volume",
    );
    const savedHasInteracted = localStorage.getItem(
      "cosmic-music-interacted",
    );

    if (savedMusicMuted !== null)
      setMusicMuted(savedMusicMuted === "true");
    if (savedMusicVolume !== null)
      setMusicVolume(Number(savedMusicVolume));
    if (savedHasInteracted !== null)
      setHasInteracted(savedHasInteracted === "true");
  }, []);

  // Initialize audio element with your custom music
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = musicVolume / 100;
      audioRef.current.preload = "auto";

      // ⭐ CHANGE THIS LINE TO YOUR AUDIO URL OR FILE PATH ⭐
      audioRef.current.src =
        "https://cdn.jsdelivr.net/gh/i235567-boop/audio-files@main/bgm.mp3";

      // Alternative CDN options for the same GitHub file:
      // Option 2: "https://raw.githack.com/i235567-boop/audio-files/main/bgm.mp3"
      // 
      // Examples:
      // External URL: audioRef.current.src = 'https://example.com/your-music.mp3';
      // Local file: audioRef.current.src = '/audio/space-music.mp3';

      audioRef.current.addEventListener("play", () => {
        console.log("Music started playing");
        setIsPlaying(true);
      });

      audioRef.current.addEventListener("pause", () => {
        console.log("Music paused");
        setIsPlaying(false);
      });

      audioRef.current.addEventListener("error", (e) => {
        console.error("Audio loading error:", e);
        console.error(
          "Make sure your audio URL is correct and has CORS enabled",
        );
        setIsPlaying(false);
      });

      audioRef.current.addEventListener(
        "canplaythrough",
        () => {
          console.log("Audio loaded and ready to play");
        },
      );
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicMuted
        ? 0
        : musicVolume / 100;
    }
  }, [musicVolume, musicMuted]);

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setMusicMuted(true);
      localStorage.setItem("cosmic-music-muted", "true");
    } else {
      try {
        setMusicMuted(false);
        localStorage.setItem("cosmic-music-muted", "false");
        localStorage.setItem("cosmic-music-interacted", "true");
        await audioRef.current.play();
        setHasInteracted(true);
      } catch (error) {
        console.error("Failed to play music:", error);
      }
    }
  };

  const handleMusicVolumeChange = (newVolume: number) => {
    setMusicVolume(newVolume);
    localStorage.setItem(
      "cosmic-music-volume",
      String(newVolume),
    );

    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }

    // If volume increased from 0 and music was muted, unmute it
    if (
      newVolume > 0 &&
      musicMuted &&
      hasInteracted &&
      audioRef.current
    ) {
      setMusicMuted(false);
      audioRef.current
        .play()
        .catch((err) => console.error("Play error:", err));
    }
  };

  return (
    <div className="fixed bottom-24 right-8 z-30 space-y-3">
      {/* Background Music Control - Icon with Hover Expand */}
      <div
        className={`flex items-center gap-3 px-3 py-3 bg-black/80 backdrop-blur-xl border border-purple-500/50 rounded-xl shadow-2xl shadow-purple-500/30 transition-all duration-300 ${
          musicHovered ? "w-auto" : "w-auto"
        }`}
        onMouseEnter={() => setMusicHovered(true)}
        onMouseLeave={() => setMusicHovered(false)}
      >
        <button
          onClick={toggleMusic}
          className="p-2 hover:bg-purple-600/20 rounded-lg transition-all hover:scale-110 active:scale-95 shrink-0"
          title={isPlaying ? "Pause Music" : "Play Music"}
        >
          {isPlaying ? (
            <Music className="w-5 h-5 text-purple-400 animate-pulse" />
          ) : musicMuted ? (
            <VolumeX className="w-5 h-5 text-gray-500" />
          ) : (
            <Volume2 className="w-5 h-5 text-purple-400" />
          )}
        </button>

        <div
          className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${
            musicHovered
              ? "max-w-[200px] opacity-100"
              : "max-w-0 opacity-0"
          }`}
        >
          <input
            type="range"
            min="0"
            max="100"
            value={musicVolume}
            onChange={(e) =>
              handleMusicVolumeChange(Number(e.target.value))
            }
            className="w-32 h-2 bg-purple-900/50 rounded-lg appearance-none cursor-pointer 
              [&::-webkit-slider-thumb]:appearance-none 
              [&::-webkit-slider-thumb]:w-4 
              [&::-webkit-slider-thumb]:h-4 
              [&::-webkit-slider-thumb]:bg-gradient-to-r
              [&::-webkit-slider-thumb]:from-purple-400
              [&::-webkit-slider-thumb]:to-pink-400
              [&::-webkit-slider-thumb]:rounded-full 
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:shadow-purple-500/50
              [&::-webkit-slider-thumb]:hover:scale-110
              [&::-webkit-slider-thumb]:transition-transform"
          />
          <span className="text-sm text-purple-400 font-mono font-semibold min-w-[3ch] text-right">
            {musicVolume}%
          </span>
        </div>
      </div>

      {/* Sound Effects Control - Icon with Hover Expand */}
      <div
        className={`flex items-center gap-3 px-3 py-3 bg-black/80 backdrop-blur-xl border border-cyan-500/50 rounded-xl shadow-2xl shadow-cyan-500/30 transition-all duration-300 ${
          sfxHovered ? "w-auto" : "w-auto"
        }`}
        onMouseEnter={() => setSfxHovered(true)}
        onMouseLeave={() => setSfxHovered(false)}
      >
        <button
          onClick={toggleMute}
          className="p-2 hover:bg-cyan-600/20 rounded-lg transition-all hover:scale-110 active:scale-95 shrink-0"
          title={sfxMuted ? "Unmute SFX" : "Mute SFX"}
        >
          {sfxMuted ? (
            <VolumeX className="w-5 h-5 text-gray-500" />
          ) : (
            <Speaker className="w-5 h-5 text-cyan-400" />
          )}
        </button>

        <div
          className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${
            sfxHovered
              ? "max-w-[200px] opacity-100"
              : "max-w-0 opacity-0"
          }`}
        >
          <input
            type="range"
            min="0"
            max="100"
            value={sfxVolume}
            onChange={(e) =>
              updateVolume(Number(e.target.value))
            }
            className="w-32 h-2 bg-cyan-900/50 rounded-lg appearance-none cursor-pointer 
              [&::-webkit-slider-thumb]:appearance-none 
              [&::-webkit-slider-thumb]:w-4 
              [&::-webkit-slider-thumb]:h-4 
              [&::-webkit-slider-thumb]:bg-gradient-to-r
              [&::-webkit-slider-thumb]:from-cyan-400
              [&::-webkit-slider-thumb]:to-blue-400
              [&::-webkit-slider-thumb]:rounded-full 
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:shadow-cyan-500/50
              [&::-webkit-slider-thumb]:hover:scale-110
              [&::-webkit-slider-thumb]:transition-transform"
          />
          <span className="text-sm text-cyan-400 font-mono font-semibold min-w-[3ch] text-right">
            {sfxVolume}%
          </span>
        </div>
      </div>

      {/* Status Indicator */}
      {!hasInteracted && !isPlaying && (
        <div className="px-4 py-2 bg-yellow-600/20 backdrop-blur-xl border border-yellow-500/40 rounded-lg text-center animate-pulse">
          <p className="text-xs text-yellow-300">
            👆 Click to start music!
          </p>
        </div>
      )}
    </div>
  );
}