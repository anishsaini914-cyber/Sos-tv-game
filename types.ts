export type Player = 'Blue' | 'Red';
export type CellValue = 'S' | 'O' | null;

export interface CellData {
  id: number;
  value: CellValue;
  owner: Player | null; // Who completed the SOS involving this cell
  highlight?: boolean; // Part of a winning line
}

export type GameMode = 'PvP' | 'PvB'; // Player vs Player, Player vs Bot

export interface WinningLine {
  indices: number[]; // [start, middle, end] or just the 3 indices
  player: Player;
}

export type ThemeId = 'Neon' | 'Matrix' | 'Cyber';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  colors: {
    background: string; // CSS class for gradient/bg
    panel: string;
    textPrimary: string; // Player 1 / Main UI
    textSecondary: string; // Player 2
    accent: string;
    gridBorder: string;
    cellBg: string;
    lineBlue: string; // Hex for SVG line
    lineRed: string; // Hex for SVG line
  };
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  Neon: {
    id: 'Neon',
    name: 'Neon Future',
    colors: {
      background: 'bg-gradient-to-br from-[#0a0a12] to-black',
      panel: 'bg-[#13131f]',
      textPrimary: 'text-[#00f3ff]',
      textSecondary: 'text-[#ff0055]',
      accent: 'ring-[#00f3ff]',
      gridBorder: 'border-gray-800',
      cellBg: 'bg-gray-900/50',
      lineBlue: '#00f3ff',
      lineRed: '#ff0055'
    }
  },
  Matrix: {
    id: 'Matrix',
    name: 'The Matrix',
    colors: {
      background: 'bg-black',
      panel: 'bg-green-900/20',
      textPrimary: 'text-green-400',
      textSecondary: 'text-green-700',
      accent: 'ring-green-500',
      gridBorder: 'border-green-900',
      cellBg: 'bg-black border-green-800',
      lineBlue: '#4ade80',
      lineRed: '#15803d'
    }
  },
  Cyber: {
    id: 'Cyber',
    name: 'Cyberpunk',
    colors: {
      background: 'bg-gradient-to-r from-yellow-900/20 via-purple-900/20 to-slate-900',
      panel: 'bg-purple-900/30',
      textPrimary: 'text-yellow-400',
      textSecondary: 'text-purple-400',
      accent: 'ring-yellow-400',
      gridBorder: 'border-purple-500/50',
      cellBg: 'bg-purple-900/20',
      lineBlue: '#facc15',
      lineRed: '#c084fc'
    }
  }
};

export interface GameState {
  grid: CellData[];
  currentPlayer: Player;
  scores: { Blue: number; Red: number };
  gameMode: GameMode;
  isGameOver: boolean;
  winner: Player | 'Draw' | null;
  selectedLetter: 'S' | 'O';
}

export const GRID_SIZE = 10;
export const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;