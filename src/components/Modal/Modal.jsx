import { useState } from "react";

import PropTypes from "prop-types";

// sito components
import SitoContainer from "sito-container";
import SitoImage from "sito-image";

// @mui icons
import CloseIcon from "@mui/icons-material/Close";

// @mui
import { useTheme, Box, Typography, IconButton } from "@mui/material";
import { useEffect } from "react";

const Modal = (props) => {
  const theme = useTheme();
  const { visible, onClose, item } = props;

  const [show, setShow] = useState(visible);

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  const onShowOff = () => {
    onClose();
    setShow(false);
  };

  return (
    <Box
      onClick={onShowOff}
      sx={{
        position: "fixed",
        left: 0,
        bottom: 0,
        zIndex: show ? 20 : -1,
        opacity: show ? 1 : -1,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        background: "#4e464652",
        backdropFilter: "blur(4px)",
        transition: "all 500ms ease",
      }}
      onClose={onClose}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { md: "800px", sm: "630px", xs: "100%" },
          height: "90%",
          padding: "1rem",
          borderRadius: "1rem",
          background: theme.palette.background.paper,
          position: "relative",
          transition: "all 500ms ease",
          opacity: show ? 1 : -1,
        }}
      >
        <SitoContainer
          sx={{ width: "96%", position: "absolute", marginTop: "-10px" }}
          justifyContent="flex-end"
          alignItems="center"
        >
          <IconButton color="error" onClick={onShowOff}>
            <CloseIcon />
          </IconButton>
        </SitoContainer>
        <SitoContainer
          sx={{ width: "100%" }}
          alignItems="center"
          justifyContent="center"
        >
          <Box
            sx={{
              width: { md: "160px", sm: "160px", xs: "160px" },
              height: { md: "160px", sm: "160px", xs: "160px" },
            }}
          >
            <SitoImage
              src={item.ph}
              alt={item.n}
              sx={{ width: "100%", height: "100%", borderRadius: "100%" }}
            />
          </Box>
        </SitoContainer>

        <SitoContainer
          flexDirection="column"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              width: "100%",
              textAlign: "center",
              marginTop: "10px",
            }}
          >
            {item.p}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              width: "100%",
              textAlign: "center",
              marginTop: "10px",
            }}
          >
            {item.n}
          </Typography>
          <Typography
            variant="body"
            sx={{ width: "100%", textAlign: "center", marginTop: "10px" }}
          >
            {item.d}
          </Typography>
        </SitoContainer>
      </Box>
    </Box>
  );
};

Modal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  item: PropTypes.object,
};

export default Modal;
