/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-no-constructed-context-values */
import * as React from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

const HistoryContext = React.createContext();

const historyReducer = (historyState, action) => {
  switch (action.type) {
    case "add": {
      const { newHistory } = action;
      if (
        historyState !== null &&
        typeof historyState === "object" &&
        historyState.indexOf(newHistory) === -1
      ) {
        localStorage.setItem(
          "search-history",
          JSON.stringify([...historyState, newHistory])
        );
        return [...historyState, newHistory];
      }
      return historyState;
    }
    case "set": {
      const { newArray } = action;
      return newArray;
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const HistoryProvider = ({ children }) => {
  const [historyState, setHistoryState] = React.useReducer(historyReducer, []);

  const value = { historyState, setHistoryState };
  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
};

HistoryProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// hooks
const useHistory = () => {
  const context = React.useContext(HistoryContext);
  if (context === undefined)
    throw new Error("historyContext must be used within a Provider");
  return context;
};

export { HistoryProvider, useHistory };
