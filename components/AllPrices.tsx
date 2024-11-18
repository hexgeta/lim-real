import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.85)', 
        border: '1px solid rgba(255, 255, 255, 0.2)', 
        borderRadius: '10px',
        padding: '10px'
      }}>
        <p style={{ color: 'white', margin: '0 0 5px' }}>{`Date: ${label}`}</p>
        {payload.map((entry, index) => (
          entry.value && (
            <p key={index} style={{ color: 'white', margin: '3px 0' }}>
              <span style={{ color: entry.color }}>●</span>
              {` ${entry.name}: ${Number(entry.value).toFixed(4)}`}
            </p>
          )
        ))}
      </div>
    );
  }
  return null;
};

function PriceChart({ 
  tableName = 'maxi_prices',
  title = 'Token Prices'
}) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleLines, setVisibleLines] = useState({
    pHEX: true,
    pMAXI: true,
    pDECI: true,
    pLUCKY: true,
    pTRIO: true,
    pBASE: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data from:', tableName);
        const { data: response, error } = await supabase
          .from(tableName)
          .select('*')
          .order('date', { ascending: true });
        
        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        console.log('Raw response:', response); // Debug log
        
        if (!response || response.length === 0) {
          console.log('No data returned from Supabase');
          return;
        }

        const formattedData = response.map((item) => ({
          date: item.date,
          pHEX: Number(item.pHEX),
          pMAXI: Number(item.pMAXI),
          pDECI: Number(item.pDECI),
          pLUCKY: Number(item.pLUCKY),
          pTRIO: Number(item.pTRIO),
          pBASE: Number(item.pBASE)
        }));
        
        console.log('Formatted data:', formattedData); // Debug log
        
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tableName]);

  const handleLegendClick = (dataKey) => {
    setVisibleLines(prev => ({
      ...prev,
      [dataKey]: !prev[dataKey]
    }));
  };

  const customLegend = (props) => {
    const { payload } = props;
    
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        width: '100%', 
        marginTop: '40px',
        marginBottom: '0px'
      }}>
        <ul style={{ 
          listStyle: 'none', 
          padding: 0, 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center' 
        }}>
          {payload.map((entry, index) => (
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
  };

  if (isLoading) {
    return <div style={{ color: 'white' }}>Loading...</div>;
  }

  return (
    <div style={{ width: '100%', height: 450, margin: '40px 0px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '15px' }}>
      <h2 style={{ textAlign: 'left', color: 'white', fontSize: '24px', marginBottom: '0px', marginLeft: '40px'}}>
        {title}</h2>
      <ResponsiveContainer width="100%" height="100%" debounce={1}>
        <LineChart data={data} margin={{ top: 30, right: 20, left: 20, bottom: 60 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(136, 136, 136, 0.2)" 
            vertical={false} 
          />
          <XAxis 
            dataKey="date" 
            axisLine={{ stroke: '#888', strokeWidth: 0 }}
            tickLine={{ stroke: '#888', strokeWidth: 0}}
            tick={{ fill: '#888', fontSize: 14, dy: 5 }}
            type="category"
            label={{ 
              value: 'DATE', 
              position: 'bottom',
              offset: 10,
              style: { fill: '#888', fontSize: 12 }
            }}
          />
          <YAxis 
            domain={[0, 10]}
            axisLine={false}
            tickLine={{ stroke: '#888', strokeWidth: 1 }}
            tick={{ fill: '#888', fontSize: 14, dx: -5}}
            tickFormatter={(value) => `${value.toFixed(4)}`}
            label={{ 
              value: 'PRICE', 
              position: 'left',
              angle: -90,
              offset: 0,
              style: { fill: '#888', fontSize: 12 }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={customLegend} />
          
          <Line 
            type="monotone" 
            dataKey="pHEX" 
            name="pHEX" 
            dot={false} 
            strokeWidth={2} 
            stroke="#FF4C4C"
            hide={!visibleLines.pHEX}
          />
          <Line 
            type="monotone" 
            dataKey="pMAXI" 
            name="pMAXI" 
            dot={false} 
            strokeWidth={2} 
            stroke="#4CAF50"
            hide={!visibleLines.pMAXI}
          />
          <Line 
            type="monotone" 
            dataKey="pDECI" 
            name="pDECI" 
            dot={false} 
            strokeWidth={2} 
            stroke="#2196F3"
            hide={!visibleLines.pDECI}
          />
          <Line 
            type="monotone" 
            dataKey="pLUCKY" 
            name="pLUCKY" 
            dot={false} 
            strokeWidth={2} 
            stroke="#9C27B0"
            hide={!visibleLines.pLUCKY}
          />
          <Line 
            type="monotone" 
            dataKey="pTRIO" 
            name="pTRIO" 
            dot={false} 
            strokeWidth={2} 
            stroke="#FF9800"
            hide={!visibleLines.pTRIO}
          />
          <Line 
            type="monotone" 
            dataKey="pBASE" 
            name="pBASE" 
            dot={false} 
            strokeWidth={2} 
            stroke="#607D8B"
            hide={!visibleLines.pBASE}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PriceChart;