import React, { useEffect, useState } from 'react';
import { THEMES, ThemeId } from '../types';
import { ArrowLeft, Check, User, Volume2, VolumeX } from 'lucide-react';
import { audio } from '../services/audioService';

interface SettingsProps {
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ currentTheme, onThemeChange, onBack }) => {
  const [focusIndex, setFocusIndex] = useState(0); 
  // Indices:
  // 0-2: Themes
  // 3: Sound Toggle
  // 4: Back
  
  const [isMuted, setIsMuted] = useState(audio.muted);

  const themesList: ThemeId[] = ['Neon', 'Matrix', 'Cyber'];

  const toggleSound = () => {
    const newState = !isMuted;
    audio.setMute(newState);
    setIsMuted(newState);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
         if (focusIndex < 2) setFocusIndex(prev => prev + 1);
      } else if (e.key === 'ArrowLeft') {
         if (focusIndex > 0 && focusIndex <= 2) setFocusIndex(prev => prev - 1);
      } else if (e.key === 'ArrowDown') {
         if (focusIndex < 2) setFocusIndex(3); // Go to sound
         else if (focusIndex === 3) setFocusIndex(4); // Go to back
      } else if (e.key === 'ArrowUp') {
         if (focusIndex === 4) setFocusIndex(3); // Back to sound
         else if (focusIndex === 3) setFocusIndex(1); // Sound to middle theme
      } else if (e.key === 'Enter') {
         if (focusIndex < 3) {
             onThemeChange(themesList[focusIndex]);
         } else if (focusIndex === 3) {
             toggleSound();
         } else {
             onBack();
         }
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
          onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusIndex, onThemeChange, onBack, themesList, isMuted]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${THEMES[currentTheme].colors.background} text-white`}>
      <div className={`w-full max-w-2xl ${THEMES[currentTheme].colors.panel} p-8 rounded-2xl shadow-2xl border ${THEMES[currentTheme].colors.gridBorder}`}>
        
        <h2 className={`text-4xl font-bold mb-6 text-center ${THEMES[currentTheme].colors.textPrimary}`}>SETTINGS</h2>

        {/* Theme Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-300">Theme</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            {themesList.map((id, idx) => (
              <button
                key={id}
                onClick={() => onThemeChange(id)}
                onMouseEnter={() => setFocusIndex(idx)}
                className={`
                  flex-1 p-4 rounded-xl border-2 transition-all relative overflow-hidden group
                  ${currentTheme === id ? THEMES[currentTheme].colors.accent : 'border-gray-700'}
                  ${focusIndex === idx ? 'scale-105 shadow-lg ring-2 ring-white z-10' : 'opacity-80 hover:opacity-100'}
                `}
              >
                <div className={`absolute inset-0 opacity-20 ${THEMES[id].colors.background}`}></div>
                <div className="relative z-10 flex items-center justify-center gap-2">
                   <span className={`font-bold ${THEMES[id].colors.textPrimary}`}>{THEMES[id].name}</span>
                   {currentTheme === id && <Check size={16} className={THEMES[id].colors.textPrimary} />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sound Section */}
        <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 text-gray-300">Audio</h3>
            <button
                onClick={toggleSound}
                onMouseEnter={() => setFocusIndex(3)}
                className={`
                    w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between
                    ${focusIndex === 3 ? `bg-white/10 ${THEMES[currentTheme].colors.accent} scale-105` : 'border-gray-700 bg-black/20'}
                `}
            >
                <div className="flex items-center gap-3">
                    {isMuted ? <VolumeX size={24} className="text-gray-400"/> : <Volume2 size={24} className={THEMES[currentTheme].colors.textPrimary}/>}
                    <span className="font-bold text-lg">{isMuted ? 'Sound OFF' : 'Sound ON'}</span>
                </div>
                <div className={`px-3 py-1 rounded text-sm font-bold ${isMuted ? 'bg-gray-700 text-gray-400' : 'bg-white text-black'}`}>
                    {isMuted ? 'MUTED' : 'ACTIVE'}
                </div>
            </button>
        </div>

        {/* About Us Section */}
        <div className="mb-8 bg-black/20 p-6 rounded-xl border border-gray-800">
          <div className="flex items-center gap-4 mb-2">
            <div className={`p-2 rounded-full bg-white/10 ${THEMES[currentTheme].colors.textPrimary}`}>
                <User size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">About Us</h3>
          </div>
          <p className="text-gray-400">
             Game Concept & Development by
          </p>
          <p className={`text-2xl font-bold mt-1 ${THEMES[currentTheme].colors.textSecondary}`}>
            Anish Saini
          </p>
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          onMouseEnter={() => setFocusIndex(4)}
          className={`
            w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all
            ${focusIndex === 4 ? 'bg-white text-black scale-105' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}
          `}
        >
          <ArrowLeft size={20} />
          Back to Menu
        </button>

      </div>
    </div>
  );
};

export default Settings;