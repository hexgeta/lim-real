// src/components/DiscountChart.js
import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient'; // Ensure supabaseClient.js is set up correctly
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

function DiscountChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Use static data for testing
    const formattedData = [
      { day: 881, discount: 1.0, backingValue: 1.0 },
      { day: 997, discount: 2.0, backingValue: 1.1 },
      { day: 1113, discount: 1.5, backingValue: 1.2 },
      { day: 1229, discount: 1.3, backingValue: 1.3 },
      { day: 1345, discount: 1.4, backingValue: 1.4 },
      { day: 1461, discount: 1.5, backingValue: 1.5 },
      { day: 1577, discount: 1.2, backingValue: 1.6 },
      { day: 1693, discount: 1.3, backingValue: 1.7 },
    ];

    // Set static data to the state
    setData(formattedData);
  }, []);

  // If you want to use dynamic data, uncomment and use this section
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const { data, error } = await supabase.from('PLS - DiscountCharts').select('*');
  //     if (error) {
  //       console.error('Error fetching data:', error);
  //     } else {
  //       console.log('Fetched data:', data); // Check what data is returned
  //       const formattedData = data.map((item) => ({
  //         day: item.Day,
  //         discount: parseFloat(item['Discount/Premium']),
  //         backingValue: parseFloat(item['Backing Value']),
  //       }));
  //       console.log('Formatted data:', formattedData); // Log formatted data here
  //       setData(formattedData);
  //     }
  //   };
  //   fetchData();
  // }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        width={800}
        height={400}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="discount" stroke="#FF0000" name="Δ Discount/Premium in HEX" />
        <Line type="monotone" dataKey="backingValue" stroke="#FFD700" name="Backing Value (Principle + Yield)" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default DiscountChart; // Make sure this line is at the top level
