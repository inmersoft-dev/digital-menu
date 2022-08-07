import { Link } from "react-router-dom";

import PropTypes from "prop-types";

// @mui components
import { Button } from "@mui/material";

// @mui icons
import ChevronLeft from "@mui/icons-material/ChevronLeft";

// sito components
import SitoContainer from "sito-container";

const BackButton = (props) => {
  const { to } = props;
  return (
    <SitoContainer
      sx={{
        position: "absolute",
        top: "10px",
        left: "10px",
      }}
    >
      <Link to={to}>
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

BackButton.defaultProps = {
  to: "/",
};

BackButton.propTypes = {
  to: PropTypes.string,
};

export default BackButton;
