import { useEffect } from "react";

// prop-types
import PropTypes from "prop-types";

// @mui components
import { Box, CircularProgress, useTheme } from "@mui/material";

const Loading = (props) => {
  const theme = useTheme();
  const { sx, visible } = props;

  useEffect(() => {
    /* if (visible) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto"; */
  }, [visible]);

  return (
    <Box
      sx={{
        opacity: visible ? 1 : 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 400ms ease",
        position: "fixed",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        backdropFilter: "blur(4px)",
        background: `${theme.palette.background.paper}`,
        ...sx,
      }}
    >
      <CircularProgress color="primary" />
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
