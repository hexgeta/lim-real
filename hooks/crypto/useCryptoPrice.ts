import useSWR from 'swr'
import { TOKEN_CONSTANTS } from '@/constants/crypto'

export function useCryptoPrice(symbol: string) {
  const { data, error, isLoading } = useSWR(
    symbol ? `crypto/price/${symbol}` : null,
    async () => {
      console.log(`Fetching price for ${symbol}`)
      
      const tokenConfig = TOKEN_CONSTANTS[symbol]
      if (!tokenConfig?.PAIR) {
        throw new Error(`No pair configuration found for ${symbol}`)
      }

      const { chain, pairAddress } = tokenConfig.PAIR
      const url = `https://api.dexscreener.com/latest/dex/pairs/${chain}/${pairAddress}`
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (!data.pairs?.[0]) {
        console.error(`No pair data found for ${symbol}`)
        return {
          price: 0,
          priceChange24h: 0,
          lastUpdated: new Date(),
          chain
        }
      }

      const pair = data.pairs[0]
      const price = pair.priceUsd ? parseFloat(pair.priceUsd) : 0
      console.log(`Price for ${symbol}:`, price)
      
      return {
        price,
        priceChange24h: pair.priceChange24h ? parseFloat(pair.priceChange24h) : 0,
        lastUpdated: new Date(),
        chain
      }
    },
    {
      refreshInterval: 10000,
      revalidateOnFocus: true,
      dedupingInterval: 5000,
    }
  )

  return {
    priceData: data,
    isLoading,
    error
  }
} 