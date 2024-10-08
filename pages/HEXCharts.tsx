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
const CombinedChartPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Combined HEX Price</h1>
      <HEXPriceChart2 />
      <h1 className="text-2xl font-bold mb-4 text-center">HEX Price Ratios</h1>
      <HEXPriceRatioChart />
      <h1 className="text-2xl font-bold mb-4 text-center">Combined HEX Price, Static Median</h1>
      <CombinedChartAverage/>
      <h1 className="text-2xl font-bold mb-4 text-center">Combined HEX Price, All-Time Average/Median Moving Average</h1>
      <CombinedChartMovingAverageLive/>
      <h1 className="text-2xl font-bold mb-4 text-center">PLSX/PLS Price Ratio</h1>
      <PlsPlsxRatioChart/>
      <h1 className="text-2xl font-bold mb-4 text-center">pHEX Liquidity</h1>
      <HEXLiquidityChart/>
      <h1 className="text-2xl font-bold mb-4 text-center">eHEX Liquidity</h1>
      <EHEXLiquidityChart/>
    </div>
  );
};

export default CombinedChartPage;