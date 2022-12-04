/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback, useReducer } from "react";
import { useLocation } from "react-router-dom";

// @mui components
import {
  useMediaQuery,
  Box,
  Typography,
  IconButton,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Chip,
  useTheme,
} from "@mui/material";

// @mui/icons-material
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

// own components
import Error from "../../components/Error/Error";
import Empty from "../../components/Empty/Empty";
import Loading from "../../components/Loading/Loading";
import LinkCard from "../../components/LinkCard/LinkCard";
import FabButtons from "../../components/FabButtons/FabButtons";
import InViewComponent from "../../components/InViewComponent/InViewComponent";

// services
import { fetchAll } from "../../services/menu.js";

// contexts
import { useMode } from "../../context/ModeProvider";
import { useLanguage } from "../../context/LanguageProvider";
import { useNotification } from "../../context/NotificationProvider";

// utils
import { parserAccents } from "../../utils/parser";
import { spaceToDashes, dashesToSpace } from "../../utils/functions";
import { getUserName, userLogged } from "../../utils/auth";

// styles
import { mainWindow } from "../../assets/styles/styles";

// services
import { search } from "../../services/search";

const Home = () => {
  const biggerThanMD = useMediaQuery("(min-width:900px)");
  const location = useLocation();

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

  const searchResultReducer = (searchResultState, action) => {
    const { type } = action;
    switch (type) {
      case "set": {
        const { newArray } = action;
        return newArray;
      }
      default:
        return [];
    }
  };

  const [searchResult, setSearchResult] = useReducer(searchResultReducer, []);

  const [searchingProducts, setSearchingProducts] = useState(true);
  const toggleSearchingProducts = () =>
    setSearchingProducts(!searchingProducts);

  const [searchingCategories, setSearchingCategories] = useState(true);
  const toggleSearchingCategories = () =>
    setSearchingCategories(!searchingCategories);
  const [searchingMenus, setSearchingMenus] = useState(true);
  const toggleSearchingMenus = () => setSearchingMenus(!searchingMenus);

  const preventDefault = (event) => event.preventDefault();

  const [showFilters, setShowFilters] = useState(false);
  const toggleFilters = () => setShowFilters(!showFilters);

  const topBarHeight = useCallback(() => {
    if (biggerThanMD && !showFilters) return "60px";
    if (showSearch && showFilters)
      if (biggerThanMD) return "120px";
      else return "180px";
    if (showSearch) return "120px";
    return "60px";
  }, [biggerThanMD, showSearch, showFilters]);

  const marginTopBar = useCallback(() => {
    if (biggerThanMD && !showFilters) return "60px";
    if (showSearch && showFilters)
      if (biggerThanMD) return "100px";
      else return "160px";
    if (showSearch) return "100px";
    return "40px";
  }, [biggerThanMD, showSearch, showFilters]);

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

  const clearInput = () => setToSearch("");

  const filter = useCallback(async () => {
    setLoading(1);
    setError(false);
    try {
      if (toSearch.length) {
        const response = await search(toSearch, {
          searchingProducts,
          searchingCategories,
          searchingMenus,
        });
        const data = await response.list;
        setSearchResult({ type: "set", newArray: data });
        setLoading(0);
      }
    } catch (err) {
      console.error(err);
      showNotification("error", String(err));
      setError(true);
      setLoading(-1);
    }
  });

  useEffect(() => {
    filter();
  }, [toSearch, searchingProducts, searchingCategories, searchingMenus]);

  const handleToSearch = (e) => setToSearch(e.target.value);

  const getLinkCard = (item, type) => {
    if (type === "menu") {
      if (userLogged() && item.user === getUserName()) return "/menu/edit";
      return `/menu/${spaceToDashes(item.name)}`;
    } else {
      if (userLogged() && item.user === getUserName()) return "/menu/edit";
      return `/menu/${spaceToDashes(item.menu)}?product=${spaceToDashes(
        parserAccents(item.name)
      )}`;
    }
  };

  const searchResultIsEmpty = useCallback(() => {
    if (searchResult && (searchResult[0] || searchResult[1]))
      if (searchResult[0].list.length || searchResult[1].list.length)
        return false;
    return true;
  }, [searchResult]);

  useEffect(() => {
    if (location.search) {
      const queryParams = location.search.substring(1);
      const params = queryParams.split("&");
      params.forEach((item) => {
        const [paramName, paramValue] = item.split("=");
        if (paramValue)
          switch (paramName) {
            case "business":
              setSearchingProducts(false);
              setSearchingCategories(false);
              setSearchingMenus(true);
              setToSearch(dashesToSpace(paramValue));
              setShowSearch(true);
              break;
            case "product": {
              setSearchingProducts(true);
              setSearchingCategories(false);
              setSearchingMenus(false);
              setToSearch(dashesToSpace(paramValue));
              setShowSearch(true);
              break;
            }
            case "category": {
              setSearchingProducts(false);
              setSearchingCategories(true);
              setSearchingMenus(false);
              setToSearch(dashesToSpace(paramValue));
              setShowSearch(true);
              break;
            }
            default:
              break;
          }
      });
    }
  }, [location]);

  const theme = useTheme();

  return (
    <Box sx={mainWindow} flexDirection="column">
      <FabButtons />
      <Box sx={{ minHeight: "100vh" }}>
        <Box
          sx={{
            width: "100%",
            position: "fixed",
            top: 0,
            left: 0,
            padding: "10px 20px",
            overflow: "hidden",
            transition: "height 200ms ease",
            height: topBarHeight(),
            background: theme.palette.background.paper,
            borderBottom: "1px solid",
            borderColor: "rgba(87,87,87,0.5)",
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
            <Typography
              sx={{ fontSize: { xs: "1.3rem", md: "1.5rem" } }}
              variant="h3"
            >
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
              >
                <OutlinedInput
                  id="search"
                  size="small"
                  value={toSearch}
                  placeholder={languageState.texts.Navbar.Search}
                  onChange={handleToSearch}
                  type="search"
                  startAdornment={
                    <InputAdornment position="start">
                      {showSearch ? (
                        <IconButton
                          sx={{ marginLeft: "-12px" }}
                          color="secondary"
                          aria-label="filter"
                          onClick={toggleFilters}
                          onMouseDown={preventDefault}
                          edge="start"
                          size="small"
                        >
                          {!showFilters ? (
                            <FilterAltIcon />
                          ) : (
                            <FilterAltOffIcon />
                          )}
                        </IconButton>
                      ) : null}
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment
                      position="end"
                      sx={{ button: { marginRight: "20px" } }}
                    >
                      {toSearch.length > 0 ? (
                        <IconButton
                          sx={{ marginRight: "20px" }}
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
          {!biggerThanMD ? (
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
                startAdornment={
                  <InputAdornment position="start">
                    {showSearch ? (
                      <IconButton
                        color="secondary"
                        aria-label="filter"
                        onClick={toggleFilters}
                        sx={{ marginLeft: "-12px" }}
                        onMouseDown={preventDefault}
                        edge="start"
                        size="small"
                      >
                        {!showFilters ? (
                          <FilterAltIcon />
                        ) : (
                          <FilterAltOffIcon />
                        )}
                      </IconButton>
                    ) : null}
                  </InputAdornment>
                }
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
          <Box
            sx={{
              display: "flex",
              marginTop: "20px",
              marginLeft: 0,
              gap: "10px",
            }}
          >
            <Chip
              label={languageState.texts.Navbar.Filters.Products}
              color={searchingProducts ? "primary" : undefined}
              onClick={toggleSearchingProducts}
            />
            <Chip
              label={languageState.texts.Navbar.Filters.Categories}
              color={searchingCategories ? "primary" : undefined}
              onClick={toggleSearchingCategories}
            />
            <Chip
              label={languageState.texts.Navbar.Filters.Menus}
              color={searchingMenus ? "primary" : undefined}
              onClick={toggleSearchingMenus}
            />
          </Box>
        </Box>
        {error && loading === -1 && <Error onRetry={retry} />}
        {list.length === 0 && !loading && (
          <Empty text={languageState.texts.Errors.NoMenu} />
        )}
        <Box
          position="relative"
          sx={{
            height: "100%",
            marginTop: marginTopBar(),
            transition: "margin 200ms ease",
          }}
        >
          <Loading
            visible={loading === 1}
            sx={{
              background: "none",
              position: "absolute",
              height: "100px",
              zIndex: loading === 1 ? 10 : -1,
            }}
          />
          {!error && list.length > 0 && loading === 0 && (
            <Box>
              {toSearch.length === 0
                ? list.map((item, i) => (
                    <InViewComponent
                      key={i}
                      delay={`0.${1 * (item.index + 1)}s`}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <LinkCard
                        item={item}
                        link={
                          userLogged() && item.user === getUserName()
                            ? "/menu/edit"
                            : `/menu/${spaceToDashes(item.menu)}`
                        }
                      />
                    </InViewComponent>
                  ))
                : searchResult
                    .filter((item) => item.list.length)
                    .map((item, i) => (
                      <Box key={i}>
                        <Typography
                          sx={{ marginTop: "20px", fontSize: "1.5rem" }}
                          variant="h3"
                        >
                          {languageState.texts.Navbar.Models[item.type]}
                        </Typography>
                        {item.list.map((jtem, i) => (
                          <InViewComponent
                            key={jtem.id}
                            delay={`0.${1 * (jtem.index + 1)}s`}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              width: "100%",
                            }}
                          >
                            <LinkCard
                              item={jtem}
                              link={getLinkCard(jtem, item.type)}
                            />
                          </InViewComponent>
                        ))}
                      </Box>
                    ))}
              {toSearch.length > 0 && searchResultIsEmpty() && !loading && (
                <Empty text={languageState.texts.Errors.NoResults} />
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
