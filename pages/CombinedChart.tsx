import React from 'react';
import HEXPriceChart from '../components/CombinedChart';
import HEXPriceChart2 from '../components/CombinedChart2';
import HEXPriceRatioChart from '../components/HEXPriceRatioChart';
import CombinedChartAverage from '@/components/CombinedChartAverage';
import CombinedChartMovingAverage from '@/components/CombinedChartMovingAverage';
import CombinedChartMovingAverageLive from '@/components/CombinedChartMovingAverageLive';


const CombinedChartPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Combined Price 1 line</h1>
      <HEXPriceChart />
      <h1 className="text-2xl font-bold mb-4 text-center">Combined Price 3 lines</h1>
      <HEXPriceChart2 />
      <h1 className="text-2xl font-bold mb-4 text-center">Ratio</h1>
      <HEXPriceRatioChart />
      <h1 className="text-2xl font-bold mb-4 text-center">Static Average</h1>
      <CombinedChartAverage/>
      <h1 className="text-2xl font-bold mb-4 text-center">Combined HEX Price</h1>
      <CombinedChartMovingAverage/>
      <h1 className="text-2xl font-bold mb-4 text-center">Combined HEX Price Live</h1>
      <CombinedChartMovingAverageLive/>
    </div>
  );
};

export default CombinedChartPage;