// import getConfig from './getConfig';

export const desktopvw = (size: number) => {
  return `calc((100vw / var(--vwsizes-desktop)) * ${size})`
}

export const tabletvw = (size: number) => {
  return `calc((100vw / var(--vwsizes-tablet)) * ${size})`
}

export const mobilevw = (size: number) => {
  return `calc((100vw / var(--vwsizes-mobile)) * ${size})`
}

export const allVwSizes = (px: number, key: string) => {
  const vwsizes: {
    [key: string]: number
  } = { desktop: 1728, tablet: 1024, mobile: 432 };
  const size = vwsizes[key];

  return `${(px / size) * 100}vw`;
}
