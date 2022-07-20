import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// @emotion
import { css } from "@emotion/css";

// sito components
import SitoContainer from "sito-container";

// own components
import Loading from "../../components/Loading/Loading";

// @mui components
import {
  useTheme,
  FormControlLabel,
  FormControl,
  Button,
  IconButton,
  Checkbox,
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
import { userLogged, logUser, createCookie } from "../../utils/auth";

// services
import { login } from "../../services/auth";

import config from "../../config";

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setNotificationState } = useNotification();
  const { languageState } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(1);

  const [remember, setRemember] = useState(false);

  const toggleRemember = () => setRemember(!remember);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = (event) => event.preventDefault();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      user: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const { user, password } = data;
    try {
      const response = await login(user, password);
      if (response.status === 200) {
        logUser(remember, user);
        createCookie(
          config.basicKey,
          response.data.expiration,
          response.data.token
        );
        setNotificationState({
          type: "set",
          message: languageState.texts.Messages.LoginSuccessful,
          ntype: "success",
        });
        setTimeout(() => {
          if (userLogged()) navigate("/menu/edit");
        }, 100);
      } else {
        const { error } = response.data;
        let message;
        if (
          error.indexOf("not found") > -1 ||
          error.indexOf("wrong password") > -1
        )
          message = languageState.texts.Errors.Wrong;
        else if (error.indexOf("Error: Network Error") > -1)
          message = languageState.texts.Errors.NotConnected;
        else message = languageState.texts.Errors.SomeWrong;
        setNotificationState({
          type: "set",
          ntype: "error",
          message,
        });
      }
    } catch (err) {
      console.log(err);
      setNotificationState({
        type: "set",
        ntype: "error",
        message: languageState.texts.Errors.SomeWrong,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userLogged()) navigate("/menu/edit");
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
        <Typography variant="h3">{languageState.texts.Login.Title}</Typography>
        <Controller
          name="user"
          control={control}
          render={({ field }) => (
            <TextField
              sx={{ width: "100%", marginTop: "20px" }}
              id="user"
              required
              onInput={validate}
              onInvalid={invalidate}
              label={languageState.texts.Login.Inputs.User.Label}
              placeholder={languageState.texts.Login.Inputs.User.Placeholder}
              variant="outlined"
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
              <InputLabel htmlFor="outlined-adornment-password">
                {languageState.texts.Login.Inputs.Password.Label}
              </InputLabel>
              <OutlinedInput
                required
                id="password"
                onInput={validate}
                onInvalid={invalidate}
                placeholder={
                  languageState.texts.Login.Inputs.Password.Placeholder
                }
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
                label="Password"
                {...field}
              />
            </FormControl>
          )}
        />
        <FormControlLabel
          sx={{ marginTop: "20px" }}
          control={<Checkbox checked={remember} onChange={toggleRemember} />}
          label={languageState.texts.Login.Remember}
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
            {languageState.texts.Login.Buttons.Login}
          </Button>
          <Link to="/auth/register" className={css({ textDecoration: "none" })}>
            <Button variant="outlined">
              {languageState.texts.Login.Buttons.Register}
            </Button>
          </Link>
        </SitoContainer>
      </form>
    </Paper>
  );
};

export default Login;
