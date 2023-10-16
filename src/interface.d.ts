export interface Margins {
  /** Margin for mobile devices */
  mobile?: [string, string, string, string];
  /** Margin for tablet devices */
  tablet?: [string, string, string, string];
  /** Margin for desktop devices */
  desktop?: [string, string, string, string];
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