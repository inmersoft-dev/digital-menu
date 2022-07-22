// @mui icons
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

// @mui components
import { Typography } from "@mui/material";

// sito components
import SitoContainer from "sito-container";

// contexts
import { useLanguage } from "../../context/LanguageProvider";

const Empty = () => {
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
      <ReceiptLongIcon color="secondary" sx={{ fontSize: "4rem" }} />
      <Typography color="secondary" variant="h4">
        {languageState.texts.Errors.Empty}
      </Typography>
    </SitoContainer>
  );
};

export default Empty;
