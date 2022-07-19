// @mui icons
import ErrorOutlineTowToneIcon from "@mui/icons-material/ErrorOutlineTwoTone";

// @mui components
import { Typography } from "@mui/material";

// sito components
import SitoContainer from "sito-container";

// contexts
import { useLanguage } from "../../context/LanguageProvider";

const NotConnected = () => {
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
    </SitoContainer>
  );
};

export default NotConnected;
