'use client'

import { useCryptoPrice } from '@/hooks/crypto/useCryptoPrice'
import { useState, useEffect, useRef } from 'react'
import NumberFlow from '@number-flow/react'
import Image from 'next/image'
import { formatNumber } from '@/utils/format'

// Configuration
const CONFIG = {
  PRICE_NOISE: 0.00001,    
  UPDATE_INTERVAL: 100,     
  MOMENTUM_FACTOR: 0.7,     
  STILL_CHANCE: 0.15,      
}

function getPriceChangeColor(change: number): string {
  if (Math.abs(change * 100) < 1) return 'text-zinc-500'
  return change >= 0 ? 'text-[#01FF55]' : 'text-red-500'
}

export default function LivePdaiPrice() {
  const { priceData, isLoading, error } = useCryptoPrice('pDAI')
  const [displayPrice, setDisplayPrice] = useState(0)
  const [priceColor, setPriceColor] = useState('text-white')
  const lastPrice = useRef(0)
  const realPrice = useRef(0)
  const lastNoise = useRef(0)

  // Update real price when API data changes
  useEffect(() => {
    if (priceData?.price) {
      realPrice.current = priceData.price
      if (!CONFIG.PRICE_NOISE) {
        setDisplayPrice(priceData.price)
      }
    }
  }, [priceData?.price])

  // Price noise effect
  useEffect(() => {
    if (!CONFIG.PRICE_NOISE || !realPrice.current) return

    const generatePriceNoise = () => {
      if (Math.random() < CONFIG.STILL_CHANCE) {
        return;
      }

      const randomNoise = (Math.random() - 0.5) * CONFIG.PRICE_NOISE
      const momentumNoise = (lastNoise.current * CONFIG.MOMENTUM_FACTOR) + 
                           (randomNoise * (1 - CONFIG.MOMENTUM_FACTOR))
      
      lastNoise.current = momentumNoise
      const newPrice = realPrice.current + momentumNoise
      
      const formattedNewPrice = newPrice.toFixed(6)
      const formattedLastPrice = lastPrice.current.toFixed(6)
      
      if (formattedNewPrice !== formattedLastPrice) {
        const isIncreasing = parseFloat(formattedNewPrice) > parseFloat(formattedLastPrice)
        setPriceColor(isIncreasing ? 'text-[#01FF55]' : 'text-red-500')
      }
      
      lastPrice.current = newPrice
      setDisplayPrice(newPrice)
    }

    const interval = setInterval(generatePriceNoise, CONFIG.UPDATE_INTERVAL)
    return () => clearInterval(interval)
  }, [realPrice.current])

  // Update color on real price changes when noise is disabled
  useEffect(() => {
    if (CONFIG.PRICE_NOISE) return

    if (priceData?.price) {
      const formattedNewPrice = priceData.price.toFixed(6)
      const formattedLastPrice = lastPrice.current.toFixed(6)
      
      if (formattedNewPrice !== formattedLastPrice) {
        const isIncreasing = parseFloat(formattedNewPrice) > parseFloat(formattedLastPrice)
        setPriceColor(isIncreasing ? 'text-[#01FF55]' : 'text-red-500')
      }
      lastPrice.current = priceData.price
    }
  }, [priceData?.price])

  const currentPrice = CONFIG.PRICE_NOISE ? displayPrice : (priceData?.price || 0)

  if (error) {
    console.error('Price fetch error:', error)
    return <div className="text-red-500">Error loading price</div>
  }

  if (isLoading) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <div className="flex justify-center items-center gap-6">
      <div className="relative w-16 h-16">
        <Image
          src="/coin-logos/pDAI.svg"
          alt="pDAI Logo"
          fill
          className="object-contain"
        />
      </div>
      <div className="flex items-center gap-8">
        <div className={`${priceColor} text-7xl font-bold tabular-nums w-[350px] text-left`}>
          <NumberFlow
            value={Math.abs(currentPrice)}
            format={{ style: 'currency', currency: 'USD', minimumFractionDigits: 6, maximumFractionDigits: 6 }}
            animated={false}
          />
        </div>
        {priceData?.priceChange24h !== undefined && (
          <div className={`text-3xl font-bold ${getPriceChangeColor(priceData.priceChange24h)}`}>
            {priceData.priceChange24h >= 0 ? '+' : ''}{formatNumber(priceData.priceChange24h, { decimals: 1, percentage: true })}
          </div>
        )}
      </div>
    </div>
  );
} 