import React from "react";
import ErrorLogBox from "../ErrorLogBox/ErrorLogBox";
import "./ErrorLogPane.css";

const myComponent = {
  minWidth: '400px',
  height: '650px',
  overflowY: 'scroll'
};

function ErrorLogPane({ logEvents }) {
  return (
    <div style={{ height: '100%' }}>
      <div className="ErrorLogPane">
        <h2 className="ErrorLogPane__heading">Recent Error Logs</h2>
        <div className="ErrorLogPane__body" style={myComponent}>
          {logEvents.filter(logEvent => {
            // let yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
            // let dateObject = new Date(logEvent["creationTime"]);
            // return dateObject.getTime() > yesterday.getTime();
            return true;
          }).map((logEvent) => (
            <ErrorLogBox
              className="ErrorLogPane__box"
              logEvent={logEvent}
            ></ErrorLogBox>
          ))}
        </div>
      </div>
    </div >
  );
}

export default ErrorLogPane;