import { deepCopy } from '@/utils';

const TILE_COLOR_MAP: Record<number, string> = {
  0: '#473d49',
  1: '#00FFFF',
  2: '#FFFF00',
  3: '#800080',
  4: '#00FF00',
  5: '#FF0000',
  6: '#0000FF',
  7: '#FFA500',
};
type Block = {
  type: number;
  name: string;
  color: string;
  blockGrid: number[][];
  method: 'rotate' | 'transpose';
};
const BLOCKS: Block[] = [
  {
    type: 0,
    name: 'empty',
    color: TILE_COLOR_MAP[0],
    blockGrid: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    method: 'rotate',
  },
  {
    type: 1,
    name: 'L',
    color: TILE_COLOR_MAP[1],
    blockGrid: [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    method: 'rotate',
  },
  {
    type: 2,
    name: 'Z',
    color: TILE_COLOR_MAP[2],
    blockGrid: [
      [0, 0, 0],
      [2, 2, 0],
      [0, 2, 2],
    ],
    method: 'transpose',
  },
  {
    type: 3,
    name: 'block',
    color: TILE_COLOR_MAP[3],
    blockGrid: [
      [0, 0, 0, 0],
      [0, 3, 3, 0],
      [0, 3, 3, 0],
      [0, 0, 0, 0],
    ],
    method: 'rotate',
  },
  {
    type: 4,
    name: 'T',
    color: TILE_COLOR_MAP[4],
    blockGrid: [
      [0, 0, 0],
      [4, 4, 4],
      [0, 4, 0],
    ],
    method: 'rotate',
  },
  {
    type: 5,
    name: 'straight',
    color: TILE_COLOR_MAP[5],
    blockGrid: [
      [0, 0, 5, 0],
      [0, 0, 5, 0],
      [0, 0, 5, 0],
      [0, 0, 5, 0],
    ],
    method: 'transpose',
  },
  {
    type: 6,
    name: 'J',
    color: TILE_COLOR_MAP[6],
    blockGrid: [
      [0, 6, 0],
      [0, 6, 0],
      [6, 6, 0],
    ],
    method: 'rotate',
  },
  {
    type: 7,
    name: 'S',
    color: TILE_COLOR_MAP[7],
    blockGrid: [
      [0, 0, 0],
      [0, 7, 7],
      [7, 7, 0],
    ],
    method: 'transpose',
  },
];

const emptyBoard = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const DIRECTIONS = {
  DOWN: {
    dy: 1,
    dx: 0,
  },
  UP: {
    dy: -1,
    dx: 0,
  },
  RIGHT: {
    dy: 0,
    dx: 1,
  },
  LEFT: {
    dy: 0,
    dx: -1,
  },
};

type DirectionKeys = keyof typeof DIRECTIONS;
const KEYBOARD_MAP: Record<string, DirectionKeys | undefined> = {
  w: 'UP',
  ArrowUp: 'UP',
  W: 'UP',

  s: 'DOWN',
  ArrowDown: 'DOWN',
  S: 'DOWN',

  a: 'LEFT',
  ArrowLeft: 'LEFT',
  A: 'LEFT',

  d: 'RIGHT',
  ArrowRight: 'RIGHT',
  D: 'RIGHT',
};
export const calcNewPos = (
  directionKey: DirectionKeys,
  y: number,
  x: number,
) => {
  if (isUp(directionKey)) return [y, x];
  return [y + DIRECTIONS[directionKey].dy, x + DIRECTIONS[directionKey].dx];
};
const isOutBound = (y: number, x: number) => {
  return y < 0 || y >= emptyBoard.length || x < 0 || x >= emptyBoard[0].length;
};
export const canGoNext = ({
  board,
  grid,
  y,
  x,
}: {
  board: number[][];
  grid: number[][];
  y: number;
  x: number;
}) => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const newY = y + i;
      const newX = x + j;

      if (grid[i][j] && isOutBound(newY, newX)) return false;
      if (!isOutBound(newY, newX) && board[newY][newX]) return false;
    }
  }
  return true;
};
export const fillBlock = ({
  blockGrid,
  board,
  y,
  x,
  type,
}: {
  blockGrid: number[][];
  board: number[][];
  y: number;
  x: number;
  type: number;
}) => {
  const clonedBoard = deepCopy(board);
  for (let i = 0; i < blockGrid.length; i++) {
    for (let j = 0; j < blockGrid[i].length; j++) {
      if (!blockGrid[i][j]) continue;
      const [newY, newX] = [y + i, x + j];
      if (isOutBound(newY, newX)) continue;
      clonedBoard[newY][newX] = type;
    }
  }
  return clonedBoard;
};

export const isUp = (direction: DirectionKeys): boolean => direction === 'UP';

export const getDirectionOrUndefined = (
  eventKey: string,
): DirectionKeys | undefined => {
  return KEYBOARD_MAP[eventKey];
};
export const createRandomPiece = () => {
  const type = Math.floor(Math.random() * (BLOCKS.length - 1)) + 1;
  return {
    type,
    y: 0,
    x: 4,
    grid: BLOCKS[type].blockGrid,
    method: BLOCKS[type].method,
  };
};

export const getColorByNum = (num: number) => TILE_COLOR_MAP[num];
export const createEmptyBoard = () => deepCopy(emptyBoard);

export const rotate = (grid: number[][]): number[][] => {
  const copiedGrid = deepCopy(grid);
  // rotate
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      copiedGrid[grid.length - j - 1][i] = grid[i][j];
    }
  }

  return copiedGrid;
};
export const transpose = (grid: number[][]): number[][] => {
  const copiedGrid = deepCopy(grid);
  // rotate
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      copiedGrid[j][i] = grid[i][j];
    }
  }

  return copiedGrid;
};
