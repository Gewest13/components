'use client';

import React, { forwardRef } from 'react'

import NextImage from 'next/image';

import styles from './Image.module.scss';
import { cssMarginVars } from '../../functions/margin';
import { cssRatioVar } from '../../functions/ratios';
import { IFileComponent } from '../../interface';

export interface IImage extends IFileComponent {
  /**
   * If true, the image will be loaded immediately.
   * @default false
  */
  priority?: boolean;
  /**
   * The quality of the image.
   * @default 70
  */
  quality?: number;
}

/**
 * Image is a React component that renders an image based on the provided props.
 *
 * @param props - The properties passed to the component, which include:
 *  - `src`: The source of the image for each viewport.
 *  - `margins`: Optional. The margins for each viewport.
 *  - `ratios`: Optional. The ratios for each viewport.
 *  - `priority`: Optional. If true, the image will be loaded immediately.
 *  - `quality`: Optional. The quality of the image.
 * @param ref - Ref forwarded to the container.
 * @returns A React element representing the image.
 *
 * @example
 * <Image
 *   src={{ desktop: desktopSrc, tablet: tabletSrc, mobile: mobileSrc }}
 *   margins={{ desktop: [100, 0, 100, 0], mobile: [100, 0, 100, 0] }}
 *   ratios={{ desktop: [200, 200], tablet: [100, 100], mobile: [100, 100] }}
 *   priority={true}
 *   quality={70}
 * />
 */
export const Image = forwardRef<HTMLDivElement, IImage & React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const { src, margins, ratios, priority, quality = 70, ...rest } = props

  return (
    <div data-margin={!!margins} style={cssMarginVars(margins)} ref={ref} {...rest}>
      {Object.keys(src).map((key, index) => {
        const item = src[key as 'desktop'] as IImage['src']['desktop'];
        const ratio = ratios[key as 'desktop'] as IImage['ratios']['desktop'];

        if (!item) return null;
        if (!item.mediaItemUrl) return null;

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
              quality={quality}
            />
          </div>
        )
      })}
    </div>
  )
})

Image.displayName = 'Image'