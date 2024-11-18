import React from 'react';
import PriceChart from '../components/AllPrices';

const PricesPage = () => {
  return (
    <div className="p-0">
      <h1 className="text-2xl font-bold mt-10 mb-4 text-center">Price Charts</h1>
      <p className="text-white/60 text-center">
Prices      </p>
      <div>
        <PriceChart/>
      </div>
    </div>
  );
};

export default PricesPage;