import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play, Pause } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

type Point = { x: number; y: number };

interface SnakeGameProps {
  isPlaying: boolean;
  onScoreUpdate: (score: number) => void;
}

export default function SnakeGame({ isPlaying, onScoreUpdate }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food spawned on snake
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection({ x: 0, y: -1 });
    setIsGameOver(false);
    setScore(0);
    setGameActive(true);
    onScoreUpdate(0);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || !gameActive) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        setGameActive(false);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if ate food
      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreUpdate(newScore);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, gameActive, score, generateFood, onScoreUpdate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameActive && !isGameOver) {
      const speed = Math.max(50, INITIAL_SPEED - (score / 10) * SPEED_INCREMENT);
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameActive, isGameOver, moveSnake, score]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Game Window */}
      <div 
        className="relative glass rounded-xl border-2 border-white/10 p-1 w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] overflow-hidden shadow-2xl"
        id="snake-container"
      >
        <div 
          className="grid w-full h-full"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` 
          }}
        >
          {/* Food */}
          <motion.div
            className="rounded-full bg-neon-pink shadow-[0_0_10px_#ff00ff]"
            style={{
              gridColumnStart: food.x + 1,
              gridRowStart: food.y + 1,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          />

          {/* Snake */}
          {snake.map((segment, i) => (
            <div
              key={`${segment.x}-${segment.y}-${i}`}
              className={`rounded-sm ${i === 0 ? 'bg-neon-blue' : 'bg-neon-blue/60'} shadow-[0_0_5px_rgba(0,242,255,0.5)]`}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
              }}
            />
          ))}
        </div>

        {/* Overlays */}
        <AnimatePresence>
          {!gameActive && !isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10"
            >
              <h2 className="text-3xl font-bold mb-6 neon-text-blue font-sans">NEON SNAKE</h2>
              <button
                onClick={resetGame}
                className="group relative px-8 py-3 bg-neon-blue/20 border border-neon-blue text-neon-blue rounded-full font-bold tracking-widest hover:bg-neon-blue hover:text-black transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  <Play size={20} fill="currentColor" /> START GAME
                </span>
                <div className="absolute -inset-1 bg-neon-blue opacity-20 blur-lg rounded-full group-hover:opacity-40" />
              </button>
              <p className="mt-4 text-xs text-white/40 uppercase tracking-widest font-mono">Use Arrow Keys to Move</p>
            </motion.div>
          )}

          {isGameOver && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-20"
            >
              <Trophy className="text-neon-pink mb-2" size={48} />
              <h2 className="text-4xl font-bold text-neon-pink mb-2 font-sans tracking-tighter">GAME OVER</h2>
              <div className="text-center mb-8">
                <p className="text-white/60 text-sm uppercase tracking-widest mb-1">Final Score</p>
                <p className="text-5xl font-black text-white font-mono">{score}</p>
              </div>
              <button
                onClick={resetGame}
                className="group relative px-8 py-3 bg-neon-pink/20 border border-neon-pink text-neon-pink rounded-full font-bold tracking-widest hover:bg-neon-pink hover:text-black transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  <RefreshCw size={20} /> RETRY
                </span>
                <div className="absolute -inset-1 bg-neon-pink opacity-20 blur-lg rounded-full group-hover:opacity-40" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Help */}
      <div className="mt-8 flex gap-4">
        {['↑', '←', '↓', '→'].map((key) => (
          <div key={key} className="w-10 h-10 glass rounded-lg border border-white/10 flex items-center justify-center font-mono text-white/40">
            {key}
          </div>
        ))}
      </div>
    </div>
  );
}
