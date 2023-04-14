import styled from '@emotion/styled';
import React from 'react';
import Board from '@/feature/tetris/Board';

const TetrisGame = () => {
  return (
    <TetrisGameWrapper>
      <Empty />
      <Board />
    </TetrisGameWrapper>
  );
};

export default TetrisGame;

const TetrisGameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Empty = styled.div`
  padding-top: 20px;
`;
