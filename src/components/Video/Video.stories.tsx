import { StoryFn } from "@storybook/react";
import React, { useRef } from "react";
import { Video, VideoComponent, FullVideo, ImperativeFullVideoRef } from "./Video";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Video",
  component: Video,
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const TemplateSingleVideo: StoryFn<typeof Video> = (args) => <Video {...args} />;

export const SingleVideo = TemplateSingleVideo.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
SingleVideo.args = {
  ratio: [100, 100],
  margins: {
    mobile: [10, 10, 20, 20],
    tablet: [10, 10, 20, 20],
    desktop: [10, 10, 20, 20]
  },
  src: {
    mediaItemUrl: 'https://lucis.gwst13.com/wp-content/uploads/2023/09/HTCE-Sequence-02_4.mp4'
  }
};

const TemplateMultiScreenVideo: StoryFn<typeof VideoComponent> = (args) => <VideoComponent {...args} />;

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

const TemplateFullVideo: StoryFn<typeof FullVideo> = (args) => {
  const ref = useRef<ImperativeFullVideoRef>(null);
  
  // useEffect(() => {
  //   console.log(ref.current)

  //   setTimeout(() => {
  //     ref.current?.playFullScreen()
  //   }, 4000)
  // }, [])

return (
  <FullVideo ref={ref} style={{width: '100px', height: '100px'}} {...args} />
)};

export const FullScreenVideo = TemplateFullVideo.bind({});

FullScreenVideo.args = {
  src: {
    desktop: {
      mediaItemUrl: 'https://lucis.gwst13.com/wp-content/uploads/2023/09/HTCE-Sequence-02_4.mp4'
    }
  },
  srcFull: {
    mediaItemUrl: 'https://lucis.gwst13.com/wp-content/uploads/2023/09/HTCE-Sequence-02_4.mp4'
  },
  ratios: {
    desktop: [100, 100]
  }
}