import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

interface PriceData {
  date: string;
  price: number | null;
  isPulseChainLaunched: boolean;
}

const CombinedChartAverage: React.FC = () => {
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
            isPulseChainLaunched: pulseChainLaunched
          };
        });

        console.log("Formatted data:", formattedData);

        formattedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  };

  const medianPrice = useMemo(() => {
    if (data.length === 0) return 0;
    const sortedPrices = data.map(d => d.price).sort((a, b) => a - b);
    const mid = Math.floor(sortedPrices.length / 2);
    return sortedPrices.length % 2 !== 0 ? sortedPrices[mid] : (sortedPrices[mid - 1] + sortedPrices[mid]) / 2;
  }, [data]);

  const { lowestPrice, highestPrice, currentPrice } = useMemo(() => {
    if (data.length === 0) return { lowestPrice: 0, highestPrice: 0, currentPrice: 0 };
    const prices = data.map(d => d.price).filter(p => p !== null) as number[];
    return {
      lowestPrice: Math.min(...prices),
      highestPrice: Math.max(...prices),
      currentPrice: prices[prices.length - 1]
    };
  }, [data]);

  const calculateX = (from: number, to: number) => {
    if (from === 0 || to === 0) return 0;
    return Math.round((to / from - 1) * 100) / 100;
  };

  const xToLowest = calculateX(lowestPrice, currentPrice);
  const xToHighest = calculateX(currentPrice, highestPrice);

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
              const medianInfo = `Median: $${medianPrice.toFixed(6)}`;
              return [
                <span>{formattedValue} <br/> {medianInfo}</span>,
                props.payload.isPulseChainLaunched ? 'Combined HEX Price' : 'eHEX Price'
              ];
            }}
            labelFormatter={(label) => formatDate(label)}
          />
          <Legend />
          <ReferenceLine y={medianPrice} stroke="#888" strokeDasharray="3 3" label={{ value: 'Median', position: 'insideTopLeft', fill: '#888' }} />
          <ReferenceLine y={lowestPrice} stroke="#00FF00" strokeDasharray="3 3" label={{ value: `Lowest: $${lowestPrice.toFixed(6)}`, position: 'insideBottomLeft', fill: '#00FF00' }} />
          <ReferenceLine y={currentPrice} stroke="#FFFF00" strokeDasharray="3 3" label={{ value: `Current: $${currentPrice.toFixed(6)}`, position: 'insideBottomLeft', fill: '#FFFF00' }} />
          <ReferenceLine y={highestPrice} stroke="#FF0000" strokeDasharray="3 3" label={{ value: `Highest: $${highestPrice.toFixed(6)}`, position: 'insideTopLeft', fill: '#FF0000' }} />
          <Line 
            type="monotone" 
            dataKey="price" 
            name="Combined HEX Price"
            stroke="#FFFFFF"
            dot={false} 
            strokeWidth={2}
            connectNulls={true}
          />
        </LineChart>
      </ResponsiveContainer>
      <div style={{ color: '#FFFFFF', textAlign: 'center', marginTop: '10px' }}>
        <span style={{ color: '#00FF00' }}>X to Lowest: {xToLowest}x</span>
        {' | '}
        <span style={{ color: '#FF0000' }}>X to Highest: {xToHighest}x</span>
      </div>
    </div>
  );
};

export default CombinedChartAverage;
