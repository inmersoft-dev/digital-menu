import { useEffect, useState } from "react";

// some-javascript-utils
import { createCookie, getCookie } from "some-javascript-utils/browser";

// @emotion/css
import { css } from "@emotion/css";

// @mui/material
import { Paper, Box, Typography, Button, Link } from "@mui/material";

// @mui/icons-material
import CookieIcon from "@mui/icons-material/Cookie";

// framer-motion
import { motion } from "framer-motion";

// contexts
import { useLanguage } from "../../context/LanguageProvider";

import config from "../../config";

const CookieBox = (props) => {
  const { sx } = props;
  const { languageState } = useLanguage();
  const [hide, setHide] = useState(false);

  useEffect(() => {}, []);

  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const acceptCookie = () => {
    setHide(true);
    createCookie(config.acceptCookie, 730, true);
  };

  const declineCookie = () => {
    setHide(true);
    createCookie(config.declineCookie, 730, true);
  };

  useEffect(() => {
    if (!getCookie(config.acceptCookie) && !getCookie(config.declineCookie))
      setHide(false);
    else setHide(true);
  }, []);

  return (
    <Box>
      {!hide ? (
        <Paper
          elevation={2}
          sx={{
            padding: "20px",
            position: "fixed",
            width: "300px",
            zIndex: 99,
            left: "5px",
            bottom: "5px",
            border: "1px solid #8080804a",
            ...sx,
          }}
        >
          <motion.div
            initial="hidden"
            variants={container}
            whileInView="visible"
            viewport={{ once: true }}
            className={css({
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            })}
          >
            <Box sx={{ display: "flex" }}>
              <CookieIcon sx={{ marginRight: "10px", width: "48px" }} />
              <Typography
                sx={{
                  marginRight: "10px",
                }}
              >
                {languageState.texts.CookieBox.Description}.{" "}
                <Link href="/cookie-policy" target="_blank" rel="noopener">
                  {languageState.texts.CookieBox.Link}
                </Link>
                .
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: "10px", width: "170px" }}>
              <Button onClick={acceptCookie} variant="contained">
                {languageState.texts.CookieBox.Accept}
              </Button>
              <Button onClick={declineCookie} variant="outlined">
                {languageState.texts.CookieBox.Decline}
              </Button>
            </Box>
          </motion.div>
        </Paper>
      ) : null}
    </Box>
  );
};

export default CookieBox;
