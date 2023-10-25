/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Grids } from "../interface";

export const cssGridsVars = (grids?: Grids) => grids && Object.keys(grids).reduce((acc, key) => {
  // @ts-ignore if someone can fix this issue, please do
  if (grids[key]) acc[`--grid-${key}`] = grids[key];
  return acc;
}, {} as React.CSSProperties);