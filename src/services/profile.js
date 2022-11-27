import axios from "axios";
import { getAuth } from "../auth/auth";
import config from "../config";

// functions
import { getCookie } from "../utils/auth";

/**
 * @param {string} user - the user name
 * @param {string} oldName - the menu old name
 * @param {string} menuName - the menu name
 * @param {string} menuDescription - the menu description
 * @param {string[]} business
 * @returns The response from the server.
 */
export const saveProfile = async (
  user,
  oldName,
  menuName,
  menuDescription,
  photo,
  business
) => {
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}user/save`,
    { user, oldName, menuName, menuDescription, photo, business },
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
