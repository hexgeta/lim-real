import React, { useEffect, useState, useMemo} from 'react';
import { supabase } from '../supabaseClient';
import {
  LineChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer
} from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

function DiscountChart2({ 
  title = 'MAXI/HEX Price Ratio', 
  yAxisDomain = [0, 2.5]  // Adjust this based on your expected ratio range
}) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChartReady, setIsChartReady] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: response, error } = await supabase
          .from('historic_prices')
          .select('day, maxi_price, hex_price');
        
        if (error) throw error;
        
        const formattedData = response.map((item) => ({
          day: item.day,
          ratio: parseFloat(item.maxi_price) / parseFloat(item.hex_price),
        }));
        
        setData(formattedData.sort((a, b) => a.day - b.day));
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Adjust the timing to ensure chart is fully rendered
  useEffect(() => {
    if (!isLoading && data.length > 0) {
      // Increased delay to ensure chart has fully rendered
      const timer = setTimeout(() => {
        setIsChartReady(true);
      }, 500); // Increased from 100ms to 500ms
      return () => clearTimeout(timer);
    }
  }, [isLoading, data]);

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

  return (
    <div className="w-full h-[450px] my-10 relative">
      {!isChartReady ? (
        <Skeleton variant="chart" />
      ) : (
        <div className="w-full h-full p-5 border border-white/20 rounded-[15px]">
          <h2 className="text-left text-white text-2xl mb-0 ml-10">
            {title}
          </h2>
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
                axisLine={false}
                tickLine={{ stroke: '#888', strokeWidth: 0 }}
                tick={{ fill: '#888', fontSize: 14, dx: -5}}
                tickFormatter={(value) => `${value.toFixed(2)}`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '10px'}}
                labelStyle={{ color: 'white' }}
                itemStyle={{ color: 'white' }}
                formatter={(value) => [`${value.toFixed(4)}`, 'MAXI/HEX Ratio']}
              />
              <Line 
                type="monotone" 
                dataKey="ratio" 
                name="MAXI/HEX Ratio" 
                dot={false} 
                strokeWidth={2} 
                stroke="white"
                activeDot={{ r: 4, fill: 'white', stroke: 'white' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default DiscountChart2;