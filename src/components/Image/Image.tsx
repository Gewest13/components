/* eslint-disable react/display-name */
import React, { forwardRef } from 'react'
import { IFileComponent } from '../../interface';
import NextImage from 'next/image';
import { cssMarginVars } from '../../functions/margin';
import { cssRatioVar } from '../../functions/ratios';

import styles from './Image.module.scss';

export interface IImage extends IFileComponent {
  priority?: boolean;
}

export const Image = forwardRef<HTMLDivElement, IImage & React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const { src, margins, ratios, priority, ...rest } = props

  return (
    <div data-margin style={cssMarginVars(margins)} ref={ref} {...rest}>
      {Object.keys(src).map((key, index) => {
        const item = src[key as 'desktop'] as IImage['src']['desktop'];
        const ratio = ratios[key as 'desktop'] as IImage['ratios']['desktop'];

        return (
          <div data-viewport={key} key={index} className={styles.imageWrap} style={cssRatioVar(ratio)}>
            <NextImage
              className={styles.image}
              data-viewport={key}
              key={index}
              src={item.mediaItemUrl}
              alt={item.altText || ''}
              width={ratio[0]}
              height={ratio[1]}
              priority={priority}
              loading={priority ? 'eager' : 'lazy'}
            />
          </div>
        )
      })}
    </div>
  )
})

export default Image;