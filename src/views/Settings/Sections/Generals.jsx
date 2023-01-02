/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect, useCallback, useReducer } from "react";

// some-javascript-utils
import { getUserLanguage } from "some-javascript-utils/browser";

// @emotion
import { css } from "@emotion/css";

// imagekitio-react
import { IKContext, IKUpload } from "imagekitio-react";

// sito components
import SitoImage from "sito-image";
import SitoContainer from "sito-container";
import { useNotification } from "sito-mui-notification";

// @mui/material
import {
  useTheme,
  Box,
  Button,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  Autocomplete,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
  createFilterOptions,
} from "@mui/material";

// @mui/icons-material
import WhatsApp from "@mui/icons-material/WhatsApp";

// own components
import Error from "../../../components/Error/Error";
import Loading from "../../../components/Loading/Loading";

// contexts
import { useLanguage } from "../../../context/LanguageProvider";
import { useSettings } from "../../../context/SettingsProvider";

// utils
import {
  getUserName,
  findFirstLowerLetter,
  findFirstUpperLetter,
  userLogged,
} from "../../../utils/auth";

// services
import { search } from "../../../services/search";
import { fetchMenu } from "../../../services/menu.js";
import { removeImage } from "../../../services/photo";
import { saveProfile } from "../../../services/profile";

// images
import noProduct from "../../../assets/images/no-product.webp";

import config from "../../../config";
import { placeTypeList } from "../../../services/placeTypes/get";

const { imagekitUrl, imagekitPublicKey, imagekitAuthUrl } = config;

const filter = createFilterOptions();

