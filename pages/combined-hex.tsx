import React from 'react';
import HEXPriceChart2 from '../components/CombinedChart2';
import CombinedChartMovingAverageLive from '../components/CombinedChartMovingAverageLive';

const CombinedHex = () => {
  return (
    <div className="p-4">
          <h1 className="text-white text-2xl font-bold mt-20 mb-8 text-center">Combined HEX Price (All-Time Median & Average)</h1>
          <CombinedChartMovingAverageLive/>
          <h1 className="text-white text-2xl font-bold mt-20 mb-8 text-center">Combined HEX Price (Split by Token)</h1>
      <HEXPriceChart2/>
    </div>
  );
};

export default CombinedHex;