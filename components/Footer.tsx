import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full bg-black px-1 py-8">
      <div className="max-w-[1200px] mx-auto grid grid-cols-4 gap-8">
        <div className="col-span-1">
          <h3 className="text-lg font-semibold mb-2">LOOKINTOMAXI 2024</h3>
          <p className="text-sm">Donation address:</p>
          <p className="text-sm break-all">0x1F12DAE5450522b445Fe1882C4F8D2Cf67B38a43</p>
        </div>
        <div className="col-span-1">
          <h3 className="text-lg font-semibold mb-2">More stats</h3>
          <ul className="text-sm space-y-1">
            <li><Link href="/">Vs solo</Link></li>
            <li><Link href="/">Ended stakes</Link></li>
            <li><Link href="/">ETH vs PLS gas</Link></li>
            <li><Link href="/">Prices</Link></li>
          </ul>
        </div>
        <div className="col-span-1">
          <h3 className="text-lg font-semibold mb-2">More info</h3>
          <ul className="text-sm space-y-1">
            <li><Link href="/">Calendar</Link></li>
            <li><Link href="/">Buy</Link></li>
            <li><Link href="https://docs.lookintomaxi.com/">Docs</Link></li>
            <li><Link href="https://www.maximusdao.com/">Learn more</Link></li>
          </ul>
        </div>
        <div className="col-span-1">
          <h3 className="text-lg font-semibold mb-2">Legal</h3>
          <ul className="text-sm space-y-1">
            <li><Link href="https://lookintomaxi.com/terms-and-conditions/">T&C</Link></li>
            <li><Link href="https://lookintomaxi.com/privacy-policy/">Privacy</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;