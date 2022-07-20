import axios from "axios";
import { getAuth } from "../auth/auth";
import config from "../config";

import { encode } from "js-base64";

/**
 * @param {string} user - the user name
 * @param {string} menuName - the menu name
 * @param {string} menuDescription - the menu description
 * @returns The response from the server.
 */
export const saveProfile = async (user, menuName, menuDescription, photo) => {
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}user/save`,
    { user, menuName, menuDescription, photo },
    {
      headers: {
        ...getAuth,
        Authorization: `Bearer ${encode(config.basicKey)}`,
      },
    }
  );
  const data = await response.data;
  return data;
};
