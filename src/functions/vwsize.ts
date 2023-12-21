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

export const vwsizes: { [key: string]: number } = { desktop: 1728, tablet: 1024, mobile: 432 };

export const allVwSizes = (px: number, key: string, customVwsizes?: any) => {
  const size = (customVwsizes || vwsizes)[key];

  return `${(px / size) * 100}vw`;
}
