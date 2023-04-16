import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';

import { deepCopy, responsibleCss } from '@/utils';
import { tileOptions } from '@/feature/tetris/constants';
import Tile from '@/feature/tetris/Tile';
import { GameStatus } from '@/feature/tetris/types';
import {
  calcNewPos,
  canGoNext,
  createEmptyBoard,
  createRandomPiece,
  fillBlock,
  getColorByNum,
  getDirectionOrUndefined,
  isUp,
  rotate,
  transpose,
} from '@/feature/tetris/Borad/board.utils';

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

let timer: NodeJS.Timeout = setTimeout(() => ({}), 0);
type BoardProps = {
  gameStatus: GameStatus;
};

const Board = ({ gameStatus }: BoardProps) => {
  const pieceRef = useRef(createRandomPiece());
  const [board, setBoard] = useState(
    fillBlock({
      blockGrid: pieceRef.current.grid,
      board: createEmptyBoard(),
      ...pieceRef.current,
    }),
  );

  useEffect(() => {
    if (gameStatus === 'idle') {
      setBoard(createEmptyBoard());
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
        blockGrid: pieceRef.current.grid,
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
        isUp(direction) &&
        canGoNext({
          board: newBoard,
          grid:
            pieceRef.current.method === 'rotate'
              ? rotate(pieceRef.current.grid)
              : transpose(pieceRef.current.grid),
          y: newY,
          x: newX,
        })
      ) {
        pieceRef.current.grid =
          pieceRef.current.method === 'rotate'
            ? rotate(pieceRef.current.grid)
            : transpose(pieceRef.current.grid);
      }
      if (
        canGoNext({
          board: newBoard,
          grid: pieceRef.current.grid,
          y: newY,
          x: newX,
        })
      ) {
        newBoard = fillBlock({
          board: newBoard,
          blockGrid: pieceRef.current.grid,
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
        blockGrid: pieceRef.current.grid,
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
          grid: pieceRef.current.grid,
          y: newY,
          x: newX,
        })
      ) {
        newBoard = fillBlock({
          board: newBoard,
          blockGrid: pieceRef.current.grid,
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
          .slice(4)
          .flat()
          .map((num, idx) => (
            <Tile color={getColorByNum(num)} key={idx} />
          ))}
      </BoardWrapper>
    );
  }
  return (
    <BoardWrapper>
      {board
        .slice(4)
        .flat()
        .map((num, idx) => (
          <Tile color={getColorByNum(num)} key={idx} />
        ))}
    </BoardWrapper>
  );
};

export default Board;
