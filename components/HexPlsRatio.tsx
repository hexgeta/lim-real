import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { CartesianGrid, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

interface PriceData {
  date: string;
  priceRatio: number | null;
}

const HEXtoPLSRatioChart: React.FC = () => {
  const [data, setData] = useState<PriceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://hexdailystats.com/fulldatapulsechain');
        const pulsechainData = response.data;

        const formattedData = pulsechainData.map((item: any) => {
          const dateStr = new Date(item.date).toISOString().split('T')[0];
          const pHexPrice = Number(item.pricePulseX) || null;
          const plsPrice = Number(item.pricePulseX_PLS) || null;

          let priceRatio = null;
          if (pHexPrice && plsPrice && plsPrice > 0) {
            priceRatio = pHexPrice / plsPrice;
          }

          return {
            date: dateStr,
            priceRatio: priceRatio
          };
        });

        formattedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setData(formattedData.filter(item => item.priceRatio !== null));
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
          margin={{ top: 20, right: 0, left: 0, bottom: 60 }}
        >
                    <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(136, 136, 136, 0.2)" 
            vertical={false} 
          />
          <XAxis 
            dataKey="date" 
            axisLine={{ stroke: '#888', strokeWidth: 0 }}
            tickLine={{ stroke: '#424242', strokeWidth: 1}}
            tick={{ fill: '#888', fontSize: 14, dy: 10 }}
            interval={100}
          />
          <YAxis 
            stroke="#888" 
            domain={[0, 'auto']}
            allowDataOverflow={true}
            axisLine={false}
            tickLine={{ stroke: '#888', strokeWidth: 0 }}
            tick={{ fill: '#888', fontSize: 14, dx: -5}}
            ticks={[0, 100, 200, 300, 400, 500, 600]}
            interval={0}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', border: 'solid 1px rgba(255, 255, 255, 0.2)', borderRadius: '5px'}}
            labelStyle={{ color: 'white' }}
            formatter={(value, name, props) => {
              const formattedValue = Number(value).toFixed(0);
              return [formattedValue, 'HEX:PLS Ratio'];
            }}
            labelFormatter={(label) => formatDate(label)}
          />
          <Line 
            type="monotone" 
            dataKey="priceRatio" 
            name="HEX:PLS Price Ratio"
            stroke="#fff"
            dot={false} 
            strokeWidth={2}
            connectNulls={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HEXtoPLSRatioChart;