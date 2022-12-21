/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-no-constructed-context-values */
import * as React from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

const SettingsContext = React.createContext();

const settingsReducer = (settingsState, action) => {
  switch (action.type) {
    case "set-generals": {
      const { photo, preview, business, menu, phone } = action;
      return { ...settingsState, photo, preview, business, menu, phone };
    }
    case "set-socials": {
      const { socialMedia, description } = action;
      return { ...settingsState, socialMedia, description };
    }
    case "set-map": {
      const { location } = action;
      return { ...settingsState, location };
    }
    case "set-qr": {
      const { menu, preview } = action;
      return { ...settingsState, menu, preview };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const SettingsProvider = ({ children }) => {
  const [settingsState, setSettingsState] = React.useReducer(
    settingsReducer,
    {}
  );

  const value = { settingsState, setSettingsState };
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// hooks
const useSettings = () => {
  const context = React.useContext(SettingsContext);
  if (context === undefined)
    throw new Error("settingsContext must be used within a Provider");
  return context;
};

export { SettingsProvider, useSettings };
