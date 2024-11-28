import useSWR from 'swr'
import { useCryptoPrice } from './useCryptoPrice'

interface RatioData {
  hexRatio: number
  lastUpdated: Date
}

export function useCryptoRatio(symbol: string) {
  const { priceData: tokenPrice, isLoading: tokenLoading } = useCryptoPrice(symbol)
  const { priceData: hexPrice, isLoading: hexLoading } = useCryptoPrice('pHEX')

  console.log(`Token price for ${symbol}:`, tokenPrice?.price)
  console.log('HEX price:', hexPrice?.price)

  const { data, error, isLoading } = useSWR(
    symbol && tokenPrice && hexPrice ? `crypto/ratio/${symbol}` : null,
    () => {
      const ratio = hexPrice.price > 0 
        ? Number((tokenPrice.price / hexPrice.price).toFixed(4)) 
        : 0
      
      console.log(`Calculated ratio for ${symbol}:`, ratio)
      
      return {
        hexRatio: ratio,
        lastUpdated: new Date()
      }
    },
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
      dedupingInterval: 5000,
    }
  )

  const isLoadingAll = isLoading || tokenLoading || hexLoading || !data

  return {
    ratioData: data,
    isLoading: isLoadingAll,
    error
  }
} 