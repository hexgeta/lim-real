import React, { useEffect, useState, useMemo} from 'react';
import { supabase } from '../supabaseClient';
import {
  LineChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer
} from 'recharts';

function DiscountChart({ 
  tableName, 
  title, 
  xAxisKey = 'Day', 
  yAxis1Key = 'Discount/Premium', 
  yAxis2Key = 'Backing Value',
  yAxisDomain = [0, 2.5]
}) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: response, error } = await supabase.from(tableName).select('*');
        if (error) throw error;
        
        const formattedData = response.map((item) => ({
          day: item[xAxisKey],
          discount: parseFloat(item[yAxis1Key]),
          backingValue: parseFloat(item[yAxis2Key]),
        }));
        
        setData(formattedData.sort((a, b) => a.day - b.day));
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tableName, xAxisKey, yAxis1Key, yAxis2Key]);

  const xAxisTicks = useMemo(() => {
    if (!data?.length) return [];
    
    const firstDay = data[0].day;
    const lastDay = data[data.length - 1].day;
    const ticks = [firstDay];

    const startDay = Math.ceil(firstDay / 100) * 100;
    for (let day = startDay; day < lastDay; day += 100) {
      if (day > firstDay) {
        ticks.push(day);
      }
    }

    if (ticks[ticks.length - 1] !== lastDay) {
      ticks.push(lastDay);
    }

    return ticks;
  }, [data]);

  if (isLoading) {
    return <div style={{ color: 'white' }}>Loading...</div>;
  }

  return (
    <div style={{ width: '100%', height: 450, margin: '40px 0px 40px 00px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '15px' }}>
      <h2 style={{ textAlign: 'left', color: 'white', fontSize: '24px', marginBottom: '0px', marginLeft: '40px'}}>
        {title}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 30, right: 20, left: 20, bottom: 60 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(136, 136, 136, 0.2)" 
            vertical={false} 
          />
          <XAxis 
            dataKey="day" 
            axisLine={{ stroke: '#888', strokeWidth: 0 }}
            tickLine={{ stroke: '#888', strokeWidth: 0}}
            tick={{ fill: '#888', fontSize: 14, dy: 5 }}
            ticks={xAxisTicks}
          />
          <YAxis 
            domain={yAxisDomain} 
            ticks={[0, 0.5, 1, 1.5, 2, 2.5]}
            axisLine={false}
            tickLine={{ stroke: '#888', strokeWidth: 0 }}
            tick={{ fill: '#888', fontSize: 14, dx: -5}}
            tickFormatter={(value) => `${value.toFixed(1)}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '10px'}}
            labelStyle={{ color: 'white' }}
            itemStyle={{ color: 'white' }}
          />
                    <Legend 
            wrapperStyle={{ 
              paddingTop: '20px',  // Add space above the legend
              marginTop: '20px'    // Additional margin if needed
            }}
          />
          <Area 
            type="monotone" 
            dataKey="backingValue" 
            stroke="rgb(255, 205, 86)" 
            fillOpacity={0.3}
            fill="rgb(255, 205, 86)" 
          />
          <Area 
            type="monotone" 
            dataKey="discount" 
            stroke="white" 
            fillOpacity={0.3}
            fill="white" 
          />
          <Line type="monotone" dataKey="backingValue" name="Backing Value in HEX" dot={false} strokeWidth={2} stroke="rgb(255, 205, 86)" activeDot={{ r: 4, fill: 'rgb(255, 205, 86)', stroke: 'white' }}/>
          <Line type="monotone" dataKey="discount" name="Market Value in HEX" dot={false} strokeWidth={2} stroke="white" activeDot={{ r: 4, fill: 'rgb(234, 67, 53)', stroke: 'white' }}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


export default DiscountChart;