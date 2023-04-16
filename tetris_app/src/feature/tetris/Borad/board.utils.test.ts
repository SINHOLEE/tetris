import { rotate } from '@/feature/tetris/Borad/board.utils';

describe('rotate', () => {
  it('1', () => {
    const gird = [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ];
    const rotatedGrid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
    ];
    expect(rotate(gird)).toEqual(rotatedGrid);
  });
  it('2', () => {
    const gird = [
      [1, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 0, 0, 0],
    ];
    const rotatedGrid = [
      [0, 0, 0, 1],
      [0, 0, 0, 1],
      [0, 0, 0, 1],
      [0, 0, 0, 1],
    ];
    expect(rotate(rotate(gird))).toEqual(rotatedGrid);
  });
});
