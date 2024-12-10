import useSWR from 'swr';
import { TOKEN_CONSTANTS } from '@/constants/crypto';
import { useMemo } from 'react';
import { supabase } from '@/supabaseClient';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const CumBackingValueDECI = () => {
  // Fetch HEX daily stats for yield calculations
  const { data: hexData, error: hexError } = useSWR(
    'https://hexdailystats.com/fulldatapulsechain',
    fetcher
  );

  // Fetch price data from Supabase
  const { data: priceData, error: priceError } = useSWR(
    'price_data',
    async () => {
      console.log('Fetching DECI price data...');
      const { data, error } = await supabase
        .from('historic_prices')
        .select('*')  // Select all columns to see what we have
        .limit(5);    // Just get a few records to check

      if (data && data.length > 0) {
        console.log('Available columns:', Object.keys(data[0]));
        console.log('Sample data:', data);
      }

      const { data: actualData, error: actualError } = await supabase
        .from('historic_prices')
        .select('date, hex_price, ehex_price, deci_price')
        .gte('date', '2022-09-27')  // Removed extra 0
        .not('deci_price', 'is', null)
        .order('date', { ascending: true });
      
      if (actualError) {
        console.error('Supabase error:', actualError);
        throw actualError;
      }

      if (actualData && actualData.length > 0) {
        console.log('DECI Data:', {
          total: actualData.length,
          first: actualData[0],
          last: actualData[actualData.length - 1]
        });
      } else {
        console.warn('No DECI data found');
      }

      return actualData;
    }
  );

  const processedData = useMemo(() => {
    if (!hexData || !priceData) {
      console.log('Missing data:', { hasHexData: !!hexData, hasPriceData: !!priceData });
      return [];
    }

    console.log('Processing data:', {
      hexDataLength: hexData.length,
      priceDataLength: priceData.length
    });

    // Create a map of dates to price ratios from Supabase data
    const priceMap = new Map(
      priceData.map(day => {
        const hexPrice = day.hex_price ? parseFloat(day.hex_price) : parseFloat(day.ehex_price);
        const deciPrice = parseFloat(day.deci);
        const ratio = deciPrice / hexPrice;

        if (isNaN(ratio)) {
          console.warn('Invalid ratio for date:', {
            date: day.date,
            hexPrice,
            deciPrice,
            rawDeci: day.deci
          });
        }

        return [
          new Date(day.date).toISOString().split('T')[0],
          { priceRatio: isNaN(ratio) ? null : ratio }
        ];
      })
    );

    const TSHARES = TOKEN_CONSTANTS.pDECI.TSHARES;
    const STAKE_PRINCIPLE = TOKEN_CONSTANTS.pDECI.STAKE_PRINCIPLE;
    const START_DATE = TOKEN_CONSTANTS.pDECI.LAUNCH_DATE;

    console.log('Constants:', {
      TSHARES,
      STAKE_PRINCIPLE,
      START_DATE: START_DATE.toISOString()
    });

    // Process HEX daily stats data
    const sortedData = hexData
      .filter((day: any) => new Date(day.date) >= START_DATE)
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let cumulativeYield = 0;

    const result = sortedData.map((day: any) => {
      // Calculate daily yield using payoutPerTshareHEX
      const dailyYield = day.payoutPerTshareHEX * TSHARES || 0;
      cumulativeYield += dailyYield;
      const yieldAdjustedBacking = (cumulativeYield + STAKE_PRINCIPLE) / STAKE_PRINCIPLE;

      // Get price ratio from Supabase data
      const dateKey = new Date(day.date).toISOString().split('T')[0];
      const priceData = priceMap.get(dateKey);

      return {
        date: new Date(day.date),
        discount: priceData?.priceRatio,
        backingValue: 1,
        backingRatio: yieldAdjustedBacking,
        dailyYield,
        cumulativeYield
      };
    });

    console.log('Final data:', {
      total: result.length,
      first: result[0],
      last: result[result.length - 1]
    });

    return result;

  }, [hexData, priceData]);

  return {
    data: processedData,
    error: hexError || priceError,
    isLoading: !hexData || !priceData
  };
}; 