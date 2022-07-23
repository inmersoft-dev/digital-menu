import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// @mui icons
import KeyOffIcon from "@mui/icons-material/KeyOff";

// @mui components
import { Button } from "@mui/material";

const ToLogout = () => {
  const navigate = useNavigate();

  const toLogout = () => navigate("/auth/logout");

  const [visible, setVisible] = useState(true);

  const onScroll = useCallback(
    (e) => {
      const top = window.pageYOffset || document.documentElement.scrollTop;
      if (top < 100) setVisible(true);
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
    <Button
      onClick={toLogout}
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
        zIndex: visible ? 20 : -1,
      }}
    >
      <KeyOffIcon />
    </Button>
  );
};

export default ToLogout;
