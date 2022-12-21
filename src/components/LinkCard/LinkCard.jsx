import { Link } from "react-router-dom";

import PropTypes from "prop-types";

// @emotion/css
import { css } from "@emotion/css";

// @mui/material
import { useMediaQuery, useTheme, Paper, Box, Typography } from "@mui/material";

// sito components
import SitoImage from "sito-image";

// image
import noProduct from "../../assets/images/no-product.webp";

// styles
import {
  mainBox,
  productContentBox,
  productDescriptionBox,
  productImage,
  productImageBox,
  productPaper,
} from "../../assets/styles/styles";

const LinkCard = (props) => {
  const { item, link, onClick, sx } = props;
  const theme = useTheme();
  const biggerThanMD = useMediaQuery("(min-width:900px)");

  const parseImage = (url) => {
    const split = url.split("/");
    split[3] = split[3] + "/tr:w-500";
    let result = "";
    split.forEach((item, i) => (result += i === 0 ? `${item}//` : `${item}/`));
    result = result.substring(0, result.length - 1);
    return result;
  };

  return (
    <Link
      to={link}
      className={css({
        textDecoration: "none",
        width: biggerThanMD ? "auto" : "100%",
      })}
      onClick={onClick ? (e) => onClick(e) : () => {}}
    >
      <Paper
        id={`obj-${item.user}`}
        elevation={1}
        sx={{
          ...productPaper,
          background: theme.palette.background.paper,
          ...sx,
        }}
      >
        <Box sx={mainBox}>
          <Box sx={{ ...productImageBox, position: "relative" }}>
            <SitoImage
              src={
                item.photo && item.photo !== ""
                  ? parseImage(item.photo.url)
                  : noProduct
              }
              alt={item.menu}
              sx={{
                ...productImage,
                borderRadius: biggerThanMD ? "1rem 1rem 0 0" : "100%",
              }}
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
              <Typography variant="body1">{item.description}</Typography>
            </Box>
            {item.price !== undefined ? (
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", width: "80%" }}
              >
                {item.price} CUP
              </Typography>
            ) : null}
          </Box>
        </Box>
      </Paper>
    </Link>
  );
};

LinkCard.propTypes = {
  link: PropTypes.string.isRequired,
  onClick: PropTypes.func,
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
