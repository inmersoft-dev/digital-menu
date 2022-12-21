import axios from "axios";
import { getAuth } from "../auth/auth";
import config from "../config";
import { createCookie, getCookie } from "../utils/auth";
import { dashesToSpace } from "../utils/functions";

/**
 *
 * @param {string} menu
 * @param {string} customerName
 * @param {string} customerPhone
 * @returns
 */
export const sendOrderCookie = async (
  menu,
  customerName,
  customerPhone,
  products
) => {
  if (
    getCookie(config.acceptCookie) &&
    !getCookie(`${menu}_${config.customerName}_${config.orderCookie}`)
  ) {
    try {
      const response = await axios.post(
        // @ts-ignore
        `${config.apiUrl}trigger/add`,
        {
          event: "order",
          menu: dashesToSpace(menu),
          customerName,
          customerPhone,
          products,
        },
        {
          headers: getAuth,
        }
      );
      createCookie(
        `${menu}_${config.customerName}_${config.orderCookie}`,
        1,
        true
      );
      const data = await response.data;
      return data;
    } catch (err) {
      console.error(err);
    }
  }
};

/**
 *
 * @param {string} menu
 * @returns
 */
export const sendQrCookie = async (menu) => {
  if (
    getCookie(config.acceptCookie) &&
    !getCookie(`${menu}${config.visitCookie}`)
  ) {
    try {
      const response = await axios.post(
        // @ts-ignore
        `${config.apiUrl}trigger/add`,
        { event: "qr-visit", menu: dashesToSpace(menu) },
        {
          headers: getAuth,
        }
      );
      createCookie(`${menu}_${config.visitCookie}`, 1, true);
      const data = await response.data;
      return data;
    } catch (err) {
      console.error(err);
    }
  }
};

/**
 *
 * @param {string} menu
 * @returns
 */
export const sendVisitCookie = async (menu) => {
  if (
    getCookie(config.acceptCookie) &&
    !getCookie(`${menu}${config.visitCookie}`)
  ) {
    try {
      const response = await axios.post(
        // @ts-ignore
        `${config.apiUrl}trigger/add`,
        { event: "visit", menu: dashesToSpace(menu) },
        {
          headers: getAuth,
        }
      );
      createCookie(`${menu}_${config.visitCookie}`, 1, true);
      const data = await response.data;
      return data;
    } catch (err) {
      console.error(err);
    }
  }
};

/**
 *
 * @param {string} menu
 * @param {string} product
 * @returns
 */
export const sendDescriptionCookie = async (menu, product) => {
  if (
    getCookie(config.acceptCookie) &&
    !getCookie(`${product.id}${getCookie.descriptionCookie}`)
  ) {
    try {
      const response = await axios.post(
        // @ts-ignore
        `${config.apiUrl}trigger/add`,
        {
          event: "see-description",
          menu: dashesToSpace(menu),
          product: product.id,
        },
        {
          headers: getAuth,
        }
      );
      createCookie(`${product.id}_${getCookie.descriptionCookie}`, 10, true);
      const data = await response.data;
      return data;
    } catch (err) {
      console.error(err);
    }
  }
};

/**
 * @returns
 */
export const sendMobileCookie = async () => {
  if (getCookie(config.acceptCookie) && !getCookie(config.viewCookie)) {
    try {
      const response = await axios.post(
        // @ts-ignore
        `${config.apiUrl}trigger/general-add`,
        { event: "view", from: "mobile" },
        {
          headers: getAuth,
        }
      );
      createCookie(config.viewCookie, 1, true);
      const data = await response.data;
      return data;
    } catch (err) {
      console.error(err);
    }
  }
};

/**
 * @returns
 */
export const sendPcCookie = async () => {
  if (getCookie(config.acceptCookie) && !getCookie(config.viewCookie)) {
    try {
      const response = await axios.post(
        // @ts-ignore
        `${config.apiUrl}trigger/general-add`,
        { event: "view", from: "pc" },
        {
          headers: getAuth,
        }
      );
      createCookie(config.viewCookie, 1, true);
      const data = await response.data;
      return data;
    } catch (err) {
      console.error(err);
    }
  }
};

/**
 * @returns
 */
export const sendHowToGoCookie = async () => {
  if (getCookie(config.acceptCookie) && !getCookie(config.howToGoCookie)) {
    try {
      const response = await axios.post(
        // @ts-ignore
        `${config.apiUrl}trigger/general-add`,
        { event: "how-to-go" },
        {
          headers: getAuth,
        }
      );
      createCookie(config.howToGoCookie, 1, true);
      const data = await response.data;
      return data;
    } catch (err) {
      console.error(err);
    }
  }
};
