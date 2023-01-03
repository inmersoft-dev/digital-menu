import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

import inViewport from "in-viewport";

// @mui/material
import { useTheme, Box, IconButton } from "@mui/material";

// @mui/icons-material
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

// components
import TabView from "../TabView/TabView";
import BackButton from "../BackButton/BackButton";

// utils
import { scrollTo } from "../../utils/functions";

// contexts
import { useMode } from "../../context/ModeProvider";

const WatchAppBar = (props) => {
  const { productTypes, hasProducts } = props;
  const theme = useTheme();

  const { modeState, setModeState } = useMode();

  const toggleMode = () => setModeState({ type: "toggle" });

  const [tab, setTab] = useState(0);

  const changeTab = (e, value) => {
    setTab(value);
    const type = document.getElementById(`title-${productTypes[value].name}`);
    if (type !== null) scrollTo(type.offsetTop - (tab < value ? 0 : 120));
  };

  const onScroll = useCallback(
    (e) => {
      let firstTrue = -1;
      for (let i = 0; i < productTypes.length; i += 1) {
        const elem = document.getElementById(`title-${productTypes[i].name}`);
        const isInViewport = inViewport(elem);
        if (isInViewport && firstTrue === -1) firstTrue = i;
        if (
          isInViewport &&
          document.documentElement.scrollTop >=
            Math.floor(elem.offsetTop - elem.getBoundingClientRect().top)
        )
          setTab(i);
      }
    },
    [productTypes]
  );

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <BackButton flat to="/" sx={{ top: "11px" }} />
      {productTypes && (
        <TabView
          sx={{
            width: "100%",
            position: "fixed",
            height: "60px",
            top: 0,
            left: 0,
            background: theme.palette.background.paper,
            zIndex: 15,
          }}
          tabsContainerSx={{
            width: "calc(100% - 40px)",
            paddingLeft: "40px",
            paddingTop: "6px",
            height: "60px",
          }}
          value={tab}
          onChange={changeTab}
          tabs={productTypes
            .filter((item) => hasProducts(item))
            .map((item, i) => item.name)}
          content={[]}
        />
      )}
      <IconButton
        color="inherit"
        sx={{ position: "fixed", top: "11px", right: 0, zIndex: 40 }}
        onClick={toggleMode}
      >
        {modeState.mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Box>
  );
};

WatchAppBar.propTypes = {
  hasProducts: PropTypes.func.isRequired,
  productTypes: PropTypes.array,
};

export default WatchAppBar;
