// 'use client'

// import { useState } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"
// import { usePublicClient } from 'wagmi'
// import { mainnet, pulsechain } from 'wagmi/chains'

// // Add these types at the top
// type DexScreenerResponse = {
//   pair?: {
//     priceUsd: string;
//     // Add other fields if needed
//   };
// };

// type PortfolioStats = {
//   [token: string]: {
//     balance: string;
//     symbol: string;
//     daysRemaining: number | null;
//     priceUsd: string;
//     value: string;
//   }
// }

// // Add at the top with other types
// type PairAddresses = {
//   [chain: string]: {
//     [token: string]: string;
//   };
// };

// const PRESET_TOKENS = {
//   'MAXI': '0x0d86EB9f43C57f6FF3BC9E23D8F9d82503f0e84b',
//   'DECI': '0x6b32022693210cD2Cfc466b9Ac0085DE8fC34eA6',
//   'LUCKY': '0x6B0956258fF7bd7645aa35369B55B61b8e6d6140',
//   'TRIO': '0xF55cD1e399e1cc3D95303048897a680be3313308',
//   'BASE': '0xe9f84d418B008888A992Ff8c6D22389C2C3504e0',
//   'Other token': 'custom'
// } as const

// // Add after PRESET_TOKENS
// const PAIR_ADDRESSES: PairAddresses = {
//   ethereum: {
//     'HEX': '0x9e0905249ceefffb9605e034b534544684a58be6',
//     'MAXI': '0x2ae4517B2806b84A576C10F698d6567CE80A6490',
//     'DECI': '0x39e87e2baa67f3c7f1dd58f58014f23f97e3265e',
//     'LUCKY': '0x7327325e5F41d4c1922a9DFc87d8a3b3F1ae5C1F',
//     'TRIO': '0xda72b9e219d87ea31b4a1929640d9e960362470d',
//     'BASE': '0x7b33fe2C4f48da97dc2BAa1f32f869c50Dc1dF85',
//   },
//   pulsechain: {
//     'HEX': '0xf1f4ee610b2babb05c635f726ef8b0c568c8dc65',
//     'MAXI': '0xd63204ffcefd8f8cbf7390bbcd78536468c085a2',
//     'DECI': '0x969af590981bb9d19ff38638fa3bd88aed13603a',
//     'LUCKY': '0x52d4b3f479537a15d0b37b6cdbdb2634cc78525e',
//     'TRIO': '0x0b0f8f6c86c506b70e2a488a451e5ea7995d05c9',
//     'BASE': '0xb39490b46d02146f59e80c6061bb3e56b824d672',
//   }
// };

// // Basic ERC20 ABI for common functions
// const erc20Abi = [
//   {
//     "inputs": [],
//     "name": "name",
//     "outputs": [{ "type": "string" }],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "symbol",
//     "outputs": [{ "type": "string" }],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "decimals",
//     "outputs": [{ "type": "uint8" }],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "totalSupply",
//     "outputs": [{ "type": "uint256" }],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   // Include both naming conventions
//   {
//     "inputs": [],
//     "name": "getStakeEndDay",
//     "outputs": [{ "type": "uint256" }],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "getStakeStartDay",
//     "outputs": [{ "type": "uint256" }],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "STAKE_END_DAY",
//     "outputs": [{ "type": "uint256" }],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "STAKE_START_DAY",
//     "outputs": [{ "type": "uint256" }],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "getHexDay",
//     "outputs": [{ "type": "uint256" }],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [{ "type": "address" }],
//     "name": "balanceOf",
//     "outputs": [{ "type": "uint256" }],
//     "stateMutability": "view",
//     "type": "function"
//   }
// ] as const;

// const PortfolioTracker = () => {
//   // Create separate clients and track their status
//   const ethereumClient = usePublicClient({ chainId: mainnet.id })
//   const pulsechainClient = usePublicClient({ chainId: pulsechain.id })
//   const [walletAddress, setWalletAddress] = useState('')
//   const [isPulsechain, setIsPulsechain] = useState(false)
//   const [portfolioStats, setPortfolioStats] = useState<PortfolioStats | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   // Update the fetchTokenPrice function
//   const fetchTokenPrice = async (tokenAddress: string, chainId: number) => {
//     try {
//       const chain = chainId === 1 ? 'ethereum' : 'pulsechain';
      
//       // Find the token name from PRESET_TOKENS
//       const tokenName = Object.entries(PRESET_TOKENS).find(([_, addr]) => 
//         addr.toLowerCase() === tokenAddress.toLowerCase()
//       )?.[0];

//       if (!tokenName) return '0';

//       const pairAddress = PAIR_ADDRESSES[chain][tokenName];
//       if (!pairAddress) return '0';

//       const response = await fetch(
//         `https://api.dexscreener.com/latest/dex/pairs/${chain}/${pairAddress}`
//       );
//       const data = await response.json();
//       return data.pair?.priceUsd || '0';
//     } catch (error) {
//       console.error('Error fetching price:', error);
//       return '0';
//     }
//   };

//   const checkPortfolio = async (address: string) => {
//     if (address.length === 42 && address.startsWith('0x')) {
//       setLoading(true)
//       setPortfolioStats(null)
      
//       try {
//         const client = isPulsechain ? pulsechainClient : ethereumClient
//         const chainId = isPulsechain ? 369 : 1
//         console.log('=== PORTFOLIO CHECK ===')
//         console.log('Network:', isPulsechain ? 'Pulsechain' : 'Ethereum')
        
//         const stats: PortfolioStats = {}
//         let totalValue = 0

