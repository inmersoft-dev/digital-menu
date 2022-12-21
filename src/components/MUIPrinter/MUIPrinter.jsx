import PropTypes from "prop-types";

// @mui/material
import { Box, Typography } from "@mui/material";

// components
import AppBar from "../../components/AppBar/AppBar";
import FabButtons from "../../components/FabButtons/FabButtons";

const MUIPrinter = (props) => {
  const { text } = props;
  return (
    <Box
      sx={{
        marginTop: "60px",
        padding: { xs: "20px", sm: "50px", md: "50px 5rem", lg: "50px 15rem" },
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <AppBar />
      <FabButtons />
      {console.log(text)}
      {text.map((item, i) => (
        <Typography variant={item.variant} key={i} sx={{ ...item.sx }}>
          {item.content}
        </Typography>
      ))}
    </Box>
  );
};

MUIPrinter.propTypes = {
  text: PropTypes.arrayOf(
    PropTypes.shape({ variant: "string", content: "string" })
  ),
};

export default MUIPrinter;
