import React from "react";

import { StoryFn } from "@storybook/react";

import { Swiper, SwiperCard, ISwiper, SwiperImperativeHandle } from "./Swiper";
import styles from './SwiperStories.module.scss';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Swiper",
  component: Swiper,
};

type SwiperArgs = ISwiper & { cards: { title: string }[] };

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<SwiperArgs> = ({ cards, ...rest }: SwiperArgs) => {
  const ref = React.useRef() as React.MutableRefObject<SwiperImperativeHandle>;

  const handlePrev = () => {
    ref.current.handleClick('prev');
  }

  const handleNext = () => {
    ref.current.handleClick('next');
  }

  return (
    <>
      <Swiper {...rest} ref={ref} snap={true}>
        {cards.map((card, index) => (
          <SwiperCard className={styles.slide} key={index}>
            {card.title}
          </SwiperCard>
        ))}
      </Swiper>
      <button onClick={handlePrev}>previous</button>
      <button onClick={handleNext}>next</button>
    </>
  )
};

export const SwiperComponent = Template.bind({});
SwiperComponent.args = {
  cards: [
    { title: 'Card 1' },
    { title: 'Card 2' },
    { title: 'Card 3' },
    { title: 'Card 4' },
    { title: 'Card 5' },
  ]
}