//         for (const [tokenName, tokenAddress] of Object.entries(PRESET_TOKENS)) {
//           try {
//             console.log(`Checking ${tokenName} at ${tokenAddress}...`)
//             const balance = await client.readContract({
//               abi: erc20Abi,
//               address: tokenAddress as `0x${string}`,
//               functionName: 'balanceOf',
//               args: [address as `0x${string}`]
//             })
//             console.log(`Raw balance for ${tokenName}:`, balance.toString())
            
//             const symbol = await client.readContract({
//               abi: erc20Abi,
//               address: tokenAddress as `0x${string}`,
//               functionName: 'symbol',
//             })
            
//             const currentDay = await client.readContract({
//               abi: erc20Abi,
//               address: tokenAddress as `0x${string}`,
//               functionName: 'getHexDay',
//             })
            
//             let stakeEndDay
//             try {
//               stakeEndDay = await client.readContract({
//                 abi: erc20Abi,
//                 address: tokenAddress as `0x${string}`,
//                 functionName: tokenName === 'MAXI' ? 'getStakeEndDay' : 'STAKE_END_DAY',
//               })
//             } catch (err) {
//               stakeEndDay = null
//             }

//             const decimals = await client.readContract({
//               abi: erc20Abi,
//               address: tokenAddress as `0x${string}`,
//               functionName: 'decimals',
//             })

//             const formattedBalance = Number(balance) / Math.pow(10, Number(decimals))
//             const priceUsd = await fetchTokenPrice(
//               tokenAddress as string, 
//               chainId
//             )
//             const value = formattedBalance * Number(priceUsd)
//             totalValue += value

//             if (formattedBalance > 0) {
//               stats[tokenName] = {
//                 balance: formattedBalance.toLocaleString(),
//                 symbol,
//                 daysRemaining: stakeEndDay ? Number(stakeEndDay) - Number(currentDay) : null,
//                 priceUsd,
//                 value: value.toLocaleString('en-US', {
//                   style: 'currency',
//                   currency: 'USD'
//                 })
//               }
//             }
//           } catch (err) {
//             console.error(`Error checking ${tokenName}:`, err)
//           }
//         }

//         setPortfolioStats(stats)
//         setError(null)
//       } catch (err) {
//         console.error('Error details:', err)
//         setError(err instanceof Error ? err.message : 'Error fetching portfolio stats')
//         setPortfolioStats(null)
//       }
//       setLoading(false)
//     }
//   }

//   return (
//     <Card className="w-full max-w-md mx-auto">

//       <CardContent className="space-y-4 p-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <span className={!isPulsechain ? 'font-bold' : 'text-gray-500'}>Ethereum</span>
//             <Switch
//               id="network-toggle"
//               checked={isPulsechain}
//               onCheckedChange={async (checked) => {
//                 console.log('Switching to:', checked ? 'Pulsechain' : 'Ethereum')
//                 // Clear previous results first
//                 setPortfolioStats(null)
//                 // Update chain state
//                 setIsPulsechain(checked)
//                 // Wait for state update to complete
//                 await new Promise(resolve => setTimeout(resolve, 0))
//                 // Then check portfolio if we have an address
//                 if (walletAddress) {
//                   checkPortfolio(walletAddress)
//                 }
//               }}
//             />
//             <span className={isPulsechain ? 'font-bold' : 'text-gray-500'}>Pulsechain</span>
//           </div>
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="address">Enter Wallet Address</Label>
//           <Input
//             id="address"
//             value={walletAddress}
//             onChange={(e) => {
//               const newAddress = e.target.value
//               setWalletAddress(newAddress)
//               // Check immediately if we have a valid address
//               if (newAddress.length === 42 && newAddress.startsWith('0x')) {
//                 checkPortfolio(newAddress)
//               }
//             }}
//             placeholder="0x..."
//             required
//           />
//         </div>
        
//         {loading && (
//           <div className="p-4 bg-gray-100 rounded">
//             <p>Loading portfolio on {isPulsechain ? 'Pulsechain' : 'Ethereum'}...</p>
//           </div>
//         )}
//         {!loading && portfolioStats && Object.keys(portfolioStats).length > 0 && (
//           <div className="p-4 bg-gray-100 rounded space-y-2">
//             {Object.entries(portfolioStats).map(([tokenName, stats]) => (
//               <div key={tokenName} className="border-b pb-2 last:border-b-0">
//                 <p><b>{stats.balance} {stats.symbol}</b></p>
//                 <p className="text-sm text-gray-600">
//                   Price: ${Number(stats.priceUsd).toFixed(4)}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   Market value: {stats.value}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   Backing value: tbc
//                 </p>
//                 {stats.daysRemaining !== null && (
//                   <p className="text-sm text-gray-600">Stake days remaining: {stats.daysRemaining}</p>
//                 )}
//               </div>
//             ))}
//             <div className="mt-4 pt-2 border-t">
//               <p className="font-bold">
//                 Total: {Object.values(portfolioStats)
//                   .reduce((acc, curr) => acc + Number(curr.value.replace(/[^0-9.-]+/g, '')), 0)
//                   .toLocaleString('en-US', {
//                     style: 'currency',
//                     currency: 'USD'
//                   })}
//               </p>
//             </div>
//           </div>
//         )}
        
//         {!loading && portfolioStats && Object.keys(portfolioStats).length === 0 && (
//           <div className="p-4 bg-gray-100 rounded">
//             <p>No tokens found on {isPulsechain ? 'Pulsechain' : 'Ethereum'}</p>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }

// export default PortfolioTracker;

