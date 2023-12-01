/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Grids, ColumnGrid } from "../interface";

export const cssGridsVars = (grids?: Grids) => grids && Object.keys(grids).reduce((acc, key) => {
  // @ts-ignore if someone can fix this issue, please do
  if (grids[key]) acc[`--grid-${key}`] = grids[key];
  return acc;
}, {} as React.CSSProperties);

type LenientCSSProperties = React.CSSProperties & {
  [key: string]: string | undefined;
}

export const cssColumRowVars = (grid?: ColumnGrid): LenientCSSProperties | undefined => {
  if (!grid) return undefined;

  return (['mobile', 'tablet', 'desktop'] as const).reduce((acc: LenientCSSProperties, device) => {
    const deviceGrid = grid[device];
    if (deviceGrid) {
      acc[`--column-${device}`] = deviceGrid.column;
      acc[`--row-${device}`] = deviceGrid.row;
    }
    return acc;
  }, {});
}