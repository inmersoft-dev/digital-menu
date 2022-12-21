/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

// @emotion
import { css } from "@emotion/css";

// sito components
import SitoContainer from "sito-container";

// @mui/icons-material
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// @mui/material
import {
  Button,
  IconButton,
  Typography,
  InputLabel,
  FormControl,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
} from "@mui/material";

// components
import Loading from "../../../components/Loading/Loading";

// contexts
import { useLanguage } from "../../../context/LanguageProvider";
import { useNotification } from "../../../context/NotificationProvider";

// services
import { changePassword } from "../../../services/profile";

// utils
import {
  getUserName,
  passwordsAreValid,
  passwordValidation,
} from "../../../utils/auth";

const Security = () => {
  const { languageState } = useLanguage();
  const { setNotificationState } = useNotification();

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showRPassword, setShowRPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickRShowPassword = () => setShowRPassword(!showRPassword);

  const handleMouseDownPassword = (event) => event.preventDefault();

  const [password, setPassword] = useState("");
  const [rPassword, setRPassword] = useState("");

  const [passwordHelperText, setPasswordHelperText] = useState("");
  const [rpasswordHelperText, setRPasswordHelperText] = useState("");

  useEffect(() => {
    const passwordValidationResult = passwordValidation(
      password,
      getUserName()
    );
    if (passwordValidationResult > -1) {
      switch (passwordValidationResult) {
        case 0:
          setPasswordHelperText(
            languageState.texts.Errors.PasswordLengthValidation
          );
          break;
        case 1:
          setPasswordHelperText(
            languageState.texts.Errors.PasswordCharacterValidation
          );
          break;
        default:
          setPasswordHelperText(
            languageState.texts.Errors.PasswordNameValidation
          );
          break;
      }
    } else setPasswordHelperText("");
  }, [password]);

  const onChangePassword = async (e) => {
    e.preventDefault();
    setPasswordHelperText("");
    setRPasswordHelperText("");
    if (password === rPassword) {
      const passwordValidationResult = passwordsAreValid(
        password,
        rPassword,
        getUserName()
      );
      if (passwordValidationResult > -1)
        switch (passwordValidationResult) {
          case 0:
            setPasswordHelperText(
              languageState.texts.Errors.PasswordLengthValidation
            );
            break;
          case 1:
            setPasswordHelperText(
              languageState.texts.Errors.PasswordCharacterValidation
            );
            break;
          default:
            setPasswordHelperText(
              languageState.texts.Errors.PasswordNameValidation
            );
            break;
        }
      else {
        setLoading(true);
        try {
          await changePassword(getUserName(), password, rPassword);
          showNotification(
            "success",
            languageState.texts.Messages.SaveSuccessful
          );
          setPassword("");
          setRPassword("");
          setLoading(false);
          return true;
        } catch (err) {
          console.error(err);
          showNotification("error", String(err));
        }
      }
    } else {
      setRPasswordHelperText(languageState.texts.Errors.DifferentPassword);
      const rPasswordInput = document.getElementById("rPassword");
      if (rPasswordInput !== null) rPasswordInput.focus();
    }
    setLoading(false);
    return false;
  };

  const [ok, setOk] = useState(1);

  const validate = () => setOk(true);

  const invalidate = (e) => {
    e.preventDefault();
    if (ok) {
      const { id } = e.target;
      e.target.focus();
      setOk(false);
      switch (id) {
        default: {
          return setPasswordHelperText(
            languageState.texts.Errors.PasswordRequired
          );
        }
      }
    }
  };

  return (
    <form onSubmit={onChangePassword} className={css({ width: "100%" })}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          fontSize: "1.5rem",
          marginTop: "10px",
        }}
      >
        {languageState.texts.Settings.PasswordTitle}
      </Typography>
      <Loading
        visible={loading}
        sx={{
          zIndex: loading ? 99 : -1,
        }}
      />
      {/* Password */}
      <SitoContainer>
        <FormControl
          sx={{ width: "100%", marginTop: "20px" }}
          color={passwordHelperText.length > 0 ? "error" : "primary"}
          variant="outlined"
        >
          <InputLabel>
            {languageState.texts.Login.Inputs.Password.Label}
          </InputLabel>
          <OutlinedInput
            required
            id="password"
            onInput={validate}
            onInvalid={invalidate}
            placeholder={languageState.texts.Login.Inputs.Password.Placeholder}
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  color="secondary"
                  tabIndex={-1}
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
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <FormHelperText>{passwordHelperText}</FormHelperText>
        </FormControl>
      </SitoContainer>
      {/* rPassword */}
      <SitoContainer sx={{ marginTop: "10px" }}>
        <FormControl
          sx={{ width: "100%", marginTop: "20px" }}
          color={rpasswordHelperText.length > 0 ? "error" : "primary"}
          variant="outlined"
        >
          <InputLabel htmlFor="outlined-adornment-password">
            {languageState.texts.Login.Inputs.RPassword.Label}
          </InputLabel>
          <OutlinedInput
            id="rPassword"
            onInput={validate}
            onInvalid={invalidate}
            placeholder={languageState.texts.Login.Inputs.RPassword.Placeholder}
            type={showRPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  color="secondary"
                  tabIndex={-1}
                  aria-label="toggle r password visibility"
                  onClick={handleClickRShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showRPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label={languageState.texts.Login.Inputs.RPassword.Label}
            value={rPassword}
            onChange={(e) => setRPassword(e.target.value)}
          />
        </FormControl>
      </SitoContainer>
      <SitoContainer
        justifyContent="flex-end"
        sx={{ width: "100%", marginTop: "20px" }}
      >
        <Button type="submit" variant="contained" sx={{ marginRight: "10px" }}>
          {languageState.texts.Insert.Buttons.Save}
        </Button>
      </SitoContainer>
    </form>
  );
};

export default Security;
