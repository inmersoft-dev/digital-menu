import { Link } from "react-router-dom";

// @mui icons
import DoDisturbIcon from "@mui/icons-material/DoDisturb";

// @mui components
import { Button, Typography } from "@mui/material";

// @emotion/css
import { css } from "@emotion/css";

// sito components
import SitoContainer from "sito-container";

// contexts
import { useLanguage } from "../../context/LanguageProvider";

const NotFound = () => {
  const { languageState } = useLanguage();
  return (
    <SitoContainer
      alignItems="center"
      justifyContent="center"
      sx={{
        width: { xs: "80%" },
        maxWidth: "600px",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
        textAlign: "center",
        marginTop: "150px",
      }}
      flexDirection="column"
    >
      <DoDisturbIcon color="secondary" sx={{ fontSize: "4rem" }} />
      <Typography color="secondary" variant="h4" sx={{ marginTop: "20px" }}>
        {languageState.texts.NotFound.Title}
      </Typography>
      <Typography
        color="secondary"
        variant="body1"
        sx={{ marginTop: "20px", width: "80vw" }}
      >
        {languageState.texts.NotFound.Description}
      </Typography>
      <Link
        to="/"
        className={css({ textDecoration: "none", marginTop: "20px" })}
      >
        <Button variant="contained">{languageState.texts.NotFound.Link}</Button>
      </Link>
    </SitoContainer>
  );
};

export default NotFound;
