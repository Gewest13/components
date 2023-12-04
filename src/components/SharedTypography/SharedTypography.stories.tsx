import React, { useRef, useEffect } from "react";

import { StoryFn } from "@storybook/react";

import { SharedTypography } from "./SharedTypography";


export default {
  title: "Components/SharedTypography",
  component: SharedTypography,
};

const Template: StoryFn<typeof SharedTypography> = ({ ...rest }) => {
  console.log('hoh');

  const ref = useRef() as any;

  useEffect(() => {
    const chars = ref.current.typoRef.querySelectorAll('span');

    chars.forEach((char: any) => {
      char.style.transition = 'transform 0.5s ease-out';
      char.style.transform = 'translateY(100%)';
      char.style.display = 'inline-block';

      setTimeout(() => {
        char.style.transform = 'translateY(0)';
      });
    });

    setTimeout(() => {
      ref.current.state.split.destroy();
    }, 600);
  }, [ref]);


  return <SharedTypography ref={ref} {...rest} />;
};

export const SharedTypoGraphyComponent = Template.bind({});

SharedTypoGraphyComponent.args = {
  tag: 'h1',
  children: 'Hello World',
  uppercase: true,
  split: {
    type: 'letters',
    open: '<span>',
    close: '</span>'
  }
};


