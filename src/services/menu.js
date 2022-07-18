import axios from "axios";
import { getAuth } from "../auth/auth";
import config from "../config";

/**
 * Takes a user object and sends it to the backend to be authenticated
 * @param {string} user - the user name
 * @param {string} menuName - the menu name
 * @returns The response from the server.
 */
export const fetchMenu = async (user, menuName) => {
  const response = await axios.get(
    // @ts-ignore
    `${config.apiUrl}menu/fetch?user=${user}&menuName=${menuName}`,
    {
      headers: getAuth,
    }
  );
  const data = await response.data;
  return data;
};
