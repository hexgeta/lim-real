import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function fetchCryptoPrices() {
  const prices = {}
  
  // Define all pairs to fetch
  const pairs = {
    hex: '0xf1F4ee610b2bAbB05C635F726eF8B0C568c8dc65', // PulseChain
    ehex: '0x9e0905249ceefffb9605e034b534544684a58be6', // Ethereum
    pls: '0x6753560538eca67617a9ce605178f788be7e524e', // PulseChain
    plsx: '0x1b45b9148791d3a104184cd5dfe5ce57193a3ee9', // PulseChain
    inc: '0xf808Bb6265e9Ca27002c0A04562Bf50d4FE37EAA', // PulseChain
    btc: '0xCBCdF9626bC03E24f779434178A73a0B4bad62eD', // Ethereum
    eth: '0x11b815efB8f581194ae79006d24E0d814B7697F6', // Ethereum
    sol: '0x127452F3f9cDc0389b0Bf59ce6131aA3Bd763598',  // Ethereum
    maxi: '0xd63204ffcefd8f8cbf7390bbcd78536468c085a2', // PulseChain
    deci: '0x969af590981bb9d19ff38638fa3bd88aed13603a', // PulseChain
    lucky: '0x52d4b3f479537a15d0b37b6cdbdb2634cc78525e', // PulseChain
    trio: '0x0b0f8f6c86c506b70e2a488a451e5ea7995d05c9', // PulseChain
    base: '0xb39490b46d02146f59e80c6061bb3e56b824d672', // PulseChain
    emaxi: '0x2ae4517B2806b84A576C10F698d6567CE80A6490', // Ethereum
    edeci: '0x39e87e2baa67f3c7f1dd58f58014f23f97e3265e', // PulseChain
    elucky: '0x7327325e5F41d4c1922a9DFc87d8a3b3F1ae5C1F', // Ethereum
    etrio: '0xda72b9e219d87ea31b4a1929640d9e960362470d', // PulseChain
    ebase: '0x7b33fe2C4f48da97dc2BAa1f32f869c50Dc1dF85'  // PulseChain
  }
  
  // Fetch all prices in parallel
  const fetchPromises = Object.entries(pairs).map(async ([token, address]) => {
    const chain = ['hex', 'pls', 'plsx', 'inc', 'maxi', 'deci', 'lucky', 'trio', 'base', 'edeci', 'etrio', 'ebase'].includes(token) 
      ? 'pulsechain' 
      : 'ethereum'
    try {
      const response = await fetch(
        `https://api.dexscreener.com/latest/dex/pairs/${chain}/${address}`
      )
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${token} price from DexScreener`)
      }
      
      const data = await response.json()
      prices[token] = parseFloat(data?.pair?.priceUsd) || null
    } catch (error) {
      console.error(`Error fetching ${token} price:`, error)
      prices[token] = null
    }
  })
  
  await Promise.all(fetchPromises)
  
  return {
    date: new Date().toISOString(),
    btc_price: prices.btc,
    eth_price: prices.eth,
    sol_price: prices.sol,
    hex_price: prices.hex,
    ehex_price: prices.ehex,
    pls_price: prices.pls,
    plsx_price: prices.plsx,
    inc_price: prices.inc,
    maxi_price: prices.maxi,
    emaxi_price: prices.emaxi,
    deci_price: prices.deci,
    edeci_price: prices.edeci,
    lucky_price: prices.lucky,
    elucky_price: prices.elucky,
    trio_price: prices.trio,
    etrio_price: prices.etrio,
    base_price: prices.base,
    ebase_price: prices.ebase
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    if (req.method === 'GET') {
      const { data, error } = await supabaseClient
        .from('historic_prices')
        .select('*')
        .order('date', { ascending: false })
        .limit(4)

      if (error) throw error

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (req.method === 'POST') {
      const data = await fetchCryptoPrices()
      
      const [testTableResult] = await Promise.all([
        supabaseClient
          .from('historic_prices_test3')
          .insert([data])
          .select()
      ])

      // Check for errors
      if (testTableResult.error) throw testTableResult.error

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: {
            historic_prices_test3: testTableResult.data
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    return new Response('Method not allowed', { 
      headers: corsHeaders,
      status: 405 
    })
  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
}) 