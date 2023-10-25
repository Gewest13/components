import React, { forwardRef } from 'react';

import styles from './ColumnsContainer.module.scss';
import { cssColumRowVars } from '../../functions/grid';
import { Grid } from '../../interface';



export interface IColumnsContainerProps {
  Container: React.ElementType
  columns: {
    grids: Grid
    className?: string
    component: React.ReactNode
  }[]
}

export const ColumnsContainer = forwardRef<HTMLDivElement, IColumnsContainerProps>((props, ref) => {
  const { Container = 'div', columns } = props;

  return (
    <Container ref={ref}>
      {columns.map((column, index) => {
        return (
          <div style={cssColumRowVars(column.grids)} className={`${styles.gridItem} ${column.className || ''}`} data-grid={true} key={index}>
            {column.component}
          </div>
        )
      })}
    </Container>
  );
});

ColumnsContainer.displayName = 'ColumnsContainer';