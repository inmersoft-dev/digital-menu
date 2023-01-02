// @ts-check

/**
 *
 * @param {string} number
 */
export const floatNumber = (number) => {
  for (let i = 0; i < number.length; i += 1) {
    if (i === 0 && (number[i] === "." || number[i] === ",")) return "";
    else {
    }
  }
};
