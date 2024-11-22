import React from 'react';
import ProjectionChartMAXI from '../components/ProjectionChartMAXI';
import ProjectionChartDECI from '../components/ProjectionChartDECI';
import ProjectionChartLUCKY from '../components/ProjectionChartLUCKY';
import ProjectionChartTRIO from '../components/ProjectionChartTRIO';
import ProjectionChartBASE from '../components/ProjectionChartBASE';  

const ProjectionsPage = () => {
  return (
    <div className="p-2 sm:p-4">
      <h1 className="text-2xl font-bold mt-10 mb-4 text-center">Projection Charts</h1>
      <p className="text-white/60 text-center">
        These projection charts plot historical market price and underlying HEX stake backing value against one another and then projecting these values into the future via multiple trend lines. They serve as useful models to illustrate how the value of these tokens may behave throughout the length of their HEX stakes.
      </p>
      <div>
        <ProjectionChartMAXI/>
        <ProjectionChartDECI/>
        <ProjectionChartLUCKY/>
        <ProjectionChartTRIO/>
        <ProjectionChartBASE/>
      </div>
    </div>
  );
};

export default ProjectionsPage;