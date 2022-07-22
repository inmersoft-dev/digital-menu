import { Link } from "react-router-dom";

// @mui components
import { Button } from "@mui/material";

// @mui icons
import ChevronLeft from "@mui/icons-material/ChevronLeft";

// sito components
import SitoContainer from "sito-container";

const BackButton = () => {
  return (
    <SitoContainer
      sx={{
        position: "absolute",
        top: "10px",
        left: "10px",
      }}
    >
      <Link to="/">
        <Button
          variant="contained"
          color="primary"
          sx={{ minWidth: 0, borderRadius: "100%", padding: "5px" }}
        >
          <ChevronLeft />
        </Button>
      </Link>
    </SitoContainer>
  );
};

export default BackButton;
