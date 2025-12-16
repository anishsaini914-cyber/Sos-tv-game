import React, { useEffect, useState } from 'react';
import { GameMode, ThemeConfig } from '../types';
import { audio } from '../services/audioService';
import { Play, Bot, Gamepad2, Tv, Settings as SettingsIcon } from 'lucide-react';

interface MainMenuProps {
  onStart: (mode: GameMode) => void;
  onSettings: () => void;
  theme: ThemeConfig;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart, onSettings, theme }) => {
  const [focusIndex, setFocusIndex] = useState(0); // 0: PvB, 1: PvP, 2: Settings

  // Auto-start music on first interaction
  useEffect(() => {
    const startAudio = () => {
        audio.playMusic();
        window.removeEventListener('click', startAudio);
        window.removeEventListener('keydown', startAudio);
    };
    window.addEventListener('click', startAudio);
    window.addEventListener('keydown', startAudio);
    return () => {
        window.removeEventListener('click', startAudio);
        window.removeEventListener('keydown', startAudio);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') setFocusIndex(prev => Math.max(0, prev - 1));
      if (e.key === 'ArrowDown') setFocusIndex(prev => Math.min(2, prev + 1));
      if (e.key === 'Enter') {
        if (focusIndex === 0) onStart('PvB');
        if (focusIndex === 1) onStart('PvP');
        if (focusIndex === 2) onSettings();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart, onSettings, focusIndex]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden ${theme.colors.background}`}>
        
        {/* Animated decorative circles based on theme */}
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 opacity-10 rounded-full blur-3xl animate-pulse-fast bg-current ${theme.colors.textPrimary}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 opacity-10 rounded-full blur-3xl animate-pulse-fast delay-700 bg-current ${theme.colors.textSecondary}`}></div>

        <div className="z-10 flex flex-col items-center gap-10 max-w-md w-full p-6">
            <div className="text-center space-y-2">
                <h1 className={`text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-current to-white drop-shadow-lg ${theme.colors.textPrimary}`}>
                    SOS
                </h1>
                <p className="text-gray-400 tracking-[0.5em] text-sm md:text-base font-bold uppercase">
                    Tactical Grid Warfare
                </p>
            </div>

            <div className="w-full flex flex-col gap-4">
                {/* Single Player */}
                <button
                    onClick={() => onStart('PvB')}
                    onMouseEnter={() => setFocusIndex(0)}
                    className={`
                        group relative flex items-center justify-between p-6 rounded-2xl border 
                        transition-all duration-300 transform
                        ${focusIndex === 0 
                            ? 'bg-white text-black border-white scale-105 shadow-xl' 
                            : `${theme.colors.panel} text-white ${theme.colors.gridBorder} hover:bg-white/10`
                        }
                    `}
                >
                    <div className="flex items-center gap-4">
                        <Bot size={32} className={focusIndex === 0 ? 'text-black' : theme.colors.textPrimary.split(' ')[0]} />
                        <div className="text-left">
                            <div className="font-bold text-xl">Single Player</div>
                            <div className={`text-xs ${focusIndex === 0 ? 'text-gray-600' : 'text-gray-400'}`}>Challenge the AI</div>
                        </div>
                    </div>
                    <Play size={24} className={`opacity-0 group-hover:opacity-100 transition ${focusIndex === 0 ? 'opacity-100' : ''}`} />
                </button>

                {/* Multiplayer */}
                <button
                    onClick={() => onStart('PvP')}
                    onMouseEnter={() => setFocusIndex(1)}
                    className={`
                        group relative flex items-center justify-between p-6 rounded-2xl border 
                        transition-all duration-300 transform
                        ${focusIndex === 1
                            ? 'bg-white text-black border-white scale-105 shadow-xl' 
                            : `${theme.colors.panel} text-white ${theme.colors.gridBorder} hover:bg-white/10`
                        }
                    `}
                >
                    <div className="flex items-center gap-4">
                        <Gamepad2 size={32} className={focusIndex === 1 ? 'text-black' : theme.colors.textSecondary.split(' ')[0]} />
                        <div className="text-left">
                            <div className="font-bold text-xl">Local VS</div>
                            <div className={`text-xs ${focusIndex === 1 ? 'text-gray-600' : 'text-gray-400'}`}>Play with a friend</div>
                        </div>
                    </div>
                    <Play size={24} className={`opacity-0 group-hover:opacity-100 transition ${focusIndex === 1 ? 'opacity-100' : ''}`} />
                </button>

                {/* Settings */}
                <button
                    onClick={onSettings}
                    onMouseEnter={() => setFocusIndex(2)}
                    className={`
                        group relative flex items-center justify-between p-6 rounded-2xl border 
                        transition-all duration-300 transform
                        ${focusIndex === 2
                            ? 'bg-white text-black border-white scale-105 shadow-xl' 
                            : `${theme.colors.panel} text-white ${theme.colors.gridBorder} hover:bg-white/10`
                        }
                    `}
                >
                    <div className="flex items-center gap-4">
                        <SettingsIcon size={32} className={focusIndex === 2 ? 'text-black' : 'text-gray-400'} />
                        <div className="text-left">
                            <div className="font-bold text-xl">Settings</div>
                            <div className={`text-xs ${focusIndex === 2 ? 'text-gray-600' : 'text-gray-400'}`}>Theme & Credits</div>
                        </div>
                    </div>
                </button>
            </div>

            <div className="flex items-center gap-2 text-gray-500 text-xs">
                <Tv size={14} />
                <span>Supports Touch & TV Remote</span>
            </div>
        </div>
    </div>
  );
};

export default MainMenu;