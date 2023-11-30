'use client';

import React, { ReactNode, ElementType, forwardRef, isValidElement, cloneElement, createElement } from 'react';

import styles from './ColumnsContainer.module.scss';
import { cssColumRowVars } from '../../functions/grid';
import { Grid } from '../../interface';

export interface IColumnsContainerProps {
  Container: ReactNode | string | ElementType<any>;
  className?: string
  oneRow?: boolean
  columns: {
    grids: Grid
    className?: string
    component: React.ReactNode
  }[]
}
const withForwardedRef = (Component: any) => {
  const ForwardedComponent = forwardRef<HTMLDivElement, any>((props, ref) => {
    if (isValidElement(Component)) {
      return cloneElement(Component, { ...props, ref });
    } else if (typeof Component === 'string' || typeof Component === 'function') {
      return createElement(Component, { ...props, ref });
    }
    return null;
  });

  ForwardedComponent.displayName = `WithForwardedRef(${Component.displayName || Component.name || 'Component'})`;

  return ForwardedComponent;
};

export const ColumnsContainer = forwardRef<HTMLDivElement, IColumnsContainerProps>((props, ref) => {
  const { Container, className, columns, oneRow = false, ...rest } = props;

  const ContainerWithRef = withForwardedRef(Container);

  return (
    <ContainerWithRef className={className} ref={ref} {...rest}>
      {columns.map((column, index) => (
        <div style={cssColumRowVars(column.grids)} className={`${oneRow ? styles.oneRow : ''}${column.className ? ` ${column.className}` : ''}`} data-grid={true} key={index}>
          {column.component}
        </div>
      ))}
    </ContainerWithRef>
  );
});

ColumnsContainer.displayName = 'ColumnsContainer';