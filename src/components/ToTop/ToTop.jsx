import { useEffect, useState, useCallback } from "react";

// @mui icons
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

// @mui components
import { Tooltip, Button } from "@mui/material";

// functions
import { scrollTo } from "../../utils/functions";

// contexts
import { useLanguage } from "../../context/LanguageProvider";

const ToTop = () => {
  const { languageState } = useLanguage();

  const [visible, setVisible] = useState(false);

  const onScroll = useCallback(
    (e) => {
      const top = window.pageYOffset || document.documentElement.scrollTop;
      if (top > 100) setVisible(true);
      else setVisible(false);
    },
    [setVisible]
  );

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  return (
    <Tooltip title={languageState.texts.Tooltips.ToTop} placement="top">
      <Button
        onClick={scrollTo}
        variant="contained"
        sx={{
          borderRadius: "100%",
          position: "fixed",
          right: 10,
          bottom: 10,
          padding: "5px",
          minWidth: 0,
          transition: "all 500ms ease",
          transform: visible ? "scale(1)" : "scale(0)",
          zIndex: visible ? 23 : -1,
        }}
      >
        <ArrowUpwardIcon />
      </Button>
    </Tooltip>
  );
};

export default ToTop;
