import PropTypes from "prop-types";

// @mui icons
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

// @mui components
import { Typography } from "@mui/material";

// sito components
import SitoContainer from "sito-container";

// contexts
import { useLanguage } from "../../context/LanguageProvider";

const Empty = (props) => {
  const { text, icon, sx } = props;
  const { languageState } = useLanguage();
  return (
    <SitoContainer
      alignItems="center"
      justifyContent="center"
      sx={{ width: "100%", height: "500px", ...sx }}
      flexDirection="column"
    >
      {icon}
      <Typography
        sx={{ marginTop: "15px" }}
        color="inherit"
        variant="subtitle1"
      >
        {text || languageState.texts.Errors.NoProducts}
      </Typography>
    </SitoContainer>
  );
};

Empty.defaultProps = {
  sx: {},
  icon: <ReceiptLongIcon color="inherit" size="large" />,
  title: undefined,
  button: undefined,
  text: undefined,
};

Empty.propTypes = {
  sx: PropTypes.object,
  icon: PropTypes.node,
  text: PropTypes.string,
};

export default Empty;
