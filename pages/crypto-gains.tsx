import React from 'react';
import VsGains from '../components/vsgains';

const CryptoGains = () => {
  return (
    <div className="p-4">
          <h1 className="text-white text-2xl font-bold mt-20 mb-1 text-center">Best crypto gains in Xs</h1>
          <h2 className="text-gray-400 text-sm font-italic mb-8 text-center">(Measured from the HEX price floor)</h2>
      <VsGains/>
    </div>
  );
};

export default CryptoGains;