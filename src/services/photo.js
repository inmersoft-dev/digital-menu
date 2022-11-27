import axios from "axios";
import { getAuth } from "../auth/auth";
import config from "../config";

/**
 * @param {string} imageId - The ID of the image to be deleted.
 * @returns The status code of the response.
 */
export const removeImage = async (imageId) => {
  try {
    const response = await axios.post(
      config.imagekitDeleteUrl,
      { imageId },
      {
        headers: getAuth,
      }
    );
    const result = response.status;
    if (result === 200) {
      const data = await response.data;
      return data;
    }
    return 200;
  } catch (err) {
    return String(err);
  }
};
