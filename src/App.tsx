import { useState } from 'react';
import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { LayoutGrid, Music, Gamepad2, Info } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col font-sans">
      {/* Background Gradients */}
      <div className="fixed inset-0 bg-[#050505] z-[-1]" />
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-blue/10 blur-[120px] rounded-full z-[-1]" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-neon-pink/10 blur-[120px] rounded-full z-[-1]" />

      {/* Navigation / Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between z-10 glass border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-neon-blue/20 flex items-center justify-center border border-neon-blue/40 shadow-[0_0_10px_rgba(0,242,255,0.2)]">
            <Gamepad2 className="text-neon-blue" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter uppercase leading-none">Rhythm</h1>
            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-mono">Neon Arcade</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'Arcade', icon: LayoutGrid, active: true },
            { label: 'Playlist', icon: Music, active: false },
            { label: 'About', icon: Info, active: false },
          ].map((item) => (
            <button 
              key={item.label}
              className={`flex items-center gap-2 text-xs uppercase tracking-widest font-bold transition-colors ${item.active ? 'text-neon-blue' : 'text-white/40 hover:text-white'}`}
            >
              <item.icon size={14} /> {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="px-3 py-1 rounded bg-white/5 border border-white/10 hidden sm:block">
            <span className="text-[10px] text-white/40 font-mono uppercase mr-2">Status</span>
            <span className="text-[10px] text-neon-green font-mono uppercase animate-pulse">Online</span>
          </div>
          <button className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
            <LayoutGrid size={16} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row p-4 sm:p-8 gap-8 items-center lg:items-start justify-center max-w-7xl mx-auto w-full relative z-10">
        
        {/* Left Side: Game Stats (lg only) */}
        <aside className="hidden lg:flex flex-col gap-6 w-64 pt-8">
          <div className="glass rounded-2xl p-6 border border-white/5">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-mono mb-4">Game Stats</h4>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] text-white/40 uppercase mb-1">Current Score</p>
                <motion.p 
                  key={score}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="text-4xl font-black font-mono text-neon-blue"
                >
                  {score.toString().padStart(4, '0')}
                </motion.p>
              </div>
              <div className="h-px bg-white/5" />
              <div>
                <p className="text-[10px] text-white/40 uppercase mb-1">High Score</p>
                <p className="text-2xl font-black font-mono text-white/80">{highScore.toString().padStart(4, '0')}</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/5">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-mono mb-4">World Rank</h4>
            <div className="flex items-end gap-2 leading-none">
              <span className="text-4xl font-bold text-white tracking-widest">#102</span>
              <span className="text-neon-pink text-xs font-bold mb-1">+4</span>
            </div>
          </div>
        </aside>

        {/* Center: The Game */}
        <section className="flex-1 flex flex-col items-center">
          <div className="lg:hidden w-full flex justify-between mb-6 px-4">
            <div className="text-left">
              <p className="text-[10px] text-white/40 uppercase">Score</p>
              <p className="text-2xl font-black font-mono text-neon-blue">{score.toString().padStart(4, '0')}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/40 uppercase">High</p>
              <p className="text-2xl font-black font-mono text-white/80">{highScore.toString().padStart(4, '0')}</p>
            </div>
          </div>

          <SnakeGame isPlaying={true} onScoreUpdate={handleScoreUpdate} />
        </section>

        {/* Right Side: Music Player */}
        <aside className="w-full lg:w-96 flex flex-col gap-6 pt-0 lg:pt-8">
          <MusicPlayer />
          
          <div className="glass rounded-2xl p-6 border border-white/5 hidden lg:block">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-neon-green" />
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-mono">Live Session Data</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-white/40 uppercase mb-1">FPS</p>
                <p className="text-sm font-mono text-white">60.0</p>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase mb-1">Latency</p>
                <p className="text-sm font-mono text-neon-green">14ms</p>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer / Mobile Bar */}
      <footer className="w-full p-4 mt-auto glass border-t border-white/5 opacity-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] text-white/30 uppercase tracking-[0.2em] font-mono">
          <p>© 2024 NEON ARCADIA</p>
          <div className="flex gap-4">
            <span>Server: ASIA-EAST-1</span>
            <span>v1.0.4-BETA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
