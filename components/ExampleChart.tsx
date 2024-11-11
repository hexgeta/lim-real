import React, { useEffect, useState, useMemo} from 'react';
import { supabase } from '../supabaseClient';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Constants for regression calculations
const LINEAR_SLOPE_MULTIPLIER = 1.05;  // Adjust this value to change linear trend steepness
const EXPONENTIAL_CURVE_INTENSITY = 1.0;  // Added this for consistency

const START_DAY = 881;
const END_DAY = 5555;

function calculateExponentialRegression(data, curveIntensity = 0.1) {
  console.log('Curve Intensity:', curveIntensity);

  const n = data.length;
  let sumX = 0;
  let sumY = 0;
  let sumXlnY = 0;
  let sumXX = 0;
  
  const startX = START_DAY;
  const startY = 1;
  
  data.forEach(point => {
    const x = point.day - startX;
    const lnY = Math.log(point.backingValue);
    
    sumX += x;
    sumY += lnY;
    sumXlnY += x * lnY;
    sumXX += x * x;
  });
  
  const a = (n * sumXlnY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const b = Math.log(startY);
  
  return {
    calculate: (x) => {
      const adjustedX = x - startX;
      return Math.exp((a * adjustedX + b) * curveIntensity);
    },
    equation: `y = e^(${(a).toFixed(6)}x + ${b.toFixed(6)}) * ${curveIntensity}`
  };
}

function calculateLinearRegression(data, slopeMultiplier = 1.0) {
  console.log('Slope Multiplier:', slopeMultiplier);

  const n = data.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  
  const startX = START_DAY;
  const startY = 1;
  
  data.forEach(point => {
    const x = point.day - startX;
    const y = point.backingValue;
    
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  });
  
  const baseSlope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const slope = baseSlope * slopeMultiplier;
  const intercept = startY;
  
  console.log('Base slope:', baseSlope);
  console.log('Adjusted slope:', slope);
  
  return {
    calculate: (x) => slope * (x - startX) + intercept,
    equation: `y = ${slope.toFixed(6)}x + ${intercept.toFixed(6)}`
  };
}

function ExampleChart({ 
  tableName = 'pMAXI - DiscountChart',
  title, 
  xAxisKey = 'Day', 
  yAxis1Key = 'Discount/Premium', 
  yAxis2Key = 'Backing Value',
  yAxisDomain = [0, 2.5]
}) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trendLineData, setTrendLineData] = useState([]);
  const [linearTrendData, setLinearTrendData] = useState([]);
  const [visibleLines, setVisibleLines] = useState({
    backingValue: true,
    discount: true,
    trendValue: true,
    linearTrend: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data from table:', tableName);
        const { data: response, error } = await supabase
          .from('pMAXI - DiscountChart')
          .select('*');
        
        if (error) throw error;
        
        console.log('Market Value data from Supabase:');
        response.forEach(item => {
          console.log(`Day ${item[xAxisKey]}: Market Value = ${item[yAxis1Key]}`);
        });
        
        const formattedData = response.map((item) => ({
          day: item[xAxisKey],
          discount: parseFloat(item[yAxis1Key]),
          backingValue: parseFloat(item[yAxis2Key]),
        }));
        
        console.log('First 20 data points:');
        formattedData.slice(0, 20).forEach((point, index) => {
          if (index > 0) {
            const dayGap = point.day - formattedData[index - 1].day;
            console.log(`Day ${point.day}: Market=${point.discount}, Backing=${point.backingValue}, Gap=${dayGap}`);
          }
        });
        
        const regression = calculateExponentialRegression(formattedData, EXPONENTIAL_CURVE_INTENSITY);
        const linearRegression = calculateLinearRegression(formattedData, LINEAR_SLOPE_MULTIPLIER);
        
        console.log('Trend Line Equations:');
        console.log('Exponential:', regression.equation);
        console.log('Linear:', linearRegression.equation);
        
        // Modify how we create and combine the data points
        const combinedData = [];
        
        for (let day = START_DAY; day <= END_DAY; day++) {
          const expValue = regression.calculate(day);
          const linValue = linearRegression.calculate(day);
          
          // Find matching day in original data
          const originalDataPoint = formattedData.find(d => d.day === day) || {};
          
          combinedData.push({
            day,
            ...originalDataPoint,
            trendValue: expValue,
            linearTrend: linValue
          });
        }
        
        setData(combinedData);
        
        // Remove these as they're no longer needed
        // setTrendLineData(trendPoints);
        // setLinearTrendData(linearTrendPoints);
        
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tableName, xAxisKey, yAxis1Key, yAxis2Key]);

  const xAxisTicks = useMemo(() => {
    const ticks = [];
    const startDay = 0;
    const endDay = 5555;
    
    for (let day = startDay; day <= endDay; day += 500) {
      ticks.push(day);
    }
    
    if (ticks[ticks.length - 1] !== endDay) {
      ticks.push(endDay);
    }

    return ticks;
  }, []);

  // Add this helper function to generate ticks
  const generateTicks = (min, max) => {
    const ticks = [];
    const maxValue = Math.ceil(max);
    for (let i = 0; i <= maxValue; i++) {
      ticks.push(i);
    }
    return ticks;
  };

  const handleLegendClick = (dataKey: string) => {
    setVisibleLines(prev => ({
      ...prev,
      [dataKey]: !prev[dataKey]
    }));
  };

  const customLegend = (props: any) => {
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
  };

  if (isLoading) {
    return <div style={{ color: 'white' }}>Loading...</div>;
  }

  return (
    <div style={{ width: '100%', height: 550, margin: '40px 0px 40px 00px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '15px' }}>
      <h2 style={{ textAlign: 'left', color: 'white', fontSize: '24px', marginBottom: '0px', marginLeft: '40px'}}>
        {title}</h2>
      <ResponsiveContainer width="100%" height="100%" debounce={1}>
        <LineChart data={data} margin={{ top: 30, right: 20, left: 20, bottom: 10 }}>
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
            domain={[881, 5555]}
            type="number"
            allowDataOverflow={true}
            scale="linear"
            label={{ 
              value: 'DAY', 
              position: 'bottom',
              offset: 10,
              style: { 
                fill: '#888',
                fontSize: 12,
                marginTop: '0px',
              }
            }}
          />
          <YAxis 
            domain={[0, 25]}  // Adjust this range as needed
            ticks={[0, 1, 5, 10,15,20,25]}  // Removed 10
            axisLine={false}
            tickLine={{ stroke: '#888', strokeWidth: 0 }}
            tick={{ fill: '#888', fontSize: 14, dx: -5}}
            tickFormatter={(value) => `${value.toFixed(0)}`}
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
            formatter={(value, name) => {
              if (typeof value === 'number') {
                console.log(`Tooltip value for ${name}:`, value); // Debug log
                return value.toFixed(2);
              }
              return value;
            }}
            isAnimationActive={true}
            cursor={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
          />
          <Legend content={customLegend} />
          <Line 
            type="monotone" 
            dataKey="backingValue" 
            name="Backing Value" 
            dot={false} 
            strokeWidth={2} 
            stroke='rgba(112, 214, 104, 1)'
            activeDot={{ r: 4, fill: 'rgba(112, 214, 104, 1)', stroke: 'white' }}
            connectNulls={false}
            isAnimationActive={true}
            hide={!visibleLines.backingValue}
          />
          <Line 
            type="monotone" 
            dataKey="discount" 
            name="Market Value" 
            dot={false} 
            strokeWidth={2} 
            stroke='#3991ED'
            activeDot={{ r: 4, fill: '#3991ED', stroke: 'white' }}
            hide={!visibleLines.discount}
            connectNulls={false}
            isAnimationActive={true}
          />
          <Line 
            type="monotone"
            dataKey="trendValue"
            name="Projected Backing Value (Exponential)"
            dot={false}
            strokeWidth={2}
            stroke="rgba(112, 214, 104, 0.3)"
            connectNulls={false}
            isAnimationActive={true}
            hide={!visibleLines.trendValue}
          />
          <Line 
            type="linear"
            dataKey="linearTrend"
            name="Projected Backing Value (Linear)"
            dot={false}
            strokeWidth={2}
            stroke="rgba(255, 192, 203, 0.3)"  // Pink with transparency
            hide={!visibleLines.linearTrend}
            connectNulls={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


export default ExampleChart;