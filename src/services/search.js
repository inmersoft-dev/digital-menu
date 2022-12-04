/* eslint-disable import/prefer-default-export */
import axios from "axios";
import { getAuth } from "../auth/auth";
import config from "../config";

// cookies
import { getCookie } from "../utils/auth";

/**
 *
 * @param {string} text
 * @param {string} attribute
 * @param {string} models
 * @returns
 */
export const search = async (text, models) => {
  const response = await axios.post(
    `${config.apiUrl}search`,
    { text, models },
    {
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKey)}`,
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
        Authorization: `Bearer ${getCookie(config.basicKey)}`,
      },
    }
  );
  const data = await response.data;
  return data;
};
