import PropTypes from "prop-types";

// @mui/material
import { Box, Tooltip } from "@mui/material";

// @mui/icons-material

import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import NewReleasesIcon from "@mui/icons-material/NewReleases";

const Badge = (props) => {
  const { type, text } = props;

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
      }}
    >
      {type === "info" ? (
        <Tooltip title={text}>
          <NewReleasesIcon color={type} />
        </Tooltip>
      ) : null}
      {type === "warning" ? (
        <Tooltip title={text}>
          <WarningIcon color={type} />
        </Tooltip>
      ) : null}
      {type === "error" ? (
        <Tooltip title={text}>
          <ErrorIcon color={type} />
        </Tooltip>
      ) : null}
    </Box>
  );
};

Badge.defaultProps = {
  type: "error",
  text: "text",
};

Badge.propTypes = {
  type: PropTypes.oneOf(["info", "error", "warning"]),
  text: PropTypes.string,
};

export default Badge;
