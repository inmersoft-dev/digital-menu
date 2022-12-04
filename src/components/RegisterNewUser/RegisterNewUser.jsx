// @mui icons
import PersonAddIcon from "@mui/icons-material/PersonAdd";

// @mui components
import { Tooltip, Button, Link } from "@mui/material";

// contexts
import { useLanguage } from "../../context/LanguageProvider";

const RegisterNewUser = () => {
  const { languageState } = useLanguage();

  return (
    <Tooltip
      title={languageState.texts.Tooltips.RegisterNewUser}
      placement="left"
    >
      <Link href="/auth/register-user">
        <Button
          variant="contained"
          sx={{
            borderRadius: "100%",
            padding: "5px",
            minWidth: 0,
          }}
        >
          <PersonAddIcon />
        </Button>
      </Link>
    </Tooltip>
  );
};

export default RegisterNewUser;
