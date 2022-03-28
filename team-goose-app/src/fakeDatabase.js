// use the dummy data which is in the json
import data from './sample_log_details.json';

// The types of certain columns. All other columns will be assumed to be strings
const dateColumns = ['CREATION_TIME'];
const numberColumns = ['SEVERITY', 'PRIORITY'];

// datetime
const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

// Convert data into correct types
for(let row of data) {
    for(let colName in row) {
        if (numberColumns.includes(colName)) {
            row[colName] = Number(row[colName]);
        } else if (dateColumns.includes(colName)) {
            // needs processing. NOTE: this conversion will not be necessary in the real database
            // These times are in GMT
            // Format is: 01-JAN-22 12.55.03.680000 AM
            // we want 2020-04-13T00:00:00.000+00:00 for Date init
            let [date, time, am_pm] = row[colName].split(" ");
            let [day, mnth, yr] = date.split("-");
            let [hour, minute, second, ms] = time.split(".")
            let year = "20" + yr; // assume 2000+
            let month = String(months.indexOf(mnth.toUpperCase()) + 1).padStart(2, "0");
            let milliseconds = ms.substring(0, 3); // only 3 digits of precision
            let hour24 = String((Number(hour) % 12) + (am_pm === "PM" ? 12 : 0)).padStart(2, "0");
            let datestring = year + "-" + month + "-" + day;
            let timestring = hour24 + ":" + minute + ":" + second + "." + milliseconds;
            let d = new Date(datestring + "T" + timestring + "+00:00");
            row[colName] = d;
            console.log(d.toUTCString());
        }
    }
}

const dropdownFilters = ["EAI_DOMAIN", "BUSINESS_DOMAIN", "BUSINESS_SUBDOMAIN", "APPLICATION", "EVENT_CONTEXT"];
const prioritiesMapping = {"High": "70", "Medium": "50", "Low": "10"};


// Takes the raw values of filters (which is just the values of the filters from the UI)
// and transforms it into a filter function, which returns true if the input should pass the filter
function parseFilters(filters) {
    const resultFilters = {}
    for(let columnName in filters) {
        const rawFilter = filters[columnName];
        // Check the columnName
        if(dropdownFilters.includes(columnName)) {
            // rawFilter should be a string
            resultFilters[columnName] = (x) => {
                return rawFilter === "All" || x === rawFilter;
            };
        } else if (columnName === "PRIORITY") {
            // rawFilter should be of type Set("High"|"Medium"|"Low")
            resultFilters[columnName] = (x) => {
                return [...rawFilter].map(p => prioritiesMapping[p]).includes(x);
            }
        } else if (columnName === "SEVERITY") {
            // because severity uses ranges instead of strict values
            // rawFilter should be of type Set("Info"|"Success"|"Warning"|"Error")
            resultFilters[columnName] = (x) => {
                if(x < 20) {
                    return rawFilter.has("Info");
                } else if (x < 30) {
                    return rawFilter.has("Success");
                } else if (x < 50) {
                    return rawFilter.has("Warning");
                } else {
                    return rawFilter.has("Error");
                }
            }
        } else if (columnName === "CATEGORY_NAME") {
            // rawFilter should be of type Set("Status"|"Start"|"Stop"|"Security"|"Heartbeat")
            resultFilters[columnName] = (x) => {
                return rawFilter.has(x);
            }
        } else {
            console.warn("Unsupported filter: ", columnName);
            // We do not add unsupported columnNames to the resultFilters
        }
    }
    return resultFilters;
}

// filters are a mapping from column names to state associated with the filter for that column name
// and returns the rows of data that pass those filters
export function getTableData(filters) {
    if(!filters) {
        return data;
    }
    const filterfuncs = parseFilters(filters);
    let dataCopy = [...data];
    let resultData = [];
    // Go through each row
    for (let row of dataCopy) {
        // Find if any cols violate the filters
        let includeRow = true;
        for(let col of Object.keys(row)) {
            if(filterfuncs[col]) {
                const filterfunc = filterfuncs[col];
                if(!(filterfunc(row[col]))) {
                    includeRow = false;
                    break;
                }
            }
        }
        // only include rows that don't violate the filters
        if (includeRow) {
            resultData.push(row);
        }
    }
    return resultData;
}

// returns all the (unique) values that are in data for the give columnName
export function getColumnValues(columnName) {
    if(!columnName) {
        return [""];
    }
    if(!data[0][columnName]) {
        console.error("There is no column in the table with name: ", columnName);
    }
    let deDup = new Set();
    [...data].forEach(row => deDup.add(row[columnName]));
    return [...deDup];
}

// The names of the columns
// In order of usefulness to show in the table demo
// KEEP GLOBAL_INSTANCE_ID FIRST!
const colNames = [
    'GLOBAL_INSTANCE_ID',
    'SEVERITY', 
    'PRIORITY', 
    'CATEGORY_NAME', 
    'CREATION_TIME', 
    'APPLICATION', 
    'EVENT_CONTEXT', 
    'ACTIVITY', 
    'EAI_DOMAIN', 
    'BUSINESS_DOMAIN', 
    'BUSINESS_SUBDOMAIN', 
    'PROCESS_ID', 
    'REASONING_SCOPE', 
    'VERSION', 
    'LOCAL_INSTANCE_ID', 
    'EAI_TRANSACTION_ID', 
    'HOSTNAME', 
    'COMPONENT', 
    'MSG'
]

// Generates n rows by rotating through the possible values of each column
// possible values are from the column values in data
export function produceRows(n) {
    let columnsMap = {};
    let indices = {};
    if (data.length < 0) {
        console.warn("There is no data");
        return [];
    }
    for (let columnName of Object.keys(data[0])) {
        // global id will be generated below
        if(["", "GLOBAL_INSTANCE_ID", "Insert script"].includes(columnName)) {
            continue;
        }
        columnsMap[columnName] = getColumnValues(columnName);
        indices[columnName] = 0;
    }
    const rows = [];
    const adjustedColNames = colNames.slice(1, colNames.length);
    for (let k = 0; k < n; k++) {
        // Create and insert next row
        const id = "crm_server_" + String(k).padStart(6, "0");
        const nextRow = {}
        adjustedColNames.forEach(c => nextRow[c] = columnsMap[c][indices[c]]);
        nextRow["GLOBAL_INSTANCE_ID"] = id;
        rows.push(nextRow);

        // Go to next indices
        let curColIndex = 0
        while(true) {
            const curCol = adjustedColNames[curColIndex];
            indices[curCol] += 1;
            if (indices[curCol] !== columnsMap[curCol].length) {
                break;
            } else {
                indices[curCol] = 0;
                curColIndex += 1;
            }
        }
    }
    // console.log(rows);
    return rows;
}