import React from 'react';
import ReactDOM from 'react-dom';
import CheckboxSeverities from './components/CheckboxSeverities'
import BusinessDomainDropDown from './components/BusinessDomainDropDown'
import DomainDropDownCheck from './components/DomainDropDownCheck'
import NavTab from './components/NavTab';
import BusinessTree from './components/BusinessTree';
import ApplyButton from './components/ApplyButton';
import RefreshButton from './components/RefreshButton';
import { Grid } from '@mui/material';
import MUIStartTime from './components/MUIStartTime.js';

/**
 * To see visually (for now), each individual component can be placed here
 * however, filters should be actually be put in their designated group (BusinessFilters) 
 * for easier control of layout (stage: functionality)
 * 
 * Grid is used for organizing the elements; it works on the idea that each screen has 12 columns to work with.
 * lg and xl are for large and x-large screens, respectively. They help adjust how many columns the item takes
 * depending on screen size. For our purposes, we assume they only use computer screens and thus at only have
 * lg and xl to be specified. - @hiimlo
*/

  class BusinessView extends React.Component {
      render() {
          return (
              <div>
                <NavTab />
                <Grid container spacing={2} direction="row" alignItems="center" justifyContent="center">
                  <Grid item lg={2.75} xl={2}>
                    <MUIStartTime/>
                  </Grid>
                  <Grid item lg={2.75} xl={2}>
                    <BusinessDomainDropDown/>
                    <DomainDropDownCheck/>
                  </Grid>
                  <Grid item lg={1} xl={1.5}>
                    <RefreshButton />
                  </Grid>
                  <Grid item lg={9} xl={6.75}>
                    <BusinessTree />
                  </Grid>
                  <Grid item lg={8} xl={8}/>
                  <Grid item lg={1} xl={4}>
                    <ApplyButton />
                  </Grid>
                  <Grid item lg={3.5} xl={3}>
                    <h2>Business Process Activities</h2>
                  </Grid>
                  <Grid item lg={9} xl={10}/>
                  <Grid item lg={4} xl={3.5}>
                    <CheckboxSeverities />
                  </Grid>
                  <Grid item lg={2} xl={2}>
                    <BusinessDomainDropDown/>
                  </Grid>
                </Grid>
              </div>
          );
      }
  }

  ReactDOM.render(
    <BusinessView />,
    document.getElementById('root')
  );
  