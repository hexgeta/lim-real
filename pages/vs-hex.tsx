import React from 'react';
import PriceComparison from '../components/BtcEthHex';
import BtcEthPls from '@/components/BtcEthPls';
import BtcEthPlsx from '@/components/BtcEthPlsx';
import BtcEthInc from '@/components/BtcEthInc';
import PDAIPerformanceVisual from '@/components/PegPdai';
import PBTCPerformanceVisual from '@/components/PegPBTC';
import PstETHPerformanceVisual from '@/components/PegPstETH';
import VsGainsTop20 from '../components/vsgainstop20';


const BtcEthHex2 = () => {
  return (
    <div className="p-2 sm:p-4">
      <PriceComparison/>
      <BtcEthPls/>
      <BtcEthPlsx/>
      <BtcEthInc/>
      <PDAIPerformanceVisual/>
      <PBTCPerformanceVisual/>
      <PstETHPerformanceVisual/>
      <VsGainsTop20/>
    </div>
  );
};

export default BtcEthHex2;