import React from 'react';
import HEXPriceRatioChart from '../components/HEXPriceRatioChart';
import PlsPlsxRatioChart from '@/components/PlsPlsxRatioChart';


const PriceRatioChartPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-white text-2xl font-bold mt-20 mb-4 text-center">eHEX:pHEX Price Ratio</h1>
      <HEXPriceRatioChart />
      <h1 className="text-white text-2xl font-bold mt-20 mb-4 text-center">PLSX:PLS Price Ratio</h1>
      <PlsPlsxRatioChart/>
    </div>
  );
};

export default PriceRatioChartPage;