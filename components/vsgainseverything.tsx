"use client"

import React from 'react';
import { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { supabase } from '../supabaseClient';
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface TokenData {
  date: string;
  hexX: number;
  btcX: number;
  ethX: number;
  solX: number;
  pulseX: number;
  plsX: number;
  plsxX: number;
  incX: number;
  ehexX: number;
}

interface DexScreenerResponse {
  pair: {
    priceUsd: string;
    // ... other fields we might need
  };
}

// Helper function to format numbers with appropriate decimals and commas
const formatPrice = (price: number, symbol: string) => {
  if (!price) return '0';  // Handle undefined/null cases
  
  if (symbol === 'BTC' || symbol === 'ETH' || symbol === 'SOL') {
    return price.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
  if (symbol === 'pHEX') {
    return price.toFixed(3);  // Example: 7 decimal places for INC
  }
  if (symbol === 'PLS') {
    return price.toFixed(6);  // Example: 5 decimal places for PLS
  }
  if (symbol === 'PLSX') {
    return price.toFixed(6);  // Example: 6 decimal places for PLSX
  }
  if (symbol === 'INC') {
    return price.toFixed(2);  // Example: 7 decimal places for INC
  }
  if (symbol === 'eHEX') {
    return price.toFixed(3);  // Example: 7 decimal places for INC
  }
};

const safeParsePriceUsd = (data: any): number | null => {
  try {
    if (data && data.pair && data.pair.priceUsd) {
      const price = parseFloat(data.pair.priceUsd);
      return isNaN(price) ? null : price;
    }
    return null;
  } catch (error) {
    console.error('Error parsing price:', error);
    return null;
  }
};

const VsGainsEverything: React.FC = () => {
  const [data, setData] = useState<TokenData[]>([]);
  const [historicPrices, setHistoricPrices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleLines, setVisibleLines] = useState({
    hexX: true,
    btcX: true,
    ethX: true,
    solX: true,
    plsX: true,
    plsxX: true,
    incX: true,
    ehexX: true
  });
  const [baselineDate, setBaselineDate] = useState('2024-09-07T00:00:00.000Z');
  const [activeButton, setActiveButton] = useState<string>('HEX');
  const [date, setDate] = useState<Date | undefined>(new Date('2024-09-07'));

  useEffect(() => {
    handleDateChange('2024-09-07T00:00:00.000Z', 'HEX');
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // First, get all data from the selected date onwards
      const { data: fetchedHistoricPrices, error } = await supabase
        .from('historic_prices_test3')
        .select('*')
        .gte('date', baselineDate)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        return;
      }

      // Check if we need to fetch current prices
      const lastDataPoint = fetchedHistoricPrices[fetchedHistoricPrices.length - 1];
      const lastDataDate = new Date(lastDataPoint.date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Simple comparison using yesterday
      if (lastDataDate <= yesterday) {
        try {
          // Get the most recent prices as fallback values
          const lastKnownPrices = fetchedHistoricPrices[fetchedHistoricPrices.length - 1];
          
          // Initialize todayData with last known prices
          let todayData = {
            date: today.toISOString(),
            hex_price: lastKnownPrices.hex_price,
            ehex_price: lastKnownPrices.ehex_price,
            pls_price: lastKnownPrices.pls_price,
            plsx_price: lastKnownPrices.plsx_price,
            inc_price: lastKnownPrices.inc_price,
            btc_price: lastKnownPrices.btc_price,
            eth_price: lastKnownPrices.eth_price,
            sol_price: lastKnownPrices.sol_price
          };

          // Try to fetch new prices, falling back to last known prices if there's an error
          try {
            const hexResponse = await fetch('https://api.dexscreener.com/latest/dex/pairs/pulsechain/0xf1F4ee610b2bAbB05C635F726eF8B0C568c8dc65');
            const hexData = await hexResponse.json();
            todayData.hex_price = parseFloat(hexData?.pair?.priceUsd) || lastKnownPrices.hex_price;
          } catch (error) {
            console.error('Error fetching HEX price:', error);
          }

          try {
            const ehexResponse = await fetch('https://api.dexscreener.com/latest/dex/pairs/ethereum/0x9e0905249ceefffb9605e034b534544684a58be6');
            const ehexData = await ehexResponse.json();
            todayData.ehex_price = parseFloat(ehexData?.pair?.priceUsd) || lastKnownPrices.ehex_price;
          } catch (error) {
            console.error('Error fetching eHEX price:', error);
          }

          try {
            const plsResponse = await fetch('https://api.dexscreener.com/latest/dex/pairs/pulsechain/0x6753560538eca67617a9ce605178f788be7e524e');
            const plsData = await plsResponse.json();
            todayData.pls_price = parseFloat(plsData?.pair?.priceUsd) || lastKnownPrices.pls_price;
          } catch (error) {
            console.error('Error fetching PLS price:', error);
          }

          try {
            const plsxResponse = await fetch('https://api.dexscreener.com/latest/dex/pairs/pulsechain/0x1b45b9148791d3a104184cd5dfe5ce57193a3ee9');
            const plsxData = await plsxResponse.json();
            todayData.plsx_price = parseFloat(plsxData?.pair?.priceUsd) || lastKnownPrices.plsx_price;
          } catch (error) {
            console.error('Error fetching PLSX price:', error);
          }

          try {
            const incResponse = await fetch('https://api.dexscreener.com/latest/dex/pairs/pulsechain/0xf808Bb6265e9Ca27002c0A04562Bf50d4FE37EAA');
            const incData = await incResponse.json();
            todayData.inc_price = parseFloat(incData?.pair?.priceUsd) || lastKnownPrices.inc_price;
          } catch (error) {
            console.error('Error fetching INC price:', error);
          }

          try {
            const btcResponse = await fetch('https://api.dexscreener.com/latest/dex/pairs/ethereum/0xCBCdF9626bC03E24f779434178A73a0B4bad62eD');
            const btcData = await btcResponse.json();
            todayData.btc_price = parseFloat(btcData?.pair?.priceUsd) || lastKnownPrices.btc_price;
          } catch (error) {
            console.error('Error fetching BTC price:', error);
          }

          try {
            const ethResponse = await fetch('https://api.dexscreener.com/latest/dex/pairs/ethereum/0x11b815efB8f581194ae79006d24E0d814B7697F6');
            const ethData = await ethResponse.json();
            todayData.eth_price = parseFloat(ethData?.pair?.priceUsd) || lastKnownPrices.eth_price;
          } catch (error) {
            console.error('Error fetching ETH price:', error);
          }

          try {
            const solResponse = await fetch('https://api.dexscreener.com/latest/dex/pairs/ethereum/0x127452F3f9cDc0389b0Bf59ce6131aA3Bd763598');
            const solData = await solResponse.json();
            todayData.sol_price = parseFloat(solData?.pair?.priceUsd) || lastKnownPrices.sol_price;
          } catch (error) {
            console.error('Error fetching SOL price:', error);
          }

          console.log('Today\'s prices:', todayData);
          fetchedHistoricPrices.push(todayData);
        } catch (error) {
          console.error('Error in price fetching process:', error);
        }
      }

      // If we have data, use the first data point as baseline
      if (fetchedHistoricPrices && fetchedHistoricPrices.length > 0) {
        const baselinePrices = fetchedHistoricPrices[0];
        setHistoricPrices(fetchedHistoricPrices);

        const formattedData = fetchedHistoricPrices.map((item) => ({
          date: item.date,
          hexX: (item.hex_price / baselinePrices.hex_price),
          btcX: (item.btc_price / baselinePrices.btc_price),
          ethX: (item.eth_price / baselinePrices.eth_price),
          solX: (item.sol_price / baselinePrices.sol_price),
          plsX: (item.pls_price / baselinePrices.pls_price),
          plsxX: (item.plsx_price / baselinePrices.plsx_price),
          incX: (item.inc_price / baselinePrices.inc_price),
          ehexX: (item.ehex_price / baselinePrices.ehex_price)
        }));
        
        setData(formattedData);
      } else {
        setError('No data available for the selected date range');
      }
      setIsLoading(false);
    };

    fetchData();
  }, [baselineDate]);

  const handleLegendClick = (dataKey: string) => {
    setVisibleLines(prev => ({
      ...prev,
      [dataKey]: !prev[dataKey]
    }));
  };

  const customLegend = (props: LegendProps) => {
    const { payload } = props;
    
    if (payload && data.length > 0) {
      const latestData = data[data.length - 1];
      const lastPrices = historicPrices[historicPrices.length - 1];

      // Remove the filtering logic to include BTC, ETH, and SOL in the legend
      const filteredPayload = payload; // No filtering

      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          width: '100%', 
          marginTop: '0px' 
        }}>
          <ul style={{ 
            listStyle: 'none', 
            padding: '10px 0 40px 0', 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center' 
          }}>
            {filteredPayload.map((entry, index) => {
              const symbol = entry.value;
              const xValue = latestData[entry.dataKey];
              const priceField = symbol.toLowerCase() === 'phex' ? 'hex_price' :  // Add specific mapping for pHEX
                                 `${symbol.toLowerCase()}_price`;
              const currentPrice = lastPrices[priceField];
              const formattedPrice = formatPrice(currentPrice, symbol);
              const formattedLabel = `${symbol} ($${formattedPrice} | ${xValue.toFixed(1)}X)`;
              
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
                    {formattedLabel}
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
      ),
      plsX: (
        <g transform={`translate(${lastPoint.x + 10},${lastPoint.y - 8})`}>
          <circle r="8" fill="#9945FF" />
          <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="10">P</text>
        </g>
      ),
      plsxX: (
        <g transform={`translate(${lastPoint.x + 10},${lastPoint.y - 8})`}>
          <circle r="8" fill="#FFD700" />
          <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="10">X</text>
        </g>
      ),
      incX: (
        <g transform={`translate(${lastPoint.x + 10},${lastPoint.y - 8})`}>
          <circle r="8" fill="#00FF00" />
          <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="10">I</text>
        </g>
      )
    };

    return icons[props.dataKey];
  };

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
          {payload.map((entry, index) => {
            const symbol = entry.dataKey.replace('X', '').toUpperCase();
            const formattedPrice = formatPrice(entry.value, symbol);
            return (
              <p key={index} style={{ color: 'white', margin: '3px 0' }}>
                <span style={{ color: entry.color }}>●</span>
                {` ${symbol}: $${formattedPrice}`}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const handleDateChange = (newDate: string, buttonName: string) => {
    const dateObj = new Date(newDate);
    setBaselineDate(newDate);
    setActiveButton(buttonName);
    setDate(dateObj);
  };

  if (isLoading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    
    <div style={{ 
      width: '100%', 
      height: '500px',
      margin: '80px 0px 80px 0px', 
      padding: '20px', 
      backgroundColor: '#000',
      border: '1px solid rgba(255, 255, 255, 0.2)', 
      borderRadius: '15px',
      color: '#fff', 
      position: 'relative' 
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '10px',
        padding: '0 24px'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <h2 style={{ 
            color: 'white', 
            fontSize: '24px',
            margin: 0
          }}>
            Everything vs everything
          </h2>
          <p style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '14px',
            margin: '0 0 10px 0'
          }}>
            Xs measurable from each token's bear market bottom
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          flexDirection: 'column'  // Stack the rows vertically
        }}>
          {/* First Row */}
          <div style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            padding: '0',
            width: '100%',  // Add full width
            justifyContent: 'space-between'  // Spread contents
          }}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[180px] justify-start text-left font-normal bg-black border-gray-800 text-white",
                    "hover:bg-gray-900 hover:border-gray-700 hover:text-white",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "yyyy/MM/dd") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-black border border-gray-800">
                <Calendar
                  mode="single"
                  selected={date}
                  defaultMonth={date}
                  onSelect={(newDate) => {
                    if (newDate) {
                      const isoString = newDate.toISOString();
                      setDate(newDate);
                      setBaselineDate(isoString);
                      setActiveButton(''); // Clear active button when using date picker
                    }
                  }}
                  initialFocus
                  className="bg-black text-white"
                  classNames={{
                    months: "text-white",
                    month: "text-white",
                    caption: "flex justify-center pt-1 relative items-center text-white",
                    caption_label: "text-sm font-medium text-white",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2",
                    cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-transparent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-800 rounded-md text-white",
                    day_selected: "bg-gray-800 text-white hover:bg-gray-700 hover:text-white focus:bg-gray-800 focus:text-white",
                    day_today: "bg-gray-800/80 text-white",
                    day_outside: "text-gray-700",
                    day_disabled: "text-gray-600",
                    day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    day_hidden: "invisible",
                  }}
                />
              </PopoverContent>
            </Popover>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleDateChange('2024-09-07T00:00:00.000Z', 'HEX')}
                className={`
                  px-[10px] py-[5px] 
                  rounded-md 
                  border 
                  border-[#ff00ff] 
                  text-white 
                  cursor-pointer 
                  transition-colors
                  ${activeButton === 'HEX' ? 'bg-[#ff00ff33]' : 'bg-transparent'}
                  hover:bg-[#ff00ff33]
                `}
              >
                pHEX low
              </button>
              <button
                onClick={() => handleDateChange('2024-08-05T00:00:00.000Z', 'EHEX')}
                className={`
                  px-[10px] py-[5px] 
                  rounded-md 
                  border 
                  border-[#627EEA] 
                  text-white 
                  cursor-pointer 
                  transition-colors
                  ${activeButton === 'EHEX' ? 'bg-[#627EEA33]' : 'bg-transparent'}
                  hover:bg-[#627EEA33]
                `}
              >
                eHEX low
              </button>
              <button
                onClick={() => handleDateChange('2024-09-04T00:00:00.000Z', 'PLS')}
                className={`
                  px-[10px] py-[5px] 
                  rounded-md 
                  border 
                  border-[#9945ff] 
                  text-white 
                  cursor-pointer 
                  transition-colors
                  ${activeButton === 'PLS' ? 'bg-[#9945ff33]' : 'bg-transparent'}
                  hover:bg-[#9945ff33]
                `}
              >
                PLS low
              </button>
            </div>
          </div>

          {/* Second Row */}
          <div style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            width: '100%',  // Add full width
            justifyContent: 'space-between'  // Spread contents
          }}>
            <button
              onClick={() => handleDateChange('2023-09-11T00:00:00.000Z', 'PLSX')}
              className={`
                px-[10px] py-[5px] 
                rounded-md 
                border 
                border-[#ffd700] 
                text-white 
                cursor-pointer 
                transition-colors
                ${activeButton === 'PLSX' ? 'bg-[#ffd70033]' : 'bg-transparent'}
                hover:bg-[#ffd70033]
              `}
            >
              PLSX low
            </button>
            <button
              onClick={() => handleDateChange('2023-12-12T00:00:00.000Z', 'INC')}
              className={`
                px-[10px] py-[5px] 
                rounded-md 
                border 
                border-[#00ff00] 
                text-white 
                cursor-pointer 
                transition-colors
                ${activeButton === 'INC' ? 'bg-[#00ff0033]' : 'bg-transparent'}
                hover:bg-[#00ff0033]
              `}
            >
              INC low
            </button>
            <button
              onClick={() => handleDateChange('2022-11-22T00:00:00.000Z', 'BTC')}
              className={`
                px-[10px] py-[5px] 
                rounded-md 
                border 
                border-[#f7931a] 
                text-white 
                cursor-pointer 
                transition-colors
                ${activeButton === 'BTC' ? 'bg-[#f7931a33]' : 'bg-transparent'}
                hover:bg-[#f7931a33]
              `}
            >
              BTC low
            </button>
            <button
              onClick={() => handleDateChange('2022-06-19T00:00:00.000Z', 'ETH')}
              className={`
                px-[10px] py-[5px] 
                rounded-md 
                border 
                border-[#00FFFF] 
                text-white 
                cursor-pointer 
                transition-colors
                ${activeButton === 'ETH' ? 'bg-[#00FFFF33]' : 'bg-transparent'}
                hover:bg-[#00FFFF33]
              `}
            >
              ETH low
            </button>
            <button
              onClick={() => handleDateChange('2022-12-30T00:00:00.000Z', 'SOL')}
              className={`
                px-[10px] py-[5px] 
                rounded-md 
                border 
                border-[#14F195] 
                text-white 
                cursor-pointer 
                transition-colors
                ${activeButton === 'SOL' ? 'bg-[#14F19533]' : 'bg-transparent'}
                hover:bg-[#14F19533]
              `}
            >
              SOL low
            </button>
          </div>
        </div>
      </div>
      
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
            domain={['dataMin', 'dataMax']}
            ticks={data.reduce((acc, item, index) => {
              if (index === 0 || index === data.length - 1) {
                acc.push(item.date);
              }
              return acc;
            }, [] as string[])}
          />
          <YAxis 
            tickFormatter={(value) => `${Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1)}X`}
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
                  {`${Number.isInteger(props.payload.value) ? 
                    props.payload.value.toFixed(0) : 
                    props.payload.value.toFixed(1)}X`}
                </text>
              );
            }}
            domain={[0, 'auto']}
            allowDataOverflow={false}
            interval="preserveStartEnd"
          />
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(136, 136, 136, 0.2)" 
            vertical={false} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.85)', 
              border: '1px solid rgba(255, 255, 255, 0.2)', 
              borderRadius: '10px', 
              padding: '10px',
              color: '#fff',
              boxShadow: '0 0 10px rgba(0,0,0,0.5)'
            }}
            formatter={(value: number, name: string) => {
              const color = name === 'pHEX' ? '#ff00ff' : 
                           name === 'BTC' ? '#f7931a' : 
                           name === 'ETH' ? '#00FFFF' : 
                           name === 'SOL' ? '#14F195' :
                           name === 'PLS' ? '#9945FF' :
                           name === 'PLSX' ? '#FFD700' :
                           name === 'INC' ? '#00FF00' :
                           name === 'eHEX' ? '#627EEA' :
                           '#fff';
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
            name="pHEX"
            label={renderCustomizedLabel}
            hide={!visibleLines.hexX}
          />
          <Line 
            type="monotone" 
            dataKey="ehexX" 
            stroke="#627EEA" 
            strokeWidth={2}
            dot={false}
            name="eHEX"
            hide={!visibleLines.ehexX}
            label={renderCustomizedLabel}
          />
                    <Line 
            type="monotone" 
            dataKey="plsX" 
            stroke="#9945FF" 
            strokeWidth={2}
            dot={false}
            name="PLS"
            label={renderCustomizedLabel}
            hide={!visibleLines.plsX}
          />
          <Line 
            type="monotone" 
            dataKey="plsxX" 
            stroke="#FFD700" 
            strokeWidth={2}
            dot={false}
            name="PLSX"
            label={renderCustomizedLabel}
            hide={!visibleLines.plsxX}
          />
          <Line 
            type="monotone" 
            dataKey="incX" 
            stroke="#00FF00" 
            strokeWidth={2}
            dot={false}
            name="INC"
            hide={!visibleLines.incX}
            label={renderCustomizedLabel}
          />
          <Line 
            type="monotone" 
            dataKey="btcX" 
            stroke="#f7931a" 
            strokeWidth={2}
            dot={false}
            name="BTC"
            label={renderCustomizedLabel}
            hide={!visibleLines.btcX}
          />
          <Line 
            type="monotone" 
            dataKey="ethX" 
            stroke="#00FFFF" 
            strokeWidth={2}
            dot={false}
            name="ETH"
            label={renderCustomizedLabel}
            hide={!visibleLines.ethX}
          />
          <Line 
            type="monotone" 
            dataKey="solX" 
            stroke="#14F195" 
            strokeWidth={2}
            dot={false}
            name="SOL"
            label={renderCustomizedLabel}
            hide={!visibleLines.solX}
          />


        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VsGainsEverything;

