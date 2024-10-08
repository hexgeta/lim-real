"use client"

import React, { useState, useEffect } from 'react'
// Remove these imports as we're not using them anymore
// import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'

interface CryptoData {
  symbol: string
  logo: string
  priceChange: number
  currentPrice: number
}

const fixedPrices = {
  'WBTC': 15466,
  'WETH': 2103,
  'HEX': 0.003575
}

const PriceComparison: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokens = [
          { 
            symbol: 'WBTC', 
            pairAddress: '0xCBCdF9626bC03E24f779434178A73a0B4bad62eD', 
            chainId: '1',
            logo: '/coin-logos/BTC.svg'
          },
          { 
            symbol: 'WETH', 
            pairAddress: '0x11b815efB8f581194ae79006d24E0d814B7697F6', 
            chainId: '1',
            logo: '/coin-logos/ETH.svg'
          },
          { 
            symbol: 'HEX', 
            pairAddress: '0xf1F4ee610b2bAbB05C635F726eF8B0C568c8dc65', 
            chainId: '369',
            logo: '/coin-logos/HEX.svg'
          },
        ]
        const data = await Promise.all(
          tokens.map(async (token) => {
            const url = `https://api.dexscreener.com/latest/dex/pairs/${token.chainId === '1' ? 'ethereum' : 'pulsechain'}/${token.pairAddress}`;
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log(`Data for ${token.symbol}:`, result);
            
            const pair = result.pair;
            if (!pair) {
              throw new Error(`No pair data found for ${token.symbol}`);
            }
            
            const currentPrice = parseFloat(pair.priceUsd);
            const fixedPrice = fixedPrices[token.symbol];
            const priceChange = ((currentPrice - fixedPrice) / fixedPrice) * 100;
            
            return {
              symbol: token.symbol,
              logo: token.logo, // Use the local logo path
              priceChange: priceChange,
              currentPrice: currentPrice
            };
          })
        );
        console.log("Processed data:", data);
        setCryptoData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>
  }

  if (cryptoData.length === 0) {
    return <div className="text-center">No data available</div>
  }

  const formatPrice = (symbol: string, price: number) => {
    if (symbol === 'HEX') {
      return price.toFixed(4);
    } else {
      return Math.round(price).toLocaleString();
    }
  };

  return (
    <div className="bg-[#fff200] p-2 max-w-3xl mx-auto rounded-lg">
      <div className="bg-black text-white p-8 rounded-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">Price performance from the <span className="underline">local bottom</span>:</h2>
        <div className="flex justify-around items-center">
          {cryptoData.map((crypto) => (
            <div key={crypto.symbol} className="text-center">
              <div className={`text-4xl font-bold mb-4 ${crypto.priceChange >= 0 ? 'text-[#00FF00]' : 'text-red-400'}`}>
                {/* This is the only part that changes */}
                {crypto.priceChange >= 0 ? '+' : '-'}
                {Math.abs(Math.round(crypto.priceChange))}%
              </div>
              <div className="bg-black rounded-full w-24 h-24 mx-auto mb-1 flex items-center justify-center">
                <img src={crypto.logo} alt={crypto.symbol} className="w-24 h-24" />
              </div>
              <div className="text-2xl font-bold pt-4">{crypto.symbol}</div>
              <div className="text-lg">${formatPrice(crypto.symbol, crypto.currentPrice)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PriceComparison;