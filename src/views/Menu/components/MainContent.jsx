import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// @mui/material
import {
  Box,
  Button,
  Tooltip,
  IconButton,
  Link as MUILink,
  Typography,
} from "@mui/material";

// @mui/icons-material
import MapIcon from "@mui/icons-material/Map";
import EditIcon from "@mui/icons-material/Edit";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

// sito-components
import SitoImage from "sito-image";

// components
import InViewComponent from "../../../components/InViewComponent/InViewComponent";
import BusinessCategories from "../../../components/BusinessCategories/BusinessCategories";

// icons
import { socialMediaIcons } from "../icons";

// services
import { sendHowToGoCookie } from "../../../services/analytics";

// utils
import { parseI } from "../../../utils/parser";

// images
import noProduct from "../../../assets/images/no-product.webp";

// styles
import {
  productImage,
  mainContent,
  imageTitleBox,
} from "../../../assets/styles/styles";

// context
import { useLanguage } from "../../../context/LanguageProvider";

const MainContent = (props) => {
  const {
    menu,
    phone,
    photo,
    editing,
    business,
    onAction,
    description,
    geolocation,
    socialMedia,
  } = props;

  const { languageState } = useLanguage();

  const clickedMap = () => sendHowToGoCookie();

  return (
    <Box sx={mainContent}>
      <Box sx={imageTitleBox}>
        <SitoImage
          src={photo && photo !== "" ? photo : noProduct}
          alt={menu}
          sx={{ ...productImage, borderRadius: "100%" }}
        />
      </Box>
      <Box display="flex" alignItems="center" sx={{ marginTop: "10px" }}>
        <Typography
          variant="h3"
          sx={{ fontWeight: "bold", fontSize: "1.5rem", marginRight: "10px" }}
        >
          {menu}
        </Typography>
        {editing ? (
          <Link to="/settings">
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
        ) : null}
      </Box>
      <BusinessCategories business={business} />
      <Typography variant="body1" sx={{ textAlign: "center" }}>
        {description}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {phone.length > 0 ? (
          <InViewComponent delay="0s">
            <Tooltip
              title={
                languageState.texts.Settings.Inputs.Contact.SocialMedia.WhatsApp
              }
            >
              <MUILink
                href={`https://wa.me/${phone}`}
                rel="noopener"
                target="_blank"
              >
                <IconButton color="primary">
                  <WhatsAppIcon />
                </IconButton>
              </MUILink>
            </Tooltip>
          </InViewComponent>
        ) : null}
        {socialMedia.map((item, i) => (
          <InViewComponent delay={`${parseI(0.1, i)}s`} key={item.url}>
            <Tooltip
              title={
                languageState.texts.Settings.Inputs.Contact.SocialMedia.Icons[
                  item.icon
                ]
              }
            >
              <MUILink href={item.url} rel="noopener" target="_blank">
                <IconButton color="primary">
                  {socialMediaIcons[item.icon]}
                </IconButton>
              </MUILink>
            </Tooltip>
          </InViewComponent>
        ))}
        {geolocation.latitude && geolocation.longitude ? (
          <InViewComponent delay={`${parseI(0.1, socialMedia.length)}s`}>
            <Tooltip title={languageState.texts.Map.Tooltip}>
              <MUILink
                onClick={clickedMap}
                href={`https://www.google.com/maps/dir//${geolocation.latitude},${geolocation.longitude}/@${geolocation.latitude},${geolocation.longitude},21z`}
              >
                <IconButton color="primary">
                  <MapIcon />
                </IconButton>
              </MUILink>
            </Tooltip>
          </InViewComponent>
        ) : null}
      </Box>
      {editing ? (
        <Box sx={{ marginTop: "20px" }}>
          <Button variant="contained" onClick={onAction}>
            {languageState.texts.Insert.Buttons.Insert}
          </Button>
        </Box>
      ) : null}
    </Box>
  );
};

MainContent.defaultProps = {
  editing: false,
};

MainContent.propTypes = {
  menu: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  socialMedia: PropTypes.arrayOf(
    PropTypes.shape({ url: PropTypes.string, icon: PropTypes.string })
  ),
  business: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.number, name: PropTypes.string })
  ),
  photo: PropTypes.shape({ url: PropTypes.string }),
  description: PropTypes.string,
  geolocation: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }).isRequired,
  editing: PropTypes.bool,
  onAction: PropTypes.func.isRequired,
};

export default MainContent;
