import PropTypes from "prop-types";

// @mui/material
import { useTheme, Paper, Box, Typography } from "@mui/material";

// sito components
import SitoImage from "sito-image";
import SitoContainer from "sito-container";

// styles
import {
  productImage,
  productImageBox,
  productContentBox,
  productDescriptionBox,
} from "../../assets/styles/styles";

// images
import noProduct from "../../assets/images/no-product.webp";

const ProductCard = (props) => {
  const theme = useTheme();

  const { onClick, item } = props;

  return (
    <Paper
      id={`obj-${item.id}`}
      elevation={1}
      sx={{
        position: "relative",
        marginTop: "20px",
        width: { md: "800px", sm: "630px", xs: "100%" },
        padding: "1rem",
        borderRadius: "1rem",
        background: theme.palette.background.paper,
        alignItems: "center",
      }}
    >
      <Box sx={{ cursor: "pointer", display: "flex" }} onClick={onClick}>
        <SitoContainer sx={{ marginRight: "20px" }}>
          <Box sx={productImageBox}>
            <SitoImage
              src={
                item.photo && item.photo.url !== "" ? item.photo.url : noProduct
              }
              alt={item.name}
              sx={productImage}
            />
          </Box>
        </SitoContainer>
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
          <Typography variant="body2" sx={{ fontWeight: "bold", width: "75%" }}>
            {item.price} CUP
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

ProductCard.propTypes = {
  onClick: PropTypes.func.isRequired,
  item: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.string,
    photo: PropTypes.shape({ url: PropTypes.string }),
  }).isRequired,
};

export default ProductCard;
