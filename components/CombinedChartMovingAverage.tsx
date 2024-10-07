import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Text } from 'recharts';

interface PriceData {
  date: string;
  price: number | null;
  isPulseChainLaunched: boolean;
  cumulativeAverage: number | null;
  median: number | null;
}

const CombinedChartMovingAverage: React.FC = () => {
  const [data, setData] = useState<PriceData[]>([]);
  const [multiplier, setMultiplier] = useState<number | null>(null);

  useEffect(() => {
    const calculateCumulativeAverageAndMedian = (data: PriceData[]) => {
      let sum = 0;
      let count = 0;
      const validPrices: number[] = [];

      return data.map((item, index) => {
        if (item.price !== null) {
          sum += item.price;
          count++;
          validPrices.push(item.price);
        }

        validPrices.sort((a, b) => a - b);
        const mid = Math.floor(validPrices.length / 2);
        const median = validPrices.length % 2 !== 0 ? validPrices[mid] : (validPrices[mid - 1] + validPrices[mid]) / 2;

        return {
          ...item,
          cumulativeAverage: count > 0 ? sum / count : null,
          median: median
        };
      });
    };

    const fetchData = async () => {
      try {
        const [pulsechainResponse, ethereumResponse] = await Promise.all([
          axios.get('https://hexdailystats.com/fulldatapulsechain'),
          axios.get('https://hexdailystats.com/fulldata')
        ]);

        const pulsechainData = pulsechainResponse.data;
        const ethereumData = ethereumResponse.data;

        const ethereumMap = new Map(ethereumData.map((item: any) => [
          new Date(item.date).toISOString().split('T')[0],
          Number(item.priceUV2UV3)
        ]));

        let pulseChainLaunched = false;

        const formattedData = pulsechainData.map((item: any) => {
          const dateStr = new Date(item.date).toISOString().split('T')[0];
          const pricePulseX = Number(item.pricePulseX) || 0;
          const priceEthereum = ethereumMap.get(dateStr) || 0;

          if (pricePulseX > 0 && !pulseChainLaunched) {
            pulseChainLaunched = true;
          }

          return {
            date: dateStr,
            price: pulseChainLaunched ? pricePulseX + priceEthereum : priceEthereum,
            isPulseChainLaunched: pulseChainLaunched,
            cumulativeAverage: null,
            median: null
          };
        });

        console.log("Formatted data:", formattedData);

        formattedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const dataWithAverageAndMedian = calculateCumulativeAverageAndMedian(formattedData);
        setData(dataWithAverageAndMedian);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const validPrices = data.filter(item => item.price !== null).map(item => item.price as number);
      const lowestPrice = Math.min(...validPrices);
      const currentPrice = validPrices[validPrices.length - 1];
      const calculatedMultiplier = currentPrice / lowestPrice;
      setMultiplier(calculatedMultiplier);
    }
  }, [data]);

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  };

  return (
    <div style={{ width: '100%', height: '450px', backgroundColor: '#000', padding: '20px'}}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
        >
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={false}
          />
          <YAxis 
            stroke="#888" 
            scale="log"
            domain={['auto', 'auto']}
            allowDataOverflow={true}
            axisLine={false}
            tickLine={false}
            tick={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'solid 1px #fff', borderRadius: '5px'}}
            labelStyle={{ color: 'white' }}
            formatter={(value, name, props) => {
              const formattedValue = `$${Number(value).toFixed(6)}`;
              return [formattedValue, name];
            }}
            labelFormatter={(label) => formatDate(label)}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="price" 
            name="Combined HEX Price"
            stroke="#FF00FF"
            dot={false} 
            strokeWidth={2}
            connectNulls={true}
          />
          <Line 
            type="monotone" 
            dataKey="cumulativeAverage" 
            name="Average Price"
            stroke="#FFFFFF"
            dot={false} 
            strokeWidth={2}
            connectNulls={true}
          />
          <Line 
            type="monotone" 
            dataKey="median" 
            name="Median Price"
            stroke="#00FFFF"
            dot={false} 
            strokeWidth={2}
            connectNulls={true}
          />
          {multiplier !== null && (
            <Text
              x={50}
              y={50}
              fill="#FFFFFF"
              fontSize={16}
            >
              {`${multiplier.toFixed(2)}X from lowest`}
            </Text>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CombinedChartMovingAverage;