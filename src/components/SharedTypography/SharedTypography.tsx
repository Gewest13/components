'use client';

import React, { forwardRef, ButtonHTMLAttributes, HTMLAttributes, useRef, useEffect, useImperativeHandle } from 'react';

import { splitLetters, splitWords, splitLines } from 'textsplitter';

import { cssMarginVars } from '../../functions/margin';
import { Ivwsizes, Margins } from '../../interface';

export interface TTypography {
  uppercase?: boolean;
  children?: React.ReactNode;
  margins?: Margins;
  block?: boolean;
  split?: {
    type: 'letters' | 'words' | 'lines';
    open: string;
    close: string;
  };
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
type DivProps = HTMLAttributes<HTMLDivElement>;

// export type TypographyImperativeHandle = {
//   typoRef: HTMLButtonElement | HTMLDivElement;
//   splitRef: ReturnType<typeof splitLetters> | ReturnType<typeof splitWords> | ReturnType<typeof splitLines>;
// }

export type TTypographyType =
  | ({ tag: 'button' } & ButtonProps)
  | ({ tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'li' | 'a' | 'div' | 'small' | 'label' } & DivProps);

export const SharedTypography = forwardRef<HTMLButtonElement | HTMLDivElement, TTypographyType & Ivwsizes & TTypography>((props, ref) => {
  const { tag, children, uppercase, style, color, block, vwSizes, margins, split, ...rest } = props;

  const typoRef = useRef() as React.MutableRefObject<HTMLButtonElement | HTMLDivElement>;
  const splitRef = useRef() as React.MutableRefObject<ReturnType<typeof splitLetters> | ReturnType<typeof splitWords> | ReturnType<typeof splitLines>>;

  useImperativeHandle(ref, () => typoRef.current, []);

  useEffect(() => {
    if (!split || !typoRef.current) return () => {};

    const setSplitFunctions = {
      letters: splitLetters,
      words: splitWords,
      lines: splitLines,
    };

    const splitFunction = setSplitFunctions[split.type];

    splitRef.current = splitFunction(typoRef.current, split.open, split.close);

    console.log(splitRef.current);

    return () => {
      splitRef.current.destroy();
    };
  }, [split, typoRef]);

  if (!children) return null;

  const Tag = tag as React.ElementType;

  return (
    <Tag
      ref={typoRef}
      data-margin={!!margins}
      style={{
        textTransform: uppercase ? 'uppercase' : undefined,
        color,
        display: block ? 'block' : undefined,
        ...cssMarginVars(margins, { vwSizes: vwSizes }),
        ...style,
      }}
      dangerouslySetInnerHTML={typeof children === 'string' ? { __html: children } : undefined}
      {...rest}
    >
      {typeof children === 'string' ? null : children}
    </Tag>
  );
});

SharedTypography.displayName = 'SharedTypography';