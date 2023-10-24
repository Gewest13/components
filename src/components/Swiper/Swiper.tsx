import React, { useEffect, useMemo, useRef } from 'react';

import styles from './Swiper.module.scss';
import { useWindowSize } from '../../hooks/useWindowSize';
import { lerp } from '../../utils/math';

interface ISwiperCard {
  children: React.ReactNode;
  className?: string;
}

export function SwiperCard(data: ISwiperCard) {
  const { children, className } = data;

  return (
    <div className={`${`${className} ` || ''}${styles.card}`}>
      {children}
    </div>
  )
}

export interface ISwiper {
  children: React.ReactNode;
  snap?: boolean;
  scroll?: boolean;
  className?: string;
}

export default function Swiper(data: ISwiper) {
  const { children, snap, scroll, className, ...rest } = data;

  // Refs to access DOM elements
  const containerRef = useRef<React.ElementRef<'div'>>(null);
  const swiperRef = useRef<React.ElementRef<'div'>>(null);

  // Hook to get window size
  const size = useWindowSize();

  const state = useMemo(() => ({
    ease: 0.1,
    speed: 1.5,
    totalSlides: 0,
    max: 0,
    min: 0,
    isDragging: false,
    currentX: 0,
    lastX: 0,
    onX: 0,
    offX: 0,
    xPos: 0,
    ticker: 0,
    stopTicker: true,
    offsetSlides: [] as number[],
    percentage: 0,
    currentSnappedIndex: 0,
  }), []);

  // Cache some properties and setup initial state
  useEffect(() => {
    removeTicker();

    state.stopTicker = true;
    state.offsetSlides = [];
    state.max = (swiperRef.current ? swiperRef.current.clientWidth : 0) - (containerRef.current ? containerRef.current.clientWidth : 0);
    state.totalSlides = swiperRef.current?.children.length || 0;

    // Calculate offset for each slide
    [...Array(state.totalSlides)].forEach((_empty, index) => state.offsetSlides.push(index * swiperRef.current!.children[0].clientWidth));

    // Ensure swiper position is within bounds
    if (Math.abs(state.currentX) > state.max) {
      state.currentX = -state.max;
      state.lastX = -state.max;
      startTicker();
    }

    state.speed = 1;

    return () => {
      removeTicker();
    };
  }, [size.width]);

  // Ensure swiper position is within bounds
  const clamp = () => {
    state.currentX = Math.max(Math.min(state.currentX, state.min), -state.max);
  };

  // Start the animation ticker
  const startTicker = () => {
    removeTicker();
    state.ticker = window.requestAnimationFrame(render);
  };

  // Stop the animation ticker
  const removeTicker = () => {
    window.cancelAnimationFrame(state.ticker);
  };

  // Render the swiper's position
  const render = () => {
    startTicker();

    if (swiperRef.current) {
      if (state.totalSlides === 1) {
        state.lastX = 0; // Ensure transform3D is always 0
      } else {
        state.lastX = lerp(state.lastX, state.currentX, state.ease);
      }

      swiperRef.current.style.transform = `translate3d(${state.lastX}px, 0, 0)`;

      // Calculate the percentage of the swiper's position from 0 to 1 round to 2 decimal places
      state.percentage = Math.abs(state.lastX) / state.max;

      const closest = state.offsetSlides.reduce((prev, curr) => (Math.abs(curr - Math.abs(state.currentX)) < Math.abs(prev - Math.abs(state.currentX)) ? curr : prev));
      state.currentSnappedIndex = state.offsetSlides.indexOf(closest);
    }

    if (Math.round(state.lastX) === Math.round(state.currentX) && !state.stopTicker) {
      state.stopTicker = true;
      removeTicker();

      if (snap && scroll) {
        snapSlides();
      }
    }
  };

  // Snap the swiper to the closest slide
  const snapSlides = () => {
    const closest = state.offsetSlides.reduce((prev, curr) => (Math.abs(curr - Math.abs(state.currentX)) < Math.abs(prev - Math.abs(state.currentX)) ? curr : prev));

    state.currentX = -closest;

    clamp();

    state.offX = state.currentX;

    if (scroll) {
      state.stopTicker = false;
      startTicker();
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!scroll) return;

    if (state.stopTicker) {
      state.stopTicker = false;
      startTicker();
    }

    const maxDeltaY = 120;
    const deltaY = Math.min(Math.max(e.deltaY, -maxDeltaY), maxDeltaY);
    state.currentX -= deltaY;

    clamp();

    state.offX = state.currentX;
  };


  // Handle mouse down event
  const handleMouseDown = (e: React.MouseEvent) => {
    state.isDragging = true;
    state.onX = e.clientX;
  };

  // Handle mouse up event
  const handleMouseUp = () => {
    swiperRef.current?.classList.remove('active');
    state.isDragging = false;
    state.offX = state.currentX;

    if (snap) {
      snapSlides();
    }
  };

  // Handle mouse move event
  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.clientX) {
      e.preventDefault();
    }

    if (!state.isDragging) return;

    if (state.stopTicker) {
      state.stopTicker = false;

      startTicker();
    }

    const { clientX } = e;

    if (!clientX) return;

    state.xPos = e.pageX;

    if (Math.abs(state.onX - clientX) > 20) {
      swiperRef.current?.classList.add('active');
    }

    state.currentX = state.offX + (clientX - state.onX) * state.speed;

    clamp();
  };

  return (
    <div
      className={`${`${className} ` || ''}${styles.container}`}
      ref={containerRef}
      {...rest}
    >
      <div
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className={styles.swiper}
        ref={swiperRef}
      >
        {children}
      </div>
    </div>
  )
}
