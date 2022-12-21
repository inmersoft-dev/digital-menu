import axios from "axios";
import { getAuth } from "../auth/auth";
import config from "../config";

// functions
import { getCookie } from "../utils/auth";

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
 * @returns The response from the server.
 */
export const fetchAll = async () => {
  const response = await axios.get(
    // @ts-ignore
    `${config.apiUrl}menu/`,
    {
      headers: getAuth,
    }
  );
  const data = await response.data;
  return data;
};

/**
 * Takes a user object and sends it to the backend to be authenticated
 * @param {string} menuName - the menu name
 * @returns The response from the server.
 */
export const fetchMenu = async (menuName) => {
  const response = await axios.get(
    // @ts-ignore
    `${config.apiUrl}menu/fetch?menuName=${menuName}`,
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
