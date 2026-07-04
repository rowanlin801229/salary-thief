import type { SalaryConfig } from '../types'

const DEFAULT_DAYS = 22
const DEFAULT_HOURS = 8
const DEFAULT_HOURS_PER_WEEK = 40
const DEFAULT_WEEKS_PER_YEAR = 52

export const defaultSalaryConfig: SalaryConfig = {
  mode: 'monthly',
  amount: 0,
  daysPerMonth: DEFAULT_DAYS,
  hoursPerDay: DEFAULT_HOURS,
  hoursPerWeek: DEFAULT_HOURS_PER_WEEK,
  weeksPerYear: DEFAULT_WEEKS_PER_YEAR,
  currency: 'TWD'
}

export function isScheduleComplete(config: SalaryConfig): boolean {
  if (config.mode === 'hourly') return true
  if (config.mode === 'monthly') {
    return config.daysPerMonth > 0 && config.hoursPerDay > 0
  }
  return config.hoursPerWeek > 0 && config.weeksPerYear > 0
}

export function getPerMinuteRate(config: SalaryConfig): number {
  if (config.mode === 'hourly') {
    return config.amount / 60
  }
  if (config.mode === 'annual') {
    if (config.hoursPerWeek <= 0 || config.weeksPerYear <= 0) return 0
    return config.amount / config.weeksPerYear / config.hoursPerWeek / 60
  }
  if (config.daysPerMonth <= 0 || config.hoursPerDay <= 0) {
    return 0
  }
  return config.amount / config.daysPerMonth / config.hoursPerDay / 60
}

export function formatCurrency(symbol: string, amount: number): string {
  return `${symbol}${amount.toFixed(2)}`
}
