// @ts-check

/**
 *
 * @param {string} name
 */
export const parserAccents = (name) => {
  let newName = name;
  const accents = ["á", "é", "í", "ó", "ú"];
  const vocals = ["a", "e", "i", "o", "u"];
  accents.forEach((item, i) => {
    // @ts-ignore
    newName = newName.replaceAll(item, vocals[i]);
  });
  return newName;
};

/**
 *
 * @param {string} name
 */
export const parserAccentsBack = (name) => {
  let newName = name;
  const accents = ["á", "é", "í", "ó", "ú"];
  const vocals = ["a", "e", "i", "o", "u"];
  // @ts-ignore
  vocals.forEach((item, i) => (newName = newName.replaceAll(item, accents[i])));
  return newName;
};
