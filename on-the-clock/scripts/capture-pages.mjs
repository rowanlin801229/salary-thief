import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, '../screenshots')
const baseUrl = process.env.APP_URL ?? 'http://localhost:5173'

const today = new Date().toISOString().slice(0, 10)

function makeSession(id, minutesAgo, elapsedMs, stolenAmount) {
  const endAt = Date.now() - minutesAgo * 60_000
  return {
    id,
    startAt: endAt - elapsedMs,
    endAt,
    elapsedMs,
    stolenAmount
  }
}

const demoSessions = [
  makeSession('demo-1', 5, 185_000, 61.25),
  makeSession('demo-2', 45, 420_000, 139.5),
  makeSession('demo-3', 120, 95_000, 31.5),
  makeSession('demo-4', 180, 310_000, 102.8)
]

async function seedDemoData(page) {
  await page.goto(`${baseUrl}/setup`)
  await page.evaluate(
    ({ sessions, date }) => {
      sessionStorage.setItem('on-the-clock/last-session', JSON.stringify(sessions[0]))
      localStorage.setItem('on-the-clock/history-date', date)
      localStorage.setItem('on-the-clock/history', JSON.stringify(sessions))
      localStorage.setItem(
        'on-the-clock/salary-config',
        JSON.stringify({
          mode: 'monthly',
          amount: 50000,
          daysPerMonth: 22,
          hoursPerDay: 8,
          hoursPerWeek: 40,
          weeksPerYear: 52,
          currency: 'TWD'
        })
      )
    },
    { sessions: demoSessions, date: today }
  )
}

async function main() {
  await mkdir(outDir, { recursive: true })

  const browser = await chromium.launch()
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  })
  const page = await mobile.newPage()

  // Setup
  await page.goto(`${baseUrl}/setup`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  await page.locator('#salary-amount').fill('50000')
  await page.waitForTimeout(300)
  await page.screenshot({ path: path.join(outDir, 'setup-full.png'), fullPage: true })

  // Timer — auto-starts after setup; wait for elapsed time to show
  await page.getByRole('button', { name: /開始摸魚|Start slacking/i }).click()
  await page.waitForURL('**/timer')
  await page.waitForTimeout(1500)
  await page.screenshot({ path: path.join(outDir, 'timer-full.png'), fullPage: true })

  // Result + History (seeded data)
  await seedDemoData(page)

  await page.goto(`${baseUrl}/result`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  await page.screenshot({ path: path.join(outDir, 'result-full.png'), fullPage: true })

  await page.goto(`${baseUrl}/history`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  await page.screenshot({ path: path.join(outDir, 'history-full.png'), fullPage: true })

  await mobile.close()

  // Boss inbox — desktop width
  const desktop = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2
  })
  const desktopPage = await desktop.newPage()
  await seedDemoData(desktopPage)
  await desktopPage.goto(`${baseUrl}/setup`, { waitUntil: 'networkidle' })
  await desktopPage.getByRole('button', { name: /老闆來了|Boss alert/i }).click()
  await desktopPage.waitForTimeout(700)
  await desktopPage.screenshot({
    path: path.join(outDir, 'boss-inbox-full.png'),
    fullPage: false
  })

  await desktop.close()
  await browser.close()

  console.log('Saved screenshots:')
  console.log('  setup-full.png')
  console.log('  timer-full.png')
  console.log('  result-full.png')
  console.log('  history-full.png')
  console.log('  boss-inbox-full.png')
  console.log('Directory:', outDir)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
