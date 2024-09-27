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

    //   // Use static data for testing
  // useEffect(() => {
  //   const formattedData = [
  //     { day: 881, discount: 1.0, backingValue: 1.0 },
  //     { day: 997, discount: 2.0, backingValue: 1.1 },
  //     { day: 1113, discount: 1.5, backingValue: 1.2 },
  //     { day: 1229, discount: 1.3, backingValue: 1.3 },
  //     { day: 1345, discount: 1.4, backingValue: 1.4 },
  //     { day: 1461, discount: 1.5, backingValue: 1.5 },
  //     { day: 1577, discount: 1.2, backingValue: 1.6 },
  //     { day: 1693, discount: 1.3, backingValue: 1.7 },
  //   ];

  //   // Set static data to the state
  //   setData(formattedData);
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from(tableName).select('*');
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        const formattedData = data.map((item) => ({
          day: item[xAxisKey],
          discount: parseFloat(item[yAxis1Key]),
          backingValue: parseFloat(item[yAxis2Key]),
        }));
        
        // Sort the data by day
        const sortedData = formattedData.sort((a, b) => a.day - b.day);
        
        setData(sortedData);
      }
    };
    fetchData();
  }, [tableName, xAxisKey, yAxis1Key, yAxis2Key]);


  const xAxisTicks = useMemo(() => {
    if (data.length === 0) return [];
    
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


  return (
    <div style={{ width: '100%', height: 400, margin: '100px 200px 100px 0px'}}>
      <h2 style={{ textAlign: 'left', color: 'white', fontSize: '24px', marginBottom: '20px', marginLeft: '40px'}}>
        {title}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="day" ticks={xAxisTicks} tickFormatter={(tick) => tick.toString()}/>
          <YAxis domain={yAxisDomain} ticks={[0, 0.5, 1, 1.5, 2, 2.5]}/>
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: '1px solid white', borderRadius: '10px'}}
            labelStyle={{ color: 'white' }}
            itemStyle={{ color: 'white' }}
          />
          <Legend />
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
          <Line type="monotone" dataKey="backingValue" name="Backing Value (Principle + Yield)" dot={false} strokeWidth={2} stroke="rgb(255, 205, 86)" activeDot={{ r: 4, fill: 'rgb(255, 205, 86)', stroke: 'white' }}/>
          <Line type="monotone" dataKey="discount" name="Δ Discount/Premium in HEX" dot={false} strokeWidth={2} stroke="white" activeDot={{ r: 4, fill: 'rgb(234, 67, 53)', stroke: 'white' }}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


export default DiscountChart;