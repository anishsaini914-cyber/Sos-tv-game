import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, Player, CellValue, GRID_SIZE, TOTAL_CELLS, ThemeConfig } from '../types';
import GridCell from './GridCell';
import { checkSOS, getBotMove } from '../services/gameLogic';
import { audio } from '../services/audioService';
import { Volume2, VolumeX, Menu } from 'lucide-react';

interface GameProps {
  mode: GameMode;
  onExit: () => void;
  theme: ThemeConfig;
}

const Game: React.FC<GameProps> = ({ mode, onExit, theme }) => {
  // Game State
  const [grid, setGrid] = useState(() => 
    Array.from({ length: TOTAL_CELLS }, (_, i) => ({
      id: i,
      value: null as CellValue,
      owner: null as Player,
      highlight: false,
    }))
  );
  
  const [currentPlayer, setCurrentPlayer] = useState<Player>('Blue');
  const [scores, setScores] = useState({ Blue: 0, Red: 0 });
  const [selectedLetter, setSelectedLetter] = useState<'S' | 'O'>('S');
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  
  // Navigation State
  const [focusedIndex, setFocusedIndex] = useState<number>(0); // 0-99 grid, 100+ controls
  const [isMuted, setIsMuted] = useState(audio.muted); // Initialize with global state

  // Bot Logic
  useEffect(() => {
    if (mode === 'PvB' && currentPlayer === 'Red' && !isGameOver) {
      const timer = setTimeout(() => {
        const { index, value } = getBotMove(grid);
        if (index !== -1) {
          handleMove(index, value);
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, grid, isGameOver, mode]);

  const handleMove = useCallback((index: number, val: CellValue) => {
    if (grid[index].value || isGameOver) return;

    audio.playSfx('move');

    const newGrid = [...grid];
    newGrid[index] = { ...newGrid[index], value: val };

    // checkSOS returns array of arrays (lines)
    const foundLines = checkSOS(newGrid, index, val);
    
    if (foundLines.length > 0) {
      // Player scored
      audio.playSfx('score');
      const points = foundLines.length; // Each valid SOS line is 1 point
      
      foundLines.forEach(lineIndices => {
        // Mark cells as highlighted and owned (for color)
        lineIndices.forEach(idx => {
          newGrid[idx].owner = currentPlayer;
          newGrid[idx].highlight = true;
        });
      });

      setGrid(newGrid);
      setScores(prev => ({
        ...prev,
        [currentPlayer]: prev[currentPlayer] + points
      }));

      // Check win condition
      const isFull = newGrid.every(c => c.value !== null);
      if (isFull) {
        setIsGameOver(true);
        audio.playSfx('win');
      }
      
      // Keep turn
    } else {
      // No score, swap turn
      setGrid(newGrid);
      const isFull = newGrid.every(c => c.value !== null);
      if (isFull) {
        setIsGameOver(true);
        audio.playSfx('win');
      } else {
        setCurrentPlayer(prev => prev === 'Blue' ? 'Red' : 'Blue');
      }
    }
  }, [grid, currentPlayer, isGameOver]);

  // Determine Winner
  useEffect(() => {
    if (isGameOver) {
      if (scores.Blue > scores.Red) setWinner('Blue');
      else if (scores.Red > scores.Blue) setWinner('Red');
      else setWinner('Draw');
    }
  }, [isGameOver, scores]);

  // Keyboard / TV Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'ArrowRight') {
        if (focusedIndex < 99) setFocusedIndex(prev => prev + 1);
        else if (focusedIndex >= 100 && focusedIndex < 103) setFocusedIndex(prev => prev + 1);
      } else if (e.key === 'ArrowLeft') {
        if (focusedIndex > 0 && focusedIndex <= 99) setFocusedIndex(prev => prev - 1);
        else if (focusedIndex > 100) setFocusedIndex(prev => prev - 1);
        else if (focusedIndex === 100) setFocusedIndex(99); 
      } else if (e.key === 'ArrowDown') {
        if (focusedIndex + 10 < 100) setFocusedIndex(prev => prev + 10);
        else if (focusedIndex < 100) setFocusedIndex(100); 
      } else if (e.key === 'ArrowUp') {
        if (focusedIndex - 10 >= 0) setFocusedIndex(prev => prev - 10);
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (focusedIndex < 100) {
          handleMove(focusedIndex, selectedLetter);
        } else if (focusedIndex === 100) setSelectedLetter('S');
        else if (focusedIndex === 101) setSelectedLetter('O');
        else if (focusedIndex === 102) onExit();
        else if (focusedIndex === 103 && isGameOver) onExit();
      } else if (e.key.toLowerCase() === 's') setSelectedLetter('S');
        else if (e.key.toLowerCase() === 'o') setSelectedLetter('O');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, handleMove, selectedLetter, onExit, isGameOver]);

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${theme.colors.background} text-white overflow-hidden`}>
      
      {/* Header */}
      <div className={`w-full max-w-4xl flex justify-between items-center mb-6 ${theme.colors.panel} p-4 rounded-xl border ${theme.colors.gridBorder} shadow-lg`}>
        <div className={`flex flex-col items-center p-2 rounded-lg min-w-[100px] ${currentPlayer === 'Blue' ? `ring-2 ${theme.colors.accent} bg-white/5` : ''}`}>
          <span className={`font-bold text-xl ${theme.colors.textPrimary}`}>BLUE</span>
          <span className="text-3xl font-mono">{scores.Blue}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <h1 className={`text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-current to-white ${theme.colors.textPrimary}`}>NEON SOS</h1>
          <div className="text-sm text-gray-400 mt-1">{isGameOver ? 'GAME OVER' : `${currentPlayer}'s Turn`}</div>
        </div>

        <div className={`flex flex-col items-center p-2 rounded-lg min-w-[100px] ${currentPlayer === 'Red' ? `ring-2 ${theme.colors.accent} bg-white/5` : ''}`}>
          <span className={`font-bold text-xl ${theme.colors.textSecondary}`}>RED {mode === 'PvB' ? '(Bot)' : ''}</span>
          <span className="text-3xl font-mono">{scores.Red}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start w-full max-w-4xl justify-center">
        
        {/* Game Grid Container */}
        <div className={`relative ${theme.colors.panel} p-3 rounded-xl border ${theme.colors.gridBorder} shadow-2xl`}>
          <div className="grid grid-cols-10 relative z-0">
            {grid.map((cell) => (
              <GridCell
                key={cell.id}
                cell={cell}
                onClick={() => handleMove(cell.id, selectedLetter)}
                isFocused={focusedIndex === cell.id}
                disabled={isGameOver || (mode === 'PvB' && currentPlayer === 'Red')}
                theme={theme}
              />
            ))}
          </div>
          
          {/* Winner Overlay */}
          {isGameOver && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-xl z-20 backdrop-blur-sm animate-in fade-in duration-500">
              <h2 className="text-4xl font-bold mb-4 text-white">
                {winner === 'Draw' ? 'DRAW!' : `${winner} WINS!`}
              </h2>
              <button 
                className={`px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition ${focusedIndex === 103 ? 'tv-focus' : ''}`}
                onClick={onExit}
                onMouseEnter={() => setFocusedIndex(103)}
              >
                Back to Menu
              </button>
            </div>
          )}
        </div>

        {/* Controls Panel */}
        <div className="flex flex-col gap-4 w-full md:w-48">
          <div className={`${theme.colors.panel} p-4 rounded-xl border ${theme.colors.gridBorder}`}>
            <h3 className="text-gray-400 text-sm mb-3 font-semibold uppercase">Placement</h3>
            <div className="flex gap-2">
              <button
                className={`flex-1 py-3 rounded-lg font-bold text-xl transition-all ${selectedLetter === 'S' ? 'bg-white text-black scale-105' : 'bg-gray-800 text-gray-400'} ${focusedIndex === 100 ? 'tv-focus' : ''}`}
                onClick={() => setSelectedLetter('S')}
                onMouseEnter={() => setFocusedIndex(100)}
              >
                S
              </button>
              <button
                className={`flex-1 py-3 rounded-lg font-bold text-xl transition-all ${selectedLetter === 'O' ? 'bg-white text-black scale-105' : 'bg-gray-800 text-gray-400'} ${focusedIndex === 101 ? 'tv-focus' : ''}`}
                onClick={() => setSelectedLetter('O')}
                onMouseEnter={() => setFocusedIndex(101)}
              >
                O
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Touch or D-Pad to Select</p>
          </div>

          <div className={`${theme.colors.panel} p-4 rounded-xl border ${theme.colors.gridBorder} flex flex-col gap-3`}>
            <button 
              className={`flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition ${focusedIndex === 102 ? 'tv-focus' : ''}`}
              onClick={onExit}
              onMouseEnter={() => setFocusedIndex(102)}
            >
              <Menu size={20} />
              <span className="font-semibold">Exit Game</span>
            </button>
            
            <button 
              className={`flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition`}
              onClick={() => {
                const muted = audio.toggleMute();
                setIsMuted(muted);
              }}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              <span className="font-semibold">{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Game;