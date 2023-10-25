import React from "react";

import { StoryFn } from "@storybook/react";

import { TwoColumnsContainer } from "./TwoColumnsContainer";


// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/TwoColumnsContainer",
  component: TwoColumnsContainer,
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof TwoColumnsContainer> = (args) => {
  return (
    <TwoColumnsContainer {...args}
      column1={{
        grids: {
          desktop: '1 / 4',
          tablet: '1 / -1',
          mobile: '1 / -1',
        },
        render: <p>column2</p>
      }}
      column2={{
        grids: {
          desktop: '1 / 4',
          tablet: '1 / -1',
          mobile: '1 / -1',
        },
        render: <p>column2</p>
      }} />
  )
};

export const TwoColumnsContainerComponent = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
TwoColumnsContainerComponent.args = {

};