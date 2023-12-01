import React, { forwardRef } from 'react';

import styles from './ColumnsContainer.module.scss';
import { createContainer } from '../../functions/createContainer';
import { cssColumRowVars } from '../../functions/grid';
import { Grid } from '../../interface';

export interface IColumnsContainerProps {
  Container: React.ReactElement<HTMLDivElement> | React.ForwardRefExoticComponent<any | React.RefAttributes<HTMLDivElement>>;
  oneRow?: boolean;
  className?: string;
  columns: {
    grids: Grid;
    className?: string;
    component: React.ReactNode;
  }[];
}

/**
 * ColumnsContainer is a React component that renders a set of columns based on the provided props.
 *
 * @param props - The properties passed to the component, which include:
 *   - `Container`: The container element or component to be used. Defaults to `div`.
 *   - `oneRow`: Optional. If true, displays the layout in one row.
 *   - `className`: Optional. Additional custom CSS class name.
 *   - `columns`: Array of objects defining each column's grid, className, and component.
 * @param ref - Ref forwarded to the container.
 * @returns A React element representing the container with columns.
 *
 * @example
 * <ColumnsContainer
 *   Container={<Container desktopRow={60} />}
 *   className={styles.container}
 *   oneRow={false}
 *   columns={[
 *     {
 *       grids: { desktop: { column: '1 / -1' }, tablet: { column: '1 / span 2', row: '1 / 3' } }, mobile: { column: '1 / -1' } },
 *       className: styles.column1,
 *       component: (
 *         <MyComponent />
 *       )
 *     }
 *   ]}
 * />
 */
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
