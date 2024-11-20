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
  const [currentLiquidity, setCurrentLiquidity] = useState<number | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch historical data
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

        // Fetch live data
        const liveResponse = await axios.get('https://hexdailystats.com/livedata');
        const liveData = liveResponse.data;

        // Append live data to the dataset
        const today = new Date().toISOString().split('T')[0];
        formattedData.push({
          date: today,
          liquidityPulseX_HEX: liveData.liquidityHEX_Pulsechain || null,
          pricePulseX: liveData.price_Pulsechain || null
        });

        // After setting the formatted data, get the current values
        if (formattedData.length > 0) {
          const lastDataPoint = formattedData[formattedData.length - 1];
          setCurrentLiquidity(lastDataPoint.liquidityPulseX_HEX);
          setCurrentPrice(lastDataPoint.pricePulseX);
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

  // Function to format millions
  const formatToMillions = (value: number | null): string => {
    if (!value) return '0M';
    return `${(value / 1000000).toFixed(0)}M`;
  };

  // Function to format price
  const formatPrice = (value: number | null): string => {
    if (!value) return '$0.000';
    return `$${value.toFixed(3)}`;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: '100%', height: '450px', backgroundColor: '#000', padding: '0px'}}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 0, left: 0, bottom: 80 }}
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
            contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', border: 'solid 1px rgba(255, 255, 255, 0.2)', borderRadius: '5px'}}
            labelStyle={{ color: 'white' }}
            formatter={(value: any, name: string) => {
              if (name.includes('pHEX Price')) {
                return [`$${Number(value).toFixed(3)}`, name];
              } else if (name.includes('Total pHEX Liquidity')) {
                const billions = Number(value) / 1000000000;
                const millions = Number(value) / 1000000;
                
                if (millions >= 1000) {
                  // If over 1000M, show as billions
                  return [`${billions.toFixed(2)}B`, name];
                } else {
                  // Otherwise show as millions
                  return [`${millions.toFixed(0)}M`, name];
                }
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
            name={`Total pHEX Liquidity (${formatToMillions(currentLiquidity)} HEX)`}
            stroke="#fff"
            dot={false} 
            strokeWidth={2}
            connectNulls={true}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="pricePulseX" 
            name={`pHEX Price (${formatPrice(currentPrice)})`}
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