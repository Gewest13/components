export const calcPercentage = ({ y, until, reverse = false }: { y: number, until: number, reverse?: boolean }) => {
  const percentage = Math.min(Math.max(y / until, -1), 0) * -1;
  return reverse ? 1 - percentage : percentage;
};
