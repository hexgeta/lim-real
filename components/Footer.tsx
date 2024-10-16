import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full bg-black px-1 py-8">
      <div className="max-w-[1200px] mx-auto grid grid-cols-4 gap-8">
        <div className="col-span-1">
          <h3 className="text-lg font-semibold mb-2">LOOKINTOMAXI 2024</h3>
          <p className="text-sm">Donation address:</p>
          <p className="text-sm break-all text-[rgb(153,153,153)] hover:text-gray-300 cursor-pointer" onClick={() => navigator.clipboard.writeText('0x1F12DAE5450522b445Fe1882C4F8D2Cf67B38a43')}>
            0x1F12DAE5450522b445Fe1882C4F8D2Cf67B38a43
          </p>
        </div>
        <div className="col-span-1">
          <h3 className="text-lg font-semibold mb-2">More charts</h3>
          <ul className="text-sm space-y-1">
            <li><Link href="/vs-hex" className="text-[rgb(153,153,153)] hover:text-gray-300">BTC vs ETH vs HEX</Link></li>
            <li><Link href="/hex-gains" className="text-[rgb(153,153,153)] hover:text-gray-300">HEX Xs</Link></li>

          </ul>
        </div>
        <div className="col-span-1">
          <h3 className="text-lg font-semibold mb-2">Learn more</h3>
          <ul className="text-sm space-y-1">
            <li><Link href="https://docs.lookintomaxi.com/" className="text-[rgb(153,153,153)] hover:text-gray-300">Docs</Link></li>
            <li><Link href="https://www.maximusdao.com/" className="text-[rgb(153,153,153)] hover:text-gray-300">Official site</Link></li>
          </ul>
        </div>
        <div className="col-span-1">
          <h3 className="text-lg font-semibold mb-2">Legal</h3>
          <ul className="text-sm space-y-1">
            <li><Link href="/terms-and-conditions" className="text-[rgb(153,153,153)] hover:text-gray-300">T&C</Link></li>
            <li><Link href="/privacy-policy" className="text-[rgb(153,153,153)] hover:text-gray-300">Privacy</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
