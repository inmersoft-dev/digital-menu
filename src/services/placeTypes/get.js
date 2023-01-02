/* eslint-disable import/prefer-default-export */

// @ts-check

import axios from "axios";

// some-javascript-utils
import { getUserLanguage, getCookie } from "some-javascript-utils/browser";

// @ts-ignore
import { getAuth } from "../../auth/auth";

import config from "../../config";

/**
 *
 * @param {number} id
 * @param {number} page
 * @param {number} count
 * @param {string} orderBy
 * @returns
 */
export const placeTypeList = async (
  id = 0,
  page = 1,
  count = 10,
  orderBy = "date",
  query = undefined
) => {
  // @ts-ignore
  const response = await axios.post(
    `${config.apiUrl}place-type/list`,
    {
      id,
      page,
      count,
      orderBy,
      query,
      lang: getUserLanguage(),
    },
    {
      // @ts-ignore
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKey)}`,
      },
    }
  );
  const data = await response.data;
  return data;
};
