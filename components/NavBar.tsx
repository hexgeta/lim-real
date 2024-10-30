import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full bg-black px-4 py-2">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-xl">
          LookIntoMaxi
        </Link>
        <div className="hidden md:flex items-center justify-left flex-grow ml-10">
          <div className="flex space-x-6">
            <Link href="/delta-discounts" className="text-[rgb(153,153,153)] hover:text-gray-300">Δ Discounts</Link>
            <Link href="/hex-charts" className="text-[rgb(153,153,153)] hover:text-gray-300">HEX Charts</Link>

          </div>
        </div>
        <div className="hidden md:flex items-center">
          <Link href="https://x.com/hexgeta" target="_blank" rel="noopener noreferrer" className="text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </Link>
        </div>
        <button
          className="text-white md:hidden flex flex-col justify-center items-center"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
          <div
            ref={menuRef}
            className="absolute right-2 top-2 h-auto w-64 bg-black bg-opacity-90 p-4 shadow-lg z-50 border border-white rounded-[10px]"
          >
            <Link href="/delta-discounts" className="block text-white py-2">Δ Discounts</Link>
            <Link href="/hex-charts" className="block text-white py-2">Charts</Link>
            <Link href="/vs-hex" className="block text-white py-2">BTC vs ETH vs HEX</Link>
            <Link href="/hex-gains" className="block text-white py-2">Hex Xs</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
