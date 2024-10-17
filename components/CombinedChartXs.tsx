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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
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

  const localLowPrice = 0.004; // Fixed local low price

  const calculateX = (price: number, current: number) => {
    if (current === 0 || Math.abs(current - price) < 1e-10) {
      return 1;
    }
    return price / current;
  };

  const highestX = calculateX(highestPrice, currentPrice);
  const lowestX = calculateX(lowestPrice, currentPrice);
  const localLowX = calculateX(localLowPrice, currentPrice);

  const customTooltip = (props: any) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      const currentPrice = payload[0].value;
      const highestX = calculateX(highestPrice, currentPrice);
      const lowestX = calculateX(lowestPrice, currentPrice);
      const localLowX = calculateX(localLowPrice, currentPrice);

      return (
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: '1px solid #fff', borderRadius: '5px', padding: '10px' }}>
          <p style={{ color: '#fff' }}>{`Date: ${payload[0].payload.date}`}</p>
          <p style={{ color: '#fff' }}>{`Price: $${currentPrice.toFixed(6)}`}</p>
          <p style={{ color: '#fff' }}>{`${highestX.toFixed(1)}X to ATH`}</p>
          <p style={{ color: '#fff' }}>{`${(1/lowestX).toFixed(0)}X from ATL`}</p>
          <p style={{ color: '#fff' }}>{`${(1/localLowX).toFixed(1)}X from local low`}</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: '100%', height: '450px', backgroundColor: '#000', padding: '20px', color: '#fff', position: 'relative' }}>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        >
          <XAxis dataKey="date" hide={true} />
          <YAxis hide={true} scale="log" domain={['auto', 'auto']} />
          <Tooltip content={customTooltip} />
          <ReferenceLine y={currentPrice} stroke="#888" strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#ff00ff"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
      <div style={{ position: 'absolute', top: '80%', right: '5%', transform: 'translateY(-50%)', fontSize: '22px', fontWeight: 'bold', color: 'rgb(153,153,153)'}}>
        <div>
        <span style={{ textDecoration: 'underline' }}>
          {lowestX === 1 ? 
            "At ATL" : 
            `${(1/lowestX).toFixed(0)}X`
          }
        </span>
        {lowestX !== 1 && " up from ATL"}
        </div>
      </div>
      <div style={{ 
        position: 'absolute', 
        top: '50%', 
        right: '5%', 
        transform: 'translateY(-50%)', 
        fontSize: '22px', 
        fontWeight: 'bold', 
        color: 'rgb(153,153,153)',
      }}>
        <span style={{ textDecoration: 'underline' }}>
          {localLowX === 1 ? 
            "At Local Low" : 
            `${(1/localLowX).toFixed(1)}X`
          }
          </span>
          {lowestX !== 1 && " up from local low"}
      </div>
      <div style={{ position: 'absolute', top: '0%', right: '5%', fontSize: '22px', fontWeight: '600', color: 'rgb(153,153,153)'}}>
        <span style={{ textDecoration: 'underline' }}>
          {highestX === 1 ? 
            "At ATH" : 
            `${highestX.toFixed(0)}X`
          }
        </span>
        {highestX !== 1 && " until ATH"}
      </div>
    </div>
  );
};

export default CombinedChartXs;
