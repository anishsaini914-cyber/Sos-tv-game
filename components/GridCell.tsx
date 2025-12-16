import React from 'react';
import { CellData, ThemeConfig } from '../types';

interface GridCellProps {
  cell: CellData;
  onClick: () => void;
  isFocused: boolean;
  disabled: boolean;
  theme: ThemeConfig;
}

const GridCell: React.FC<GridCellProps> = ({ cell, onClick, isFocused, disabled, theme }) => {
  let textColor = 'text-gray-500';
  let bgColor = theme.colors.cellBg;
  // Use theme grid border
  let borderColor = theme.colors.gridBorder;
  let customStyle = {};

  if (cell.value) {
    textColor = 'text-white';
    if (cell.highlight) {
       // Check owner for color
       textColor = cell.owner === 'Blue' ? theme.colors.textPrimary : theme.colors.textSecondary;
       
       // Stronger background highlight using the hex color + transparency (approx 25%)
       // This replaces the line system
       const baseColor = cell.owner === 'Blue' ? theme.colors.lineBlue : theme.colors.lineRed;
       customStyle = { backgroundColor: `${baseColor}40`, boxShadow: `0 0 10px ${baseColor}40` };
    }
  }

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      style={customStyle}
      className={`
        relative flex items-center justify-center
        h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12
        m-[2px] 
        border ${borderColor} rounded-md
        transition-all duration-200
        cursor-pointer select-none
        ${!cell.highlight ? bgColor : ''}
        ${isFocused ? 'tv-focus' : ''}
        ${!cell.value && !disabled ? 'hover:bg-white/5' : ''}
      `}
    >
      <span className={`text-lg sm:text-xl font-bold ${textColor} ${cell.highlight ? 'animate-pulse' : ''}`}>
        {cell.value}
      </span>
    </div>
  );
};

export default React.memo(GridCell);