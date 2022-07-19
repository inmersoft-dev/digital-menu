import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// @mui components
import { useTheme } from "@mui/material";

// sito components
import SitoContainer from "sito-container";

// own components
import Loading from "../../components/Loading/Loading";

// utils
import { deleteCookie, logoutUser } from "../../utils/auth";

import config from "../../config";

const Logout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    logoutUser();
    deleteCookie(config.basicKey);
    navigate("/auth/login");
  }, []);

  return (
    <SitoContainer sx={{ width: "100vw", height: "100vh" }}>
      <Loading
        visible={loading}
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          backdropFilter: "blur(4px)",
          background: `${theme.palette.background.paper}ec`,
          borderRadius: "1rem",
          zIndex: loading ? 99 : -1,
        }}
      />
    </SitoContainer>
  );
};

export default Logout;
