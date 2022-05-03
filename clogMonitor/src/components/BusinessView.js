import React from "react";
import { Grid } from "@mui/material";
import { filterTableData, getLogDetails, getColumnValues, getTableData } from '../fakeDatabase';
import BusinessTable from "../components/BusinessTable";
import BusinessTreeFilters from "../components/BusinessTreeFilters";
import BusinessTableFilters from "./BusinessTableFilters";

//keeping consistent with other views, similar code is here for handling checkboxes
//checkbox and dropdown both need to be here since they're post selection filtering
/**
 * Code reworked from Logview
 */

export const BusinessView = () => {
  // To get token, use the following line:
  // const token = sessionStorage.getItem("token");
  const [tableData, setTableData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
      const tdata = getTableData(undefined);
      console.log("Got tdata");
      console.log(tdata);
      setTableData(tdata);
      // setLoading(true);
      // getLogDetails(undefined).then((resultData) => {
      //     console.log("Got api data")
      //     setTableData(resultData)
      //     setLoading(false);
      // });
  }, [])

  function handleTableSet(params, todoFilters={}) {

    // setLoading(true);
    // getLogDetails(params).then((resultData) => {
    //     // Since we still need to manually filter some things
    //     const fullyFilteredData = filterTableData(todoFilters, resultData);
    //     // Actually update the table
    //     setTableData(fullyFilteredData);
    //     setLoading(false);
    //     return fullyFilteredData;
    // })
  }

  return (
    <Grid container spacing={1} direction="row" alignItems="center" justifyContent="center">
      <Grid item>
        <BusinessTreeFilters dataSetHandler={handleTableSet} />
      </Grid>
      <Grid item lg={12} xl={12} align="center">
      <BusinessTableFilters dataSetHandler={handleTableSet} />
      </Grid>
      <Grid item lg={12} xl={12} align="center">
      <BusinessTable data={tableData} loading={loading}/>
      </Grid>
    </Grid>
  );
};
