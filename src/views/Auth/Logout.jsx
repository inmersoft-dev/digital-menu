import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// @mui components
import { useTheme } from "@mui/material";

// sito components
import SitoContainer from "sito-container";

// own components
import Loading from "../../components/Loading/Loading";

// utils
import { logoutUser } from "../../utils/auth";

const Logout = () => {
  const navigate = useNavigate();
  const [loading] = useState(true);

  useEffect(() => {
    logoutUser();
    setTimeout(() => {
      navigate("/");
    }, 1000);
  }, []);

  return (
    <SitoContainer sx={{ width: "100vw", height: "100vh" }}>
      <Loading
        visible={loading}
        sx={{
          zIndex: loading ? 99 : -1,
        }}
      />
    </SitoContainer>
  );
};

export default Logout;
