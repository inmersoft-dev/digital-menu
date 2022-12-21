/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useState, useCallback, useEffect, useReducer } from "react";

// sito components
import SitoContainer from "sito-container";

// @emotion
import { css } from "@emotion/css";

// @mui/icons-material
import AddIcon from "@mui/icons-material/Add";
import PublicIcon from "@mui/icons-material/Public";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PinterestIcon from "@mui/icons-material/Pinterest";
import YouTubeIcon from "@mui/icons-material/YouTube";

// @mui/material
import {
  Box,
  Chip,
  Button,
  Select,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";

// own components
import Loading from "../../../components/Loading/Loading";

// contexts
import { useLanguage } from "../../../context/LanguageProvider";
import { useSettings } from "../../../context/SettingsProvider";
import { useNotification } from "../../../context/NotificationProvider";

// services
import { fetchMenu } from "../../../services/menu.js";
import { saveSocial } from "../../../services/profile";

// utils
import { getUserName } from "../../../utils/auth";

const Socials = () => {
  const navigate = useNavigate();
  const { languageState } = useLanguage();
  const { setNotificationState } = useNotification();
  const { settingsState, setSettingsState } = useSettings();

  const [loading, setLoading] = useState(true);

  const { control, handleSubmit, reset, getValues } = useForm({
    defaultValues: {
      description: "",
    },
  });

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const [descriptionHelperText, setDescriptionHelperText] = useState("");

  const [inputCurrentSocialMedia, setInputCurrentSocialMedia] = useState("");
  const handleInputCurrentSocialMedia = (e) =>
    setInputCurrentSocialMedia(e.target.value);

  const [currentSocialMedia, setCurrentSocialMedia] = useState("any");
  const handleSelectSocialMedia = (e) => setCurrentSocialMedia(e.target.value);

  const icons = {
    any: <PublicIcon sx={{ marginRight: "5px" }} />,
    facebook: <FacebookIcon sx={{ marginRight: "5px" }} />,
    instagram: <InstagramIcon sx={{ marginRight: "5px" }} />,
    twitter: <TwitterIcon sx={{ marginRight: "5px" }} />,
    linkedIn: <LinkedInIcon sx={{ marginRight: "5px" }} />,
    pinterest: <PinterestIcon sx={{ marginRight: "5px" }} />,
    youtube: <YouTubeIcon sx={{ marginRight: "5px" }} />,
  };

  const socialMediaReducer = (socialMediaState, action) => {
    const { type } = action;
    switch (type) {
      case "set": {
        const { newArray } = action;
        return newArray;
      }
      case "add": {
        const { newSocialMedia } = action;
        return [...socialMediaState, newSocialMedia];
      }
      case "remove": {
        const { index } = action;
        const newArray = [...socialMediaState];
        newArray.splice(index, 1);
        return newArray;
      }
      default:
        return [];
    }
  };

  const [socialMedia, setSocialMedia] = useReducer(socialMediaReducer, []);

  const addSocialMedia = useCallback(() => {
    if (inputCurrentSocialMedia.length) {
      const newSocialMedia = {
        url: inputCurrentSocialMedia,
        icon: currentSocialMedia,
      };
      setInputCurrentSocialMedia("");
      setCurrentSocialMedia("any");
      setSocialMedia({ type: "add", newSocialMedia });
    }
  }, [currentSocialMedia, inputCurrentSocialMedia]);

  const onSaveSocial = useCallback(
    async (data) => {
      const { description } = data;
      if (!description || !description.length) {
        const descriptionInput = document.getElementById("description");
        if (descriptionInput !== null) descriptionInput.focus();
        setDescriptionHelperText(
          languageState.texts.Errors.DescriptionRequired
        );
      } else {
        setDescriptionHelperText("");
        setLoading(true);
        try {
          const response = await saveSocial(
            getUserName(),
            socialMedia || [],
            description || ""
          );
          if (response.status === 200) {
            showNotification(
              "success",
              languageState.texts.Messages.SaveSuccessful
            );
            setSettingsState({
              type: "set-socials",
              description: description || "",
              socialMedia: socialMedia || [],
            });
            setLoading(false);
            return true;
          } else
            showNotification("error", languageState.texts.Errors.SomeWrong);
        } catch (err) {
          console.error(err);
          showNotification("error", String(err));
        }
      }
      setLoading(false);
      return false;
    },
    [socialMedia]
  );

  const [menu, setMenu] = useState("");

  const fetch = async () => {
    setLoading(true);
    try {
      const response = await fetchMenu(getUserName());
      const data = await response.data;
      if (data) {
        setMenu(data.menu);
        if (data.socialMedia)
          setSocialMedia({ type: "set", newArray: data.socialMedia });
        reset({
          description: data.description,
        });
        setSettingsState({
          type: "set-socials",
          description: data.description,
          socialMedia: data.socialMedia,
        });
      }
    } catch (err) {
      console.error(err);
      showNotification("error", String(err));
    }
    setLoading(false);
  };

  const preventDefault = (event) => event.preventDefault();

  const retry = () => fetch();

  const [ok, setOk] = useState(1);

  const validate = () => setOk(true);

  const invalidate = (e) => {
    e.preventDefault();
    if (ok) {
      const { id } = e.target;
      e.target.focus();
      setOk(false);
      switch (id) {
        default:
          return setDescriptionHelperText(
            languageState.texts.Errors.DescriptionRequired
          );
      }
    }
  };

  const init = () => {
    setSocialMedia({ type: "set", newArray: settingsState.socialMedia });
    reset({
      description: settingsState.description,
    });
    setLoading(false);
  };

  useEffect(() => {
    const textarea = document.getElementById("description");
    if (textarea !== null) textarea.setAttribute("maxlength", 255);
    if (!settingsState.description || !settingsState.socialMedia) retry();
    else init();
  }, []);

  const goToEdit = async () => {
    if (menu.length) {
      const value = await onSaveSocial({
        description: getValues("description"),
      });
      if (value) navigate("/menu/edit/");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSaveSocial)}
      className={css({ width: "100%", position: "relative" })}
    >
      <Loading
        visible={loading}
        sx={{
          position: "absolute",
          zIndex: loading ? 99 : -1,
        }}
      />
      {/* Social Media */}
      <Box
        sx={{
          width: "100%",
          marginTop: "20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <FormControl sx={{ width: { xs: "70px", md: "180px" } }}>
          <Select
            value={currentSocialMedia}
            sx={{ div: { display: "flex" } }}
            onChange={handleSelectSocialMedia}
          >
            {Object.keys(icons).map((item) => (
              <MenuItem
                key={item}
                value={item}
                sx={{ display: "flex", alignItems: "center" }}
              >
                {icons[item]}
                <Typography
                  sx={{
                    display: { xs: "none", md: "inherit" },
                  }}
                >
                  -{" "}
                  {
                    languageState.texts.Settings.Inputs.Contact.SocialMedia
                      .Icons[item]
                  }
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          sx={{
            flex: 1,
          }}
          variant="outlined"
        >
          <InputLabel>
            {languageState.texts.Settings.Inputs.Contact.SocialMedia.Label}
          </InputLabel>
          <OutlinedInput
            id="search"
            value={inputCurrentSocialMedia}
            placeholder={
              languageState.texts.Settings.Inputs.Contact.SocialMedia
                .Placeholder
            }
            label={
              languageState.texts.Settings.Inputs.Contact.SocialMedia.Label
            }
            onChange={handleInputCurrentSocialMedia}
            type="url"
            endAdornment={
              <InputAdornment position="end">
                <Button
                  variant="contained"
                  color="primary"
                  aria-label="add social media"
                  onClick={addSocialMedia}
                  onMouseDown={preventDefault}
                  edge="end"
                  sx={{
                    borderRadius: "100%",
                    minWidth: 0,
                    minHeight: 0,
                    width: "30px",
                  }}
                >
                  <AddIcon fontSize="small" />
                </Button>
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          marginTop: socialMedia.length > 0 ? "10px" : 0,
          gap: "5px",
        }}
      >
        {socialMedia.map((item, i) => (
          <Chip
            sx={{ svg: { borderRadius: "100%" } }}
            key={item.url}
            avatar={icons[item.icon]}
            label={item.url}
            color="primary"
            onDelete={() => setSocialMedia({ type: "remove", index: i })}
          />
        ))}
      </Box>
      {/* Description */}
      <SitoContainer sx={{ marginTop: "30px" }}>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              sx={{ width: "100%" }}
              id="description"
              label={languageState.texts.Settings.Inputs.Description.Label}
              placeholder={
                languageState.texts.Settings.Inputs.Description.Placeholder
              }
              helperText={descriptionHelperText}
              color={descriptionHelperText ? "error" : "primary"}
              onInput={validate}
              onInvalid={invalidate}
              multiline
              maxLength="255"
              maxRows={3}
              minRows={3}
              variant="outlined"
              {...field}
            />
          )}
        />
      </SitoContainer>
      {/* Buttons */}
      <SitoContainer
        justifyContent="flex-end"
        sx={{ width: "100%", marginTop: "20px" }}
      >
        <Button type="submit" variant="contained" sx={{ marginRight: "10px" }}>
          {languageState.texts.Insert.Buttons.Save}
        </Button>
        <Button type="button" variant="outlined" onClick={goToEdit}>
          {languageState.texts.Insert.Buttons.Edit}
        </Button>
      </SitoContainer>
    </form>
  );
};

export default Socials;
