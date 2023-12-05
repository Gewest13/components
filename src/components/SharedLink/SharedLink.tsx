import React, { forwardRef, ForwardedRef } from 'react';

import NextLink from 'next/link';

interface LinkInterface {
  href?: string;
  target?: string;
  customTag?: string;
  title?: string;
  'aria-label'?: string;
  children?: any;
  className?: string;
  type?: 'submit' | 'button';
  disabled?: boolean;
}

export const SharedLink = forwardRef((props: LinkInterface & React.HTMLAttributes<HTMLDivElement | HTMLButtonElement | HTMLAnchorElement>, ref?: ForwardedRef<any>) => {
  const { href, type, disabled, children, title, target, 'aria-label': ariaLabel, customTag, ...rest } = props;

  if (!title && !children) return null;

  if (customTag) {
    const CustomTag = `${customTag || 'span'}` as any;

    return (
      <CustomTag ref={ref} {...rest}>
        {children || title}
      </CustomTag>
    );
  }

  if (!href || type === 'button' || type === 'submit') {
    return (
      <button
        aria-label={ariaLabel}
        ref={ref}
        type={type === 'button' ? 'button' : 'submit'}
        disabled={disabled}
        {...rest}
      >
        {children || title}
      </button>
    );
  }

  return (
    <NextLink
      href={href}
      ref={ref}
      aria-label={ariaLabel}
      target={target || '_self'}
      // Scroll true is preferred
      // scroll={false}
      {...rest}
    >
      {title && title}
      {children && children}
    </NextLink>
  );
});

SharedLink.displayName = 'SharedLink';
