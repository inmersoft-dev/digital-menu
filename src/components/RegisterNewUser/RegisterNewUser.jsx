import { useNavigate } from "react-router-dom";

// @mui icons
import PersonAddIcon from "@mui/icons-material/PersonAdd";

// @mui components
import { Tooltip, Button } from "@mui/material";

// contexts
import { useLanguage } from "../../context/LanguageProvider";

const RegisterNewUser = () => {
  const navigate = useNavigate();

  const { languageState } = useLanguage();

  const toRegisterNewUser = () => navigate("/auth/register-user");

  return (
    <Tooltip
      title={languageState.texts.Tooltips.RegisterNewUser}
      placement="top"
    >
      <Button
        onClick={toRegisterNewUser}
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
        <PersonAddIcon />
      </Button>
    </Tooltip>
  );
};

export default RegisterNewUser;
