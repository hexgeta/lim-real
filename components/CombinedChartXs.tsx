import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface PriceData {
  date: string;
  price: number | null;
  isPulseChainLaunched: boolean;
}

interface XCalculations {
  toATH: number;
  fromATL: number;
  fromLocalLow: number;
}

const calculateXs = (currentPrice: number, highestPrice: number, lowestPrice: number, localLowPrice: number): XCalculations => {
  const calculateX = (price: number, current: number) => {
    if (current === 0 || Math.abs(current - price) < 1e-10) {
      return 0;
    }
    return (price / current) - 1;
  };

  const toATH = calculateX(highestPrice, currentPrice);
  const fromATL = calculateX(currentPrice, lowestPrice);
  const fromLocalLow = calculateX(currentPrice, localLowPrice);

  return {
    toATH: toATH, // Add 1 to get the correct multiplier
    fromATL: fromATL,
    fromLocalLow: fromLocalLow,
  };
};

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

  const xCalculations = useMemo(() => {
    return calculateXs(currentPrice, highestPrice, lowestPrice, localLowPrice);
  }, [currentPrice, highestPrice, lowestPrice, localLowPrice]);

  const customTooltip = (props: any) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      const currentPrice = payload[0].value;
      const tooltipXs = calculateXs(currentPrice, highestPrice, lowestPrice, localLowPrice);

      return (
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: '1px solid #fff', borderRadius: '5px', padding: '10px' }}>
          <p style={{ color: '#fff' }}>{`Date: ${payload[0].payload.date}`}</p>
          <p style={{ color: '#fff' }}>{`Price: $${currentPrice.toFixed(4)}`}</p>
          <p style={{ color: '#fff' }}>{`${tooltipXs.toATH.toFixed(1)}X until ATH`}</p>
          <p style={{ color: '#fff' }}>{`${tooltipXs.fromATL.toFixed(0)}X up from ATL`}</p>
          <p style={{ color: '#fff' }}>{`${tooltipXs.fromLocalLow.toFixed(1)}X up from local low`}</p>
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
      {/* Labels container */}
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: 1 }}>
        <div style={{ position: 'absolute', top: '62%', right: '5%', transform: 'translateY(-50%)', fontSize: '22px', fontWeight: 'bold', color: 'rgb(153,153,153)'}}>
          <div>
            <span style={{ textDecoration: 'underline' }}>
              {xCalculations.fromATL === 1 ? "At ATL" : `${xCalculations.fromATL.toFixed(0)}X`}
            </span>
            {xCalculations.fromATL !== 1 && " up from ATL"}
          </div>
        </div>
        <div style={{ 
          position: 'absolute', 
          top: '52%', 
          right: '5%', 
          transform: 'translateY(-50%)', 
          fontSize: '22px', 
          fontWeight: 'bold', 
          color: 'rgb(153,153,153)',
        }}>
          <span style={{ textDecoration: 'underline' }}>
            {xCalculations.fromLocalLow === 1 ? "At Local Low" : `${xCalculations.fromLocalLow.toFixed(1)}X`}
          </span>
          {xCalculations.fromLocalLow !== 1 && " up from local low"}
        </div>
        <div style={{ position: 'absolute', top: '2%', right: '40%', fontSize: '22px', fontWeight: '600', color: 'rgb(153,153,153)'}}>
          <span style={{ textDecoration: 'underline' }}>
            {xCalculations.toATH === 1 ? "At ATH" : `${xCalculations.toATH.toFixed(1)}X`}
          </span>
          {xCalculations.toATH !== 1 && " until ATH"}
        </div>
      </div>

      {/* Chart container */}
      <div style={{ position: 'relative', zIndex: 2, height: '100%' }}>
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
      </div>
    </div>
  );
};

export default CombinedChartXs;
