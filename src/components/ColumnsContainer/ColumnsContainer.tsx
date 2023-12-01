import React, { forwardRef } from 'react';

import styles from './ColumnsContainer.module.scss';
import { createContainer } from '../../functions/createContainer';
import { cssColumRowVars } from '../../functions/grid';
import { Grid } from '../../interface';

export interface IColumnsContainerProps {
  Container: React.ReactElement<HTMLDivElement> | React.ForwardRefExoticComponent<any | React.RefAttributes<HTMLDivElement>>
  oneRow?: boolean
  className?: string
  columns: {
    grids: Grid
    className?: string
    component: React.ReactNode
  }[]
}

export const ColumnsContainer = forwardRef<HTMLDivElement, IColumnsContainerProps & React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const { Container = 'div', columns, oneRow, ...rest } = props;

  const CreatedContainer = createContainer(Container);

  return (
    <CreatedContainer ref={ref} {...rest}>
      {columns.map((column, index) => {
        return (
          <div style={cssColumRowVars(column.grids)} className={`${oneRow ? styles.oneRow : ''} ${column.className || ''}`} data-grid={true} key={index}>
            {column.component}
          </div>
        )
      })}
    </CreatedContainer>
  );
});

ColumnsContainer.displayName = 'ColumnsContainer';