import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, '../screenshots')
const baseUrl = process.env.APP_URL ?? 'http://localhost:5173'

const today = new Date().toISOString().slice(0, 10)
const demoSession = {
  id: 'screenshot-demo',
  startAt: Date.now() - 185_000,
  endAt: Date.now(),
  elapsedMs: 185_000,
  stolenAmount: 61.25
}

async function seedResult(page) {
  await page.goto(`${baseUrl}/setup`)
  await page.evaluate(
    ({ session, date }) => {
      sessionStorage.setItem('on-the-clock/last-session', JSON.stringify(session))
      localStorage.setItem('on-the-clock/history-date', date)
      localStorage.setItem('on-the-clock/history', JSON.stringify([session]))
    },
    { session: demoSession, date: today }
  )
}

async function main() {
  await mkdir(outDir, { recursive: true })

  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  })
  const page = await context.newPage()

  // Setup — fill demo salary so the page looks realistic
  await page.goto(`${baseUrl}/setup`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  await page.locator('#salary-amount').fill('50000')
  await page.waitForTimeout(300)
  await page.screenshot({
    path: path.join(outDir, 'setup-full.png'),
    fullPage: true
  })

  // Timer — start from setup, run briefly
  await page.getByRole('button', { name: /開始摸魚|Start slacking/i }).click()
  await page.waitForURL('**/timer')
  await page.waitForTimeout(400)
  await page.getByRole('button', { name: /^(開始|Start|暫停|Pause)$/i }).click()
  await page.waitForTimeout(1200)
  await page.screenshot({
    path: path.join(outDir, 'timer-full.png'),
    fullPage: true
  })

  // Result — seeded session with today total
  await seedResult(page)
  await page.goto(`${baseUrl}/result`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  await page.screenshot({
    path: path.join(outDir, 'result-full.png'),
    fullPage: true
  })

  await browser.close()
  console.log('Saved to', outDir)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
