import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { CumBackingValueELUCKY } from '@/hooks/CumBackingValueELUCKY';
import { Skeleton } from '@/components/ui/skeleton2';

interface Props {
  title: string;
}

function DiscountChartELUCKY({ title }: Props) {
  const { data, error, isLoading } = CumBackingValueELUCKY();
  
  const [visibleLines, setVisibleLines] = useState({
    backingRatio: true,
    discount: true
  });

  const handleLegendClick = (dataKey: string) => {
    setVisibleLines(prev => ({
      ...prev,
      [dataKey]: !prev[dataKey]
    }));
  };

  const customLegend = (props: any) => {
    const { payload } = props;
    
    if (payload && data?.length > 0) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          width: '100%', 
          marginTop: '35px' 
        }}>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center' 
          }}>
            {payload.map((entry: any, index: number) => (
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
                  fontSize: '28px',
                  lineHeight: '18px',
                  display: 'flex',
                  alignItems: 'center'
                }}>●</span>
                <span style={{ 
                  color: visibleLines[entry.dataKey] ? '#fff' : '#888',
                  fontSize: '12px',
                  lineHeight: '12px'
                }}>
                  {entry.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  if (error) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="w-full h-[450px] my-10 relative">
      {isLoading ? (
        <Skeleton variant="chart" />
      ) : (
        <div className="w-full h-full p-5 border border-white/20 rounded-[15px]">
          <h2 className="text-left text-white text-2xl mb-0 ml-10">
            {title}
          </h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 30, right: 20, left: 20, bottom: 30 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(136, 136, 136, 0.2)" 
                vertical={false} 
              />
              <XAxis 
                dataKey="date"
                axisLine={{ stroke: '#888', strokeWidth: 0 }}
                tickLine={false}
                tick={{ fill: '#888', fontSize: 14, dy: 5 }}
                ticks={[data[0]?.date, data[data.length - 1]?.date]}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { 
                    month: 'short',
                    year: 'numeric'
                  });
                }}
                label={{ 
                  value: 'DATE', 
                  position: 'bottom',
                  offset: 5,
                  style: { 
                    fill: '#888',
                    fontSize: 12,
                    marginTop: '0px',
                  }
                }}
              />
              <YAxis 
                domain={[0, 2.5]}
                ticks={[0.0, 1.0, 2.0, 2.5]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#888', fontSize: 14, dx: -5}}
                tickFormatter={(value) => value.toFixed(1)}
                label={{ 
                  value: 'HEX', 
                  position: 'left',
                  angle: -90,
                  offset: 0,
                  style: { 
                    fill: '#888',
                    fontSize: 12,
                    marginTop: '0px',
                  }
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.85)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)', 
                  borderRadius: '10px'
                }}
                labelStyle={{ color: 'white' }}
                itemStyle={{ color: 'white' }}
                labelFormatter={(dateStr) => {
                  const date = new Date(dateStr);
                  const month = date.getMonth() + 1;
                  const day = date.getDate();
                  const year = date.getFullYear();
                  return `${month}/${day}/${year}`;
                }}
                formatter={(value: number) => value?.toFixed(2) || 'N/A'}
              />
              <Legend content={customLegend} />
              <Line 
                type="monotone" 
                dataKey="backingRatio" 
                name="Stake Backing"
                dot={false} 
                strokeWidth={2} 
                stroke="rgba(112, 214, 104)"
                hide={!visibleLines.backingRatio}
              />
              <Line 
                type="monotone" 
                dataKey="discount" 
                name="Market Price Ratio"
                dot={false} 
                strokeWidth={2} 
                stroke="#416F22" 
                activeDot={{ r: 4, fill: '#416F22', stroke: 'white' }}
                hide={!visibleLines.discount}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default DiscountChartELUCKY; 