import styled from '@emotion/styled';
import Board from '@/feature/tetris/Board';
import { useState } from 'react';

type GameStatus = 'idle' | 'playing' | 'gameOver' | 'pause';

const Game = () => {
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');

  return (
    <TetrisGameWrapper>
      <Empty />
      <Board />
    </TetrisGameWrapper>
  );
};

export default Game;

const TetrisGameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Empty = styled.div`
  padding-top: 20px;
`;
