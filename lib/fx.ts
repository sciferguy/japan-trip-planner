const FX_CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours
const cache = new Map<string, { rate: number; timestamp: number }>()

export async function getExchangeRate(
  from: string,
  to: string
): Promise<number> {
  const cacheKey = `${from}_${to}`
  const cached = cache.get(cacheKey)
  
  if (cached && Date.now() - cached.timestamp < FX_CACHE_DURATION) {
    return cached.rate
  }

  // Using exchangerate-api.com free tier
  const response = await fetch(
    `https://api.exchangerate-api.com/v4/latest/${from}`
  )
  const data = await response.json()
  const rate = data.rates[to]
  
  cache.set(cacheKey, { rate, timestamp: Date.now() })
  
  return rate
}