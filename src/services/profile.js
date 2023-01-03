import axios from "axios";
import { getAuth } from "../auth/auth";
import config from "../config";

import md5 from "md5";

// some-javascript-utils
import { getCookie } from "some-javascript-utils/browser";

/**
 * @param {string} user - the user name
 * @param {string} oldName - the menu old name
 * @param {string} menuName - the menu name
 * @param {string} menuDescription - the menu description
 * @param {string[]} business
 * @param {string} lang
 * @returns The response from the server.
 */
export const saveProfile = async (
  user,
  oldName,
  menuName,
  phone,
  photo,
  business,
  lang
) => {
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}user/save`,
    {
      user,
      oldName,
      menuName,
      phone,
      photo,
      business,
      lang,
    },
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
 * @param {string} user
 * @param {string} password
 */
export const changePassword = async (user, password) => {
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}user/change-password`,
    {
      user,
      password: md5(password),
    },
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
 * @param {string} user
 * @param {number} longitude
 * @param {number} latitude
 */
export const saveLocation = async (user, longitude, latitude) => {
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}user/save-location`,
    {
      user,
      longitude,
      latitude,
    },
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
 * @param {string} user
 * @param {object[]} socialMedia
 * @param {string} description
 */
export const saveSocial = async (user, socialMedia, description) => {
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}user/save-social`,
    {
      user,
      socialMedia,
      description,
    },
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
 * @param {string} user
 * @param {object} schedule
 */
export const saveSchedule = async (user, schedule) => {
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}user/save-schedule`,
    {
      user,
      schedule,
    },
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
