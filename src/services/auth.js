import axios from "axios";
import { getAuth } from "../auth/auth";
import config from "../config";

// functions
import { getCookie } from "../utils/auth";

import md5 from "md5";

/**
 *
 * @param {string} type
 * @returns
 */
export const validateBasicKey = async (type) => {
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}user/${type === "admin" ? "is-admin" : "validate"}`,
    {},
    {
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKeyCookie)}`,
      },
    }
  );
  const data = await response.data;
  if (data.data.user) return data.data.user;
  return false;
};

/**
 * Takes a user object and sends it to the backend to be authenticated
 * @param {string} user - the user name
 * @param {string} password - the user password
 * @returns The response from the server.
 */
export const login = async (user, password, remember) => {
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}user/login`,
    { user, password: md5(password), remember },
    {
      headers: getAuth,
    }
  );
  const data = await response.data;
  return data;
};

/**
 * Takes a user object as an argument, and returns a promise that resolves to the data returned from
 * the API
 * @param {object} user - This is the user object that we are sending to the server.
 * @returns The data from the response.
 */
export const register = async (user, password) => {
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}user/register`,
    { user, password: md5(password) },
    {
      headers: getAuth,
    }
  );
  const data = await response.data;
  return data;
};
