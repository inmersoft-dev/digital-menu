import { Link } from "react-router-dom";

import PropTypes from "prop-types";

// @mui/material
import { Box, Tooltip, IconButton } from "@mui/material";

// @mui/icons-material
import StorefrontIcon from "@mui/icons-material/Storefront"; // store

// utils
import { parserAccents } from "../../utils/parser";
import { spaceToDashes } from "../../utils/functions";

// icons
import { placeTypeIcons } from "../../views/Menu/icons";

const BusinessCategories = (props) => {
  const { business } = props;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      {business.map((item) => (
        <Tooltip key={item.id} title={item.name}>
          <Link
            to={`/?business=${parserAccents(
              spaceToDashes(item.name || "")
            ).toLowerCase()}`}
          >
            <IconButton color="primary">
              {placeTypeIcons[item.icon] ? (
                placeTypeIcons[item.icon]
              ) : (
                <StorefrontIcon fontSize="small" />
              )}
            </IconButton>
          </Link>
        </Tooltip>
      ))}
    </Box>
  );
};

BusinessCategories.propTypes = {
  business: PropTypes.array,
};

export default BusinessCategories;
