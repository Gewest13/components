export interface TFile {
  mediaItemUrl: string
  altText?: string
}

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

export interface FileSource {
  /** URL of the File source for desktop devices */
  desktop: TFile;
  /** URL of the File source for tablet devices */
  tablet?: TFile;
  /** URL of the File source for mobile devices */
  mobile?: TFile;
}

export interface FileRatios {
  /** Aspect ratio for desktop view (width, height) */
  desktop: [number, number];
  /** Aspect ratio for tablet view (width, height) */
  tablet?: [number, number];
  /** Aspect ratio for mobile view (width, height) */
  mobile?: [number, number];
}

export interface IFileComponent {
  /** File src for different device types */
  src: FileSource;
  /** Aspect ratios for different device types */
  ratios: FileRatios;
  /** Margins for different device types */
  margins?: Margins;
}