export const spaceToDashes = (string) =>
  string.replace(/\s+/g, "-").toLowerCase();

export const dashesToSpace = (string) => string.replace(/-/g, " ");

export const justHasNumbersAndLetters = (string) =>
  /^[a-zA-Z0-9]+$/i.test(string);

/**
 * Scroll to a target position, default the top of the page.
 * @param {number} [target=0] - The target position to scroll to.
 */
export const scrollTo = (target = 0) =>
  window.scroll({
    top: target > 55 ? target - 55 : target,
    left: 0,
    behavior: "smooth",
  });

/**
 * It takes a string, splits it into an array of words, capitalizes the first letter of each word, and
 * then joins the array back into a string
 * @param {string} string - The string to be converted to sentence case.
 * @returns a string with the first letter of each word capitalized.
 */
export const toSentenceCase = (string) => {
  const splittedString = string.split(" ");
  let result = "";
  for (let i = 0; i < splittedString.length; i += 1) {
    splittedString[i].charAt(0).toUpperCase();
    result += splittedString[i];
  }
  return result;
};

/**
 * It returns the index of the first element in an array that matches the given item, or -1 if no match
 * is found
 * @param  array - The array to search in
 * @param item - The item you want to find in the array.
 * @param [attributes] - an array of strings that are the names of the attributes that you want to
 * compare.
 * @param [startIn=0] - The index to start the search from.
 * @returns The index of the first element in the array that matches the item.
 */
export const ComplexIndexOf = (array, item, attributes = [], startIn = 0) => {
  if (startIn < array.length && startIn >= 0)
    for (let i = startIn; i < array.length; i += 1) {
      if (attributes.length === 0 && array[i] === item) return i;
      else {
        let equals = true;
        attributes.forEach((jtem) => {
          if (array[i][jtem] !== item[jtem]) equals = false;
        });
        if (equals) return i;
      }
    }
  return -1;
};

/**
 *
 * @param {object[]} array
 * @param {string} attribute
 * @param {any} value
 * @returns
 */
export const getIndexOfByAttribute = (array, attribute, value) => {
  for (let i = 0; i < array.length; i += 1)
    if (array[i][attribute] === value) return i;
  return -1;
};
