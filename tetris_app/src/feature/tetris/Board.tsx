import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';

import { deepCopy, responsibleCss } from '@/utils';
import { tileOptions } from '@/feature/tetris/constants';
import Tile from '@/feature/tetris/Tile';
import { GameStatus } from '@/feature/tetris/types';

const TILE_COLOR_MAP = {
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
  blockGrid: number;
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
  },
  {
    type: 1,
    name: 'L',
    color: TILE_COLOR_MAP[1],
    blockGrid: [
      [0, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 1, 0, 0],
    ],
  },
  {
    type: 2,
    name: 'Z',
    color: TILE_COLOR_MAP[2],
    blockGrid: [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [2, 2, 0, 0],
      [0, 2, 2, 0],
    ],
  },
  {
    type: 3,
    name: 'block',
    color: TILE_COLOR_MAP[3],
    blockGrid: [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [3, 3, 0, 0],
      [3, 3, 0, 0],
    ],
  },
  {
    type: 4,
    name: 'T',
    color: TILE_COLOR_MAP[4],
    blockGrid: [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [4, 4, 4, 0],
      [0, 4, 0, 0],
    ],
  },
  {
    type: 5,
    name: 'straight',
    color: TILE_COLOR_MAP[5],
    blockGrid: [
      [5, 0, 0, 0],
      [5, 0, 0, 0],
      [5, 0, 0, 0],
      [5, 0, 0, 0],
    ],
  },
];

const BoardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  box-sizing: content-box;
  ${responsibleCss({
    'background-color': 'white',
    border: '1px solid green',
    height: [
      `${tileOptions.rowNums * tileOptions.responsibleTileSize[0]}px`,
      `${tileOptions.rowNums * tileOptions.responsibleTileSize[1]}px`,
      `${tileOptions.rowNums * tileOptions.responsibleTileSize[2]}px`,
    ],
    width: [
      `${tileOptions.colNums * tileOptions.responsibleTileSize[0]}px`,
      `${tileOptions.colNums * tileOptions.responsibleTileSize[1]}px`,
      `${tileOptions.colNums * tileOptions.responsibleTileSize[2]}px`,
    ],
  })}
`;

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
const calcNewPos = (directionKey: DirectionKeys, y: number, x: number) => {
  return [y + DIRECTIONS[directionKey].dy, x + DIRECTIONS[directionKey].dx];
};
const isOutBound = (y: number, x: number) => {
  return y < 0 || y >= 23 || x < 0 || x >= 10;
};
const canGoNext = ({
  board,
  block,
  y,
  x,
}: {
  board: number[][];
  block: Block;
  y: number;
  x: number;
}) => {
  for (let i = 0; i < block.blockGrid.length; i++) {
    for (let j = 0; j < block.blockGrid[0].length; j++) {
      const newY = y + i;
      const newX = x + j;

      if (block.blockGrid[i][j] && isOutBound(newY, newX)) return false;
      if (!isOutBound(newY, newX) && board[newY][newX]) return false;
    }
  }
  return true;
};
const fillBlock = ({
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

type KeyMapType = {
  [key: string]: undefined;
} & {
  s: string;
  ArrowDown: string;
  S: string;
  a: string;
  ArrowLeft: string;
  A: string;
  d: string;
  ArrowRight: string;
  D: string;
};

const KEYBOARD_MAP: Record<string, DirectionKeys | undefined> = {
  // w: 'UP',
  // ArrowUp: 'UP',
  // W: 'UP',

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

const getDirectionOrUndefined = (
  eventKey: string,
): DirectionKeys | undefined => {
  return KEYBOARD_MAP[eventKey];
};
let timer = -1;
type BoardProps = {
  gameStatus: GameStatus;
};

const createRandomPiece = () => ({
  type: Math.floor(Math.random() * (BLOCKS.length - 1)) + 1,
  y: 0,
  x: 4,
});
const Board = ({ gameStatus }: BoardProps) => {
  const pieceRef = useRef(createRandomPiece());
  const [board, setBoard] = useState(
    fillBlock({
      blockGrid: BLOCKS[pieceRef.current.type].blockGrid,
      board: emptyBoard,
      ...pieceRef.current,
    }),
  );

  useEffect(() => {
    if (gameStatus === 'idle') {
      setBoard(deepCopy(emptyBoard));
      pieceRef.current = createRandomPiece();
    }
  }, [gameStatus]);
  useEffect(() => {
    const keyPressHandler = (e: KeyboardEvent) => {
      const direction = getDirectionOrUndefined(e.key);
      if (gameStatus !== 'playing') return;
      if (!direction) return;
      let newBoard = deepCopy(board);
      // 1. 현재위치 board를 지운다.
      newBoard = fillBlock({
        board: newBoard,
        blockGrid: BLOCKS[pieceRef.current.type].blockGrid,
        y: pieceRef.current.y,
        x: pieceRef.current.x,
        type: 0,
      });

      const [newY, newX] = calcNewPos(
        direction,
        pieceRef.current.y,
        pieceRef.current.x,
      );

      if (
        canGoNext({
          board: newBoard,
          block: BLOCKS[pieceRef.current.type],
          y: newY,
          x: newX,
        })
      ) {
        newBoard = fillBlock({
          board: newBoard,
          blockGrid: BLOCKS[pieceRef.current.type].blockGrid,
          y: newY,
          x: newX,
          type: pieceRef.current.type,
        });
        pieceRef.current.y = newY;
        pieceRef.current.x = newX;
        setBoard(newBoard);
      }
    };
    document.addEventListener('keydown', keyPressHandler);
    return () => {
      document.removeEventListener('keydown', keyPressHandler);
    };
  }, [board, gameStatus]);

  useEffect(() => {
    if (gameStatus !== 'playing') return;
    timer = setTimeout(() => {
      let newBoard = deepCopy(board);
      // 1. 현재위치 board를 지운다.
      newBoard = fillBlock({
        board: newBoard,
        blockGrid: BLOCKS[pieceRef.current.type].blockGrid,
        y: pieceRef.current.y,
        x: pieceRef.current.x,
        type: 0,
      });
      // 2. 현재 위치에서 1칸 내려간 blockGrid의 위치를 계산한다.
      const [newY, newX] = calcNewPos(
        'DOWN',
        pieceRef.current.y,
        pieceRef.current.x,
      );
      // 3.  newY,newX를 기준으로 그릴 수 있는지 계산한다.
      if (
        canGoNext({
          board: newBoard,
          block: BLOCKS[pieceRef.current.type],
          y: newY,
          x: newX,
        })
      ) {
        newBoard = fillBlock({
          board: newBoard,
          blockGrid: BLOCKS[pieceRef.current.type].blockGrid,
          y: newY,
          x: newX,
          type: pieceRef.current.type,
        });
        pieceRef.current.y = newY;
        pieceRef.current.x = newX;
        setBoard(newBoard);
      } else {
        clearTimeout(timer);
      }
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [board, gameStatus]);

  if (gameStatus === 'idle') {
    return (
      <BoardWrapper>
        {board
          .slice(3)
          .flat()
          .map((num, idx) => (
            <Tile color={TILE_COLOR_MAP[num]} key={idx} />
          ))}
      </BoardWrapper>
    );
  }
  return (
    <BoardWrapper>
      {board
        .slice(3)
        .flat()
        .map((num, idx) => (
          <Tile color={TILE_COLOR_MAP[num]} key={idx} />
        ))}
    </BoardWrapper>
  );
};

export default Board;
