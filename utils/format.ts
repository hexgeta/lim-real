export function formatNumber(value: number, options: {
  prefix?: string,
  suffix?: string,
  decimals?: number,
  compact?: boolean,
  percentage?: boolean
} = {}) {
  const { 
    prefix = '', 
    suffix = '',
    decimals = 2,
    compact = false,
    percentage = false
  } = options

  let formattedValue = value
  
  if (percentage) {
    formattedValue = value * 100
    return prefix + new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(formattedValue) + '%'
  }

  if (compact) {
    if (value >= 1e9) return prefix + Math.round(value / 1e9) + 'B' + suffix
    if (value >= 1e6) return prefix + Math.round(value / 1e6) + 'M' + suffix
    if (value >= 1e3) return prefix + Math.round(value / 1e3) + 'K' + suffix
  }

  // For very small numbers (like crypto prices)
  if (value < 0.001) {
    return prefix + value.toFixed(7) + suffix
  }

  return prefix + new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value) + suffix
}

export function formatPrice(value: number) {
  return formatNumber(value, { prefix: '$', decimals: 4 })
}

export function formatHexRatio(value: number) {
  return formatNumber(value, { decimals: 2 })
}

export function formatBacking(value: number) {
  return formatNumber(value, { decimals: 2, compact: true })
} 