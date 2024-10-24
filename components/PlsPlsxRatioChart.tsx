import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

interface RatioData {
  date: string;
  ratio: number | null;
}

const PlsPlsxRatioChart: React.FC = () => {
  const [data, setData] = useState<RatioData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://hexdailystats.com/fulldatapulsechain');
        const pulsechainData = response.data;

        const formattedData = pulsechainData.map((item: any) => {
          const dateStr = new Date(item.date).toISOString().split('T')[0];
          const hexPrice = Number(item.pricePulseX) || null;
          const plsPrice = item.pricePulseX_PLS ? 1 / Number(item.pricePulseX_PLS) : null;

          let ratio = null;
          if (hexPrice && plsPrice && plsPrice > 0) {
            ratio = hexPrice / plsPrice;
          }

          return {
            date: dateStr,
            ratio: ratio
          };
        });

        formattedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        // Filter out initial null values
        const filteredData = formattedData.reduce((acc: RatioData[], curr) => {
          if (curr.ratio !== null || acc.length > 0) {
            acc.push(curr);
          }
          return acc;
        }, []);

        setData(filteredData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: '100%', height: '450px', backgroundColor: '#000', padding: '0px'}}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 50, left: 0, bottom: 0 }}
        >
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={false}
            interval={20}
          />
          <YAxis 
            stroke="#888" 
            domain={[0, 1.1]}
            allowDataOverflow={true}
            axisLine={false}
            tickLine={false}
            tick={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'solid 1px #fff', borderRadius: '5px'}}
            labelStyle={{ color: 'white' }}
            formatter={(value, name, props) => {
              const formattedValue = Number(value).toFixed(6);
              return [formattedValue, 'PLSX/PLS Ratio'];
            }}
            labelFormatter={(label) => formatDate(label)}
          />
          <Legend />
          <ReferenceLine y={1} stroke="#888" strokeDasharray="3 3" label={{ value: '1:1', position: 'top', offset: 6, fill: '#888', fontSize: 20 }}/>
          <ReferenceLine y={0.5} stroke="#888" strokeDasharray="3 3" label={{ value: '1:0.5', position: 'top', offset: 6, fill: '#888', fontSize: 20 }}/>
          <ReferenceLine y={0} stroke="#888" strokeDasharray="3 3" label={{ value: '0', position: 'top', offset: 6, fill: '#888', fontSize: 20 }}/>
          <Line 
            type="monotone" 
            dataKey="ratio" 
            name="PLSX/PLS Price Ratio"
            stroke="#fff"
            dot={false} 
            strokeWidth={2}
            connectNulls={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlsPlsxRatioChart;
