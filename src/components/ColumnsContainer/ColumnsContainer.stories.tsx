import React, { useRef } from "react";

import { StoryFn } from "@storybook/react";

import { ColumnsContainer } from "./ColumnsContainer";
import useParallax from "../../hooks/useParallax";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/ColumnsContainer",
  component: ColumnsContainer,
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof ColumnsContainer & { test?: string }> = ({ ...rest }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  useParallax({
    parallaxRef: ref,
    parentRef,
    desktop: 240,
    tablet: 180,
    mobile: 120,
    topOfPage: false
  });

  return(
    <ColumnsContainer
      {...rest}
      Container={<div />}
      columns={[
        {
          grids: { desktop: { column: '1 / -1', row: '1 / 2', alignSelf: 'center' }, mobile: { column: '1 / -1', row: '1 / 2' } },
          component: <div ref={parentRef}>
            <h1 ref={ref} >Column 1</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias enim odit dolorem ipsum, laudantium officia quam quibusdam voluptatum dolore fuga aliquam? Consectetur, cum. Ea ut dolore obcaecati iusto et velit!</p>
          </div>
        },
        {
          grids: { desktop: { column: '1 / -1', row: '1 / 2', alignSelf: 'center' }, mobile: { column: '1 / -1', row: '1 / 2' } },
          component: undefined
        }
      ]}
    />
  )
};

export const ImageComponent = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
ImageComponent.args = {
  Container: <div />,
  columns: [
    {
      grids: {
        desktop: { column: '1 / 4' },
        mobile: { column: '1 / -1' }
      },
      component: <div>Column 1</div>
    },
    {
      grids: {
        desktop: { column: '1 / 4' },
        mobile: { column: '1 / -1', row: '1 / 2' },
        tablet: { column: '1 / -1', row: '1 / 2' }
      },
      component: <div>Column 2</div>
    },
  ]
};