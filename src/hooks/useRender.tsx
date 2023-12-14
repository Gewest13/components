/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect } from 'react';

// @ts-ignore no ts...
import Tempus from '@studio-freight/tempus'

export default function useRender(observeEl: React.MutableRefObject<HTMLElement | null>, fn: () => void) {
  useEffect(() => {
    let unsubscribe: any;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        unsubscribe = Tempus.add(fn, 0)
      } else {
        unsubscribe && unsubscribe();
      }
    });

    if (observeEl.current) observer.observe(observeEl.current);

    return () => {
      observer.disconnect();
      unsubscribe && unsubscribe();
    };
  }, [observeEl, fn]);
}
