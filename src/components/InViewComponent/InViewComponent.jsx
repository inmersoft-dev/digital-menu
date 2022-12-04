import { useRef } from "react";

import PropTypes from "prop-types";

// framer-motion
import { useInView } from "framer-motion";

// @mui/material
import { Box } from "@mui/material";

const InViewComponent = (props) => {
  const { id, children, delay, className, flexOrder, sx } = props;

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <Box
      id={id}
      ref={ref}
      className={className}
      sx={{
        transform: isInView ? "translateY(0px)" : "translateY(20px)",
        opacity: isInView ? 1 : 0,
        transition: `all 0.1s linear ${delay}`,
        order: {
          xs: flexOrder,
          md: "inherit",
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

InViewComponent.defaultProps = {
  id: "",
  children: <></>,
  delay: "0.3s",
  className: "",
  flexOrder: 0,
  sx: {},
};

InViewComponent.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  delay: PropTypes.string,
  className: PropTypes.string,
  flexOrder: PropTypes.number,
  sx: PropTypes.object,
};

export default InViewComponent;
