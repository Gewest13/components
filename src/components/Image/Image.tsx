import React from 'react'

export interface IImage {
  /** Aspect ratio for desktop view (width, height) */
  ratio: [number, number];
  /** Image src for different device types */
  // src: TFile;
  label: string
}

export const Image = (props: IImage) => {
  const { label } = props

  return (
    <div>{label}</div>
  )
}
