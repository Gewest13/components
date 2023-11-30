import React, { cloneElement, createElement, forwardRef, isValidElement } from 'react';

import styles from './ColumnsContainer.module.scss';
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

const CreateContainer = (Container: any) => {
  const ForwardComponent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
    if (isValidElement(Container)) {
      return cloneElement(Container, { ...props });
    }

    return createElement(Container, { ...props, ref });
  })

  ForwardComponent.displayName = 'Container';

  return ForwardComponent;
}

export const ColumnsContainer = forwardRef<HTMLDivElement, IColumnsContainerProps & React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const { Container = 'div', columns, oneRow, ...rest } = props;

  const CreatedContainer = CreateContainer(Container);

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