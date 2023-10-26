import React from "react";

import { StoryFn } from "@storybook/react";

import { ColumnsContainer } from "./ColumnsContainer";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/ColumnsContainer",
  component: ColumnsContainer,
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof ColumnsContainer> = (args) => <ColumnsContainer {...args} />;

export const ImageComponent = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
ImageComponent.args = {
  Container: 'div',
  columns: [
    {
      grids: {
        desktop: { column: '1 / 4' },
        mobile: { column: '1 / -1' }
      },
      component: <div>Test</div>
    },
    {
      grids: {
        desktop: { column: '1 / 4' },
        mobile: { column: '1 / -1', row: '1 / 2' },
        tablet: { column: '1 / -1', row: '1 / 2' }
      },
      component: <></>
    },
  ]
};