import React from 'react';
import CombinedChartXs from '../components/CombinedChartXs';
import VsGainsTop20 from '../components/vsgainstop20';

const HexGains = () => {
  return (
    <div className="p-2 sm:p-4">
          <h1 className="text-white text-2xl font-bold mt-20 mb-8 text-center">Combined HEX gains in Xs</h1>
          <p className="text-white/60 text-center">A chart showing HEX gains from various points.</p>
      <CombinedChartXs/>
      <VsGainsTop20/>
    </div>
  );
};

export default HexGains;