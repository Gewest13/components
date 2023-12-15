import { useEffect } from 'react';

const useScroll = (onScroll: (e: Event) => void) => {
  useEffect(() => {
    const handleScroll = (e: Event) => {
      onScroll(e);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
};

export default useScroll;