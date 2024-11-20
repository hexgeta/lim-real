import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine, CartesianGrid } from 'recharts';

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
        console.log('Raw data:', pulsechainData);
        console.log('Sample data item:', pulsechainData[0]);

        const formattedData = pulsechainData
          .filter((item: any) => {
            // Filter data starting from PulseChain launch (May 2023)
            const date = new Date(item.date);
            return date >= new Date('2023-05-10');
          })
          .map((item: any) => {
            const dateStr = new Date(item.date).toISOString().split('T')[0];
            const plsxPrice = Number(item.pricePulseX_PLSX) || null;
            const plsPrice = Number(item.pricePulseX_PLS) || null;

            console.log(`Date: ${dateStr}`);
            console.log(`PLSX Price: ${plsxPrice}`);
            console.log(`PLS Price: ${plsPrice}`);

            let ratio = null;
            if (plsxPrice && plsPrice && plsPrice > 0) {
              ratio = plsxPrice / plsPrice;
              console.log(`Date: ${dateStr}, PLSX: ${plsxPrice}, PLS: ${plsPrice}, Ratio: ${ratio}`);
            } else {
              console.log('Could not calculate ratio - missing or invalid prices');
            }

            return {
              date: dateStr,
              ratio: ratio
            };
          });

        console.log('Formatted data:', formattedData);

        formattedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        // Filter out initial null values
        const filteredData = formattedData.reduce((acc: RatioData[], curr) => {
          if (curr.ratio !== null || acc.length > 0) {
            acc.push(curr);
          }
          return acc;
        }, []);

        console.log('Final filtered data:', filteredData);
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
          margin={{ top: 10, right: 0, left: 0, bottom: 60 }}
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
            domain={[0, 1]}
            allowDataOverflow={true}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#888', fontSize: 14, dx: -5}}
            ticks={[0, 0.2,0.4, 0.6, 0.8, 1]}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', border: 'solid 1px rgba(255, 255, 255, 0.2)', borderRadius: '5px'}}
            labelStyle={{ color: 'white' }}
            formatter={(value, name, props) => {
              const formattedValue = Number(value).toFixed(2);
              return [formattedValue, 'PLSX:PLS Ratio'];
            }}
            labelFormatter={(label) => formatDate(label)}
          />
          <Line 
            type="monotone" 
            dataKey="ratio" 
            name="PLSX:PLS Price Ratio"
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

export default PlsPlsxRatioChart;
