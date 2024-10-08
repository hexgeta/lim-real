import React from 'react';
import Link from 'next/link';

const NavigationBar = () => {
  return (
    <nav className="w-full bg-black px-4 py-2 debug-nav pt-4 pl-20 pr-20">
      <div className="max-w-[1200px] mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-4 debug-nav-inner">
        <Link href="/" className="text-white font-normal text-xl justify-self-start debug-logo">
          LookIntoMaxi
        </Link>
        <div className="flex justify-center space-x-6 debug-links">
          <Link href="/DeltaDiscounts" className="text-white hover:text-gray-300">Δ Discounts</Link>
          <Link href="/HEXCharts" className="text-white hover:text-gray-300">Charts</Link>
          <Link href="/Btc-Eth-Hex" className="text-white hover:text-gray-300">BTC vs ETH vs HEX</Link>
        </div>
        <Link href="/Buy" className="bg-transparent text-white font-normal py-1 px-4 border border-white rounded justify-self-end debug-buy  hover:text-gray-300">
          Buy
        </Link>
      </div>
    </nav>
  );
};

export default NavigationBar;