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
  src: {
    mobile: {
      mediaItemUrl: '/static/media/src/stories/assets/image.jpg'
    },
    tablet: {
      mediaItemUrl: '/static/media/src/stories/assets/image.jpg'
    },
    desktop: {
      mediaItemUrl: '/static/media/src/stories/assets/image.jpg'
    }
  },
  ratios: {
    mobile: [200, 200],
    tablet: [100, 100],
    desktop: [100, 100]
  }
};