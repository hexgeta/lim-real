"use client"

import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { supabase } from '../supabaseClient';

interface TokenData {
  date: string;
  hexX: number;
  btcX: number;
  ethX: number;
  solX: number;
}

const VsGains: React.FC = () => {
  const [data, setData] = useState<TokenData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleLines, setVisibleLines] = useState({
    hexX: true,
    btcX: true,
    ethX: true,
    solX: true
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: baselineData, error: baselineError } = await supabase
        .from('historic_prices')
        .select('*')
        .eq('date', '2024-09-07T00:00:00.000Z')
        .single();

      if (baselineError) {
        console.error('Error fetching baseline data:', baselineError);
        setError(baselineError.message);
        setIsLoading(false);
        return;
      }

      const baselines = {
        btc: baselineData.btc_price,
        eth: baselineData.eth_price,
        hex: baselineData.hex_price,
        sol: baselineData.sol_price
      };

      const { data: historicPrices, error } = await supabase
        .from('historic_prices')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } else {
        const formattedData = historicPrices.map((item) => ({
          date: item.date,
          hexX: (item.hex_price / baselines.hex),
          btcX: (item.btc_price / baselines.btc),
          ethX: (item.eth_price / baselines.eth),
          solX: (item.sol_price / baselines.sol),
        }));
        
        setData(formattedData);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleLegendClick = (dataKey: string) => {
    setVisibleLines(prev => ({
      ...prev,
      [dataKey]: !prev[dataKey]
    }));
  };

  const customLegend = (props: LegendProps) => {
    const { payload } = props;
    
    if (payload && data.length > 0) {
      const latestData = data[data.length - 1]; // Get the most recent data point

      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          width: '100%', 
          marginTop: '10px' 
        }}>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center' 
          }}>
            {payload.map((entry, index) => {
              // Get the corresponding X value based on the dataKey
              const xValue = latestData[entry.dataKey];
              const formattedX = xValue !== undefined ? `(${xValue.toFixed(2)}X)` : '';
              
              return (
                <li 
                  key={`item-${index}`}
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    marginRight: 20, 
                    marginBottom: 5,
                    cursor: 'pointer' 
                  }}
                  onClick={() => handleLegendClick(entry.dataKey)}
                >
                  <span style={{ 
                    color: entry.color, 
                    marginRight: 5,
                    fontSize: '24px',
                    lineHeight: '1'
                  }}>●</span>
                  <span style={{ 
                    color: visibleLines[entry.dataKey] ? '#fff' : '#888',
                    fontSize: '14px'
                  }}>
                    {entry.value} {formattedX}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = (props: any) => {
    const { points } = props;
    if (!points || points.length === 0) return null;

    // Get the last point of the line
    const lastPoint = points[points.length - 1];
    if (!lastPoint) return null;

    const icons = {
      hexX: (
        <g transform={`translate(${lastPoint.x + 10},${lastPoint.y - 8})`}>
          <circle r="8" fill="#ff00ff" />
          <text 
            x="0" 
            y="0" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            fill="white" 
            fontSize="10"
          >
            H
          </text>
        </g>
      ),
      btcX: (
        <g transform={`translate(${lastPoint.x + 10},${lastPoint.y - 8})`}>
          <circle r="8" fill="#f7931a" />
          <text 
            x="0" 
            y="0" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            fill="white" 
            fontSize="10"
          >
            ₿
          </text>
        </g>
      ),
      ethX: (
        <g transform={`translate(${lastPoint.x + 10},${lastPoint.y - 8})`}>
          <circle r="8" fill="#00FFFF" />
          <text 
            x="0" 
            y="0" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            fill="white" 
            fontSize="10"
          >
            Ξ
          </text>
        </g>
      ),
      solX: (
        <g transform={`translate(${lastPoint.x + 10},${lastPoint.y - 8})`}>
          <circle r="8" fill="#14F195" />
          <text 
            x="0" 
            y="0" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            fill="white" 
            fontSize="10"
          >
            S
          </text>
        </g>
      )
    };

    return icons[props.dataKey];
  };

  if (isLoading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div style={{ width: '100%', height: '450px', backgroundColor: '#000', padding: '20px', color: '#fff', position: 'relative' }}>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={data}
          margin={{ top: 15, right: 0, left: 0, bottom: 20 }}
        >
          <XAxis 
            dataKey="date" 
            stroke="#888"
            axisLine={{ stroke: '#888', strokeWidth: 0 }}
            tickLine={{ stroke: '#333' }}
            tick={{ fill: '#888', fontSize: 14, dy: 10 }}
            tickFormatter={(date) => new Date(date).toLocaleDateString('en-UK', { 
              day: 'numeric', 
              month: 'short',
              year: '2-digit'
            })}
            ticks={data.reduce((acc, item, index) => {
              const currentDate = new Date(item.date);
              const isFirstDate = index === 0;
              const isLastDate = index === data.length - 1;
              const isFirstOfMonth = currentDate.getDate() === 1;
              
              if (isFirstDate || isLastDate || isFirstOfMonth) {
                acc.push(item.date);
              }
              
              return acc;
            }, [] as string[])}
          />
          <YAxis 
            tickFormatter={(value) => `${value.toFixed(1)}X`}
            stroke="#888"
            axisLine={{ stroke: '#888', strokeWidth: 0 }}
            tickLine={false}
            tick={(props) => {
              return (
                <text
                  x={props.x}
                  y={props.y}
                  dy={4}
                  textAnchor="end"
                  fill="#888"
                  fontSize={14}
                >
                  {`${props.payload.value.toFixed(visibleLines.hexX ? 0 : 1)}X`}
                </text>
              );
            }}
            domain={[1, 'auto']}
          />
          <CartesianGrid 
            stroke="rgba(136, 136, 136, 0.2)" 
            vertical={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.75)', 
              border: '1px solid rgba(255, 255, 255, 0.2)', 
              borderRadius: '10px', 
              padding: '10px',
              color: '#fff',
              boxShadow: '0 0 10px rgba(0,0,0,0.5)'
            }}
            formatter={(value: number, name: string) => {
              const color = name === 'HEX' ? '#ff00ff' : 
                           name === 'BTC' ? '#f7931a' : 
                           name === 'ETH' ? '#00FFFF' : 
                           '#14F195';
              return [
                <span style={{ color }}>
                  {name} : {value.toFixed(1)}X
                </span>
              ];
            }}
            labelFormatter={(label) => (
              <div style={{ 
                marginBottom: '5px',
                fontSize: '14px',
                color: '#fff'
              }}>
                {label.split('T')[0]}
              </div>
            )}
          />
          <Legend content={customLegend} />
          <Line 
            type="monotone" 
            dataKey="hexX" 
            stroke="#ff00ff" 
            strokeWidth={2}
            dot={false}
            name="HEX"
            hide={!visibleLines.hexX}
            label={renderCustomizedLabel}
          />
          <Line 
            type="monotone" 
            dataKey="btcX" 
            stroke="#f7931a" 
            strokeWidth={2}
            dot={false}
            name="BTC"
            hide={!visibleLines.btcX}
            label={renderCustomizedLabel}
          />
          <Line 
            type="monotone" 
            dataKey="ethX" 
            stroke="#00FFFF" 
            strokeWidth={2}
            dot={false}
            name="ETH"
            hide={!visibleLines.ethX}
            label={renderCustomizedLabel}
          />
          <Line 
            type="monotone" 
            dataKey="solX" 
            stroke="#14F195" 
            strokeWidth={2}
            dot={false}
            name="SOL"
            hide={!visibleLines.solX}
            label={renderCustomizedLabel}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VsGains;

