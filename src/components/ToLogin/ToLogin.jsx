import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// @mui icons
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import SettingsIcon from "@mui/icons-material/Settings";

// @mui components
import { Button } from "@mui/material";

// functions
import { userLogged } from "../../utils/auth";

const ToLogin = () => {
  const navigate = useNavigate();

  const toLogin = () => navigate("/auth/");

  const toSettings = () => navigate("/settings/");

  return (
    <Button
      onClick={!userLogged() ? toLogin : toSettings}
      variant="contained"
      sx={{
        borderRadius: "100%",
        position: "fixed",
        left: 10,
        bottom: 10,
        padding: "5px",
        minWidth: 0,
      }}
    >
      {!userLogged() ? <VpnKeyIcon /> : <SettingsIcon />}
    </Button>
  );
};

export default ToLogin;
