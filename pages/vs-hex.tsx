import React from 'react';
import PriceComparison from '../components/BtcEthHex';
import BtcEthPls from '@/components/BtcEthPls';
import BtcEthPlsx from '@/components/BtcEthPlsx';
import BtcEthInc from '@/components/BtcEthInc';

const BtcEthHex2 = () => {
  return (
    <div className="p-4">
      <PriceComparison/>
      <BtcEthPls/>
      <BtcEthPlsx/>
      <BtcEthInc/>
    </div>
  );
};

export default BtcEthHex2;