import React from 'react';
import DiscountChart from '../components/DiscountChart';

const DeltaDiscounts = () => {
  const chartConfigs = [
    { tableName: 'pMAXI - DiscountChart', title: 'pMaxi Ⓜ️' },
    { tableName: 'pDECI - DiscountChart', title: 'pDECI 🛡️' },
    { tableName: 'pLUCKY - DiscountChart', title: 'pLUCKY 🍀' },
    { tableName: 'pTRIO - DiscountChart', title: 'pTRIO 🎲' },
    { tableName: 'pBASE - DiscountChart', title: 'pBASE 🟠' },
  ];

  return (
    <div className="p-0">
      <h1 className="text-2xl font-bold mt-10 mb-4 text-center">Delta Discounts</h1>
      <p className="text-white/60 text-center">The Δ Discounts page offers a visual representation of the discount or premium of various stake pool tokens over time. This allows users to track how each token's market price fluctuates relative to its intrinsic backing value (principle + yield). The page is designed to help users spot potential buying opportunities when tokens are undervalued or identify when to sell at a premium.</p>
      <div>
        {chartConfigs.map((config, index) => (
          <DiscountChart 
            key={index}
            tableName={config.tableName}
            title={config.title}
          />
        ))}
      </div>
    </div>
  );
};

export default DeltaDiscounts;