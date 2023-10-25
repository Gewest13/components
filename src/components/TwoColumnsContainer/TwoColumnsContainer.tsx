/* eslint-disable react/display-name */
import React, { forwardRef } from 'react'

import styles from './TwoColumnsContainer.module.scss';
import { cssGridsVars } from '../../functions/grid';

interface IColumn {
  grids: {
    desktop: string;
    tablet: string;
    mobile: string;
  }
  className?: string;
  render: React.ReactNode;
}

export interface ITwoColumnsContainer {
  CointainerTag: any;
  column1: IColumn;
  column2: IColumn;
}

export const TwoColumnsContainer = forwardRef<HTMLDivElement, ITwoColumnsContainer & React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const { CointainerTag = 'p', column1, column2, } = props

  return (
    <CointainerTag ref={ref}>
      <div style={cssGridsVars(column1.grids)} className={`${styles.gridItem} ${column1.className || ''}`} data-grid={true}>
        {column1.render}
      </div>
      <div style={cssGridsVars(column2.grids)}  className={`${styles.gridItem} ${column2.className || ''}`} data-grid={true}>
        {column2.render}
      </div>
    </CointainerTag>
  )
})