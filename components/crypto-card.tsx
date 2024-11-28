import Image from 'next/image'
import { Card } from "@/components/ui/card"
import { TokenData } from '@/types/crypto'
import { TOKEN_LOGOS } from '@/constants/crypto'
import { useCryptoPrice } from '@/hooks/crypto/useCryptoPrice'
import { useCryptoRatio } from '@/hooks/crypto/useCryptoRatio'
import { useBackingValue } from '@/hooks/crypto/useBackingValue'
import { formatNumber, formatPrice, formatHexRatio, formatBacking } from '@/utils/format'

interface CryptoCardProps {
  data: TokenData
  variant?: 'default' | 'wide'
}

function convertSymbol(symbol: string): string {
  const [base, chain] = symbol.split('-')
  if (!chain) return symbol // If no chain specified, return as is
  
  const prefix = chain === 'PLS' ? 'p' : 'e'
  return `${prefix}${base}`
}

export function CryptoCard({ data, variant = 'default' }: CryptoCardProps) {
  const { priceData, isLoading: priceLoading } = useCryptoPrice(data.symbol)
  const { ratioData, isLoading: ratioLoading } = useCryptoRatio(data.symbol)
  const { backingData, isLoading: backingLoading } = useBackingValue(data.symbol)
  
  const baseSymbol = data.symbol.slice(1)
  const showBacking = baseSymbol !== 'HEX'

  // Check if each piece of data is ready
  const hasPriceData = !priceLoading && priceData
  const hasRatioData = !ratioLoading && ratioData
  const hasBackingData = !backingLoading && backingData

  if (variant === 'wide') {
    return (
      <Card className="bg-black text-white p-4 rounded-xl h-[144px] md:h-auto border-2 border-white/10">
        <div className="flex items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {TOKEN_LOGOS[baseSymbol] && (
                <Image
                  src={TOKEN_LOGOS[baseSymbol]}
                  alt={`${baseSymbol} logo`}
                  width={24}
                  height={24}
                  className={baseSymbol === 'HEX' ? '' : 'rounded-full'}
                />
              )}
              <div className="text-xl font-bold">{baseSymbol}</div>
            </div>
            <div className="flex items-baseline gap-2">
              {!hasPriceData ? (
                <div className="skeleton h-8 w-24 rounded" />
              ) : (
                <div className="text-2xl font-bold">
                  {formatPrice(priceData.price)}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-black text-white p-4 rounded-xl border-2 border-white/10">
      <div className="flex items-center justify-between m-2">
        <div className="flex items-center gap-2">
          {TOKEN_LOGOS[baseSymbol] && (
            <Image
              src={TOKEN_LOGOS[baseSymbol]}
              alt={`${baseSymbol} logo`}
              width={24}
              height={24}
              className={baseSymbol === 'HEX' ? '' : 'rounded-full'}
            />
          )}
          <div className="text-xl font-bold">{baseSymbol}</div>
        </div>
      </div>

      <div>
        <div className="flex items-baseline gap-2">
          {!hasPriceData ? (
            <div className="skeleton h-8 w-24 rounded" />
          ) : (
            <div className="text-2xl font-bold">
              {formatPrice(priceData.price)}
            </div>
          )}
        </div>
        {!hasRatioData ? (
          <div className="skeleton h-4 w-20 rounded mt-1" />
        ) : (
          <div className="text-sm text-zinc-500">
            {formatHexRatio(ratioData.hexRatio)} HEX
          </div>
        )}
        {showBacking && hasBackingData && (
          <>
            <hr className="border-zinc-800 my-2" />
            <div className="text-sm text-zinc-500">
              Stake backing: {formatNumber(backingData.backingStakeRatioInverse, { decimals: 2 })}
            </div>
            <div className="text-sm text-zinc-500">
              Backing discount: {formatNumber(backingData.backingDiscount, { decimals: 2, percentage: true })}
            </div>
          </>
        )}
        {showBacking && !hasBackingData && (
          <>
            <hr className="border-zinc-800 my-2" />
            <div className="space-y-2">
              <div className="skeleton h-4 w-32 rounded" />
              <div className="skeleton h-4 w-28 rounded" />
            </div>
          </>
        )}
      </div>
    </Card>
  )
}

