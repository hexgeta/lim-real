import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer
} from 'recharts';

function DiscountChart({ 
  tableName, 
  title, 
  xAxisKey = 'Day', 
  yAxis1Key = 'Discount/Premium', 
  yAxis2Key = 'Backing Value',
  yAxisDomain = [0, 2.5]
}) {
  const [data, setData] = useState([]);

    //   // Use static data for testing
  // useEffect(() => {
  //   const formattedData = [
  //     { day: 881, discount: 1.0, backingValue: 1.0 },
  //     { day: 997, discount: 2.0, backingValue: 1.1 },
  //     { day: 1113, discount: 1.5, backingValue: 1.2 },
  //     { day: 1229, discount: 1.3, backingValue: 1.3 },
  //     { day: 1345, discount: 1.4, backingValue: 1.4 },
  //     { day: 1461, discount: 1.5, backingValue: 1.5 },
  //     { day: 1577, discount: 1.2, backingValue: 1.6 },
  //     { day: 1693, discount: 1.3, backingValue: 1.7 },
  //   ];

  //   // Set static data to the state
  //   setData(formattedData);
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from(tableName).select('*');
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        const formattedData = data.map((item) => ({
          day: item[xAxisKey],
          discount: parseFloat(item[yAxis1Key]),
          backingValue: parseFloat(item[yAxis2Key]),
        }));
        
        // Sort the data by day
        const sortedData = formattedData.sort((a, b) => a.day - b.day);
        
        setData(sortedData);
      }
    };
    fetchData();
  }, [tableName, xAxisKey, yAxis1Key, yAxis2Key]);

  return (
    <div style={{ width: '100%', height: 500, margin: '20px' }}>
      <h2 style={{ textAlign: 'left', color: '#000', fontSize: '44px', marginBottom: '20px', marginLeft: '40px'}}>
        {title}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis domain={yAxisDomain} ticks={[0, 0.5, 1, 1.5, 2, 2.5]}/>
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #ccc', borderRadius: '10px'}}
            labelStyle={{ color: '#666' }}
            itemStyle={{ color: '#666' }}
          />
          <Legend />
          <Line type="monotone" dataKey="backingValue" name="Backing Value (Principle + Yield)" dot={false} strokeWidth={2} stroke="rgb(255, 205, 86)" activeDot={{ r: 5, fill: 'rgb(255, 205, 86)', stroke: 'rgb(255, 205, 86, 0.6)' }}/>
          <Line type="monotone" dataKey="discount" name="Δ Discount/Premium in HEX" dot={false} strokeWidth={2} stroke="#EA4335" activeDot={{ r: 5, fill: 'rgb(234, 67, 53)', stroke: 'rgb(234, 67, 53, 0.6)' }}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DiscountChart;