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
export const executeOrder = async (order, menu) => {
  const response = await axios.post(
    `${config.apiUrl}order`,
    { order, menu },
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
