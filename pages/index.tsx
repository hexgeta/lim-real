import React from 'react';
import Link from 'next/link';
import CryptoDashboard from '@/components/crypto-dashboard';

const Home = () => {
  return (
    <div className="p-6 sm:p-6 my-2 sm:my-4">
      <CryptoDashboard/>
    </div>
  );
};

export default Home;