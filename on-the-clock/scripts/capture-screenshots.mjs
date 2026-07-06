import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.resolve(__dirname, '../screenshots')
const BASE_URL = process.env.SCREENSHOT_BASE_URL ?? 'http://localhost:5173'

const salaryConfig = {
  mode: 'monthly',
  amount: 50000,
  daysPerMonth: 22,
  hoursPerDay: 8,
  hoursPerWeek: 40,
  weeksPerYear: 52,
  currency: 'TWD'
}

function buildSeedData() {
  const now = Date.now()
  const today = new Date().toISOString().slice(0, 10)
  const yearMonth = today.slice(0, 7)
  const sessions = [
    {
      id: 'screenshot-session-1',
      startAt: now - 5 * 60 * 1000,
      endAt: now - 4 * 60 * 1000,
      elapsedMs: 60 * 1000,
      stolenAmount: 150
    },
    {
      id: 'screenshot-session-2',
      startAt: now - 12 * 60 * 1000,
      endAt: now - 10 * 60 * 1000,
      elapsedMs: 2 * 60 * 1000,
      stolenAmount: 280
    },
    {
      id: 'screenshot-session-3',
      startAt: now - 24 * 60 * 60 * 1000,
      endAt: now - 24 * 60 * 60 * 1000 + 6 * 60 * 1000,
      elapsedMs: 6 * 60 * 1000,
      stolenAmount: 180
    }
  ]

  return {
    today,
    yearMonth,
    sessions,
    lastSession: sessions[0]
  }
}

async function seedStorage(page) {
  const { today, yearMonth, sessions, lastSession } = buildSeedData()

  await page.addInitScript(
    ({ salaryConfig, today, yearMonth, sessions, lastSession }) => {
      localStorage.setItem('on-the-clock/salary-config', JSON.stringify(salaryConfig))
      localStorage.setItem('selected-currency', salaryConfig.currency)
      localStorage.setItem('on-the-clock/history-date', today)
      localStorage.setItem('on-the-clock/history', JSON.stringify(sessions))
      localStorage.setItem(`on-the-clock/monthly-history-${yearMonth}`, JSON.stringify(sessions))
      sessionStorage.setItem('on-the-clock/last-session', JSON.stringify(lastSession))
    },
    { salaryConfig, today, yearMonth, sessions, lastSession }
  )
}

async function capture(page, route, filename) {
  await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  await page.screenshot({
    path: path.join(OUT_DIR, filename),
    fullPage: true
  })
  console.log(`saved ${filename}`)
}

async function clickButton(page, label) {
  await page.getByRole('button', { name: label, exact: true }).click()
  await page.waitForTimeout(300)
}

async function clickTab(page, label) {
  const tab = page.getByRole('tab', { name: label, exact: true })
  if (await tab.count()) {
    await tab.click()
  } else {
    await clickButton(page, label)
  }
  await page.waitForTimeout(300)
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  })
  const page = await context.newPage()
  await seedStorage(page)

  await capture(page, '/setup', '01-setup.png')
  await capture(page, '/timer', '02-timer.png')
  await capture(page, '/result', '03-result-session.png')
  await clickTab(page, '今日戰績')
  await page.screenshot({
    path: path.join(OUT_DIR, '04-result-today.png'),
    fullPage: true
  })
  console.log('saved 04-result-today.png')

  await capture(page, '/history', '05-history-today.png')
  await clickTab(page, '全紀錄')
  await page.screenshot({
    path: path.join(OUT_DIR, '06-history-all-records-month.png'),
    fullPage: true
  })
  console.log('saved 06-history-all-records-month.png')
  await clickTab(page, '全時間記錄')
  await page.screenshot({
    path: path.join(OUT_DIR, '07-history-all-records-alltime.png'),
    fullPage: true
  })
  console.log('saved 07-history-all-records-alltime.png')

  await capture(page, '/milestones', '08-milestones-month.png')
  await clickTab(page, '累計成績')
  await page.screenshot({
    path: path.join(OUT_DIR, '09-milestones-alltime.png'),
    fullPage: true
  })
  console.log('saved 09-milestones-alltime.png')

  await browser.close()
  console.log(`\nScreenshots saved to: ${OUT_DIR}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
