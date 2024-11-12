import React from 'react';
import HEXPriceChart from '../components/CombinedChart';
import HEXPriceChart2 from '../components/CombinedChart2';
import HEXPriceRatioChart from '../components/HEXPriceRatioChart';
import CombinedChartAverage from '@/components/CombinedChartAverage';
import CombinedChartMovingAverage from '@/components/CombinedChartMovingAverage';
import CombinedChartMovingAverageLive from '@/components/CombinedChartMovingAverageLive';
import PlsPlsxRatioChart from '@/components/PlsPlsxRatioChart';
import HEXLiquidityChart from '@/components/HEXLiquidityChart';
import EHEXLiquidityChart from '@/components/EHEXLiquidityChart';
import TSharesChart from '@/components/TshareChart';
import CombinedChartXs from '@/components/CombinedChartXs';

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