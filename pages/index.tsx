import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import PriceComparison from '../components/BtcEthHex';

const Home = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Welcome to LookIntoMaxi</h1>
      <h2 className="text-1xl font-semi-bold mb-4 text-center">yo, this site is still being built. i'm a junior dev and using ai to make it, cut me some slack.</h2>
    </div>
  );
};

export default Home;