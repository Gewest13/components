import { RefObject } from 'react';

import useScroll from './useScroll';
import { calcPercentage } from '../utils/calcPercentage';

interface Parallax {
  parallaxRef: RefObject<HTMLElement>;
  parentRef?: RefObject<HTMLElement>;
  desktop: number
  tablet?: number
  mobile?: number
  topOfPage?: boolean;
}

const useParallax = (data: Parallax) => {
  const { parallaxRef, parentRef, desktop, tablet, mobile, topOfPage = false } = data;

  console.log(tablet, mobile);

  useScroll(() => {
    const { current: scrollElementRef } =  parentRef || parallaxRef;
    const { current: parallaxElementRef } = parallaxRef;

    if (!scrollElementRef || !parallaxElementRef) return;

    const { y: elementPositionY, height: elementHeight } = scrollElementRef.getBoundingClientRect();

    const scrollPercentage = calcPercentage({ y: elementPositionY - (!topOfPage ? window.innerHeight : 0), until: elementHeight + (!topOfPage ? window.innerHeight : 0) });

    parallaxElementRef.style.transform = `translateY(${scrollPercentage * desktop}px)`;
  })
};

export default useParallax;