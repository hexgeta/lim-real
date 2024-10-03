import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PriceData {
  date: string;
  pricePulseX: number | null;
  priceEthereum: number | null;
}

const HEXPriceChart2: React.FC = () => {
  const [data, setData] = useState<PriceData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pulsechainResponse, ethereumResponse] = await Promise.all([
          axios.get('https://hexdailystats.com/fulldatapulsechain'),
          axios.get('https://hexdailystats.com/fulldata')
        ]);

        const pulsechainData = pulsechainResponse.data;
        const ethereumData = ethereumResponse.data;

        // Find the earliest date from both datasets
        const allDates = [
          ...pulsechainData.map((item: any) => new Date(item.date)),
          ...ethereumData.map((item: any) => new Date(item.date))
        ];
        const earliestDate = new Date(Math.min(...allDates));
        const today = new Date();

        // Create an array of all dates from the earliest to today
        const dateRange = [];
        for (let d = new Date(earliestDate); d <= today; d.setDate(d.getDate() + 1)) {
          dateRange.push(new Date(d));
        }

        // Process and format the data
        const formattedData = dateRange.map(date => {
          const dateStr = date.toISOString().split('T')[0];
          const pulseItem = pulsechainData.find((item: any) => new Date(item.date).toISOString().split('T')[0] === dateStr);
          const ethereumItem = ethereumData.find((item: any) => new Date(item.date).toISOString().split('T')[0] === dateStr);

          return {
            date: dateStr,
            pricePulseX: pulseItem ? pulseItem.priceUV2UV3 : null,
            priceEthereum: ethereumItem ? ethereumItem.priceUV2UV3 : null
          };
        });

        setData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Filter out data points where both prices are null
  const filteredData = data.filter(item => item.pricePulseX !== null || item.priceEthereum !== null);

  return (
    <div style={{ width: '100%', height: '400px', backgroundColor: '#000', padding: '20px'}}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={filteredData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: 'white' }}
            angle={-45}
            textAnchor="end"
            height={80}
            interval={'preserveStartEnd'}
          />
          <YAxis 
            type="number"
            scale="log"
            domain={['auto', 'auto']}
            tick={{ fill: 'white' }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'solid 1px #fff', borderRadius: '5px'}}
            labelStyle={{ color: 'white' }}
            itemStyle={{ color: '#ff00ff' }}
            formatter={(value) => (value !== null ? Number(value).toFixed(6) : 'N/A')}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="pricePulseX" 
            name="PulseChain Price"
            stroke="#FF00FF" 
            dot={false} 
            strokeWidth={2}
            connectNulls
          />
          <Line 
            type="monotone" 
            dataKey="priceEthereum" 
            name="Ethereum Price"
            stroke="#00FFFF" 
            dot={false} 
            strokeWidth={2}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HEXPriceChart2;