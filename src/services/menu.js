import axios from "axios";

// some-javascript-utils
import { getCookie } from "some-javascript-utils/browser";

import { getAuth } from "../auth/auth";

import config from "../config";

/**
 *
 * @param {string} menu
 * @param {object[]} order
 */
export const saveOrder = async (menu, order) => {
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}menu/save-order`,
    {
      menu,
      order,
    },
    {
      headers: getAuth,
    }
  );
  const data = await response.data;
  return data;
};

/**
 *
 * @param {string} orderBy
 * @param {number} page
 * @param {number} count
 * @param {string[]} attributes
 * @returns
 */
export const fetchAll = async (
  orderBy = "date",
  page = 1,
  count = 10,
  attributes = []
) => {
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}menu/`,
    { orderBy, page, count, attributes },
    {
      headers: getAuth,
    }
  );
  const data = await response.data;
  return data;
};

/**
 *
 * @param {string} menuName
 * @param {string[]} attributes
 * @returns
 */
export const fetchMenu = async (menuName, attributes = []) => {
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}menu/fetch?menuName=${menuName}`,
    { menuName, attributes },
    {
      headers: getAuth,
    }
  );
  const data = await response.data;
  return data;
};

/**
 * Takes a user object and sends it to the backend to be authenticated
 * @param {string} user - the user name
 * @param {string} menuName - the menu name
 * @param {object[]} menu - the menu list
 * @param {string[]} types - the type list
 * @returns The response from the server.
 */
export const saveMenu = async (user, menuName, menu, types) => {
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}menu/save`,
    { user, menuName, menu, types },
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
