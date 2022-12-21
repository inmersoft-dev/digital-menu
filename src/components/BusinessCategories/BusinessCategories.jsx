import { Link } from "react-router-dom";

import PropTypes from "prop-types";

// @mui/material
import { Box, Tooltip, IconButton } from "@mui/material";

// utils
import { parserAccents } from "../../utils/parser";
import { spaceToDashes } from "../../utils/functions";

// icons
import { placeTypeIcons } from "../../views/Menu/icons";

// contexts
import { useLanguage } from "../../context/LanguageProvider";

const BusinessCategories = (props) => {
  const { business } = props;

  const { languageState } = useLanguage();

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
              spaceToDashes(item.name)
            ).toLowerCase()}`}
          >
            <IconButton color="primary">
              {
                placeTypeIcons[
                  languageState.texts.Settings.Inputs.CenterTypes.Types.find(
                    (jtem) => jtem.id === item.id
                  ).icon
                ]
              }
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
