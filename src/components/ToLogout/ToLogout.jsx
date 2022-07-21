import { useNavigate } from "react-router-dom";

// @mui icons
import KeyOffIcon from "@mui/icons-material/KeyOff";

// @mui components
import { Button } from "@mui/material";

const ToLogout = () => {
  const navigate = useNavigate();

  const toLogout = () => navigate("/auth/logout");

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
      }}
    >
      <KeyOffIcon />
    </Button>
  );
};

export default ToLogout;
