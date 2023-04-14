import { PropertiesHyphen } from 'csstype';
import { useEffect, useLayoutEffect } from 'react';

export const isCSR = () => typeof window === 'undefined';
export const useSafeEffect = isCSR() ? useLayoutEffect : useEffect;

const mediaQuery = () => {
  let mobileSize = 420;
  let tabletSize = 900;
  const build = () => ({
    mobile: `@media (width >=0px) and (width <${mobileSize}px)`,
    tablet: `@media  (width >=${mobileSize}px) and (width <${tabletSize}px)`,
    pc: `@media (min-width: ${tabletSize}px)`,
  });
  const setMaxMobileSize = (aMobileSize: number) => {
    if (0 >= aMobileSize) {
      console.warn(`mobileSize should be greater then 0`);
    }
    mobileSize = aMobileSize;
  };
  const setMaxTabletSize = (aTabletSize: number) => {
    if (mobileSize >= aTabletSize) {
      console.warn(`aTabletSize should be greater then mobileSize`);
    }
    tabletSize = aTabletSize;
  };

  return {
    build,
    setMaxMobileSize,
    setMaxTabletSize,
  };
};

export const mediaQueryBuilder = mediaQuery();
type ResponsibleCSSProperties = {
  [key in keyof PropertiesHyphen]:
    | [PropertiesHyphen[key], PropertiesHyphen[key], PropertiesHyphen[key]]
    | [
        PropertiesHyphen[key],
        PropertiesHyphen[key] | undefined,
        PropertiesHyphen[key],
      ]
    | [PropertiesHyphen[key], PropertiesHyphen[key]]
    | [PropertiesHyphen[key]]
    | PropertiesHyphen[key];
};

export const responsibleCss = (props: ResponsibleCSSProperties) => `
    ${Object.entries(props)
      .map(([key, lis]) =>
        !Array.isArray(lis) || lis.length === 1 ? `${key}: ${lis};` : '',
      )
      .join('\n')}
      
    ${mediaQueryBuilder.build().mobile} {
      ${Object.entries(props)
        .map(([key, lis]) => `${key}: ${Array.isArray(lis) ? lis[0] : lis};`)
        .join('\n')}
    }

    ${mediaQueryBuilder.build().tablet} {
      ${Object.entries(props)
        .map(([key, lis]) =>
          Array.isArray(lis) && lis[1] ? `${key}: ${lis[1]};` : '',
        )
        .join('\n')}
    }

    ${mediaQueryBuilder.build().pc} {
      ${Object.entries(props)
        .map(([key, lis]) =>
          Array.isArray(lis) && lis[2] ? `${key}: ${lis[2]};` : '',
        )
        .join('\n')}
    }
  `;

export const deepCopy = <T extends unknown>(item: T) => {
  return JSON.parse(JSON.stringify(item)) as T;
};
