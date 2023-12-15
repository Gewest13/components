export const removeHTMLTags = (text: string) => {
  // The regular expression /<[^>]+>/g matches any HTML tags in the string.
  // The expression <[^>]+> breaks down as follows:
  // - < matches the opening angle bracket of an HTML tag.
  // - [^>]+ matches one or more characters that are not the closing angle bracket (>).
  // - > matches the closing angle bracket of an HTML tag.
  // The 'g' flag makes the replacement global, so it replaces all occurrences in the string.

  // The replacement is a single space, effectively removing the HTML tags while preserving
  // spacing between words.

  return text.replace(/<[^>]+>/g, ' ');
};