const Generals = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (ref) ref.focus();
  }, [ref]);

  const placeTypesReducer = (placeTypesState, action) => {
    const { type } = action;
    switch (type) {
      case "set": {
        const { array } = action;
        return [...array];
      }
      case "add": {
        const { array } = action;
        array.forEach((item) => {
          if (!placeTypesState.find((jtem) => item.id === jtem.id))
            placeTypesState.push(item);
        });
        return [...placeTypesState];
      }
      default:
        return [];
    }
  };

  const [placeTypes, setPlaceTypes] = useReducer(placeTypesReducer, []);
  const [loadingPlaceTypes, setLoadingPlaceTypes] = useState(false);
  const [currentType, setCurrentType] = useState("");

  const inputChange = (event, newInputValue) => setCurrentType(newInputValue);

  const fetchPlaceTypes = useCallback(async () => {
    setLoadingPlaceTypes(true);
    try {
      const response = await search(
        currentType,
        ["placeTypes"],
        getUserLanguage(config.language)
      );
      const { list } = await response;
      const parsedPlaceTypes = list.map((item) => ({
        id: item.data.id,
        name: item.data[getUserLanguage(config.language)],
      }));

      setPlaceTypes({ type: "add", array: parsedPlaceTypes });
    } catch (err) {
      console.error(err);
      showNotification("error", String(err));
    }
    setLoadingPlaceTypes(false);
  }, [currentType]);

  useEffect(() => {
    if (currentType.length) fetchPlaceTypes();
  }, [currentType]);

  const { languageState } = useLanguage();
  const { setNotificationState } = useNotification();
  const { settingsState, setSettingsState } = useSettings();

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const [loading, setLoading] = useState(true);
  const [loadingPhoto, setLoadingPhoto] = useState(false);

  const [error, setError] = useState(false);
  const [photo, setPhoto] = useState("");
  const [preview, setPreview] = useState("");

  const [types, setTypes] = useState([]);

  const handleTypes = (event, newValue) => {
    if (typeof newValue === "string") {
      setTypes([
        ...types,
        {
          name: newValue,
        },
      ]);
    } else if (newValue && newValue.inputValue) {
      // Create a new value from the user input
      setTypes([
        ...types,
        {
          name: newValue.inputValue,
        },
      ]);
    } else {
      setTypes(newValue);
    }
  };

  const { control, handleSubmit, reset, getValues, watch } = useForm({
    defaultValues: {
      menu: "",
      phone: "",
    },
  });

  const [oldName, setOldName] = useState("");
  const [menuNameHelperText, setMenuNameHelperText] = useState(false);

  const fetch = async () => {
    if (userLogged()) {
      setLoading(true);
      setError(false);
      try {
        const response = await fetchMenu(getUserName(), [
          "photo",
          "business",
          "menu",
          "phone",
        ]);
        const data = await response.data;
        if (data) {
          if (data.photo) {
            setPhoto(data.photo);
            setPreview(data.photo.url);
          }
          if (data.business) setTypes(data.business);
          setOldName(data.menu);

          reset({
            menu: data.menu,
            phone: data.phone,
          });
          setSettingsState({
            type: "set-generals",
            menu: data.menu,
            phone: data.phone,
            preview: data.photo ? data.photo.url : "",
            photo: data.photo,
            business: data.business,
          });
        }
      } catch (err) {
        console.error(err);
        showNotification("error", String(err));
        setError(true);
      }
      setLoading(false);
    }
  };

  const uploadPhoto = useCallback((e) => {
    const file = document.getElementById("menu-photo");
    if (file !== null) file.click();
  }, []);

  const phoneValue = watch(["phone"]);

  const [phoneHelperText, setPhoneHelperText] = useState("");

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
        case "phone":
          return setPhoneHelperText(languageState.texts.Errors.PhoneRequired);
        default:
          return setMenuNameHelperText(languageState.texts.Errors.NameRequired);
      }
    }
  };

  const onSubmit = useCallback(
    async (data) => {
      const { menu, phone } = data;
      if (phoneHelperText.length > 0 && (!phone || phone.length)) {
        const phoneInput = document.getElementById("phone");
        if (phoneInput !== null) phoneInput.focus();
      } else {
        setMenuNameHelperText("");
        setPhoneHelperText("");
        setLoading(true);
        try {
          const response = await saveProfile(
            getUserName(),
            oldName,
            menu,
            phone || "",
            photo || "",
            types.map((item) => item.id) || []
          );
          if (response.status === 200) {
            showNotification(
              "success",
              languageState.texts.Messages.SaveSuccessful
            );
            const parsedTypes = [];
            const fetchTypes = await placeTypeList(0, 1, -1);
            setSettingsState({
              type: "set-generals",
              menu: menu,
              phone: phone || "",
              preview: photo ? photo.url : "",
              photo: photo || "",
              business: parsedTypes || [],
            });
            setLoading(false);
            return true;
          } else {
            const { error } = response.data;
            if (error.indexOf("menu") > -1) {
              setMenuNameHelperText(languageState.texts.Errors.MenuNameTaken);
              const menuInput = document.getElementById("menu");
              if (menuInput !== null) menuInput.focus();
            } else
              showNotification("error", languageState.texts.Errors.SomeWrong);
          }
        } catch (err) {
          console.error(err);
          showNotification("error", String(err));
        }
      }
      setLoading(false);
      return false;
    },
    [phoneHelperText, photo, types]
  );

  useEffect(() => {
    const image = document.getElementById("no-image");
    if (image !== null) {
      image.onclick = uploadPhoto;
    }
    return () => {
      if (image !== null) {
        image.onclick = undefined;
      }
    };
  }, [uploadPhoto, loading, loadingPhoto]);

  const init = () => {
    setPhoto(settingsState.photo);
    setPreview(settingsState.preview);
    setTypes(settingsState.business);
    setOldName(settingsState.menu);
    reset({
      menu: settingsState.menu,
      phone: settingsState.phone,
    });
    setLoading(false);
  };

  useEffect(() => {
    if (
      !settingsState.photo ||
      !settingsState.preview ||
      !settingsState.business ||
      !settingsState.menu
    )
      retry();
    else init();
  }, []);

  const onLoading = () => setLoadingPhoto(true);

  const onSuccess = async (res) => {
    try {
      const { url, fileId } = res;
      if (photo) await removeImage(photo.fileId);
      setPhoto({ fileId, url });
      setPreview(url);
    } catch (err) {
      console.error(err);
    }
    setLoadingPhoto(false);
  };

  const onError = (e) => {
    showNotification("error", languageState.texts.Errors.SomeWrong);
    setLoadingPhoto(false);
  };

  const goToEdit = async () => {
    if (getValues("menu") && getValues("menu").length) {
      const value = await onSubmit({
        menu: getValues("menu"),
        phone: getValues("phone"),
      });
      if (value) navigate("/menu/edit/");
    } else {
      setMenuNameHelperText(languageState.texts.Errors.NameRequired);
      const menuInput = document.getElementById("menu");
      if (menuInput !== null) document.getElementById("menu").focus();
    }
  };

  useEffect(() => {
    const [value] = phoneValue;

    if (
      value &&
      (findFirstLowerLetter(value) > -1 || findFirstUpperLetter(value) > -1)
    )
      setPhoneHelperText(languageState.texts.Errors.InvalidPhone);
    else setPhoneHelperText("");
  }, [phoneValue]);

  const [opened, setOpened] = useState(false);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={css({ width: "100%", position: "relative" })}
    >
      <Loading
        visible={loading}
        sx={{
          position: "absolute",
          zIndex: loading ? 99 : -1,
        }}
      />
      {!error ? (
        <>
          {/* Image */}
          <SitoContainer
            sx={{ width: "100%", marginTop: "10px", flexWrap: "wrap" }}
            justifyContent="center"
            alignItems="center"
          >
            <Box
              sx={{
                width: { md: "160px", sm: "120px", xs: "80px" },
                height: { md: "160px", sm: "120px", xs: "80px" },
                borderRadius: "100%",
              }}
            >
              {!loading && (
                <IKContext
                  publicKey={imagekitPublicKey}
                  urlEndpoint={imagekitUrl}
                  authenticationEndpoint={imagekitAuthUrl}
                  transformationPosition="path"
                >
                  <IKUpload
                    id="menu-photo"
                    fileName={`${getUserName()}`}
                    onChange={onLoading}
                    onError={onError}
                    onSuccess={onSuccess}
                  />
                  {loadingPhoto ? (
                    <Loading
                      visible={loadingPhoto}
                      sx={{
                        position: "relative",
                        backdropFilter: "none",
                        borderRadius: "1rem",
                        boxShadow: "1px 1px 15px -4px",
                        background: theme.palette.background.default,
                      }}
                    />
                  ) : (
                    <SitoImage
                      id="no-image"
                      src={preview && preview !== "" ? preview : noProduct}
                      alt="user"
                      sx={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "1rem",
                        cursor: "pointer",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </IKContext>
              )}
            </Box>
            <Typography sx={{ marginLeft: "20px", maxWidth: "200px" }}>
              {languageState.texts.Settings.ImageSuggestion}
            </Typography>
          </SitoContainer>
          {/* Menu name */}
          <SitoContainer sx={{ marginTop: "10px" }}>
            <Controller
              name="menu"
              control={control}
              render={({ field }) => (
                <TextField
                  required
                  color={menuNameHelperText.length > 0 ? "error" : "primary"}
                  sx={{ width: "100%", marginTop: "20px" }}
                  id="menu"
                  type="text"
                  onInput={validate}
                  onInvalid={invalidate}
                  label={languageState.texts.Settings.Inputs.Menu.Label}
                  placeholder={
                    languageState.texts.Settings.Inputs.Menu.Placeholder
                  }
                  variant="outlined"
                  {...field}
                />
              )}
            />
          </SitoContainer>
          {/* Phone */}
          <SitoContainer sx={{ marginTop: "30px" }}>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <FormControl
                  color={phoneHelperText.length > 0 ? "error" : "primary"}
                  sx={{ width: "100%" }}
                  variant="outlined"
                >
                  <InputLabel>
                    {languageState.texts.Settings.Inputs.Contact.Phone.Label}
                  </InputLabel>
                  <OutlinedInput
                    required
                    id="phone"
                    type="tel"
                    onInput={validate}
                    onInvalid={invalidate}
                    startAdornment={
                      <InputAdornment position="start">
                        <WhatsApp color="secondary" />
                      </InputAdornment>
                    }
                    label={
                      languageState.texts.Settings.Inputs.Contact.Phone.Label
                    }
                    placeholder={
                      languageState.texts.Settings.Inputs.Contact.Phone
                        .Placeholder
                    }
                    {...field}
                  />
                  <FormHelperText>{phoneHelperText}</FormHelperText>
                </FormControl>
              )}
            />
          </SitoContainer>
          {/* Business */}
          <SitoContainer sx={{ width: "100%", marginTop: "30px" }}>
            <Autocomplete
              multiple
              clearOnBlur
              openOnFocus
              autoComplete
              id="business"
              open={opened}
              selectOnFocus
              handleHomeEndKeys
              includeInputInList
              filterSelectedOptions
              sx={{
                width: "100%",
                div: { svg: { color: theme.palette.secondary.main } },
              }}
              noOptionsText={
                languageState.texts.Settings.Inputs.CenterTypes.NoOptions
              }
              loadingText={
                languageState.texts.Settings.Inputs.CenterTypes.Loading
              }
              onOpen={() => setOpened(true)}
              onClose={() => setOpened(false)}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some(
                  (option) => inputValue === option.name
                );
                if (!loadingPlaceTypes && inputValue !== "" && !isExisting) {
                  filtered.push({
                    inputValue,
                    name: `${languageState.texts.Insert.Inputs.Type.Add} "${inputValue}"`,
                  });
                }

                return filtered;
              }}
              isOptionEqualToValue={(option, value) =>
                option.name === value.name
              }
              loading={loadingPlaceTypes}
              onChange={handleTypes}
              options={placeTypes}
              getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                if (typeof option === "string") {
                  return option;
                }
                // Add "xxx" option created dynamically
                if (option.inputValue) {
                  return option.inputValue;
                }
                // Regular option
                return option.name;
              }}
              defaultValue={[]}
              value={types || []}
              ChipProps={{ color: "primary" }}
              inputValue={currentType}
              onInputChange={inputChange}
              renderOption={(props, option) => (
                <li {...props}>{option.name}</li>
              )}
              renderInput={(params) => (
                <TextField
                  color="primary"
                  {...params}
                  label={languageState.texts.Settings.Inputs.CenterTypes.Label}
                  placeholder={
                    types.length === 0
                      ? languageState.texts.Settings.Inputs.CenterTypes
                          .Placeholder
                      : ""
                  }
                  inputRef={(input) => {
                    setRef(input);
                  }}
                />
              )}
            />
          </SitoContainer>

          {/* Buttons */}
          <SitoContainer
            justifyContent="flex-end"
            sx={{ width: "100%", marginTop: "20px" }}
          >
            <Button
              type="submit"
              variant="contained"
              sx={{ marginRight: "10px" }}
            >
              {languageState.texts.Buttons.Save}
            </Button>
            <Button type="button" variant="outlined" onClick={goToEdit}>
              {languageState.texts.Buttons.Edit}
            </Button>
          </SitoContainer>
        </>
      ) : (
        <Error onRetry={retry} />
      )}
    </form>
  );
};

export default Generals;
