import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import Input from "./Input";

export default {
  title: "Components/Input",
  component: Input,
} as Meta<typeof Input>;

const Template: StoryFn<typeof Input> = (args) => <Input {...args} />;

export const DefaultInput = Template.bind({});
DefaultInput.args = {
  placeholder: "Text",
};

export const DisabledInput = Template.bind({});
DisabledInput.args = {
  disabled: true,
  placeholder: "Text",
};