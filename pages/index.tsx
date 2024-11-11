import React from 'react';
import Link from 'next/link';
import ExampleChart from '../components/ExampleChart';

const Home = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4 text-center"> Welcome to LookIntoMaxi <span className= "inline-block animate-[wave_2s_ease-in-out_infinite]">👋</span>
      </h1>
      <h2 className="text-1xl font-normal mb-4 text-center">This is an analytics site dedicated to pooled hex staking. Check out what $MAXI could do in 13 years 👇
    
      </h2>
      <ExampleChart/>
    </div>
  );
};

export default Home;