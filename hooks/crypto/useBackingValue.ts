import { TOKEN_CONSTANTS, API_ENDPOINTS } from '@/constants/crypto'
import useSWR from 'swr'
import { useCryptoPrice } from './useCryptoPrice'

// Add a branded type for percentages
type Percentage = number & { __brand: 'percentage' }

interface BackingData {
  backingStakeYield: number
  backingStakeValue: number
  marketStakeValue: number
  backingStakeRatio: number
  backingDiscount: Percentage
  lastUpdated: Date
}

// Helper function to create a percentage
function asPercentage(num: number): Percentage {
  return num as Percentage
}

export function useBackingValue(token: string) {
  const { priceData, isLoading: priceLoading } = useCryptoPrice(token)
  const { priceData: hexPriceData, isLoading: hexPriceLoading } = useCryptoPrice('pHEX')
  
  const { data, error, isLoading: swrLoading } = useSWR(
    token && priceData && hexPriceData ? `crypto/backing/${token}` : null,
    async () => {
      try {
        const response = await fetch(API_ENDPOINTS.HEX_STATS)
        const data = await response.json()

        const tokenConfig = TOKEN_CONSTANTS[token]
        if (!tokenConfig) {
          throw new Error(`No configuration found for token: ${token}`)
        }

        const startDate = tokenConfig.STAKE_START_DATE
        if (!startDate) {
          console.log('No stake start date for token:', token)
          return null
        }

        const relevantData = data?.filter(entry => new Date(entry.date) >= startDate)
        if (!relevantData?.length) {
          console.log('No relevant data found for token:', token)
          return null
        }

        // Calculate payout sum based on token
        let payoutSum
        if (token === 'pMAXI') {
          payoutSum = relevantData.reduce((acc, entry) => acc + (entry.payoutPerTshareHEX || 0), 0)
          console.log('MAXI payout sum:', payoutSum)
        } else {
          // Use the same sum for all other tokens
          const otherTokensStartDate = new Date('2022-09-27')
          const otherTokensData = data?.filter(entry => new Date(entry.date) >= otherTokensStartDate)
          payoutSum = otherTokensData.reduce((acc, entry) => acc + (entry.payoutPerTshareHEX || 0), 0)
          console.log('Other tokens payout sum:', payoutSum)
        }

        const backingStakeYield = payoutSum * (tokenConfig.TSHARES || 0)
        const stakePrinciple = tokenConfig.STAKE_PRINCIPLE || 0
        const backingStakeValue = stakePrinciple + backingStakeYield
        const marketStakeValue = (priceData?.price * (tokenConfig.TOKEN_SUPPLY || 0)) / (hexPriceData?.price || 1)
        const backingStakeRatio = stakePrinciple > 0 ? backingStakeValue / stakePrinciple : 0
        const backingStakeRatioInverse = backingStakeRatio
        const hexRatio = priceData?.price / (hexPriceData?.price || 1)
        const backingDiscount = asPercentage((hexRatio - backingStakeRatio) / backingStakeRatio)

        console.log('Debug values:', {
          token,
          tokenPrice: priceData?.price,
          hexPrice: hexPriceData?.price,
          tokenSupply: tokenConfig.TOKEN_SUPPLY,
          backingStakeValue,
          marketStakeValue,
          backingStakeRatio,
          hexRatio,
          backingDiscount
        })
        
        return {
          backingStakeYield,
          backingStakeValue,
          marketStakeValue,
          backingStakeRatio,
          backingDiscount,
          backingStakeRatioInverse,
          lastUpdated: new Date()
        }
      } catch (error) {
        console.error(`Error calculating ${token} backing values:`, error)
        return null  // Return null instead of partial data
      }
    },
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
      dedupingInterval: 5000,
    }
  )

  const isLoading = swrLoading || priceLoading || hexPriceLoading

  return {
    backingData: isLoading ? null : data,  // Only return data when not loading
    isLoading,
    error
  }
}