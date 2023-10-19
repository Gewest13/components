/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Margins } from "../interface";
import { allVwSizes } from "./vwsize";

export const cssMarginVars = (margins?: Margins) => margins && Object.keys(margins).reduce((acc, key) => {
  // @ts-ignore if someone can fix this issue, please do
  if (margins[key]) acc[`--margin-${key}`] = margins[key].map((size: number) => allVwSizes(size, key)).join(" ");
  return acc;
}, {} as React.CSSProperties);