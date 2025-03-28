import React, { useEffect, useState, useMemo} from 'react';
import { supabase } from '../supabaseClient';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Skeleton } from "@/components/ui/skeleton2";

// Constants for regression calculations
const LINEAR_SLOPE_MULTIPLIER = 1;    // Adjust as needed for DECI
const EXPONENTIAL_CURVE_INTENSITY = 1; // Adjust as needed for DECI

// Sine wave parameters
const SINE_AMPLITUDE = 0.9;     // Adjust as needed for DECI
const SINE_FREQUENCY = 0.01;    // Adjust as needed for DECI
const SINE_PHASE = 4.7;         // Adjust as needed for DECI
const SINE_OFFSET = 0.25;        // Adjust as needed for DECI

// End-of-stake dampening parameters
const DAMPENING_FACTOR = 0.001; // Adjust as needed for DECI
const END_DAMPENING_START = 3500; // Adjust as needed for DECI

const START_DAY = 1030;
const END_DAY = START_DAY + 3696;

function calculateExponentialRegression(data, curveIntensity = 0.03) {
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

function calculateSineRegression(data, exponentialRegression) {
  const lastDataPoint = data[data.length - 1];
  const startDay = lastDataPoint.day;
  
  return {
    calculate: (x) => {
      const expValue = exponentialRegression.calculate(x);
      const daysAfterLast = x - startDay;
      
      if (daysAfterLast <= 0) return null;
      
      // Calculate end-dampening multiplier (1 to 0 as we approach day 5555)
      const daysToEnd = END_DAY - x;
      const endDampeningMultiplier = x > END_DAMPENING_START 
        ? Math.exp(-DAMPENING_FACTOR * (x - END_DAMPENING_START))
        : 1;
      
      return expValue + (
        SINE_AMPLITUDE * Math.sin(SINE_FREQUENCY * (x - startDay) + SINE_PHASE)
        * endDampeningMultiplier
      ) + SINE_OFFSET;
    },
    equation: `y = exp_trend + ${SINE_AMPLITUDE}*sin(${SINE_FREQUENCY}*(x-${startDay}) + ${SINE_PHASE})*e^(-${DAMPENING_FACTOR}*(x-${END_DAMPENING_START})) + ${SINE_OFFSET}`
  };
}

// Add this custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Format the day number
    const day = parseInt(label);
    
    // Reorder the payload items
    const orderedPayload = [
      payload.find(p => p.dataKey === "backingValue"),    // Backing Value
      payload.find(p => p.dataKey === "discount"),        // Market Value
      payload.find(p => p.dataKey === "trendValue"),      // Projected Backing Value (Exponential)
      payload.find(p => p.dataKey === "sineTrend"),       // Market Oscillation
      payload.find(p => p.dataKey === "linearTrend"),     // Projected Backing Value (Linear)
    ].filter(Boolean);

    return (
      <div style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.85)', 
        border: '1px solid rgba(255, 255, 255, 0.2)', 
        borderRadius: '10px',
        padding: '10px'
      }}>
        <p style={{ color: 'white', margin: '0 0 5px' }}>
          <strong>Day: {day}</strong>
        </p>
        {orderedPayload.map((entry, index) => (
          entry && entry.value !== null && (
            <p key={index} style={{ color: 'white', margin: '3px 0' }}>
              <span style={{ color: entry.color }}>●</span>
              {` ${entry.name}: ${Number(entry.value).toFixed(2)}`}
            </p>
          )
        ))}
      </div>
    );
  }
  return null;
};

