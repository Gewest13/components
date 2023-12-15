export const sanitizeString = (text: string) => {
  // The regular expression /[^a-z0-9áéíóúñü .,_-]/gim matches any character
  // that is not a lowercase letter, digit, accentuated character, space, dot,
  // comma, underscore, or hyphen.
  // The 'g' flag makes the replacement global, 'i' makes it case-insensitive,
  // and 'm' makes it multiline (though multiline doesn't have much effect here).

  // The replacement is an empty string, effectively removing any characters
  // that do not match the allowed set.

  // The trim() function is then used to remove any leading or trailing spaces
  // that may have been introduced by the removal of characters.

  return text.replace(/[^a-z0-9áéíóúñü .,_-]/gim, '').trim();
};
