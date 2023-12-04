export interface TFile {
  /** URL of the File source */
  mediaItemUrl: string
  /** Alt text of the File source */
  altText?: string
}

/** Margins to be applied to the video container
 * @example
 * {desktop: [100, 0, 100, 0], tablet: [100, 0, 100, 0], mobile: [100, 0, 100, 0]}
*/
export interface Margins {
  /** Margin for mobile devices */
  mobile?: [number, number, number, number];
  /** Margin for tablet devices */
  tablet?: [number, number, number, number];
  /** Margin for desktop devices */
  desktop?: [number, number, number, number];
}


export interface Grids {
  /** Grid for mobile devices */
  mobile?: string;
  /** Grid for tablet devices */
  tablet?: string;
  /** Grid for desktop devices */
  desktop?: string;
}

export type ColumnGrid = {
  desktop: {
    column: string;
    row?: string;
  }
  tablet?: {
    column: string;
    row?: string;
  },
  mobile: {
    column: string;
    row?: string;
  },
};

export interface FileSource {
  /** URL of the File source for desktop devices */
  desktop: TFile;
  /** URL of the File source for tablet devices */
  tablet?: TFile;
  /** URL of the File source for mobile devices */
  mobile?: TFile;
}

export interface FileRatios {
  /** Aspect ratio for desktop view [width, height] */
  desktop: [number, number];
  /** Aspect ratio for tablet view [width, height] */
  tablet?: [number, number];
  /** Aspect ratio for mobile view [width, height] */
  mobile?: [number, number];
}

export interface IFileComponent {
  /** File src for different device types */
  src: FileSource;
  /** Aspect ratios for different device types */
  ratios: FileRatios;
  /** Margins to be applied to the video container */
  margins?: Margins;
}
