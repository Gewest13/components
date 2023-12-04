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
    if (ref.current && ref.current.splitRef) {
      console.log(ref.current.splitRef);
    }
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


