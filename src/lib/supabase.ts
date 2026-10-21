import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export function formatMoney(amount: number, currency: string = 'CDF'): string {
  if (amount == null || isNaN(amount as any)) return '0 CDF'
  try {
    return new Intl.NumberFormat('fr-CD', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${Number(amount).toLocaleString('fr-FR')} ${currency}`
  }
}

export const formatPrice = formatMoney