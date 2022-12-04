// @mui icons
import KeyOffIcon from "@mui/icons-material/KeyOff";

// @mui components
import { Tooltip, Button, Link } from "@mui/material";

// contexts
import { useLanguage } from "../../context/LanguageProvider";

const ToLogout = () => {
  const { languageState } = useLanguage();

  return (
    <Tooltip title={languageState.texts.Tooltips.ToLogout} placement="left">
      <Link href="/auth/logout">
        <Button
          variant="contained"
          sx={{
            borderRadius: "100%",
            padding: "5px",
            minWidth: 0,
          }}
        >
          <KeyOffIcon />
        </Button>
      </Link>
    </Tooltip>
  );
};

export default ToLogout;
