import { css } from '@emotion/react';
import { responsibleCss } from '@/utils';
import React from 'react';
import { tileOptions } from '@/feature/constants';

const tileCss = css`
  border: 0.5px solid #7f7f7f;
`;

const tileCssColor = (color: string) =>
  css`
    background-color: ${color};
  `;
const tileCssSize = css(
  responsibleCss({
    width: [
      `${tileOptions.responsibleTileSize[0]}px`,
      `${tileOptions.responsibleTileSize[1]}px`,
      `${tileOptions.responsibleTileSize[2]}px`,
    ],
    height: [
      `${tileOptions.responsibleTileSize[0]}px`,
      `${tileOptions.responsibleTileSize[1]}px`,
      `${tileOptions.responsibleTileSize[2]}px`,
    ],
  }),
);

type TileProps = {
  color: string;
  size: number;
  idx: number;
};

const Tile = ({ color }: TileProps) => {
  return <div css={[tileCss, tileCssColor(color), tileCssSize]} />;
};

export default React.memo(Tile);
