import { CellData, CellValue, GRID_SIZE, TOTAL_CELLS } from '../types';

/**
 * Returns an array of lines, where each line is an array of 3 indices [idx1, idx2, idx3]
 * that form a valid SOS.
 */
export const checkSOS = (
  grid: CellData[],
  index: number,
  value: CellValue
): number[][] => {
  const row = Math.floor(index / GRID_SIZE);
  const col = index % GRID_SIZE;
  const foundLines: number[][] = [];

  // Helper to get safe index
  const getIdx = (r: number, c: number) => {
    if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return -1;
    return r * GRID_SIZE + c;
  };

  const directions = [
    { dr: 0, dc: 1 },  // Horizontal
    { dr: 1, dc: 0 },  // Vertical
    { dr: 1, dc: 1 },  // Diagonal \
    { dr: 1, dc: -1 }, // Diagonal /
  ];

  if (value === 'S') {
    // Look for S-O-S where the placed 'S' is one of the ends
    // Must find 'O' then 'S' in that direction
    directions.forEach(({ dr, dc }) => {
      // Check forward
      const idx1 = getIdx(row + dr, col + dc); // Should be O
      const idx2 = getIdx(row + dr * 2, col + dc * 2); // Should be S

      if (idx1 !== -1 && idx2 !== -1) {
        if (grid[idx1].value === 'O' && grid[idx2].value === 'S') {
          foundLines.push([index, idx1, idx2]); // Store line [S, O, S]
        }
      }

      // Check backward
      const idxB1 = getIdx(row - dr, col - dc); // Should be O
      const idxB2 = getIdx(row - dr * 2, col - dc * 2); // Should be S
      if (idxB1 !== -1 && idxB2 !== -1) {
        if (grid[idxB1].value === 'O' && grid[idxB2].value === 'S') {
          foundLines.push([index, idxB1, idxB2]); // Store line [S, O, S]
        }
      }
    });
  } else if (value === 'O') {
    // Look for S-O-S where the placed 'O' is the center
    // Must find 'S' on both opposite sides
    directions.forEach(({ dr, dc }) => {
      const idx1 = getIdx(row + dr, col + dc); // Side A
      const idx2 = getIdx(row - dr, col - dc); // Side B

      if (idx1 !== -1 && idx2 !== -1) {
        if (grid[idx1].value === 'S' && grid[idx2].value === 'S') {
          foundLines.push([idx1, index, idx2]); // Store line [S, O, S]
        }
      }
    });
  }

  return foundLines;
};

export const getBotMove = (grid: CellData[]): { index: number; value: CellValue } => {
  const emptyIndices = grid.filter((c) => !c.value).map((c) => c.id);
  
  if (emptyIndices.length === 0) return { index: -1, value: 'S' };

  // 1. Try to find a scoring move
  for (const idx of emptyIndices) {
    // Check if placing S scores
    if (checkSOS(grid, idx, 'S').length > 0) return { index: idx, value: 'S' };
    // Check if placing O scores
    if (checkSOS(grid, idx, 'O').length > 0) return { index: idx, value: 'O' };
  }

  // 2. Random valid move
  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  const randomValue: CellValue = Math.random() > 0.5 ? 'S' : 'O';

  return { index: randomIndex, value: randomValue };
};