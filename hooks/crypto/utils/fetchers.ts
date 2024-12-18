import { PAIR_ADDRESSES } from '@/constants/crypto'

interface PairInfo {
  chain: string
  pairAddress: string
}

export function getPairInfo(symbol: string): PairInfo {
  console.log('Getting pair info for:', symbol) // Debug
  const pairInfo = PAIR_ADDRESSES[symbol]
  if (!pairInfo) {
    throw new Error(`No pair info found for symbol: ${symbol}`)
  }
  console.log('Found pair info:', pairInfo) // Debug
  return pairInfo
}

export async function fetchPairData(chain: string, pairAddress: string) {
  console.log('Fetching pair data:', { chain, pairAddress }) // Debug
  const baseUrl = `https://api.dexscreener.com/latest/dex/pairs/${chain}/`
  const response = await fetch(`${baseUrl}${pairAddress}`)
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  const data = await response.json()
  const pair = data.pairs?.[0]
  
  if (!pair) {
    throw new Error('No pair data found')
  }
  
  console.log('Fetched pair data:', pair) // Debug
  return pair
}

export function getChainName(chainId: string): string {
  return chainId === '1' ? 'ethereum' : 'pulsechain'
} 