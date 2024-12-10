import React from 'react';
import DiscountChartMAXI from '../components/DiscountChartMAXI';
import DiscountChartLUCKY from '../components/DiscountChartLUCKY';
import DiscountChartDECI from '../components/DiscountChartDECI';

const DeltaDiscounts = () => {
  return (
    <div className="p-2 sm:p-4">
      <h1 className="text-2xl font-bold mt-10 mb-4 text-center">Delta Discounts</h1>
      <p className="text-white/60 text-center">The Δ Discounts page offers a visual representation of the discount or premium of various stake pool tokens over time. This allows users to track how each token's market price fluctuates relative to its intrinsic backing value (principle + yield). Tracking this behaviour can help users spot potential buying opportunities when tokens are at a discount or selling oppertunities when they are at a premium.</p>
      <div>
        <div>
          <DiscountChartMAXI title="pMaxi Ⓜ️" />
        </div>
        {/* <div>
          <DiscountChartDECI title="pDeci 🛡️" />
        </div>
        <div>
          <DiscountChartLUCKY title="pLucky 🍀" />
        </div> */}
      </div>
    </div>
  );
};

export default DeltaDiscounts;