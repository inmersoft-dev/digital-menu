/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-no-constructed-context-values */
import * as React from "react";

// theme
import light from "../assets/theme/light";
import dark from "../assets/theme/dark";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

const ModeContext = React.createContext();

const modeReducer = (modeState, action) => {
  switch (action.type) {
    case "set":
      document.body.style.background =
        action.to === "light"
          ? light.palette.background.default
          : dark.palette.background.default;
      return {
        mode: action.to || "light",
      };
    case "toggle":
      document.body.style.background =
        modeState.mode === "light"
          ? dark.palette.background.default
          : light.palette.background.default;
      return {
        mode: modeState.mode === "light" ? "dark" : "light",
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const ModeProvider = ({ children }) => {
  const [modeState, setModeState] = React.useReducer(modeReducer, {
    mode: "dark",
  });

  const value = { modeState, setModeState };
  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
};

ModeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// hooks
const useMode = () => {
  const context = React.useContext(ModeContext);
  if (context === undefined)
    throw new Error("modeContext must be used within a Provider");
  return context;
};

export { ModeProvider, useMode };
