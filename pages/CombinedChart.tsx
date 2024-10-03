import React from 'react';
import HEXPriceChart from '../components/CombinedChart';
import HEXPriceChart2 from '../components/CombinedChart2';


const CombinedChartPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Combined Price</h1>
      <HEXPriceChart />
      <HEXPriceChart2 />
    </div>
  );
};

export default CombinedChartPage;