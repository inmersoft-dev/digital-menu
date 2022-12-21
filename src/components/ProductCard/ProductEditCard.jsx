import { useState } from "react";
import PropTypes from "prop-types";

// @mui/material
import {
  useMediaQuery,
  useTheme,
  Paper,
  Box,
  Typography,
  IconButton,
} from "@mui/material";

// sito components
import SitoImage from "sito-image";

// @mui/icons-material
import DeleteIcon from "@mui/icons-material/Delete";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// styles
import {
  productImage,
  productPaper,
  productImageBox,
  productContentBox,
  productDescriptionBox,
  mainBox,
} from "../../assets/styles/styles";

// images
import noProduct from "../../assets/images/no-product.webp";

const ProductEditCard = (props) => {
  const theme = useTheme();
  const biggerThanMD = useMediaQuery("(min-width:900px)");

  const { item, changeVisibility, deleteProduct, onClick } = props;

  const [visibility, setVisibility] = useState(false);

  return (
    <Paper
      id={`obj-${item.id}`}
      elevation={1}
      sx={{
        ...productPaper,
        background: item.visibility
          ? theme.palette.background.paper
          : theme.palette.background.default,
      }}
      onMouseEnter={() => setVisibility(true)}
      onMouseLeave={() => setVisibility(false)}
    >
      <Box
        sx={{
          position: "absolute",
          top: "1px",
          right: "1px",
          borderRadius: "1rem",
          opacity: visibility ? 1 : 0,
          transition: "opacity 500ms ease",
          background: { md: "#222222aa", xs: "none" },
        }}
      >
        <IconButton
          color="secondary"
          onClick={() => changeVisibility(item.index)}
        >
          {item.visibility ? <Visibility /> : <VisibilityOff />}
        </IconButton>
        <IconButton color="error" onClick={() => deleteProduct(item.index)}>
          <DeleteIcon />
        </IconButton>
      </Box>
      <Box sx={mainBox} onClick={() => onClick(item)}>
        <Box sx={productImageBox}>
          <SitoImage
            src={
              item.photo && item.photo.url !== "" ? item.photo.url : noProduct
            }
            alt={item.name}
            sx={{
              ...productImage,
              borderRadius: biggerThanMD ? "1rem 1rem 0 0" : "100%",
            }}
          />
        </Box>
        <Box sx={productContentBox}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            {item.name}
          </Typography>
          <Box sx={productDescriptionBox}>
            <Typography variant="body1" sx={{ textAlign: "justify" }}>
              {item.description}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: "bold", width: "80%" }}>
            {item.price} CUP
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

ProductEditCard.propTypes = {
  onClick: PropTypes.func.isRequired,
  deleteProduct: PropTypes.func.isRequired,
  changeVisibility: PropTypes.func.isRequired,
  addToOrder: PropTypes.func.isRequired,
  item: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.string,
    photo: PropTypes.shape({ url: PropTypes.string }),
  }).isRequired,
};

export default ProductEditCard;
