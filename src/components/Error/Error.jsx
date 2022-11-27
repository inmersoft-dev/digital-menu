/* eslint-disable react/function-component-definition */
import PropTypes from "prop-types";

// @mui icons
import ErrorIcon from "@mui/icons-material/Error";
import ReplayIcon from "@mui/icons-material/Replay";

// @mui components
import { Typography, Button } from "@mui/material";

// sito components
import SitoContainer from "sito-container";

// contexts
import { useLanguage } from "../../context/LanguageProvider";

const Error = (props) => {
  const { languageState } = useLanguage();
  const { onAction, text } = props;

  return (
    <SitoContainer
      alignItems="center"
      justifyContent="center"
      sx={{ width: "100%", height: "500px" }}
      flexDirection="column"
    >
      <ErrorIcon size="large" color="error" />
      <Typography
        sx={{ marginTop: "15px" }}
        color="inherit"
        variant="subtitle1"
      >
        {text || languageState.texts.Errors.SomeWrong}
      </Typography>
      {onAction && (
        <Button
          color="inherit"
          type="submit"
          onClick={onAction}
          sx={{ marginTop: "15px" }}
        >
          <ReplayIcon sx={{ marginRight: "15px" }} />
          {languageState.texts.Buttons.Retry}
        </Button>
      )}
    </SitoContainer>
  );
};

Error.defaultProps = {
  onAction: undefined,
  text: undefined,
};

Error.propTypes = {
  onAction: PropTypes.func,
  text: PropTypes.string,
};

export default Error;
