import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

interface PriceData {
  date: string;
  priceRatio: number | null;
}

const HEXPriceRatioChart: React.FC = () => {
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

        const formattedData = pulsechainData.map((item: any) => {
          const dateStr = new Date(item.date).toISOString().split('T')[0];
          const pricePulseX = Number(item.pricePulseX) || null;
          const priceEthereum = ethereumMap.get(dateStr) || null;

          let priceRatio = null;
          if (pricePulseX && priceEthereum && pricePulseX > 0) {
            priceRatio = priceEthereum / pricePulseX;
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
      }
    };

    fetchData();
  }, []);

  const maxRatio = useMemo(() => {
    return Math.max(...data.map(item => item.priceRatio || 0)) + 1;
  }, [data]);

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  };

  // Add this custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const ratio = Number(payload[0].value).toFixed(4);
      return (
        <div style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
          border: 'solid 1px #fff', 
          borderRadius: '5px',
          padding: '10px',
          color: 'white'
        }}>
          <p>{formatDate(label)}</p>
          <p>1 eHEX = {ratio} pHEX</p>
        </div>
      );
    }
    return null;
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
            domain={[0, maxRatio]}
            axisLine={false}
            tickLine={false}
            tick={false}
          />
          <Tooltip 
            content={<CustomTooltip />}
            labelStyle={{ color: 'white' }}
            formatter={(value, name, props) => {
              if (value !== null) {
                const ratio = Number(value).toFixed(4);
                return [`1 eHEX = ${ratio} pHEX`, ''];
              }
              return ['N/A', ''];
            }}
            labelFormatter={(label) => formatDate(label)}
          />
          <Legend />
          <ReferenceLine y={1} stroke="#888" strokeDasharray="3 3" label={{ value: '1:1', position: 'top', offset: 6, fill: '#888', fontSize: 20 }}/>
          <Line 
            type="monotone" 
            dataKey="priceRatio" 
            name="eHEX:pHEX Price Ratio"
            stroke="#FFFFFF" 
            dot={false} 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HEXPriceRatioChart;