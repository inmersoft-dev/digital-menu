/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-no-constructed-context-values */
import * as React from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

const ScrollContext = React.createContext();

const scrollReducer = (scrollState, action) => {
  switch (action.type) {
    case "set":
      console.log("perra");
      return {
        scrolling: true,
        tab: action.value,
      };
    case "no-scroll":
      console.log("hola");
      return {
        scrolling: false,
        tab: scrollState.tab,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const ScrollProvider = ({ children }) => {
  const [scrollState, setScrollState] = React.useReducer(scrollReducer, {
    tab: 0,
  });

  const value = { scrollState, setScrollState };
  return (
    <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
  );
};

ScrollProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// hooks
const useScroll = () => {
  const context = React.useContext(ScrollContext);
  if (context === undefined)
    throw new Error("scrollContext must be used within a Provider");
  return context;
};

export { ScrollProvider, useScroll };
