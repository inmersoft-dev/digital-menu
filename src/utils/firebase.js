import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const config = require("../config");

const firebaseConfig = {
  ...config.firebaseConfig,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app,"digitalmenu-bb1a1.appspot.com");
