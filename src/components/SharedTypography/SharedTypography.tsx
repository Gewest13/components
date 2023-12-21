'use client';

import React, { forwardRef, ButtonHTMLAttributes, HTMLAttributes, useRef, useEffect, useImperativeHandle, useState } from 'react';

import { splitLetters, splitWords, splitLines } from 'textsplitter';

import { cssMarginVars } from '../../functions/margin';
import { Ivwsizes, Margins } from '../../interface';

export interface TTypography {
  uppercase?: boolean;
  children?: React.ReactNode;
  margins?: Margins;
  block?: boolean;
  varColor?: string;
  split?: {
    type: 'letters' | 'words' | 'lines';
    open: string;
    close: string;
  };
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
type DivProps = HTMLAttributes<HTMLDivElement>;

export type TypographyImperativeHandle = {
  typoRef: HTMLButtonElement | HTMLDivElement;
  split?: { container: HTMLElement; destroy: () => void; };
}

export type TTypographyType =
  | ({ tag: 'button' } & ButtonProps)
  | ({ tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'li' | 'a' | 'div' | 'small' | 'label' } & DivProps);

export const SharedTypography = forwardRef<TypographyImperativeHandle, TTypographyType & Ivwsizes & TTypography>((props, ref) => {
  const { tag, children, uppercase, style, color, varColor, block, vwSizes, margins, split, ...rest } = props;

  const typoRef = useRef() as React.MutableRefObject<HTMLButtonElement | HTMLDivElement>;
  const [splitState, setSplitState] = useState<{ container: HTMLElement; destroy: () => void; }>();

  useImperativeHandle(ref, () => ({
    typoRef: typoRef.current,
    split: splitState
  }), [splitState]);

  useEffect(() => {
    if (!split || !typoRef.current) return () => {};

    const setSplitFunctions = {
      letters: splitLetters,
      words: splitWords,
      lines: splitLines,
    };

    const splitFunction = setSplitFunctions[split.type];
    const splitFn = splitFunction(typoRef.current, split.open, split.close);

    setSplitState(splitFn);

    return () => {
      splitFn.destroy();
    };
  }, [split, typoRef]);

  if (!children) return null;

  const Tag = tag as React.ElementType;

  let setColor = color;

  if (varColor) {
    setColor = `var(--color-${varColor})`;
  }

  return (
    <Tag
      ref={typoRef}
      data-margin={!!margins}
      style={{
        textTransform: uppercase ? 'uppercase' : undefined,
        color: setColor,
        display: block ? 'block' : undefined,
        ...cssMarginVars(margins, vwSizes),
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