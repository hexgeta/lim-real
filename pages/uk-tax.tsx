import React from 'react';
import UKMarginalTaxRateChart from '../components/uktax';

const UKTax = () => {
  return (
    <div className="p-4">
          <h1 className="text-white text-2xl font-bold mt-20 mb-8 text-center">UK tax</h1>
      <UKMarginalTaxRateChart/>
    </div>
  );
};

export default UKTax;
