export type Language = 'en' | 'zh'

export type Currency = 'TWD' | 'USD' | 'GBP'

export interface SalaryConfig {
  mode: 'monthly' | 'annual' | 'hourly'
  amount: number
  daysPerMonth: number
  hoursPerDay: number
  hoursPerWeek: number
  weeksPerYear: number
  currency: Currency
}

export interface SessionRecord {
  id: string
  startAt: number
  endAt: number
  elapsedMs: number
  stolenAmount: number
}
