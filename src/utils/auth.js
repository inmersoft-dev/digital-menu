// @ts-check

import config from "../config";
import { validateBasicKey } from "../services/auth";

import { getCookie, deleteCookie } from "some-javascript-utils/browser";

export const getUserName = () => sessionStorage.getItem("user");

export const isAdmin = async () => {
  const value = await validateBasicKey("admin");
  if (value) return true;
  return false;
};

/**
 * If the user is logged in, return true, otherwise return false.
 */
export const userLogged = () =>
  // @ts-ignore
  getCookie(config.basicKeyCookie).length > 0;

export const logoutUser = () =>
  // @ts-ignore
  deleteCookie(config.basicKeyCookie);

/**
 * Find the first upper case letter in a string.
 * @param {string} str - The string to search through.
 * @returns {number} The index of the first uppercase letter in the string.
 */
export const findFirstUpperLetter = (str) => {
  const upperLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < str.length; i += 1)
    if (upperLetters.indexOf(str[i]) > -1) return i;
  return -1;
};

/**
 * Returns the index of the first number in a string
 * @param {string} str - The string to search through.
 * @returns {number} The index of the first number in the string.
 */
export const findFirstNumber = (str) => {
  const numbers = "012345678";
  for (let i = 0; i < str.length; i += 1)
    if (numbers.indexOf(str[i]) > -1) return i;
  return -1;
};

/**
 * Return the index of the first lowercase letter in the string, or -1 if there are no lowercase
 * letters.
 * @param {string} str - the string to search through
 * @returns {number} The index of the first lowercase letter in the string.
 */
export const findFirstLowerLetter = (str) => {
  const lowerLetters = "abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < str.length; i += 1)
    if (lowerLetters.indexOf(str[i]) > -1) return i;
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
  if (password.length < 8 || password.length > 25) return 0;
  // validating password special characters
  if (
    findFirstUpperLetter(password) === -1 ||
    findFirstLowerLetter(password) === -1 ||
    findFirstNumber(password) === -1
  )
    return 1;
  if (password.indexOf(user) !== -1) return 2;
  return -1;
};

/**
 *
 * @param {string} password
 * @param {string} rpassword
 * @param {string} user
 * @returns
 */
export const passwordsAreValid = (password, rpassword, user) => {
  // validating passwords
  let passwordValidationResult = passwordValidation(password, user);
  if (passwordValidationResult > -1) return passwordValidationResult;
  passwordValidationResult = passwordValidation(rpassword, user);
  if (passwordValidationResult > -1) return passwordValidationResult;
  return -1;
};
