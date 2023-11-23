'use client';

import React, { forwardRef } from 'react'

import NextImage from 'next/image';

import styles from './Image.module.scss';
import { cssMarginVars } from '../../functions/margin';
import { cssRatioVar } from '../../functions/ratios';
import { IFileComponent } from '../../interface';

export interface IImage extends IFileComponent {
  priority?: boolean;
}

export const Image = forwardRef<HTMLDivElement, IImage & React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const { src, margins, ratios, priority, ...rest } = props

  return (
    <div data-margin={!!margins} style={cssMarginVars(margins)} ref={ref} {...rest}>
      {Object.keys(src).map((key, index) => {
        const item = src[key as 'desktop'] as IImage['src']['desktop'];
        const ratio = ratios[key as 'desktop'] as IImage['ratios']['desktop'];

        if (!item) return null;
        if (!item.mediaItemUrl) return null;

        return (
          <div data-viewport={key} key={index} className={styles.imageWrap} style={{ ...cssRatioVar(ratio), aspectRatio: ratio[0] / ratio[1] }}>
            <NextImage
              style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
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

Image.displayName = 'Image'