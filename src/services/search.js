/* eslint-disable import/prefer-default-export */
import axios from "axios";
import { getAuth } from "../auth/auth";
import config from "../config";

// some-javascript-utils
import { getCookie } from "some-javascript-utils/browser";

/**
 *
 * @param {string} text
 * @param {string[]} models
 * @param {string} attribute
 * @returns
 */
export const search = async (text, models, attribute = "") => {
  const response = await axios.post(
    `${config.apiUrl}search`,
    { text, models, attribute },
    {
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKeyCookie)}`,
      },
    }
  );
  const data = await response.data;
  return data;
};

/**
 *
 * @param {string[]} ids
 * @param {string} models
 * @returns
 */
export const searchIds = async (ids, models) => {
  const response = await axios.post(
    `${config.apiUrl}search/array-ids`,
    { ids, models },
    {
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKeyCookie)}`,
      },
    }
  );
  const data = await response.data;
  return data;
};
