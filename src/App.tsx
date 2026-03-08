import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Trophy, Eye, EyeOff, Tag, RotateCcw, Info, ArrowRight, Check } from 'lucide-react';

type GamePhase = 'setup' | 'passPhone' | 'entry' | 'reveal';

interface PlayerEntry {
  id: number;
  word: string;
}

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [category, setCategory] = useState('');
  const [entries, setEntries] = useState<PlayerEntry[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [currentWord, setCurrentWord] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Setup Phase Handlers
  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (category.trim()) {
      setPhase('passPhone');
    }
  };

  // Pass Phone Handlers
  const handleReady = () => {
    setPhase('entry');
    setCurrentWord('');
    setShowInput(false);
  };

  // Entry Handlers
  const handleNextPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentWord.trim()) {
      setEntries((prev) => [...prev, { id: currentPlayer, word: currentWord.trim() }]);
      setCurrentPlayer((prev) => prev + 1);
      setPhase('passPhone');
    }
  };

  const handleFinishAndReveal = () => {
    setPhase('reveal');
  };

  // Reveal Handlers
  const shuffledWords = useMemo(() => {
    if (phase !== 'reveal') return [];
    const words = entries.map(e => e.word);
    for (let i = words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [words[i], words[j]] = [words[j], words[i]];
    }
    return words;
  }, [entries, phase]);

  const handleNewGame = () => {
    setPhase('setup');
    setCategory('');
    setEntries([]);
    setCurrentPlayer(1);
    setCurrentWord('');
    setShowInput(false);
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 1.05, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-black font-serif overflow-hidden relative selection:bg-[var(--color-primary)] selection:text-white flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF6321] rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#646cff] rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <main className="w-full max-w-md z-10 glass-panel p-6 sm:p-8 rounded-2xl relative">
        <AnimatePresence mode="wait">
          {/* ----- SETUP PHASE ----- */}
          {phase === 'setup' && (
            <motion.div
              key="setup"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-6"
            >
              <div className="text-center">
                <h1 className="text-5xl border-black inline-block mb-2 text-[#FF6321]" style={{ WebkitTextStroke: "2px black" }}>EMPIRE</h1>
                <p className="text-xl font-bold brutal-border bg-[#FF6321] text-white inline-block px-3 py-1 transform -rotate-2">Party Game</p>
              </div>

              <form onSubmit={handleStartGame} className="flex flex-col gap-4 mt-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="category" className="font-sans font-black text-lg uppercase tracking-wider flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#FF6321]" /> category
                  </label>
                  <input
                    id="category"
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. 80s Movies, Pizza Toppings"
                    className="w-full text-xl p-4 brutal-border focus:outline-none focus:ring-4 focus:ring-[#FF6321]/50 bg-white placeholder-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!category.trim()}
                  className="w-full brutal-border bg-black text-white hover:bg-black/90 text-xl py-4 mt-2 disabled:opacity-50 transition-all font-sans font-black flex justify-center items-center gap-2"
                >
                  START GAME <ArrowRight className="w-6 h-6" />
                </button>
              </form>

              <button
                onClick={() => setShowHowToPlay(!showHowToPlay)}
                className="text-sm font-sans font-bold underline flex items-center justify-center gap-1 mx-auto mt-4 text-gray-700 hover:text-black"
              >
                <Info className="w-4 h-4" /> How to Play
              </button>

              <AnimatePresence>
                {showHowToPlay && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-gray-100 brutal-border p-4 text-sm mt-2 rounded">
                      <p className="mb-2"><strong>1.</strong> Enter a category and hit start.</p>
                      <p className="mb-2"><strong>2.</strong> Pass the phone around. Each player secretly enters a word related to the category.</p>
                      <p className="mb-2"><strong>3.</strong> When everyone has entered, hit "Reveal".</p>
                      <p><strong>4.</strong> Read the randomized list out loud. Players take turns guessing who wrote what to build their "Empire".</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ----- PASS PHONE PHASE ----- */}
          {phase === 'passPhone' && (
            <motion.div
              key="passPhone"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center justify-center text-center gap-8 py-8"
            >
              <div className="bg-[#FF6321] brutal-border p-4 rounded-full w-24 h-24 flex items-center justify-center mb-4">
                <Users className="w-12 h-12 text-white" />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-sans font-black uppercase">Pass the phone to</h2>
                <div className="text-5xl font-black brutal-border bg-yellow-300 inline-block px-6 py-2 transform rotate-2">
                  Player {currentPlayer}
                </div>
              </div>

              <button
                onClick={handleReady}
                className="w-full mt-8 brutal-border bg-black text-white hover:bg-gray-900 text-xl py-5 font-sans font-black active:scale-95 transition-transform"
              >
                I AM PLAYER {currentPlayer}
              </button>

              {entries.length >= 2 && (
                <button
                  onClick={handleFinishAndReveal}
                  className="mt-4 brutal-border bg-white text-black text-lg py-3 px-6 font-sans font-bold hover:bg-gray-100 flex items-center gap-2 justify-center"
                >
                  <Trophy className="w-5 h-5" /> FINISH & REVEAL
                </button>
              )}
            </motion.div>
          )}

          {/* ----- ENTRY PHASE ----- */}
          {phase === 'entry' && (
            <motion.div
              key="entry"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-6"
            >
              <div className="flex justify-between items-center bg-black text-white px-4 py-2 brutal-border -mx-2 -mt-2">
                <span className="font-sans font-bold">Player {currentPlayer}</span>
                <span className="flex items-center gap-1 text-sm bg-[#FF6321] px-2 py-0.5 border-2 border-white font-bold">
                  <Tag className="w-3 h-3" /> {category}
                </span>
              </div>

              <form onSubmit={handleNextPlayer} className="flex flex-col gap-6 mt-4 py-4">
                <div className="flex flex-col gap-3">
                  <label className="font-sans font-black text-xl text-center">
                    Enter your word:
                  </label>
                  <div className="relative">
                    <input
                      type={showInput ? "text" : "password"}
                      required
                      value={currentWord}
                      onChange={(e) => setCurrentWord(e.target.value)}
                      placeholder="Secret word..."
                      className="w-full text-2xl p-4 brutal-border pr-14 text-center focus:outline-none focus:ring-4 focus:ring-black/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowInput(!showInput)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black p-1"
                      aria-label="Toggle visibility"
                    >
                      {showInput ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                    </button>
                  </div>
                </div>

                <p className="text-center text-sm text-gray-600 font-bold mb-4">
                  Keep it hidden from others!
                </p>

                <button
                  type="submit"
                  disabled={!currentWord.trim()}
                  className="w-full brutal-border bg-[#FF6321] text-white text-xl py-4 disabled:opacity-50 active:scale-95 transition-all font-sans font-black flex justify-center items-center gap-2"
                >
                  <Check className="w-6 h-6 stroke-[3px]" /> CONFIRM WORD
                </button>
              </form>
            </motion.div>
          )}

          {/* ----- REVEAL PHASE ----- */}
          {phase === 'reveal' && (
            <motion.div
              key="reveal"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-6 h-[80vh] max-h-[600px]"
            >
              <div className="text-center pb-4 border-b-4 border-black">
                <h2 className="text-3xl font-sans font-black uppercase tracking-tight text-[#FF6321]">
                  The List
                </h2>
                <div className="inline-block mt-2 bg-black text-white font-bold px-3 py-1 brutal-border text-sm">
                  Category: {category}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4 space-y-3">
                {shuffledWords.map((word, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={index}
                    className="flex bg-white brutal-border text-xl font-bold"
                  >
                    <div className="bg-yellow-300 border-r-4 border-black w-12 flex items-center justify-center font-sans font-black text-2xl">
                      {index + 1}
                    </div>
                    <div className="p-4 overflow-hidden text-ellipsis whitespace-nowrap">
                      {word}
                    </div>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={handleNewGame}
                className="w-full brutal-border bg-black text-white hover:bg-gray-900 text-xl py-4 font-sans font-black flex items-center justify-center gap-2 mt-auto"
              >
                <RotateCcw className="w-5 h-5" /> NEW GAME
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
