import PropTypes from "prop-types";

// @mui icons
import ErrorOutlineTowToneIcon from "@mui/icons-material/ErrorOutlineTwoTone";

// @mui components
import { Button, Typography } from "@mui/material";

// sito components
import SitoContainer from "sito-container";

// contexts
import { useLanguage } from "../../context/LanguageProvider";

const NotConnected = (props) => {
  const { onRetry } = props;
  const { languageState } = useLanguage();
  return (
    <SitoContainer
      alignItems="center"
      justifyContent="center"
      sx={{
        width: "80%",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
        textAlign: "center",
        marginTop: "150px",
      }}
      flexDirection="column"
    >
      <ErrorOutlineTowToneIcon color="error" sx={{ fontSize: "4rem" }} />
      <Typography color="error" variant="h4">
        {languageState.texts.Errors.NotConnected}
      </Typography>
      <Button variant="contained" onClick={onRetry} sx={{ marginTop: "20px" }}>
        {languageState.texts.Insert.Buttons.Retry}
      </Button>
    </SitoContainer>
  );
};

NotConnected.propTypes = {
  onRetry: PropTypes.func,
};

export default NotConnected;
