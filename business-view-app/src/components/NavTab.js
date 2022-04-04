import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Grid } from '@mui/material';
import isoLogo from './isoLogo.PNG';
import Background from './Background'

/**
 * A navigation bar (temp) for use during demos- real one will be implemented by Team Kick
 * 
 * @author @hiimlo
 * 
 * Contains: 
 *    isoLogo.PNG
 *    Background.js (Toggle button for dark/light mode)
 *    Tabs (switch between views *hypothetically*)
 * 
 * @returns {React.ElementType}
 *
*/

export default function NavTabs() {
  const [value, setValue] = React.useState('Business');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid container spacing={2}>
      <Grid item lg={4} xl={4}>
        <img src={isoLogo} alt="Logo" width={125} height={62.5} />
      </Grid>
      <Grid item lg={6} xl={7}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab value="Dashboard" label="Dashboard" />
          <Tab value="Business" label="Business Processes" />
          <Tab value="Log" label="Log View" />
        </Tabs>
      </Grid>
      <Grid item lg={2} xl={1}>
        <Background />
      </Grid>
    </Grid>
  );
}