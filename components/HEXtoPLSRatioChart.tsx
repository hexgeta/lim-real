import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

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

  const maxRatio = useMemo(() => {
    return Math.max(...data.map(item => item.priceRatio || 0)) + 1;
  }, [data]);

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Invalid Date';
    const [year, month, day] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  };

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
          <p>1 HEX = {ratio} PLS</p>
        </div>
      );
    }
    return null;
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
            stroke="#888" 
            domain={[100, (dataMax: number) => Math.max(dataMax, 100) + 200]}
            axisLine={false}
            tickLine={false}
            tick={false}
          />
          <Tooltip 
            content={<CustomTooltip formatDate={formatDate} />} 
            labelStyle={{ color: 'white' }}
            formatter={(value, name, props) => {
              if (value !== null) {
                const ratio = Number(value).toFixed(4);
                return [`1 PLS = ${ratio} pHEX`, ''];
              }
              return ['N/A', ''];
            }}
            labelFormatter={(label) => formatDate(label)}
          />
          <Legend />
          <ReferenceLine 
            y={100} 
            stroke="#888" 
            strokeDasharray="3 3" 
            label={{ 
              value: '100 PLS', 
              position: 'left', 
              offset: 10, 
              fill: '#888', 
              fontSize: 12,
              dy: 0
            }}
          />
                    <ReferenceLine 
            y={200} 
            stroke="#888" 
            strokeDasharray="3 3" 
            label={{ 
              value: '200 PLS', 
              position: 'left', 
              offset: 10, 
              fill: '#888', 
              fontSize: 12,
              dy: 0
            }}
          />
                    <ReferenceLine 
            y={300} 
            stroke="#888" 
            strokeDasharray="3 3" 
            label={{ 
              value: '300 PLS', 
              position: 'left', 
              offset: 10, 
              fill: '#888', 
              fontSize: 12,
              dy: 0
            }}
          />
                              <ReferenceLine 
            y={400} 
            stroke="#888" 
            strokeDasharray="3 3" 
            label={{ 
              value: '400 PLS', 
              position: 'left', 
              offset: 10, 
              fill: '#888', 
              fontSize: 12,
              dy: 0
            }}
          />
          <Line 
            type="monotone" 
            dataKey="priceRatio" 
            name="pHEX/PLS Price Ratio"
            stroke="#FFFFFF" 
            dot={false} 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HEXtoPLSRatioChart;
