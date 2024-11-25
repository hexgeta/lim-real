import React from 'react';
import Link from 'next/link';
import ProjectionChartMAXI from '@/components/ProjectionChartMAXI';

const Home = () => {
  return (
    <div className="p-2 sm:p-4">
      <h1 className="text-2xl font-bold mb-4 text-center mt-10"> Welcome to LookIntoMaxi <span className= "inline-block animate-[wave_2s_ease-in-out_infinite]">👋</span>
      </h1>
      <h2 className="text-1xl font-normal mb-4 text-center">This is an analytics site dedicated to pooled hex staking. Check out what $MAXI could do in 13 years 👇
      </h2>
      <ProjectionChartMAXI/>
    </div>
  );
};

export default Home;