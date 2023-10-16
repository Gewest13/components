import { ComponentStory } from "@storybook/react";
import React from "react";
import { Image } from "./Image";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Image",
  component: Image,
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Image> = (args) => <Image {...args} />;

export const ImageComponent = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
ImageComponent.args = {
  label: 'Image',
};