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
    </div>
  );
};

export default CombinedChartAverage;