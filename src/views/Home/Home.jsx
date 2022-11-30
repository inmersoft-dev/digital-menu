/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// @emotion/css
import { css } from "@emotion/css";

// @mui components
import {
  useMediaQuery,
  useTheme,
  Paper,
  Box,
  Typography,
  IconButton,
  FormControl,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";

// @mui/icons-material
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

// sito components
import SitoContainer from "sito-container";
import SitoImage from "sito-image";

// own components
import Error from "../../components/Error/Error";
import Empty from "../../components/Empty/Empty";
import Loading from "../../components/Loading/Loading";
import ToLogin from "../../components/ToLogin/ToLogin";
import ToLogout from "../../components/ToLogout/ToLogout";
import InViewComponent from "../../components/InViewComponent/InViewComponent";

// services
import { fetchAll } from "../../services/menu.js";

// contexts
import { useMode } from "../../context/ModeProvider";
import { useLanguage } from "../../context/LanguageProvider";
import { useNotification } from "../../context/NotificationProvider";
import { getUserName, userLogged } from "../../utils/auth";

// image
import noProduct from "../../assets/images/no-product.webp";

// styles
import {
  mainWindow,
  productContentBox,
  productDescriptionBox,
  productImage,
  productImageBox,
  productPaper,
} from "../../assets/styles/styles";

// utils
import { spaceToDashes } from "../../utils/functions";

const Home = () => {
  const theme = useTheme();
  const biggerThanMD = useMediaQuery("(min-width:900px)");

  const linkStyle = css({
    width: "100%",
    textDecoration: "none",
    display: "flex",
    justifyContent: "center",
  });

  const { languageState } = useLanguage();
  const { modeState, setModeState } = useMode();

  const toggleMode = () => setModeState({ type: "toggle" });

  const { setNotificationState } = useNotification();

  const [showSearch, setShowSearch] = useState(false);
  const toggleSearchInput = () => setShowSearch(!showSearch);

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const [loading, setLoading] = useState(1);
  const [error, setError] = useState(false);

  const [, setAllData] = useState([]);
  const [list, setList] = useState([]);

  const fetch = async () => {
    setLoading(1);
    setError(false);
    try {
      const response = await fetchAll();
      const data = await response.data;
      if (data && data.users) {
        const arrayData = Object.values(data.users);
        setList(arrayData.filter((item) => item.photo));
        setAllData(Object.keys(data.users));
        setLoading(0);
      }
    } catch (err) {
      console.error(err);
      showNotification("error", String(err));
      setError(true);
      setLoading(-1);
    }
  };

  const retry = () => fetch();

  useEffect(() => {
    retry();
  }, []);

  const [toSearch, setToSearch] = useState("");
  const handleToSearch = (e) => setToSearch(e.target.value);
  const clearInput = () => setToSearch("");

  const actionToSearch = (e) => {
    e.preventDefault();
  };

  const preventDefault = (event) => event.preventDefault();

  return (
    <SitoContainer sx={mainWindow} flexDirection="column">
      <Loading
        visible={loading === 1}
        sx={{
          zIndex: loading === 1 ? 99 : -1,
        }}
      />

      {userLogged() ? <ToLogout /> : <ToLogin />}
      {error && loading === -1 && <Error onRetry={retry} />}
      {list.length === 0 && !loading && (
        <Empty text={languageState.texts.Errors.NoMenu} />
      )}
      {!error && list.length > 0 && loading === 0 && (
        <Box>
          <Box
            sx={{
              width: "100%",
              overflow: "hidden",
              transition: "height 200ms ease",
              height: biggerThanMD ? "50px" : showSearch ? "100px" : "40px",
            }}
          >
            <Box
              sx={{
                gap: "30px",
                width: "100%",
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
                position: "relative",
                justifyContent: "space-between",
              }}
            >
              <Typography sx={{ fontSize: "1.5rem" }} variant="h3">
                {languageState.texts.Title}
              </Typography>
              {biggerThanMD ? (
                <FormControl
                  sx={{
                    overflow: "hidden",
                    position: "absolute",
                    right: "40px",
                    div: { borderRadius: "25px" },
                    width: showSearch ? "50%" : "40px",
                    transition: "all 1000ms ease",
                    marginLeft: showSearch ? 0 : "50%",
                    fieldset: {
                      transition: "all 1000ms ease",
                      borderWidth: showSearch ? "1px" : 0,
                    },
                    input: { padding: "7.5px 14px", fontSize: "15px" },
                  }}
                  variant="outlined"
                  component="form"
                >
                  <OutlinedInput
                    id="search"
                    size="small"
                    value={toSearch}
                    placeholder={languageState.texts.Navbar.Search}
                    onChange={handleToSearch}
                    type="search"
                    endAdornment={
                      <InputAdornment position="end">
                        {toSearch.length > 0 ? (
                          <IconButton
                            color="secondary"
                            aria-label="clear"
                            onClick={clearInput}
                            onMouseDown={preventDefault}
                            edge="end"
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        ) : null}
                      </InputAdornment>
                    }
                  />
                </FormControl>
              ) : null}
              <Box display="flex" alignItems="center">
                <IconButton color="inherit" onClick={toggleSearchInput}>
                  <SearchIcon />
                </IconButton>
                <IconButton color="inherit" onClick={toggleMode}>
                  {modeState.mode === "light" ? (
                    <DarkModeIcon />
                  ) : (
                    <LightModeIcon />
                  )}
                </IconButton>
              </Box>
            </Box>
            <FormControl
              sx={{
                width: "100%",
                div: { borderRadius: "25px" },
                input: { padding: "7.5px 14px", fontSize: "15px" },
              }}
              variant="outlined"
              component="form"
            >
              <OutlinedInput
                id="search"
                size="small"
                value={toSearch}
                placeholder={languageState.texts.Navbar.Search}
                onChange={handleToSearch}
                type="search"
                endAdornment={
                  <InputAdornment position="end">
                    {toSearch.length > 0 ? (
                      <IconButton
                        color="secondary"
                        aria-label="clear"
                        onClick={clearInput}
                        onMouseDown={preventDefault}
                        edge="end"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    ) : null}
                  </InputAdornment>
                }
              />
            </FormControl>
          </Box>
          {list.map((item, i) => (
            <InViewComponent
              key={item.id}
              delay={`0.${1 * (item.index + 1)}s`}
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Link
                to={
                  userLogged() && item.user === getUserName()
                    ? "/menu/edit"
                    : `/menu/${spaceToDashes(item.menu)}`
                }
                className={linkStyle}
              >
                <Paper
                  id={`obj-${item.user}`}
                  elevation={1}
                  sx={{
                    ...productPaper,
                    background: theme.palette.background.paper,
                  }}
                >
                  <SitoContainer sx={{ marginRight: "20px" }}>
                    <Box sx={productImageBox}>
                      <SitoImage
                        src={
                          item.photo && item.photo !== ""
                            ? item.photo.url
                            : noProduct
                        }
                        alt={item.menu}
                        sx={productImage}
                      />
                    </Box>
                  </SitoContainer>
                  <Box sx={productContentBox}>
                    <Typography
                      variant="h3"
                      sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    >
                      {item.menu}
                    </Typography>
                    <Box sx={productDescriptionBox}>
                      <Typography variant="body1" sx={{ textAlign: "justify" }}>
                        {item.description}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Link>
            </InViewComponent>
          ))}
        </Box>
      )}
    </SitoContainer>
  );
};

export default Home;
