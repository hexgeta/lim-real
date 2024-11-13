import React from 'react';
import ProjectionChartMAXI from '../components/ProjectionChartMAXI';
import ProjectionChartDECI from '../components/ProjectionChartDECI';
import ProjectionChartLUCKY from '../components/ProjectionChartLUCKY';
import ProjectionChartTRIO from '../components/ProjectionChartTRIO';
import ProjectionChartBASE from '../components/ProjectionChartBASE';  

const ProjectionsPage = () => {
  return (
    <div className="p-0">
      <h1 className="text-2xl font-bold mt-10 mb-4 text-center">Projection Charts</h1>
      <p className="text-white/60 text-center">These projections charts plot the historic market price and underlying HEX stake backing value against one another and project these values out via multipe trend lines. They're useful models to help illustrate how the market value of these tokens can behave over the length of the entire HEX stake.
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