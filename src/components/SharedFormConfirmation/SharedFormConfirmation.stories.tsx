import React, { useEffect, useState } from 'react';

import { StoryFn } from "@storybook/react";


import { SharedFormConfirmation, SharedFormConfirmationProps } from './SharedFormConfirmation';

export default {
  title: 'Components/SharedFormConfirmation',
  component: SharedFormConfirmation,
};

const Template: StoryFn<SharedFormConfirmationProps> = (args) => {
  const [confirmation, setConfirmation] = useState<{ id: number }>({ id: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setConfirmation({ id: Math.floor(Math.random() * 100) });
    }, 2900);

    return () => clearInterval(interval);
  }, []);

  return(
    <SharedFormConfirmation { ...args} confirmation={confirmation}>
      <div style={{
        backgroundColor: 'red',
        padding: '30px'
      }}>
        {new Date().toLocaleTimeString()}
        <button>Remove Message</button>
      </div>
    </SharedFormConfirmation>
  )
};

export const FormConfirmation = Template.bind({});

FormConfirmation.args = {
  confirmation: { id: 0 },
  debug: false
};