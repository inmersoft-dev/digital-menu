// prop-types
import PropTypes from "prop-types";

// @mui components
import { Box } from "@mui/material";

// @mui icons
import LoopIcon from "@mui/icons-material/Loop";

const Loading = (props) => {
  const { sx, visible } = props;
  return (
    <Box
      sx={{
        opacity: visible ? 1 : 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 400ms ease",
        ...sx,
      }}
    >
      <LoopIcon sx={{ fontSize: "3rem" }} className="loading" color="primary" />
    </Box>
  );
};

Loading.defaultProps = {
  sx: {},
  visible: false,
};

Loading.propTypes = {
  sx: PropTypes.objectOf(PropTypes.any),
  visible: PropTypes.bool,
};

export default Loading;