function ProjectionChartDECI({ 
  tableName = 'pDECI - DiscountChart',
  title = 'pDECI 🛡️', 
  xAxisKey = 'Day', 
  yAxis1Key = 'Discount/Premium', 
  yAxis2Key = 'Backing Value',
  yAxisDomain = [0, 1.5]
}) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trendLineData, setTrendLineData] = useState([]);
  const [linearTrendData, setLinearTrendData] = useState([]);
  const [visibleLines, setVisibleLines] = useState({
    backingValue: true,
    discount: true,
    trendValue: true,
    linearTrend: false,
    sineTrend: true
  });
  const [isZoomed, setIsZoomed] = useState(true);
  const [isChartReady, setIsChartReady] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data from table:', tableName);
        const { data: response, error } = await supabase
          .from('pDECI - DiscountChart')
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
        const sineRegression = calculateSineRegression(formattedData, regression);
        
        console.log('Trend Line Equations:');
        console.log('Exponential:', regression.equation);
        console.log('Linear:', linearRegression.equation);
        
        // Find the last day with market value data
        const lastMarketDay = formattedData[formattedData.length - 1].day;
        
        // Modify how we create and combine the data points
        const combinedData = [];
        
        for (let day = START_DAY; day <= END_DAY; day++) {
          const expValue = regression.calculate(day);
          const linValue = linearRegression.calculate(day);
          const sineValue = day > lastMarketDay ? sineRegression.calculate(day) : null;
          
          // Find matching day in original data
          const originalDataPoint = formattedData.find(d => d.day === day) || {};
          
          combinedData.push({
            day,
            ...originalDataPoint,
            trendValue: expValue,
            linearTrend: linValue,
            sineTrend: sineValue
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

  useEffect(() => {
    if (!isLoading && data.length > 0) {
      const timer = setTimeout(() => {
        setIsChartReady(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, data]);

  const xAxisTicks = useMemo(() => {
    if (!isZoomed) { // Regular wide view
      const ticks = [881];
      for (let day = 1000; day <= 5000; day += 500) {
        ticks.push(day);
      }
      ticks.push(5555);
      return ticks;
    } else { // Zoomed in view - focus on stake period
      const ticks = [];
      for (let day = START_DAY; day <= END_DAY; day += 250) {
        ticks.push(day);
      }
      if (ticks[ticks.length - 1] !== END_DAY) {
        ticks.push(END_DAY);
      }
      return ticks;
    }
  }, [isZoomed]);

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
    
    // Define the desired order of legend items
    const orderedLegendItems = [
      payload.find(p => p.dataKey === "backingValue"),    // Backing Value
      payload.find(p => p.dataKey === "discount"),        // Market Value
      payload.find(p => p.dataKey === "trendValue"),      // Projected Backing Value (Exponential)
      payload.find(p => p.dataKey === "sineTrend"),       // Market Oscillation
      payload.find(p => p.dataKey === "linearTrend"),     // Projected Backing Value (Linear)
    ].filter(Boolean);

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
          {orderedLegendItems.map((entry: any, index: number) => (
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

  // Update yAxisTicks based on zoom state
  const yAxisTicks = !isZoomed 
    ? [0, 1, 5, 10, 15, 20, 25]  
    : [0, 1, 5,10,12];     

  const currentYAxisDomain = !isZoomed ? [0, 25] : [0, 5];

  return (
    <div className="w-full h-[450px] my-10 relative">
      {!isChartReady ? (
        <Skeleton variant="chart" />
      ) : (
        <div style={{ width: '100%', height: '100%', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '40px', marginBottom: '0px' }}>
            <h2 style={{ color: 'white', fontSize: '24px', margin: '0' }}>
              {title}
            </h2>
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              style={{
                marginLeft: '15px',
                padding: '4px 8px',
                fontSize: '12px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                color: '#888',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {isZoomed ? 'Zoom Out' : 'Zoom In'}
            </button>
          </div>

          <ResponsiveContainer width="100%" height="100%" debounce={1}>
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
                domain={!isZoomed ? [881, 5555] : [START_DAY, END_DAY]}
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
                domain={currentYAxisDomain}
                ticks={yAxisTicks}
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
              <Tooltip content={<CustomTooltip />} />
              <Legend content={customLegend} />
              <Line 
                type="linear"
                dataKey="linearTrend"
                name="Projected Backing Value (Linear)"
                dot={false}
                strokeWidth={2}
                stroke="#474747"
                activeDot={{ r: 4, fill: '#474747', stroke: 'white' }}
                hide={!visibleLines.linearTrend}
                connectNulls={false}
                isAnimationActive={true}
              />
              <Line 
                type="monotone"
                dataKey="trendValue"
                name="Projected Backing Value (Exp.)"
                dot={false}
                strokeWidth={2}
                stroke="#23411F"
                activeDot={{ r: 4, fill: '#23411F', stroke: 'white' }}
                connectNulls={false}
                isAnimationActive={true}
                hide={!visibleLines.trendValue}
              />

                        <Line 
                type="monotone"
                dataKey="sineTrend"
                name="Projected Market Value (Exp.)"
                dot={false}
                strokeWidth={2}
                stroke="#764035"
                activeDot={{ r: 4, fill: '#764035', stroke: 'white' }}
                connectNulls={false}
                isAnimationActive={true}
                hide={!visibleLines.sineTrend}
              />
              <Line 
                type="monotone" 
                dataKey="backingValue" 
                name="Backing Value" 
                dot={false} 
                strokeWidth={2} 
                stroke='rgba(112, 214, 104)'
                activeDot={{ r: 4, fill: 'rgba(112, 214, 104)', stroke: 'white' }}
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
                stroke='#C24C35'
                activeDot={{ r: 4, fill: '#C24C35', stroke: 'white' }}
                hide={!visibleLines.discount}
                connectNulls={false}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default ProjectionChartDECI;