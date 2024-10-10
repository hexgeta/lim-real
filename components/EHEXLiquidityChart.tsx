import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LegendProps } from 'recharts';

interface ChartData {
  date: string;
  liquidityUV2UV3_HEX: number | null;
  priceUV2UV3: number | null;
  liquidityPulseX_EHEX: number | null;
  totalLiquidity: number | null;
  dollarLiquidity: number | null;
}

const EHEXLiquidityChart: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleLines, setVisibleLines] = useState({
    totalLiquidity: true,
    liquidityUV2UV3_HEX: false,
    liquidityPulseX_EHEX: false,
    priceUV2UV3: true,
    dollarLiquidity: true
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [ethereumResponse, pulseChainResponse] = await Promise.all([
          axios.get('https://hexdailystats.com/fulldata'),
          axios.get('https://hexdailystats.com/fulldatapulsechain')
        ]);

        const ethereumData = ethereumResponse.data;
        const pulseChainData = pulseChainResponse.data;

        let formattedData = ethereumData.map((item: any) => ({
          date: new Date(item.date).toISOString().split('T')[0],
          liquidityUV2UV3_HEX: item.liquidityUV2UV3_HEX || null,
          priceUV2UV3: item.priceUV2UV3 || null,
          liquidityPulseX_EHEX: null,
          totalLiquidity: null,
          dollarLiquidity: null
        }));

        formattedData = formattedData.map(item => {
          const pulseChainItem = pulseChainData.find(
            (pItem: any) => new Date(pItem.date).toISOString().split('T')[0] === item.date
          );
          const liquidityPulseX_EHEX = pulseChainItem ? pulseChainItem.liquidityPulseX_EHEX || 0 : 0;
          const totalLiquidity = item.liquidityUV2UV3_HEX !== null 
            ? item.liquidityUV2UV3_HEX + liquidityPulseX_EHEX 
            : null;
          const dollarLiquidity = totalLiquidity !== null && item.priceUV2UV3 !== null
            ? totalLiquidity * item.priceUV2UV3
            : null;
          
          return {
            ...item,
            liquidityPulseX_EHEX: liquidityPulseX_EHEX || null,
            totalLiquidity,
            dollarLiquidity
          };
        });

        formattedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        while (formattedData.length > 0 && 
               formattedData[0].liquidityUV2UV3_HEX === null && 
               formattedData[0].priceUV2UV3 === null &&
               formattedData[0].totalLiquidity === null) {
          formattedData.shift();
        }

        setData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  };

  const handleLegendClick = (dataKey: string) => {
    setVisibleLines(prev => ({
      ...prev,
      [dataKey]: !prev[dataKey]
    }));
  };

  const customLegend = (props: LegendProps) => {
    const { payload } = props;
    
    if (payload) {
      const customOrder = [
        'Total eHEX Liquidity',
        'eHEX Liquidity on ETH',
        'eHEX Liquidity on PLS',
        'eHEX Price',
        'Total $ Liquidity'
      ];

      const orderedPayload = customOrder.map(itemName => 
        payload.find(item => item.value === itemName)
      ).filter(Boolean);

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
            {orderedPayload.map((entry, index) => (
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: '100%', height: '450px', backgroundColor: '#000', padding: '0px', display: 'flex', flexDirection: 'column'}}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={false}
          />
          <YAxis 
            yAxisId="liquidity"
            stroke="#888" 
            domain={['auto', 'auto']}
            allowDataOverflow={true}
            axisLine={false}
            tickLine={false}
            tick={false}
            scale="log"
          />
          <YAxis 
            yAxisId="price"
            orientation="right"
            stroke="#888" 
            domain={['auto', 'auto']}
            allowDataOverflow={true}
            axisLine={false}
            tickLine={false}
            tick={false}
            scale="log"
          />
          <YAxis 
            yAxisId="dollarLiquidity"
            orientation="right"
            stroke="#888" 
            domain={['auto', 'auto']}
            allowDataOverflow={true}
            axisLine={false}
            tickLine={false}
            tick={false}
            scale="log"
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'solid 1px #fff', borderRadius: '5px'}}
            labelStyle={{ color: 'white' }}
            formatter={(value: any, name: string, props: any) => {
              if (name === 'eHEX Price') {
                return [`$${Number(value).toFixed(4)}`, name];
              } else if (name === 'Total $ Liquidity') {
                return [`$${Number(value).toLocaleString(undefined, {maximumFractionDigits: 0})}`, name];
              } else if (['Total eHEX Liquidity', 'eHEX Liquidity on ETH', 'eHEX Liquidity on PLS'].includes(name)) {
                return [Number(value).toLocaleString(undefined, {maximumFractionDigits: 0}), name];
              }
              return [value, name];
            }}
            labelFormatter={(label) => formatDate(label)}
          />
          <Legend content={customLegend} />
          <Line 
            yAxisId="liquidity"
            type="monotone" 
            dataKey="totalLiquidity" 
            name="Total eHEX Liquidity"
            stroke="#fff"
            dot={false} 
            strokeWidth={2}
            connectNulls={true}
            hide={!visibleLines.totalLiquidity}
          />
          <Line 
            yAxisId="liquidity"
            type="monotone" 
            dataKey="liquidityUV2UV3_HEX" 
            name="eHEX Liquidity on ETH"
            stroke="#00FFFF"
            dot={false} 
            strokeWidth={2}
            connectNulls={true}
            hide={!visibleLines.liquidityUV2UV3_HEX}
          />
          <Line 
            yAxisId="liquidity"
            type="monotone" 
            dataKey="liquidityPulseX_EHEX" 
            name="eHEX Liquidity on PLS"
            stroke="#ffc658"
            dot={false} 
            strokeWidth={2}
            connectNulls={true}
            hide={!visibleLines.liquidityPulseX_EHEX}
          />
          <Line 
            yAxisId="price"
            type="monotone" 
            dataKey="priceUV2UV3" 
            name="eHEX Price"
            stroke="#ff00ff"
            dot={false} 
            strokeWidth={2}
            connectNulls={true}
            hide={!visibleLines.priceUV2UV3}
          />
          <Line 
            yAxisId="dollarLiquidity"
            type="monotone" 
            dataKey="dollarLiquidity" 
            name="Total $ Liquidity"
            stroke="#00ff00"
            dot={false} 
            strokeWidth={2}
            connectNulls={true}
            hide={!visibleLines.dollarLiquidity}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EHEXLiquidityChart;