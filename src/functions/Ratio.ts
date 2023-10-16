import { FileRatios } from "../interface";

export const cssRatioVar = (ratio: FileRatios['desktop']) => ({ "--aspect-ratio": `${ratio ? ratio[0] / ratio[1] : 1}` } as React.CSSProperties);
