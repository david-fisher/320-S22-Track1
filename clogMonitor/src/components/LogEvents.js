import React from 'react';
import LogEventsFilters from './LogEventsFilters';
import LogEventsTable from './LogEventsTable';
import { filterTableData, getLogDetails } from '../fakeDatabase';
import './LogEvents.css'

/**
 * The body of the Log Events page, includes filters and table for displaying Log Events.
 * 
 * 
 * @returns {React.ElementType}
 */
const LogEvents = () => {
    const [tableData, setTableData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [loadError, setLoadError] = React.useState(false);
    const [needTryAgain, setNeedTryAgain] = React.useState(false);

    const attemptQuery = (params, filters={}) => {
        setLoading(true);
        setNeedTryAgain(false);
        getLogDetails(params).then((resultData) => {
            // Since we still need to manually filter some things
            const fullyFilteredData = filterTableData(filters, resultData);
            // Actually update the table
            setTableData(fullyFilteredData);
            setLoading(false);
            setLoadError(false);
        }).catch(err => {
            console.error(err);
            setLoadError(true);
            setNeedTryAgain(true);
        });
    }

    // Initial query on component load
    React.useEffect(() => {
        attemptQuery(undefined);
    }, []);

    // The try again loop
    React.useEffect(() => {
        if(needTryAgain) {
            setTimeout(() => {
                attemptQuery(undefined)
            }, 500);
        }
    }, [needTryAgain]);

    // Handles when table data needs setting
    // Takes in query params and extra filters for filtering the returned data
    function handleTableSet(params, todoFilters={}) {
        attemptQuery(params, todoFilters);
    }

    return (
        <div className='log-events-container'>
            <LogEventsFilters dataSetHandler={handleTableSet}></LogEventsFilters>
            <LogEventsTable data={tableData} loading={loading} error={loadError}></LogEventsTable>
        </div>
    );
}

export default LogEvents;