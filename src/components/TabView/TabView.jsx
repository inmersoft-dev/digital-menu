/* eslint-disable react/no-array-index-key */
/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from "react";

// prop types
import PropTypes from "prop-types";

// @mui components
import { useTheme, Tabs, Tab, Typography, Box } from "@mui/material";

// functions
import { scrollTo } from "../../utils/functions";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const TabView = (props) => {
  const theme = useTheme();

  const { content, tabs, value, shouldScroll } = props;

  const [localValue, setLocalValue] = useState(0);

  const handleChange = (event, newValue) => {
    console.log(newValue);
    if (shouldScroll)
      scrollTo(document.getElementById(`title-${newValue}`).offsetTop);
    setLocalValue(newValue);
  };

  useEffect(() => {
    handleChange({}, value);
  }, [value]);

  return (
    <Box
      sx={{
        width: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        background: theme.palette.background.paper,
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          textColor="primary"
          indicatorColor="primary"
          value={localValue}
          onChange={handleChange}
          scrollButtons="auto"
          aria-label="tabs"
        >
          {tabs.map((item, i) => (
            <Tab key={item} label={item} {...a11yProps(i)} />
          ))}
        </Tabs>
      </Box>
      {content.map((item, i) => (
        <TabPanel key={`tc${i}`} value={value} index={i}>
          {item}
        </TabPanel>
      ))}
    </Box>
  );
};

TabView.defaultProps = {
  onChange: undefined,
};

TabView.propTypes = {
  content: PropTypes.arrayOf(PropTypes.node).isRequired,
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func,
};

export default TabView;
