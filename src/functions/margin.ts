/* eslint-disable @typescript-eslint/ban-ts-comment */

import { allVwSizes } from "./vwsize";
import { Ivwsizes, Margins } from "../interface";

export const cssMarginVars = (margins?: Margins, vwsizes?: Ivwsizes['vwSizes']) => margins && Object.keys(margins).reduce((acc, key) => {
  // @ts-ignore if someone can fix this issue, please do
  if (margins[key]) acc[`--margin-${key}`] = margins[key].map((size: number) => allVwSizes(size, key, vwsizes)).join(" ");
  return acc;
}, {} as React.CSSProperties);