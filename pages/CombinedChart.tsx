import React from 'react';
import HEXPriceChart from '../components/CombinedChart';

const CombinedChartPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Combined Price</h1>
      <HEXPriceChart />
    </div>
  );
};

export default CombinedChartPage;