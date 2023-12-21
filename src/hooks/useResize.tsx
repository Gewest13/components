import { useEffect } from 'react';

const useResize = (onResize: () => void) => {
  useEffect(() => {
    const handleResize = () => {
      onResize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [onResize]);
};

export default useResize;