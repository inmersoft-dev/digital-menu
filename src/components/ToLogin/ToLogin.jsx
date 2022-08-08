import { useNavigate } from "react-router-dom";

// @mui icons
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import SettingsIcon from "@mui/icons-material/Settings";

// @mui components
import { Tooltip, Button } from "@mui/material";

// functions
import { userLogged } from "../../utils/auth";

// contexts
import { useLanguage } from "../../context/LanguageProvider";

const ToLogin = () => {
  const navigate = useNavigate();
  const { languageState } = useLanguage();

  const toLogin = () => navigate("/auth/");

  const toSettings = () => navigate("/settings/");

  return (
    <Tooltip
      title={
        !userLogged()
          ? languageState.texts.Tooltips.ToLogin
          : languageState.texts.Tooltips.ToSettings
      }
      placement="top"
    >
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
          zIndex: 20,
        }}
      >
        {!userLogged() ? <VpnKeyIcon /> : <SettingsIcon />}
      </Button>
    </Tooltip>
  );
};

export default ToLogin;
