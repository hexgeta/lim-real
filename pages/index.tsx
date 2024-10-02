import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';

const Home = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome to LookIntoMaxi</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Staking</CardTitle>
            <CardDescription>Explore staking options and rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/Table" className="text-blue-500 hover:underline">
              View Staking Tables
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gas Analysis</CardTitle>
            <CardDescription>Understand gas costs and savings</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/Gas" className="text-blue-500 hover:underline">
              View Gas Analysis
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leagues</CardTitle>
            <CardDescription>Check stake pool token rankings</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/Leagues" className="text-blue-500 hover:underline">
              View Leagues
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <p className="text-xl mb-4">Explore more features and data on LookIntoMaxi</p>
        <Link href="/Buy" className="text-blue-500 hover:underline text-lg">
          Learn how to buy
        </Link>
      </div>
    </div>
  );
};

export default Home;