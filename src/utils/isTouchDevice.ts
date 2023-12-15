export const isTouchDevice = () => {
  return typeof window !== 'undefined' ? window.matchMedia('(hover: none), (pointer:coarse)').matches : false;
}