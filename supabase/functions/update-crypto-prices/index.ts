import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function fetchCryptoPrices() {
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  
  // Format date as DD-MM-YYYY
  const yesterdayStr = yesterday.toLocaleDateString('en-GB').split('/').join('-')
  
  // Fetch daily prices for each coin
  const coins = ['bitcoin', 'ethereum', 'solana', 'hex-pulsechain']
  const prices = {}
  
  for (const coin of coins) {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coin}/history?date=${yesterdayStr}`
    )
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${coin} price from CoinGecko`)
    }
    
    const data = await response.json()
    prices[coin] = data.market_data.current_price.usd
  }
  
  return {
    date: yesterday.toISOString(),  // Keep ISO format for database
    btc_price: prices.bitcoin,
    eth_price: prices.ethereum,
    sol_price: prices.solana,
    hex_price: prices['hex-pulsechain']
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
      
      const { data: insertedData, error } = await supabaseClient
        .from('historic_prices')
        .insert([data])
        .select()

      if (error) throw error

      return new Response(
        JSON.stringify({ success: true, data: insertedData }),
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