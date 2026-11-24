import { chromium, expect } from '@playwright/test'
import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
const base = process.env.PORTFOLIO_URL || 'http://127.0.0.1:4187/'
const out = process.env.QA_OUTPUT || '/tmp/portfolio-interactive-qa'
await mkdir(out, { recursive: true })
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] })
const results = []
const check = async (name, fn) => { await fn(); results.push(name); console.log(`PASS ${name}`) }
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
await context.addInitScript(() => {
  window.__frames = 0
  const raf = window.requestAnimationFrame.bind(window)
  window.requestAnimationFrame = cb => raf(time => { window.__frames++; cb(time) })
})
const page = await context.newPage()
const hash = buffer => createHash('sha256').update(buffer).digest('hex')
const settle = () => page.waitForTimeout(250)
try {
  await page.goto(base, { waitUntil: 'networkidle' })
  await expect(page.locator('.robot-lab-panel')).toBeVisible()
  const canvas = page.locator('.robot-lab canvas')
  await check('reduced motion keeps WebGL idle, controls usable', async () => {
    await expect(page.locator('.robot-lab-motion')).toBeDisabled()
    await settle()
    const before = await page.evaluate(() => window.__frames)
    await settle()
    expect(await page.evaluate(() => window.__frames)).toBe(before)
  })
  let solid
  await check('solid, wireframe and point modes produce distinct canvas frames', async () => {
    solid = hash(await canvas.screenshot())
    await page.getByRole('button', { name: 'wire', exact: true }).click()
    await expect(page.getByRole('button', { name: 'wire', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await settle()
    const wire = hash(await canvas.screenshot())
    await canvas.screenshot({ path: `${out}/robot-wire.png` })
    await page.getByRole('button', { name: 'points', exact: true }).click()
    await settle()
    const points = hash(await canvas.screenshot())
    await canvas.screenshot({ path: `${out}/robot-points.png` })
    expect(new Set([solid, wire, points]).size).toBe(3)
  })
  await check('keyboard joint angle changes model and output, reset restores', async () => {
    await page.getByRole('button', { name: '로봇 자세와 카메라 초기화' }).click()
    const slider = page.getByRole('slider')
    await slider.focus()
    await page.keyboard.press('End')
    await expect(slider).toHaveValue('90')
    await expect(page.locator('.robot-lab-joint output')).toHaveText('+90°')
    await settle()
    expect(hash(await canvas.screenshot())).not.toBe(solid)
    await page.getByRole('button', { name: '로봇 자세와 카메라 초기화' }).click()
    await expect(slider).toHaveValue('0')
  })
  await check('camera orbit changes rendered viewpoint', async () => {
    await settle()
    const before = hash(await canvas.screenshot())
    await page.getByRole('button', { name: '카메라 오른쪽 회전' }).click()
    await settle()
    expect(hash(await canvas.screenshot())).not.toBe(before)
  })
  await check('pointer drag rotates scene and preserves touch scroll contract', async () => {
    expect(await canvas.evaluate(c => getComputedStyle(c).touchAction)).toBe('pan-y')
    const rect = await canvas.boundingBox()
    const before = hash(await canvas.screenshot())
    await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2)
    await page.mouse.down()
    await page.mouse.move(rect.x + rect.width / 2 + 100, rect.y + rect.height / 2 + 15, { steps: 10 })
    await page.mouse.up()
    await page.mouse.move(10, 100)
    await settle()
    expect(hash(await canvas.screenshot())).not.toBe(before)
  })
  await check('motion play/pause and offscreen stop use bounded animation frames', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await expect(page.locator('.robot-lab-motion')).toBeEnabled()
    await page.getByRole('button', { name: '자동 모션 재생', exact: true }).click()
    const before = await page.evaluate(() => window.__frames)
    await page.waitForTimeout(700)
    expect(await page.evaluate(() => window.__frames)).toBeGreaterThan(before + 1)
    await page.getByRole('button', { name: '자동 모션 일시정지' }).click()
    await settle()
    const paused = await page.evaluate(() => window.__frames)
    await settle()
    expect(await page.evaluate(() => window.__frames)).toBe(paused)
    await page.getByRole('button', { name: '자동 모션 재생', exact: true }).click()
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }))
    await settle()
    const offscreen = await page.evaluate(() => window.__frames)
    await settle()
    expect(await page.evaluate(() => window.__frames)).toBe(offscreen)
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(page.locator('.robot-lab-motion')).toBeDisabled()
  })
  await check('WebGL context loss exposes static fallback with no dead controls', async () => {
    await canvas.evaluate(c => c.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext())
    await expect(page.locator('.robot-lab-fallback')).toContainText('정적 미리보기')
    await expect(page.locator('.robot-lab-panel')).toHaveCount(0)
    await page.locator('.robot-lab').screenshot({ path: `${out}/robot-fallback.png` })
    await page.getByRole('button', { name: '프로젝트 탐색', exact: true }).click()
    await expect(page.locator('#selected-work')).toBeVisible()
  })
  await check('WebGL unavailable at startup retains content and fallback', async () => {
    const fallback = await context.newPage()
    await fallback.addInitScript(() => {
      const getContext = HTMLCanvasElement.prototype.getContext
      HTMLCanvasElement.prototype.getContext = function(type, ...args) {
        if (type.startsWith('webgl')) return null
        return getContext.call(this, type, ...args)
      }
    })
    await fallback.goto(base, { waitUntil: 'networkidle' })
    await expect(fallback.locator('.robot-lab-fallback')).toContainText('정적 미리보기')
    await expect(fallback.locator('.robot-lab-panel')).toHaveCount(0)
    await expect(fallback.locator('.studio-hero h1')).toContainText('Intelligence')
    await fallback.close()
  })
  await writeFile(`${out}/robot-report.json`, JSON.stringify({ base, checks: results }, null, 2))
} finally { await browser.close() }
