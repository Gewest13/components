import React from 'react'
import { IFileComponent } from '../../interface';

export interface IImage extends IFileComponent {
  priority?: boolean;
}

export const Image = (props: IImage) => {
  const { src, margins, ratios } = props

  return (
    <div>Image</div>
  )
}
