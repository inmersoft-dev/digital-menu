import { useState } from "react";
import PropTypes from "prop-types";

// @emotion/css
import { css } from "@emotion/css";

// framer-motion
import { motion } from "framer-motion";

// @mui/material
import { Box, Button } from "@mui/material";

// @mui/icons-material
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

// components
import ToTop from "../ToTop/ToTop";
import ToLogin from "../ToLogin/ToLogin";
import ToLogout from "../ToLogout/ToLogout";
import InViewComponent from "../InViewComponent/InViewComponent";
import RegisterNewUser from "../../components/RegisterNewUser/RegisterNewUser";

// utils
import { isAdmin, userLogged } from "../../utils/auth";

const FabButtons = (props) => {
  const { location } = props;
  const [active, setActive] = useState(false);

  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const ulItem = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <Box
      sx={{
        gap: "10px",
        right: "10px",
        zIndex: 20,
        bottom: "10px",
        display: "flex",
        position: "fixed",
        flexDirection: "column",
      }}
    >
      {active ? (
        <motion.div
          onClick={() => setActive(false)}
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          })}
        >
          <InViewComponent delay={isAdmin() ? "0.7s" : "0.5s"}>
            <motion.div className={active ? "appear" : "hidden"}>
              <ToTop show={active} />
            </motion.div>
          </InViewComponent>
          {userLogged() ? (
            <InViewComponent delay={!isAdmin() ? "0.3s" : "0.5s"}>
              <motion.div className={active ? "appear" : "hidden"}>
                <ToLogout />
              </motion.div>
            </InViewComponent>
          ) : null}
          {isAdmin() ? (
            <InViewComponent delay="0.3s">
              <motion.div className={active ? "appear" : "hidden"}>
                <RegisterNewUser />
              </motion.div>
            </InViewComponent>
          ) : null}
          {location !== "settings" ? (
            <InViewComponent delay="0.1s">
              <motion.div className={active ? "appear" : "hidden"}>
                <ToLogin />
              </motion.div>
            </InViewComponent>
          ) : null}
        </motion.div>
      ) : null}
      <motion.div variants={ulItem} viewport={{ once: true }}>
        <Button
          variant="contained"
          onClick={() => setActive(!active)}
          sx={{
            borderRadius: "100%",
            padding: "5px",
            minWidth: 0,
          }}
        >
          <MoreHorizIcon />
        </Button>
      </motion.div>
    </Box>
  );
};

FabButtons.defaultProps = {
  location: "/",
};

FabButtons.propTypes = {
  location: PropTypes.string,
};

export default FabButtons;
