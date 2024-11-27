import React from 'react';
import PriceComparison from '../components/BtcEthHex';
import BtcEthPls from '@/components/BtcEthPls';
import BtcEthPlsx from '@/components/BtcEthPlsx';
import BtcEthInc from '@/components/BtcEthInc';
import PDAIPerformanceVisual from '@/components/Pdai';

const BtcEthHex2 = () => {
  return (
    <div className="p-2 sm:p-4">
      <PriceComparison/>
      <BtcEthPls/>
      <BtcEthPlsx/>
      <BtcEthInc/>
      <PDAIPerformanceVisual/>
    </div>
  );
};

export default BtcEthHex2;