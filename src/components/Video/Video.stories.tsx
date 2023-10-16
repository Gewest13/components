import { ComponentStory } from "@storybook/react";
import React from "react";
import {Video} from "./Video";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Video",
  component: Video,
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Video> = (args) => <Video {...args} />;

export const VideoComponent = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
VideoComponent.args = {
  ratio: [100, 100],
  src: {
    mediaItemUrl: 'https://lucis.gwst13.com/wp-content/uploads/2023/09/HTCE-Sequence-02_4.mp4'
  }
};