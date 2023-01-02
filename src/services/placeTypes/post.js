// @ts-check

import axios from "axios";
// @ts-ignore
import { getAuth } from "auth/auth";

// cookies
// @ts-ignore
import { getCookie } from "utils/auth";

import config from "../../config";

/**
 * Takes a placeType object, sends it to the API, and returns the response
 * @param {object} placeType - The placeType object that contains the placeType's information.
 * @returns The data from the response.
 */
export const createPlaceType = async (placeType) => {
  // @ts-ignore
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}place-type/save`,
    { ...placeType, create: true },
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
