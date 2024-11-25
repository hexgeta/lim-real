import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { supabase } from '../supabaseClient';

const HEXPriceChart3: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: prices, error } = await supabase
        .from('historic_prices')
        .select('date, hex_price, ehex_price')
        .order('date', { ascending: true });

      if (!prices) return;

      const chartData = prices
        .filter(row => row.hex_price || row.ehex_price) // Only keep rows with at least one price
        .map(row => ({
          date: new Date(row.date).toISOString().split('T')[0],
          pricePulseX: Number(row.hex_price) || 0,
          priceEthereum: Number(row.ehex_price) || 0,
          combinedPrice: (Number(row.hex_price) || 0) + (Number(row.ehex_price) || 0)
        }));

      console.log('First date:', chartData[0]?.date);
      console.log('Last date:', chartData[chartData.length - 1]?.date);
      console.log('Sample of dates:', chartData.slice(0, 5).map(d => d.date));

      setData(chartData);
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: '100%', height: '600px', backgroundColor: '#000000' }}>
      <ResponsiveContainer>
        <LineChart 
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis 
            dataKey="date" 
            stroke="#FFFFFF"
            tick={{ fill: '#FFFFFF' }}
            type="category"
            domain={['dataMin', 'dataMax']}
          />
          <YAxis 
            stroke="#FFFFFF"
            tick={{ fill: '#FFFFFF' }}
          />
          <Tooltip contentStyle={{ backgroundColor: '#000000', border: '1px solid #FFFFFF' }} />
          <Line type="monotone" dataKey="pricePulseX" stroke="#FF00FF" dot={false} strokeWidth={1} />
          <Line type="monotone" dataKey="priceEthereum" stroke="#00FFFF" dot={false} strokeWidth={1} />
          <Line type="monotone" dataKey="combinedPrice" stroke="#FFFFFF" dot={false} strokeWidth={1} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HEXPriceChart3;