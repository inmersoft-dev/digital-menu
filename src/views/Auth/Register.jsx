/* eslint-disable react-hooks/exhaustive-deps */
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// sito components
import SitoContainer from "sito-container";

// own components
import Loading from "../../components/Loading/Loading";
import BackButton from "../../components/BackButton/BackButton";

// @mui
import {
  useTheme,
  FormControl,
  Button,
  IconButton,
  TextField,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Typography,
  Paper,
} from "@mui/material";

// @mui icons
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// contexts
import { useLanguage } from "../../context/LanguageProvider";
import { useNotification } from "../../context/NotificationProvider";

// utils
import { userLogged } from "../../utils/auth";

// services
import { register } from "../../services/auth";

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setNotificationState } = useNotification();
  const { languageState } = useLanguage();

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(1);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = (event) => event.preventDefault();

  const [showRPassword, setShowRPassword] = useState(false);

  const handleClickShowRPassword = () => setShowRPassword(!showRPassword);

  const handleMouseDownRPassword = (event) => event.preventDefault();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      user: "",
      password: "",
      rpassword: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const { user, password, rpassword } = data;
    if (password === rpassword) {
      try {
        const response = await register(user, password);
        if (response.status === 200) {
          showNotification(
            "success",
            languageState.texts.Messages.RegisterSuccessful
          );
        } else {
          const { error } = response.data;
          let message;
          if (error.indexOf("username taken") > -1)
            message = languageState.texts.Errors.UsernameTaken;
          else if (error.indexOf("Error: Network Error") > -1)
            message = languageState.texts.Errors.NotConnected;
          else message = languageState.texts.Errors.SomeWrong;
          showNotification("error", message);
        }
      } catch (err) {
        console.log(err);
        showNotification("error", languageState.texts.Errors.SomeWrong);
      }
    } else showNotification("error", languageState.texts.Errors.SomeWrong);
    setLoading(false);
  };

  useEffect(() => {
    if (!userLogged()) navigate("/");
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
          return showNotification(
            "error",
            languageState.texts.Errors.NameRequired
          );
        default:
          return showNotification(
            "error",
            languageState.texts.Errors.NoEmptyPassword
          );
      }
    }
  };

  return (
    <Paper
      sx={{
        alignItems: "center",
        background: theme.palette.background.paper,
        display: "flex",
        width: "400px",
        padding: "1rem",
        borderRadius: "1rem",
        position: "relative",
      }}
    >
      <BackButton to="/settings/" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Loading
          visible={loading}
          sx={{
            zIndex: loading ? 99 : -1,
          }}
        />
        <Typography variant="h3">
          {languageState.texts.Register.Title}
        </Typography>
        <Controller
          name="user"
          control={control}
          render={({ field }) => (
            <TextField
              sx={{ width: "100%", marginTop: "20px" }}
              id="user"
              required
              label={languageState.texts.Login.Inputs.User.Label}
              placeholder={languageState.texts.Login.Inputs.User.Placeholder}
              variant="outlined"
              onInput={validate}
              onInvalid={invalidate}
              {...field}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <FormControl
              sx={{ width: "100%", marginTop: "20px" }}
              variant="outlined"
            >
              <InputLabel htmlFor="password">
                {languageState.texts.Login.Inputs.Password.Label}
              </InputLabel>
              <OutlinedInput
                required
                id="password"
                placeholder={
                  languageState.texts.Login.Inputs.Password.Placeholder
                }
                onInput={validate}
                onInvalid={invalidate}
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label={languageState.texts.Login.Inputs.Password.Label}
                {...field}
              />
            </FormControl>
          )}
        />
        <Controller
          name="rpassword"
          control={control}
          render={({ field }) => (
            <FormControl
              sx={{ width: "100%", marginTop: "20px" }}
              variant="outlined"
            >
              <InputLabel htmlFor="rpassword">
                {languageState.texts.Login.Inputs.RPassword.Label}
              </InputLabel>
              <OutlinedInput
                required
                id="rpassword"
                placeholder={
                  languageState.texts.Login.Inputs.RPassword.Placeholder
                }
                onInput={validate}
                onInvalid={invalidate}
                type={showRPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowRPassword}
                      onMouseDown={handleMouseDownRPassword}
                      edge="end"
                    >
                      {showRPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label={languageState.texts.Login.Inputs.RPassword.Label}
                {...field}
              />
            </FormControl>
          )}
        />
        <SitoContainer
          justifyContent="flex-end"
          sx={{ width: "100%", marginTop: "20px" }}
        >
          <Button
            type="submit"
            variant="contained"
            sx={{ marginRight: "20px" }}
          >
            {languageState.texts.Login.Buttons.Register}
          </Button>
        </SitoContainer>
      </form>
    </Paper>
  );
};

export default Register;
