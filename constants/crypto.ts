import { PairData } from '@/types/crypto'

export const TOKEN_LOGOS: { [key: string]: string } = {
  'HEX': '/coin-logos/HEX.svg',
  'MAXI': '/coin-logos/maxi/MAXI.svg',
  'DECI': '/coin-logos/maxi/DECI.svg',
  'LUCKY': '/coin-logos/maxi/LUCKY.svg',
  'TRIO': '/coin-logos/maxi/TRIO.svg',
  'BASE': '/coin-logos/maxi/BASE.svg',
  'PLS': '/coin-logos/PLS.svg',
  'PLSX': '/coin-logos/PLSX.svg',
  'WETH': '/coin-logos/WETH.svg',
  'HDRN': '/coin-logos/HDRN.svg',
  'ICOSA': '/coin-logos/ICOSA.svg',
  'INC': '/coin-logos/INC.svg',
}

// Token-specific constants
export const TOKEN_CONSTANTS = {
  pHEX: {
    PAIR: {
      pairAddress: '0xf1f4ee610b2babb05c635f726ef8b0c568c8dc65',
      chain: 'pulsechain'
    }
  },
  eHEX: {
    PAIR: {
      pairAddress: '0x9e0905249ceefffb9605e034b534544684a58be6',
      chain: 'ethereum'
    }
  },
  pMAXI: {
    LAUNCH_DATE: new Date('2022-05-01'),
    TSHARES: 42104.44,
    STAKE_PRINCIPLE: 294323603.77,
    TOKEN_SUPPLY: 274546065,
    STAKE_START_DATE: new Date('2022-05-01'),
    STAKE_END_DATE: new Date('2037-07-16'),
    TOTAL_STAKED_DAYS: 5555,
    PAIR: {
      pairAddress: '0xd63204ffcefd8f8cbf7390bbcd78536468c085a2',
      chain: 'pulsechain'
    }
  },
  eMAXI: {
    LAUNCH_DATE: new Date('2022-05-01'),
    TSHARES: 42104.44,
    STAKE_PRINCIPLE: 294323603.77,
    TOKEN_SUPPLY: 274546065,
    STAKE_START_DATE: new Date('2022-05-01'),
    STAKE_END_DATE: new Date('2037-07-16'),
    TOTAL_STAKED_DAYS: 5555,
    PAIR: {
      pairAddress: '0x2ae4517B2806b84A576C10F698d6567CE80A6490',
      chain: 'ethereum'
    }
  },
  pDECI: {
    LAUNCH_DATE: new Date('2022-09-27'),
    STAKE_PRINCIPLE: 565991988,
    TOKEN_SUPPLY: 565991988,
    TSHARES: 71337.83,
    STAKE_START_DATE: new Date('2022-09-27'),
    STAKE_END_DATE: new Date('2032-11-09'),
    TOTAL_STAKED_DAYS: 3696,
    PAIR: {
      pairAddress: '0x969af590981bb9d19ff38638fa3bd88aed13603a',
      chain: 'pulsechain'
    }
  },
  eDECI: {
    LAUNCH_DATE: new Date('2022-09-27'),
    STAKE_PRINCIPLE: 565991988,
    TOKEN_SUPPLY: 565991988,
    TSHARES: 71337.83,
    STAKE_START_DATE: new Date('2022-09-27'),
    STAKE_END_DATE: new Date('2032-11-09'),
    TOTAL_STAKED_DAYS: 3696,
    PAIR: {
      pairAddress: '0x39e87e2baa67f3c7f1dd58f58014f23f97e3265e',
      chain: 'pulsechain'
    }
  },
  pLUCKY: {
    LAUNCH_DATE: new Date('2022-09-27'),
    STAKE_PRINCIPLE: 74985502,
    TOKEN_SUPPLY: 74985502,
    TSHARES: 7524.68,
    STAKE_START_DATE: new Date('2022-09-27'),
    STAKE_END_DATE: new Date('2029-09-25'),
    TOTAL_STAKED_DAYS: 2555,
    PAIR: {
      pairAddress: '0x52d4b3f479537a15d0b37b6cdbdb2634cc78525e',
      chain: 'pulsechain'
    }
  },
  eLUCKY: {
    LAUNCH_DATE: new Date('2022-09-27'),
    STAKE_PRINCIPLE: 74985502,
    TOKEN_SUPPLY: 74985502,
    TSHARES: 7524.68,
    STAKE_START_DATE: new Date('2022-09-27'),
    STAKE_END_DATE: new Date('2029-09-25'),
    TOTAL_STAKED_DAYS: 2555,
    PAIR: {
      pairAddress: '0x7327325e5F41d4c1922a9DFc87d8a3b3F1ae5C1F',
      chain: 'ethereum'
    }
  },
  pTRIO: {
    LAUNCH_DATE: new Date('2022-09-27'),
    STAKE_PRINCIPLE: 69617911,
    TOKEN_SUPPLY: 69617911,
    TSHARES: 4698.32,
    STAKE_START_DATE: new Date('2022-09-27'),
    STAKE_END_DATE: new Date('2025-10-12'),
    TOTAL_STAKED_DAYS: 1111,
    PAIR: {
      pairAddress: '0x0b0f8f6c86c506b70e2a488a451e5ea7995d05c9',
      chain: 'pulsechain'
    }
  },
  eTRIO: {
    LAUNCH_DATE: new Date('2022-09-27'),
    STAKE_PRINCIPLE: 69617911,
    TOKEN_SUPPLY: 69617911,
    TSHARES: 4698.32,
    STAKE_START_DATE: new Date('2022-09-27'),
    STAKE_END_DATE: new Date('2025-10-12'),
    TOTAL_STAKED_DAYS: 1111,
    PAIR: {
      pairAddress: '0xda72b9e219d87ea31b4a1929640d9e960362470d',
      chain: 'pulsechain'
    }
  },
  pBASE: {
    LAUNCH_DATE: new Date('2022-09-27'),
    STAKE_PRINCIPLE: 100033101,
    TOKEN_SUPPLY: 100033101,
    TSHARES: 5107.53,
    STAKE_START_DATE: new Date('2022-09-27'),
    STAKE_END_DATE: new Date('2023-10-01'),
    TOTAL_STAKED_DAYS: 369,
    PAIR: {
      pairAddress: '0xb39490b46d02146f59e80c6061bb3e56b824d672',
      chain: 'pulsechain'
    }
  },
  eBASE: {
    LAUNCH_DATE: new Date('2022-09-27'),
    STAKE_PRINCIPLE: 100033101,
    TOKEN_SUPPLY: 100033101,
    TSHARES: 5107.53,
    STAKE_START_DATE: new Date('2022-09-27'),
    STAKE_END_DATE: new Date('2023-10-01'),
    TOTAL_STAKED_DAYS: 369,
    PAIR: {
      pairAddress: '0x7b33fe2C4f48da97dc2BAa1f32f869c50Dc1dF85',
      chain: 'pulsechain'
    }
  },
  pBASE2: {
    LAUNCH_DATE: new Date('2023-10-10'),
    STAKE_PRINCIPLE: 109163369,
    TOKEN_SUPPLY: 97197332,
    TSHARES: 4532.11,
    STAKE_START_DATE: new Date('2023-10-10'),
    STAKE_END_DATE: new Date('2024-10-13'),
    TOTAL_STAKED_DAYS: 369,
    PAIR: {
      pairAddress: '0xb39490b46d02146f59e80c6061bb3e56b824d672',
      chain: 'pulsechain'
    }
  },
  eBASE2: {
    LAUNCH_DATE: new Date('2023-10-10'),
    STAKE_PRINCIPLE: 94725486,
    TOKEN_SUPPLY: 84316269,
    TSHARES: 3917.41,
    STAKE_START_DATE: new Date('2023-10-10'),
    STAKE_END_DATE: new Date('2024-10-13'),
    TOTAL_STAKED_DAYS: 369,
    PAIR: {
      pairAddress: '0x7b33fe2C4f48da97dc2BAa1f32f869c50Dc1dF85',
      chain: 'pulsechain'
    }
  },
  // pBASE3: {
  //   LAUNCH_DATE: new Date('2022-09-27'),
  //   STAKE_PRINCIPLE: 109163369,
  //   TOKEN_SUPPLY: 97197332,
  //   TSHARES: 4532.11,
  //   STAKE_START_DATE: new Date('2023-10-10'),
  //   STAKE_END_DATE: new Date('2024-10-13'),
  //   TOTAL_STAKED_DAYS: 369,
  //   PAIR: {
  //     pairAddress: '0xb39490b46d02146f59e80c6061bb3e56b824d672',
  //     chain: 'pulsechain'
  //   }
  // },
  // eBASE3: {
  //   LAUNCH_DATE: new Date('2022-09-27'),
  //   STAKE_PRINCIPLE: 109163369,
  //   TOKEN_SUPPLY: 97197332,
  //   TSHARES: 4532.11,
  //   STAKE_START_DATE: new Date('2023-10-10'),
  //   STAKE_END_DATE: new Date('2024-10-13'),
  //   TOTAL_STAKED_DAYS: 369,
  //   PAIR: {
  //     pairAddress: '0x7b33fe2C4f48da97dc2BAa1f32f869c50Dc1dF85',
  //     chain: 'pulsechain'
  //   }
  // },
  PLS: {
    PAIR: {
      pairAddress: '0xe56043671df55de5cdf8459710433c10324de0ae',
      chain: 'pulsechain'
    }
  },
  PLSX: {
    PAIR: {
      pairAddress: '0x1b45b9148791d3a104184cd5dfe5ce57193a3ee9',
      chain: 'pulsechain'
    }
  },
  INC: {
    PAIR: {
      pairAddress: '0xf808Bb6265e9Ca27002c0A04562Bf50d4FE37EAA',
      chain: 'pulsechain'
    }
  },
  pHDRN: {
    PAIR: {
      pairAddress: '0xa67F04E03194F3A1064f4FF4FF0f0f0144fD5EfF',
      chain: 'pulsechain'
    }
  },
  eHDRN: {
    PAIR: {
      pairAddress: '0x035a397725d3c9fc5ddd3e56066b7b64c749014e',
      chain: 'ethereum'
    }
  },
  pICOSA: {
    PAIR: {
      pairAddress: '0xe5bb65e7a384D2671C96cfE1Ee9663F7B03a573e',
      chain: 'pulsechain'
    }
  },
  eICOSA: {
    PAIR: {
      pairAddress: '0x4676b75eecf653c0a439b5744f52f70674e8fb07',
      chain: 'ethereum'
    }
  }
}

export const API_ENDPOINTS = {
  historic_pulsechain: 'https://hexdailystats.com/fulldatapulsechain',
  historic_ethereum: 'https://hexdailystats.com/fulldata',
  livedata: 'https://hexdailystats.com/livedata'
}