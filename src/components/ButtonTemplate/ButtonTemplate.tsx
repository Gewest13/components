import React, { forwardRef, AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'

import { cssMarginVars } from '../../functions';
import { Ivwsizes, Margins, TLink } from '../../interface';
import { SharedLink } from '../SharedLink/SharedLink';

interface TButtonBase {
  title?: string;
  className?: string;
  margins?: Margins;
  src: TLink
}

type TButtonAnchor = TButtonBase & AnchorHTMLAttributes<HTMLAnchorElement>;
type TButtonButton = TButtonBase & ButtonHTMLAttributes<HTMLButtonElement>;

export type TButton = { type?: undefined } & TButtonAnchor | { type?: 'button' | 'submit' } & TButtonButton;

export const ButtonTemplate = forwardRef<HTMLAnchorElement | HTMLButtonElement, TButton & Ivwsizes>((props, ref) => {
  const { src, margins, vwSizes, title, children, ...rest } = props;

  return (
    <SharedLink
      data-margin={!!margins}
      href={src.url} target={src.target}
      style={cssMarginVars(margins, { vwSizes: vwSizes })}
      ref={ref}
      {...rest}
    >
      {/* Children are more important */}
      {children || title || src.title}
    </SharedLink>
  )
});

ButtonTemplate.displayName = 'ButtonTemplate';
