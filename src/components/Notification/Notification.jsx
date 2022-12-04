/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */

import { useState, useEffect } from "react";

// react-cool-onclickoutside
import useOnclickOutside from "react-cool-onclickoutside";

// mui components
import { Snackbar } from "@mui/material/";
import MuiAlert from "@mui/material/Alert";

// contexts
import { useNotification } from "../../context/NotificationProvider";

const Notification = () => {
  const { notificationState } = useNotification();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(notificationState.visible);
  }, [notificationState]);

  const handleClose = () => {
    setOpen(false);
  };

  const ref = useOnclickOutside(() => {
    setOpen(false);
  });

  return (
    <div ref={ref}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert
          variant="filled"
          onClose={handleClose}
          severity={notificationState.type}
          style={{
            opacity: open ? 1 : 0,
            zIndex: open ? 98 : -1,
            minWidth: 250,
          }}
        >
          {notificationState.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Notification;
