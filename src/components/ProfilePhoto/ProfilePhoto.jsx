/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/function-component-definition */
import { useState, useEffect } from "react";
import Avatar from "react-avatar-edit";

import PropTypes from "prop-types";

// @emotion/css
import { css } from "@emotion/css";

// @mui/material
import { useTheme, Box, Modal } from "@mui/material";

// @mui/icons-material
import SendIcon from "@mui/icons-material/Send";

// sito components
import SitoContainer from "sito-container";

// contexts
import { useLanguage } from "context/LanguageProvider";
import { useNotification } from "context/NotificationProvider";

const EmailDialog = (props) => {
  const theme = useTheme();

  const { open, handleClose, onSubmit, urlPhoto } = props;

  const { setNotificationState } = useNotification();

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const { languageState } = useLanguage();
  const [preview, setPreview] = useState(null);
  const [src, setSrc] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    setSrc(urlPhoto);
  }, [open]);

  const onClose = () => setPreview(null);

  const onCrop = (remotePreview) => setPreview(remotePreview);

  const onBeforeFileLoad = (elem) => setFile(elem.target.files[0]);

  const onLocalSubmit = (e) => {
    e.preventDefault();
    onSubmit(preview, file);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        component="form"
        onSubmit={onLocalSubmit}
        sx={{
          p: 4,
          top: "50%",
          left: "50%",
          width: 500,
          boxShadow: 24,
          position: "absolute",
          bgcolor: "background.paper",
          transform: "translate(-50%, -50%)",
        }}
      >
        <h5>{languageState.texts.ProfileDialog.Title}</h5>
        <div className={css({ div: { overflow: "auto" } })}>
          <Avatar
            width="100%"
            height={295}
            onCrop={onCrop}
            onClose={onClose}
            onBeforeFileLoad={onBeforeFileLoad}
            src={src}
          />
        </div>
        <SitoContainer
          justifyContent="flex-end"
          sx={{ marginTop: "20px", fullWidth: "100%" }}
        >
          <button
            type="button"
            onClick={handleClose}
            className={`butn ${css({
              background: "none",
              marginRight: "20px",
              color: "#000",
              border: `2px solid ${theme.palette.primary.main}`,
            })}`}
          >
            {languageState.texts.EmailDialog.Cancel}
          </button>
          <button type="submit" className="butn">
            {languageState.texts.ProfileDialog.Button}
            <SendIcon sx={{ marginLeft: "20px" }} />
          </button>
        </SitoContainer>
      </Box>
    </Modal>
  );
};

EmailDialog.defaultProps = {
  urlPhoto: "",
};

EmailDialog.propTypes = {
  urlPhoto: PropTypes.string,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default EmailDialog;
