import { useState, useEffect } from "react";

// @mui components
import { useTheme, Paper, Box, Typography } from "@mui/material";

// sito components
import SitoContainer from "sito-container";
import SitoImage from "sito-image";

// own components
import Loading from "../../components/Loading/Loading";
import Empty from "../../components/Empty/Empty";
import NotConnected from "../../components/NotConnected/NotConnected";

// services
import { fetchAll } from "../../services/menu.js";

// contexts
import { useLanguage } from "../../context/LanguageProvider";
import { useNotification } from "../../context/NotificationProvider";

const Home = () => {
  const theme = useTheme();
  const { languageState } = useLanguage();
  const { setNotificationState } = useNotification();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [allData, setAllData] = useState([]);
  const [list, setList] = useState([]);

  const fetch = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetchAll();
      const data = await response.data;
      if (data && data.u) {
        const newList = [];
        Object.values(data.u).forEach((item, i) => {
          newList.push(
            <SitoContainer
              key={item.u}
              justifyContent="center"
              sx={{ width: "100%" }}
            >
              <Paper
                id={`obj-${i}`}
                elevation={1}
                sx={{
                  cursor: "pointer",
                  marginTop: "20px",
                  display: "flex",
                  width: { md: "800px", sm: "630px", xs: "100%" },
                  padding: "1rem",
                  borderRadius: "1rem",
                  background: theme.palette.background.paper,
                }}
              >
                <SitoContainer sx={{ marginRight: "20px" }}>
                  <Box
                    sx={{
                      width: { md: "160px", sm: "120px", xs: "80px" },
                      height: { md: "160px", sm: "120px", xs: "80px" },
                    }}
                  >
                    <SitoImage
                      src={item.ph}
                      alt={item.m}
                      sx={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "100%",
                      }}
                    />
                  </Box>
                </SitoContainer>
                <Box
                  sx={{
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    width: { md: "585px", sm: "350px", xs: "95%" },
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {item.m}
                  </Typography>
                  <Box
                    sx={{
                      height: { xs: "28px", sm: "50px", md: "100px" },
                      lineHeight: "20px",
                      wordBreak: "break-all",
                      display: "-webkit-box",
                      boxOrient: "vertical",
                      lineClamp: 5,
                      overflow: "hidden",
                    }}
                  >
                    <Typography variant="body1" sx={{ textAlign: "justify" }}>
                      {item.d}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </SitoContainer>
          );
        });
        setList(newList);
        setAllData(data);
      } else
        setNotificationState({
          type: "set",
          ntype: "error",
          message: languageState.texts.Errors.NotConnected,
        });
    } catch (err) {
      console.log(err);
      setNotificationState({
        type: "set",
        ntype: "error",
        message: languageState.texts.Errors.NotConnected,
      });
      setError(true);
    }
    setLoading(false);
  };

  const retry = () => {
    fetch();
  };

  useEffect(() => {
    retry();
  }, []);

  return (
    <SitoContainer
      sx={{ width: "100vw", height: "100vh" }}
      flexDirection="column"
    >
      <Loading
        visible={loading}
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          backdropFilter: "blur(4px)",
          background: `${theme.palette.background.paper}ec`,
          borderRadius: "1rem",
          zIndex: loading ? 99 : -1,
        }}
      />
      {error && !loading && <NotConnected onRetry={retry} />}
      {!loading && !error && !allData.length && <Empty />}
      {!error && !loading && allData.length && (
        <Box
          sx={{
            margin: "20px 20px",
            flexDirection: "column",
          }}
        >
          {list.map((item, i) => (
            <Box
              key={i}
              sx={{
                flexDirection: "column",
                marginTop: i === 0 ? "40px" : "20px",
                alignItems: "center",
                display: "flex",
              }}
            >
              {item}
            </Box>
          ))}
        </Box>
      )}
    </SitoContainer>
  );
};

export default Home;
