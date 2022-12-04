import { Link } from "react-router-dom";

import PropTypes from "prop-types";

// @emotion/css
import { css } from "@emotion/css";

// @mui/material
import { useTheme, Paper, Box, Typography } from "@mui/material";

// sito components
import SitoImage from "sito-image";
import SitoContainer from "sito-container";

// image
import noProduct from "../../assets/images/no-product.webp";

// styles
import {
  productContentBox,
  productDescriptionBox,
  productImage,
  productImageBox,
  productPaper,
} from "../../assets/styles/styles";

const LinkCard = (props) => {
  const { item, link } = props;
  const theme = useTheme();

  const linkStyle = css({
    width: "100%",
    textDecoration: "none",
    display: "flex",
    justifyContent: "center",
  });

  return (
    <Link to={link} className={linkStyle}>
      <Paper
        id={`obj-${item.user}`}
        elevation={1}
        sx={{
          ...productPaper,
          background: theme.palette.background.paper,
        }}
      >
        <SitoContainer sx={{ marginRight: "20px" }}>
          <Box sx={{ ...productImageBox, position: "relative" }}>
            <SitoImage
              src={item.photo && item.photo !== "" ? item.photo.url : noProduct}
              alt={item.menu}
              sx={productImage}
            />
            {item.name && item.menu && item.name !== item.menu ? (
              <Box
                sx={{
                  width: "50px",
                  height: "50px",
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                }}
              >
                <SitoImage
                  src={
                    item.ownerPhoto && item.ownerPhoto !== ""
                      ? item.ownerPhoto.url
                      : noProduct
                  }
                  alt={item.menu}
                  sx={productImage}
                />
              </Box>
            ) : null}
          </Box>
        </SitoContainer>
        <Box sx={productContentBox}>
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", fontSize: "1rem" }}
          >
            {item.name || item.menu}{" "}
            {item.name && item.menu && item.name !== item.menu
              ? `- ${item.menu}`
              : null}
          </Typography>
          <Box sx={productDescriptionBox}>
            <Typography variant="body1" sx={{ textAlign: "justify" }}>
              {item.description}
            </Typography>
          </Box>
          {item.price !== undefined ? (
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", width: "75%" }}
            >
              {item.price} CUP
            </Typography>
          ) : null}
        </Box>
      </Paper>
    </Link>
  );
};

LinkCard.propTypes = {
  link: PropTypes.string.isRequired,
  item: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    user: PropTypes.string,
    type: PropTypes.string,
    price: PropTypes.number,
    photo: PropTypes.shape({
      url: PropTypes.string,
    }),
    menu: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

export default LinkCard;
