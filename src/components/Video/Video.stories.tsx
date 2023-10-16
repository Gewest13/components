import { ComponentStory } from "@storybook/react";
import React from "react";
import { Video, VideoComponent } from "./Video";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Video",
  component: Video,
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const TemplateSingleVideo: ComponentStory<typeof Video> = (args) => <Video {...args} />;

export const SingleVideo = TemplateSingleVideo.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
SingleVideo.args = {
  ratio: [100, 100],
  src: {
    mediaItemUrl: 'https://lucis.gwst13.com/wp-content/uploads/2023/09/HTCE-Sequence-02_4.mp4'
  }
};

const TemplateMultiScreenVideo: ComponentStory<typeof VideoComponent> = (args) => <VideoComponent {...args} />;

export const MultiScreenVideo = TemplateMultiScreenVideo.bind({});

MultiScreenVideo.args = {
  src: {
    mobile: {
      mediaItemUrl: 'https://lucis.gwst13.com/wp-content/uploads/2023/09/HTCE-Sequence-02_4.mp4'
    },
    tablet: {
      mediaItemUrl: 'https://lucis.gwst13.com/wp-content/uploads/2023/09/HTCE-Sequence-02_4.mp4'
    },
    desktop: {
      mediaItemUrl: 'https://lucis.gwst13.com/wp-content/uploads/2023/09/HTCE-Sequence-02_4.mp4'
    }
  },
  ratios: {
    mobile: [100, 100],
    tablet: [100, 100],
    desktop: [100, 100]
  }
}