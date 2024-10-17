import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface PriceData {
  date: string;
  price: number | null;
  isPulseChainLaunched: boolean;
}

const CombinedChartXs: React.FC = () => {
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

  const highestPrice = useMemo(() => {
    if (data.length === 0) return 0;
    return Math.max(...data.map(d => d.price || 0));
  }, [data]);

  const lowestPrice = useMemo(() => {
    if (data.length === 0) return 0;
    return Math.min(...data.map(d => d.price || 0));
  }, [data]);

  const currentPrice = useMemo(() => {
    if (data.length === 0) return 0;
    return data[data.length - 1].price || 0;
  }, [data]);

  const calculateX = (price: number) => {
    if (currentPrice === 0) return 0;
    return Math.round((price / currentPrice) * 100) / 100;
  };

  const highestX = calculateX(highestPrice);
  const lowestX = calculateX(lowestPrice);

  return (
    <div style={{ width: '100%', height: '450px', backgroundColor: '#000', padding: '20px', color: '#fff', position: 'relative' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Combined HEX Price (All-time Median)</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="date" hide={true} />
          <YAxis hide={true} scale="log" domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: '1px solid #fff' }}
            labelStyle={{ color: '#fff' }}
            formatter={(value) => [`$${Number(value).toFixed(6)}`, 'Price']}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#fff"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
      <div style={{ position: 'absolute', top: '70%', right: '10%', transform: 'translateY(-50%)' }}>
        <div>5X from ATL</div>
      </div>
      <div style={{ position: 'absolute', top: '30%', right: '10%' }}>
        <div>{highestX.toFixed(0)}X to ATH</div>
      </div>
    </div>
  );
};

export default CombinedChartXs;
