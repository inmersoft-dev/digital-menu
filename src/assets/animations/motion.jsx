// @emotion
import { css } from "@emotion/css";

export const motionUlContainer = {
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

export const motionUlCss = css({
  padding: 0,
  width: "100%",
});

export const motionLiAnimation = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export const motionLiCss = css({
  display: "flex",
  justifyContent: "center",
  width: "100%",
});
