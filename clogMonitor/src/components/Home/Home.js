import React from "react";
import AppBarChart from "../Charts/AppBarChart";
import WelcomeTynography from "../WelcomeTynography/WelcomeTynography";
import ErrorLogPane from "../ErrorLogPane/ErrorLogPane";
import "./Home.css";

function Home() {
  return (
    <div className="Home">
      <div className="Home__WelcomeTynography">
        <WelcomeTynography />
      </div>
      <div className="Home__subscreen">
        <div className="Home__Charts">
          <AppBarChart />
        </div>
        <div className="Home___ErrorLogPane">
          <ErrorLogPane />
        </div>
      </div>
    </div>
  );
}

export default Home;
