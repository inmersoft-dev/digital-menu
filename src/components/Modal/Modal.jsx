import PropTypes from "prop-types";

// sito components
import SitoModal from "sito-modal";
import SitoContainer from "sito-container";
import SitoImage from "sito-image";

// @mui
import { Box, Typography } from "@mui/material";

const Modal = (props) => {
  const { visible, onClose, item } = props;

  return (
    <SitoModal visible={visible} onClose={onClose}>
      <Box
        sx={{
          width: { md: "160px", sm: "120px", xs: "80px" },
          height: { md: "160px", sm: "120px", xs: "80px" },
        }}
      >
        <SitoImage
          src={item.ph}
          alt={item.n}
          sx={{ width: "100%", height: "100%", borderRadius: "100%" }}
        />
      </Box>
      <SitoContainer>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", width: "100%", alignItems: "center" }}
        >
          {item.p}
        </Typography>
        <Typography
          variant="h3"
          sx={{ fontWeight: "bold", width: "100%", alignItems: "center" }}
        >
          {item.n}
        </Typography>
        <Typography variant="body" sx={{ width: "100%", alignItems: "center" }}>
          {item.p}
        </Typography>
      </SitoContainer>
    </SitoModal>
  );
};

Modal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  item: PropTypes.object,
};

export default Modal;
