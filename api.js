export const fetchHexData = async () => {
    const response = await fetch("https://hexdailystats.com/livedata");
    const data = await response.json();
    return {
      price: data.price_Pulsechain,
      payoutPerTshare: data.payoutPerTshare_Pulsechain,
      tshareRate: data.tshareRateHEX_Pulsechain,
    };
  };
  
  export const fetchPulsechainPrice = async () => {
    const tokenAddress = '0xA1077a294dDE1B09bB078844df40758a5D0f9a27';
    const url = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`;
    const response = await fetch(url);
    const data = await response.json();
    const targetPairAddress = '0xe56043671df55de5cdf8459710433c10324de0ae'.toLowerCase();
    const pair = data.pairs.find(p => p.pairAddress.toLowerCase() === targetPairAddress);
    return parseFloat(pair.priceUsd);
  };
  
  export const fetchGasPrice = async () => {
    const url = 'https://api.scan.pulsechain.com/api/v2/stats';
    const response = await fetch(url);
    const data = await response.json();
    return data.gas_prices.average;
  };