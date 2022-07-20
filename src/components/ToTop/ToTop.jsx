import { useEffect, useState } from "react";

// @mui icons
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

// @mui components
import { Button } from "@mui/material";

// functions
import { scrollTo } from "../../utils/functions";
import { useCallback } from "react";

const ToTop = () => {
  const [visible, setVisible] = useState(false);

  const onScroll = useCallback(
    (e) => {
      console.log(e);
    },
    [visible, setVisible]
  );

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  return (
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
        zIndex: visible ? 10 : -1,
      }}
    >
      <ArrowUpwardIcon />
    </Button>
  );
};

export default ToTop;
