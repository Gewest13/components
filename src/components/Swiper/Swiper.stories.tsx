import { StoryFn } from "@storybook/react";
import React from "react";
import Swiper, { SwiperCard, ISwiper } from "./Swiper";

import styles from './SwiperStories.module.scss';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Swiper",
  component: Swiper,
};

type SwiperArgs = ISwiper & { cards: { title: string }[] };

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<SwiperArgs> = ({ cards, ...rest }: SwiperArgs) => (
  <Swiper className={styles.swiper} {...rest}>
    {cards.map((card, index) => (
      <SwiperCard className={styles.slide} key={index}>
        {card.title}
      </SwiperCard>
    ))}
  </Swiper>
);

export const SwiperComponent = Template.bind({});
SwiperComponent.args = {
  cards: [
    {title: 'Card 1'},
    {title: 'Card 2'},
    {title: 'Card 3'},
    {title: 'Card 4'},
    {title: 'Card 5'},
  ]
}