import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

// sito components
import SitoContainer from "sito-container";

// @mui components
import { useTheme, Paper, Button, TextField, Typography } from "@mui/material";

// own components
import Loading from "../../components/Loading/Loading";

// functions
import { userLogged } from "../../utils/auth";

// contexts
import { useNotification } from "../../context/NotificationProvider";
import { useLanguage } from "../../context/LanguageProvider";

const Edit = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [ok, setOk] = useState(1);

  const { setNotificationState } = useNotification();
  const { languageState } = useLanguage();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      user: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(true);

  const onSubmit = async (data) => {};

  useEffect(() => {
    if (userLogged()) navigate("/auth/");
    setLoading(false);
  }, []);

  const validate = () => {
    setOk(true);
  };

  const invalidate = (e) => {
    e.preventDefault();
    if (ok) {
      const { id } = e.target;
      e.target.focus();
      setOk(false);
      switch (id) {
        case "user":
          return setNotificationState({
            type: "set",
            ntype: "error",
            message: languageState.texts.Errors.NameRequired,
          });
        default:
          return setNotificationState({
            type: "set",
            ntype: "error",
            message: languageState.texts.Errors.NoEmptyPassword,
          });
      }
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        alignItems: "center",
        background: theme.palette.background.paper,
        maxWidth: "400px",
        minWidth: "320px",
        padding: "1rem",
        borderRadius: "1rem",
        border: "none",
        position: "relative",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <Typography variant="h3">{languageState.texts.Insert.Title}</Typography>
        <Controller
          name="product"
          control={control}
          render={({ field }) => (
            <TextField
              sx={{ width: "100%", marginTop: "20px" }}
              id="product"
              required
              onInput={validate}
              onInvalid={invalidate}
              label={languageState.texts.Insert.Inputs.Product.Label}
              placeholder={
                languageState.texts.Insert.Inputs.Product.Placeholder
              }
              variant="outlined"
              {...field}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              sx={{ width: "100%", marginTop: "20px" }}
              id="description"
              required
              onInput={validate}
              onInvalid={invalidate}
              label={languageState.texts.Insert.Inputs.Description.Label}
              maxRows={3}
              minRows={3}
              placeholder={
                languageState.texts.Insert.Inputs.Description.Placeholder
              }
              variant="outlined"
              {...field}
            />
          )}
        />
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <TextField
              sx={{ width: "100%", marginTop: "20px" }}
              id="price"
              required
              type="number"
              onInput={validate}
              onInvalid={invalidate}
              label={languageState.texts.Insert.Inputs.Price.Label}
              placeholder={languageState.texts.Insert.Inputs.Price.Placeholder}
              variant="outlined"
              {...field}
            />
          )}
        />
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <TextField
              sx={{ width: "100%", marginTop: "20px" }}
              id="type"
              required
              onInput={validate}
              onInvalid={invalidate}
              label={languageState.texts.Insert.Inputs.Type.Label}
              maxRows={3}
              minRows={3}
              placeholder={languageState.texts.Insert.Inputs.Type.Placeholder}
              variant="outlined"
              {...field}
            />
          )}
        />
        <SitoContainer
          justifyContent="flex-end"
          sx={{ width: "100%", marginTop: "20px" }}
        >
          <Button type="submit" variant="contained">
            {languageState.texts.Insert.Buttons.Save}
          </Button>
        </SitoContainer>
      </form>
    </Paper>
  );
};

export default Edit;
