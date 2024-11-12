import React from 'react';
import HEXLiquidityChart from '@/components/HEXLiquidityChart';
import EHEXLiquidityChart from '@/components/EHEXLiquidityChart';

const LiquidityChartPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-white text-2xl font-bold mt-20 mb-4 text-center">pHEX Liquidity</h1>
      <HEXLiquidityChart/>
      <h1 className="text-white text-2xl font-bold mt-20 mb-4 text-center">eHEX Liquidity</h1>
      <EHEXLiquidityChart/>

    </div>
  );
};

export default LiquidityChartPage;