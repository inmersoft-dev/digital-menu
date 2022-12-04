import { Link } from "react-router-dom";

import PropTypes from "prop-types";

// @mui components
import { Box, IconButton, Button } from "@mui/material";

// @mui icons
import ChevronLeft from "@mui/icons-material/ChevronLeft";

const BackButton = (props) => {
  const { to, flat, sx } = props;
  return (
    <Box
      sx={{
        position: "fixed",
        top: "5px",
        left: "1px",
        zIndex: 20,
        ...sx,
      }}
    >
      <Link to={to}>
        {!flat ? (
          <Button
            variant="contained"
            color="primary"
            sx={{ minWidth: 0, borderRadius: "100%", padding: "5px" }}
          >
            <ChevronLeft />
          </Button>
        ) : (
          <IconButton color="secondary">
            <ChevronLeft />
          </IconButton>
        )}
      </Link>
    </Box>
  );
};

BackButton.defaultProps = {
  to: "/",
  flat: false,
  sx: {},
};

BackButton.propTypes = {
  to: PropTypes.string,
  flat: PropTypes.bool,
  sx: PropTypes.object,
};

export default BackButton;
