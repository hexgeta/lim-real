import React from 'react';
import PriceChart from '../components/AllPrices';

const PricesPage = () => {
  return (
    <div className="p-2 sm:p-4">
      <h1 className="text-2xl font-bold mt-10 mb-4 text-center">Price Charts</h1>
      <p className="text-white/60 text-center">A chart showing all asset prices overlayed on one another.</p>
      <div>
        <PriceChart/>
      </div>
    </div>
  );
};

export default PricesPage;