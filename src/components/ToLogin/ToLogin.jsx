// @mui icons
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import SettingsIcon from "@mui/icons-material/Settings";

// @mui components
import { Tooltip, Button, Link } from "@mui/material";

// functions
import { userLogged } from "../../utils/auth";

// contexts
import { useLanguage } from "../../context/LanguageProvider";

const ToLogin = () => {
  const { languageState } = useLanguage();

  return (
    <Tooltip
      title={
        !userLogged()
          ? languageState.texts.Tooltips.ToLogin
          : languageState.texts.Tooltips.ToSettings
      }
      placement="left"
    >
      <Link href={!userLogged() ? "/auth/" : "/settings/"}>
        <Button
          variant="contained"
          sx={{
            borderRadius: "100%",
            padding: "5px",
            minWidth: 0,
          }}
        >
          {!userLogged() ? <VpnKeyIcon /> : <SettingsIcon />}
        </Button>
      </Link>
    </Tooltip>
  );
};

export default ToLogin;
