import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PriceData {
  date: string;
  pricePulseX: number | null;
  priceEthereum: number | null;
  combinedPrice: number | null;
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

        const ethereumMap = new Map(ethereumData.map((item: any) => [
          new Date(item.date).toISOString().split('T')[0],
          Number(item.priceUV2UV3)
        ]));

        let firstPulseChainPriceFound = false;

        const formattedData = pulsechainData.map((item: any) => {
          const dateStr = new Date(item.date).toISOString().split('T')[0];
          const pricePulseX = Number(item.pricePulseX) || null;
          const priceEthereum = ethereumMap.get(dateStr) || null;

          if (pricePulseX && pricePulseX > 0) {
            firstPulseChainPriceFound = true;
          }

          return {
            date: dateStr,
            pricePulseX: pricePulseX,
            priceEthereum: priceEthereum,
            combinedPrice: firstPulseChainPriceFound && pricePulseX !== null && priceEthereum !== null
              ? Number(pricePulseX) + Number(priceEthereum)
              : null
          };
        });

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

  return (
    <div style={{ width: '100%', height: '490px', backgroundColor: '#000', padding: '0px'}}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 50, left: 0, bottom: 10 }}
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
            axisLine={false}
            tickLine={false}
            tick={false}
          />
          <Tooltip 
            labelStyle={{ color: 'white' }}
            itemStyle={{
              color: '#FFFFFF',
              fillOpacity: 1,
              strokeOpacity: 1,
            }}
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            }}
            formatter={(value, name) => {
              const color = name === "Ethereum Price" ? '#00FFFF' : 
                            name === "PulseChain Price" ? '#FF00FF' : '#FFFFFF';
              return [value, name, color];
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="pricePulseX" 
            name="pHEX Price"
            stroke="#FF00FF" 
            dot={false} 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="priceEthereum" 
            name="eHEX Price"
            stroke="#00FFFF" 
            dot={false} 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="combinedPrice" 
            name="Combined HEX Price"
            stroke="#FFFFFF" 
            dot={false} 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HEXPriceChart2;