import React, { forwardRef, isValidElement } from 'react';

import styles from './ColumnsContainer.module.scss';
import { cssColumRowVars } from '../../functions/grid';
import { Grid } from '../../interface';

export interface IColumnsContainerProps {
  Container: React.ElementType
  oneRow?: boolean
  columns: {
    grids: Grid
    className?: string
    component: React.ReactNode
  }[]
}

export const ColumnsContainer = forwardRef<HTMLDivElement, IColumnsContainerProps & React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const { Container = 'div', columns, oneRow, ...rest } = props;

  return (
    <Container ref={ref} {...rest}>
      {columns.map((column, index) => {
        if (!isValidElement(column.component)) return null;

        if (!column.component.props.children) return null;

        return (
          <div style={cssColumRowVars(column.grids)} className={`${oneRow ? styles.oneRow : ''} ${column.className || ''}`} data-grid={true} key={index}>
            {column.component}
          </div>
        )
      })}
    </Container>
  );
});

ColumnsContainer.displayName = 'ColumnsContainer';