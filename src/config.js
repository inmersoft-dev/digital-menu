const { REACT_APP_API_URL, REACT_APP_BASIC_KEY, REACT_APP_USER_COOKIE } =
  process.env;

export default {
  basicKey: REACT_APP_BASIC_KEY,
  apiUrl: REACT_APP_API_URL,
  userCookie: REACT_APP_USER_COOKIE,
};
