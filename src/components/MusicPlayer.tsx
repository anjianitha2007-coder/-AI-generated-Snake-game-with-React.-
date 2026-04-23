import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Music, Volume2 } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Cybernetic Pulse",
    artist: "AI Construct v1",
    duration: 184,
    color: "#ff00ff", // Neon Pink
    cover: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=300&h=300&fit=crop&q=80"
  },
  {
    id: 2,
    title: "Vapor Overdrive",
    artist: "Synth Mind 42",
    duration: 212,
    color: "#00f2ff", // Neon Blue
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop&q=80"
  },
  {
    id: 3,
    title: "Neon Horizon",
    artist: "Digital Echo",
    duration: 156,
    color: "#39ff14", // Neon Green
    cover: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=300&h=300&fit=crop&q=80"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const track = TRACKS[currentTrackIndex];

  // Simulating playback progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => (prev + 1) % track.duration);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, track.duration]);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md">
      <div className="glass rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden group">
        {/* Animated Background Glow */}
        <motion.div 
          animate={{
            scale: isPlaying ? [1, 1.2, 1] : 1,
            opacity: isPlaying ? [0.1, 0.2, 0.1] : 0.1
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px]"
          style={{ backgroundColor: track.color }}
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-white/40">Now Playing</span>
            <div className="flex gap-1">
              {[1, 2, 3].map(i => (
                <motion.div 
                  key={i}
                  animate={{ height: isPlaying ? [4, 12, 4] : 4 }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                  className="w-0.5 bg-neon-blue rounded-full"
                />
              ))}
            </div>
          </div>

          <div className="flex gap-6 items-center">
            {/* Album Art */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={track.id}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    src={track.cover}
                    alt={track.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
              </div>
              {isPlaying && (
                <motion.div 
                  layoutId="glow"
                  className="absolute -inset-2 blur-xl opacity-30 rounded-2xl -z-10"
                  style={{ backgroundColor: track.color }}
                />
              )}
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h3 className="text-xl font-bold text-white truncate font-sans tracking-tight mb-1">{track.title}</h3>
                  <p className="text-sm text-white/50 truncate font-sans">{track.artist}</p>
                </motion.div>
              </AnimatePresence>
              
              <div className="mt-4 flex items-center gap-2 text-white/30">
                <Music size={12} />
                <span className="text-[10px] uppercase tracking-widest font-mono">24-bit Lossless</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="h-1 w-full bg-white/5 rounded-full relative overflow-hidden">
              <motion.div 
                className="h-full absolute left-0 top-0 rounded-full"
                animate={{ width: `${(progress / track.duration) * 100}%` }}
                style={{ backgroundColor: track.color }}
              />
            </div>
            <div className="flex justify-between mt-2 font-mono text-[10px] text-white/30">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(track.duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={handlePrev}
                className="text-white/40 hover:text-white transition-colors p-2"
              >
                <SkipBack size={20} fill="currentColor" />
              </button>
              
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 relative group"
                style={{ backgroundColor: track.color }}
              >
                <div className="relative z-10 text-black">
                  {isPlaying ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" className="ml-1" />}
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-full transition-opacity" />
                <div className="absolute -inset-2 blur-xl opacity-40 group-hover:opacity-60 transition-opacity" style={{ backgroundColor: track.color }} />
              </button>

              <button 
                onClick={handleNext}
                className="text-white/40 hover:text-white transition-colors p-2"
              >
                <SkipForward size={20} fill="currentColor" />
              </button>
            </div>

            <div className="flex items-center gap-2 group/vol">
              <Volume2 size={16} className="text-white/40 group-hover/vol:text-white transition-colors" />
              <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-white/30" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
