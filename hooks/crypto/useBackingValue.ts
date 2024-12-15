import { TOKEN_CONSTANTS, API_ENDPOINTS } from '@/constants/crypto'
import useSWR from 'swr'
import { useCryptoPrice } from './useCryptoPrice'

// Add a branded type for percentages
type Percentage = number & { __brand: 'percentage' }

interface BackingData {
  backingStakeYield: number
  backingStakeValue: number
  marketStakeValue: number | null  // Can be null if price data unavailable
  backingStakeRatio: number
  backingDiscount: Percentage | null  // Can be null if price data unavailable
  lastUpdated: Date
}

// Helper function to create a percentage
function asPercentage(num: number): Percentage {
  return num as Percentage
}

export function useBackingValue(token: string) {
  const { priceData, isLoading: priceLoading } = useCryptoPrice(token)
  const { priceData: pHexPrice, isLoading: pHexLoading } = useCryptoPrice('pHEX')
  const { priceData: eHexPrice, isLoading: eHexLoading } = useCryptoPrice('eHEX')
  
  // Determine if this is an Ethereum token
  const isEthereumToken = token.startsWith('e')
  const endpoint = isEthereumToken ? API_ENDPOINTS.historic_ethereum : API_ENDPOINTS.historic_pulsechain
  
  console.log('Using endpoint:', endpoint, 'for token:', token)
  
  const { data, error, isLoading: swrLoading } = useSWR(
    token ? `crypto/backing/${token}` : null, // Only depend on token, not prices
    async () => {
      try {
        console.log('Fetching data from:', endpoint)
        const response = await fetch(endpoint)

        if (!response.ok) {
          const errorText = await response.text()
          console.error('Fetch error:', {
            status: response.status,
            statusText: response.statusText,
            response: errorText
          })
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const text = await response.text()
        console.log('Received response:', text.substring(0, 100) + '...')
        
        let data
        try {
          data = JSON.parse(text)
        } catch (parseError) {
          console.error('JSON Parse error:', parseError)
          console.error('Raw response:', text.substring(0, 200))
          throw parseError
        }

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
        if (token === 'pMAXI' || token === 'eMAXI') {
          payoutSum = relevantData.reduce((acc, entry) => acc + (entry.payoutPerTshareHEX || 0), 0)
          console.log(`${token} payout sum:`, payoutSum)
        } else {
          // Use the same sum for all other tokens
          const otherTokensStartDate = new Date('2022-09-27')
          const otherTokensData = data?.filter(entry => new Date(entry.date) >= otherTokensStartDate)
          payoutSum = otherTokensData.reduce((acc, entry) => acc + (entry.payoutPerTshareHEX || 0), 0)
          console.log('Other tokens payout sum:', payoutSum)
        }

        // Calculate price-independent values
        const backingStakeYield = payoutSum * (tokenConfig.TSHARES || 0)
        const stakePrinciple = tokenConfig.STAKE_PRINCIPLE || 0
        const backingStakeValue = stakePrinciple + backingStakeYield
        const backingStakeRatio = stakePrinciple > 0 ? backingStakeValue / stakePrinciple : 0

        // Use eHEX price for Ethereum tokens, pHEX price for Pulsechain tokens
        const hexPrice = isEthereumToken ? eHexPrice : pHexPrice

        // Calculate price-dependent values only if prices are available
        let marketStakeValue = null
        let backingDiscount = null

        if (priceData?.price && hexPrice?.price) {
          marketStakeValue = (priceData.price * (tokenConfig.TOKEN_SUPPLY || 0)) / hexPrice.price
          const hexRatio = priceData.price / hexPrice.price
          backingDiscount = asPercentage((hexRatio - backingStakeRatio) / backingStakeRatio)
          
          return {
            backingStakeYield,
            backingStakeValue,
            marketStakeValue,
            backingStakeRatio,
            backingDiscount,
            lastUpdated: new Date()
          }
        }

        // If prices aren't available, return null to maintain loading state
        return null
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

  const isLoading = swrLoading || priceLoading || pHexLoading || eHexLoading

  // Return loading state if any data is still loading
  if (isLoading) {
    return {
      backingData: null,
      isLoading: true,
      error: null
    }
  }

  return {
    backingData: data,
    isLoading: false,
    error
  }
}