import styled from '@emotion/styled';
import { Board } from '@/feature/tetris/Borad';
import { useState } from 'react';
import { GameStatus } from '@/feature/tetris/types';
import ModalPortal from '@/components/ModalPortal';

const Game = () => {
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const handleGameStart = () => setGameStatus('playing');
  const handleGamePause = () => setGameStatus('pause');
  const handleGameEnd = () => setGameStatus('idle');

  return (
    <TetrisGameWrapper>
      <Empty />
      <button onClick={handleGamePause}>게임 일시 정지</button>

      <Board gameStatus={gameStatus} />
      {(gameStatus === 'idle' || gameStatus === 'pause') && (
        <ModalPortal closePortal={() => undefined}>
          <div>
            <h2>게임 옵션</h2>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <button onClick={handleGameStart}>게임 시작</button>
              <button onClick={handleGameEnd}>게임 종료</button>
            </div>
          </div>
        </ModalPortal>
      )}
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
