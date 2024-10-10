import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartData {
  date: string;
  liquidityPulseX_HEX: number | null;
  pricePulseX: number | null;
}

const HEXLiquidityChart: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://hexdailystats.com/fulldatapulsechain');
        const pulsechainData = response.data;

        let formattedData = pulsechainData.map((item: any) => ({
          date: new Date(item.date).toISOString().split('T')[0],
          liquidityPulseX_HEX: item.liquidityPulseX_HEX || null,
          pricePulseX: item.pricePulseX || null
        }));

        formattedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        // Remove leading null entries
        while (formattedData.length > 0 && 
               formattedData[0].liquidityPulseX_HEX === null && 
               formattedData[0].pricePulseX === null) {
          formattedData.shift();
        }

        setData(formattedData);
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
          />
          <YAxis 
            yAxisId="left"
            stroke="#888" 
            domain={['auto', 'auto']}
            allowDataOverflow={true}
            axisLine={false}
            tickLine={false}
            tick={false}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#888" 
            domain={['auto', 'auto']}
            allowDataOverflow={true}
            axisLine={false}
            tickLine={false}
            tick={false}
          />
          <Tooltip 
            position={{ x: 'auto', y: -30 }}
            contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'solid 1px #fff', borderRadius: '5px'}}
            labelStyle={{ color: 'white' }}
            formatter={(value: any, name: string, props: any) => {
              console.log('Tooltip value:', value, 'name:', name, 'type:', typeof value);
              if (name === 'pHEX Price') {
                return [`$${Number(value).toFixed(4)}`, name];
              } else if (name === 'Total pHEX Liquidity') {
                return [Number(value).toLocaleString(undefined, {maximumFractionDigits: 0}), name];
              }
              return [value, name];
            }}
            labelFormatter={(label) => formatDate(label)}
          />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="liquidityPulseX_HEX" 
            name="Total pHEX Liquidity"
            stroke="#fff"
            dot={false} 
            strokeWidth={2}
            connectNulls={true}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="pricePulseX" 
            name="pHEX Price"
            stroke="#ff00ff"
            dot={false} 
            strokeWidth={2}
            connectNulls={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HEXLiquidityChart;