import React, { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import MainMenu from './components/MainMenu';
import Game from './components/Game';
import Settings from './components/Settings';
import { GameMode, THEMES, ThemeId } from './types';

function AppContent() {
  const [gameMode, setGameMode] = useState<GameMode>('PvB');
  const [screen, setScreen] = useState<'MENU' | 'GAME' | 'SETTINGS'>('MENU');
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>('Neon');

  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    setScreen('GAME');
  };

  const openSettings = () => {
    setScreen('SETTINGS');
  };

  const exitToMenu = () => {
    setScreen('MENU');
  };

  return (
    <div className="w-full h-full">
      {screen === 'MENU' && (
        <MainMenu 
          onStart={startGame} 
          onSettings={openSettings} 
          theme={THEMES[currentThemeId]} 
        />
      )}
      {screen === 'GAME' && (
        <Game 
          mode={gameMode} 
          onExit={exitToMenu} 
          theme={THEMES[currentThemeId]} 
        />
      )}
      {screen === 'SETTINGS' && (
        <Settings
          currentTheme={currentThemeId}
          onThemeChange={setCurrentThemeId}
          onBack={exitToMenu}
        />
      )}
    </div>
  );
}

const App: React.FC = () => {
  return (
    <HashRouter>
       <AppContent />
    </HashRouter>
  );
};

export default App;