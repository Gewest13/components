export const convertParagraphToBreaks = (text: string) => {
  return text.replace(/<p>/g, '').replace(/<\/?p[^>]*>/g, '<br />')
};
