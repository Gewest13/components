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

/**
 * Hook to apply a parallax effect to a DOM element.
 *
 * @param {Parallax} data - The data for the parallax effect.
 * @param {React.RefObject<HTMLElement>} data.parallaxRef - The ref of the element to which the parallax effect is applied.
 * @param {React.RefObject<HTMLElement>} data.parentRef - The ref of the parent element.
 * @param {number} data.desktop - The amount of parallax effect on desktop devices.
 * @param {number} [data.tablet] - The amount of parallax effect on tablet devices.
 * @param {number} [data.mobile] - The amount of parallax effect on mobile devices.
 * @param {boolean} [data.topOfPage=false] - Whether the parallax effect starts from the top of the page.
 *
 * @example
 * ```tsx
 * const parallaxRef = useRef(null);
 *
 * useParallax({
 *   parallaxRef: parallaxRef,
  *  desktop: 100,
 *   tablet: 50,
 *   mobile: 25,
 * });
 *
 * return <div ref={parallaxRef}>Hello, world!</div>;
 * ```
 */
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