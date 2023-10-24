import { ComponentMeta, StoryFn } from "@storybook/react";
import React from "react";
import Input from "./Input";

export default {
  title: "Components/Input",
  component: Input,
} as ComponentMeta<typeof Input>;

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