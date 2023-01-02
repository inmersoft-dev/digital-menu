import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";

// @mui icons
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

// @mui components
import { Button } from "@mui/material";

// some-javascript-utils
import { scrollTo } from "some-javascript-utils/browser";

const ToTop = (props) => {
  const { show } = props;
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

  useEffect(() => {
    if (show) setVisible(true);
  }, [show]);

  return (
    <Button
      color="primary"
      onClick={scrollTo}
      variant="contained"
      sx={{
        borderRadius: "100%",
        padding: "5px",
        minWidth: 0,
        transition: "all 500ms ease",
        transform: visible ? "scale(1)" : "scale(0)",
        zIndex: visible ? 23 : -1,
      }}
    >
      <ArrowUpwardIcon />
    </Button>
  );
};

ToTop.propTypes = {
  show: PropTypes.bool.isRequired,
};

export default ToTop;
