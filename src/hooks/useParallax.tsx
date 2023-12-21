import { RefObject } from 'react';

import useScroll from './useScroll';
import { allVwSizes, vwsizes } from '../functions/vwsize';
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

  const setTransformStyle = (size: number, device: string) => {
    if (parallaxRef.current) {
      parallaxRef.current.style.translate = `0 ${allVwSizes(size, device)}`;
    }
  };

  useScroll(() => {
    const { current: scrollElementRef } =  parentRef || parallaxRef;

    if (!scrollElementRef || !parallaxRef.current) return;

    const { y: elementPositionY, height: elementHeight } = scrollElementRef.getBoundingClientRect();

    const scrollPercentage = calcPercentage({ y: elementPositionY - (!topOfPage ? window.innerHeight : 0), until: elementHeight + (!topOfPage ? window.innerHeight : 0) });

    const deviceType = window.innerWidth <= vwsizes.mobile ? 'mobile' : window.innerWidth <= vwsizes.tablet ? 'tablet' : 'desktop';

    switch (deviceType) {
      case 'mobile':
        setTransformStyle(scrollPercentage * (mobile || desktop), 'mobile');
        break;
      case 'tablet':
        setTransformStyle(scrollPercentage * (tablet || desktop), 'tablet');
        break;
      default:
        setTransformStyle(scrollPercentage * desktop, 'desktop');
    }
  });
};

export default useParallax;