/* eslint-disable react/no-array-index-key */
/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-props-no-spreading */
import { useState } from "react";

// prop types
import PropTypes from "prop-types";

// @mui components
import { Tabs, Tab, Box } from "@mui/material";

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
      {value === index && <Box sx={{ padding: "10px" }}>{children}</Box>}
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
  const { content, tabs, value, onChange, sx, tabsContainerSx } = props;

  const [localTab, setLocalTab] = useState(0);

  const localOnChange = (event, newTab) => setLocalTab(newTab);

  return (
    <Box
      sx={{
        ...sx,
      }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          width: "100%",
        }}
      >
        <Tabs
          sx={{ ...tabsContainerSx }}
          textColor="primary"
          indicatorColor="primary"
          value={value || localTab}
          onChange={onChange || localOnChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((item, i) => (
            <Tab
              sx={{ textTransform: "capitalize" }}
              key={item}
              label={item}
              {...a11yProps(i)}
            />
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
  sx: {},
};

TabView.propTypes = {
  content: PropTypes.arrayOf(PropTypes.node).isRequired,
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func,
  sx: PropTypes.object,
  tabsContainerSx: PropTypes.object,
};

export default TabView;
