// @ts-check

import config from "../config";

export const getUserName = () => {
  // @ts-ignore
  if (localStorage.getItem(config.userCookie) !== null)
    // @ts-ignore
    return localStorage.getItem(config.userCookie);
  // @ts-ignore
  return sessionStorage.getItem(config.userCookie);
};

export const isAdmin = () => getUserName() === "admin";

/**
 * If the user is logged in, return true, otherwise return false.
 */
export const userLogged = () =>
  // @ts-ignore
  localStorage.getItem(config.userCookie) !== null ||
  // @ts-ignore
  sessionStorage.getItem(config.userCookie) !== null;

/**
 * If remember is true, it stores user data to localStorage, otherwise it stores it in sessionStorage
 * @param {boolean} remember - a boolean value that determines whether the user should be remembered or not.
 * @param {string} user - The user object that you want to store in the browser.
 */
export const logUser = (remember, user) => {
  // @ts-ignore
  if (remember) localStorage.setItem(config.userCookie, user);
  // @ts-ignore
  else sessionStorage.setItem(config.userCookie, user);
};

export const logoutUser = () => {
  // @ts-ignore
  localStorage.removeItem(config.userCookie);
  // @ts-ignore
  sessionStorage.removeItem(config.userCookie);
  // @ts-ignore
  deleteCookie(config.basicKey);
};

/**
 * Takes a name, expiration, and value, and creates a cookie with those values
 * @param {string} name - The name of the cookie
 * @param {string} expiration - "2019-12-31 23:59:59"
 * @param {any} value - The value of the cookie.
 */
export const createCookie = (name, expiration, value) => {
  const spaceSplit = expiration.split(" ");
  const dashSplit = spaceSplit[0].split("-");
  const colonSplit = spaceSplit[1].split(":");
  const d = new Date(
    Number(dashSplit[0]),
    Number(dashSplit[1]),
    Number(dashSplit[2]),
    Number(colonSplit[0]),
    Number(colonSplit[1]),
    Number(colonSplit[2])
  );
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${name}=${value};${expires}";path=/`;
};

/**
 * Takes a cookie name as an argument and returns the value of that cookie
 * @param {string} cname - The name of the cookie you want to get.
 * @returns {any} The value of the cookie with the name cname.
 */
export const getCookie = (cname) => {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

/**
 * Removes a cookie
 * @param {string} name
 */
export const deleteCookie = (name) => {
  document.cookie = `${name} + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"`;
};

/**
 * Find the first upper case letter in a string.
 * @param {string} str - The string to search through.
 * @returns {number} The index of the first uppercase letter in the string.
 */
export const findFirstUpperLetter = (str) => {
  for (let i = 0; i < str.length; i += 1)
    if (str[i] === str[i].toUpperCase()) return i;
  return -1;
};

/**
 * Returns the index of the first number in a string
 * @param {string} str - The string to search through.
 * @returns {number} The index of the first number in the string.
 */
export const findFirstNumber = (str) => {
  for (let i = 0; i < str.length; i += 1)
    if (str[i] >= "0" && str[i] <= "9") return i;
  return -1;
};

/**
 * Return the index of the first lowercase letter in the string, or -1 if there are no lowercase
 * letters.
 * @param {string} str - the string to search through
 * @returns {number} The index of the first lowercase letter in the string.
 */
export const findFirstLowerLetter = (str) => {
  for (let i = 0; i < str.length; i += 1)
    if (str[i] === str[i].toLowerCase()) return i;
  return -1;
};

/**
 * Validates a password based on the following rules:
 *
 * @param {string} password - the password to validate
 * @param {string} user - the user's email address
 * @returns {number} error type, -1 if everything is ok
 *
 * - 0 The password must be between 8 and 12 characters long.
 * - 1 The password must contain at least one upper case letter, one lower case letter, and one number.
 * - 2 The password must not contain the user's name
 */
export const passwordValidation = (password, user) => {
  // validating password length
  if (password.length < 8 || password.length > 12) return 0;
  // validating password special characters
  if (
    findFirstUpperLetter(password) === -1 ||
    findFirstLowerLetter(password) === -1 ||
    findFirstNumber(password) === -1
  )
    return 1;
  if (password.indexOf(user.substring(0, user.indexOf("@"))) !== -1) return 2;
  return -1;
};
