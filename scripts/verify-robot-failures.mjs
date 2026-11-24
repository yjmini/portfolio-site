import { chromium, expect } from '@playwright/test'
const base = process.env.PORTFOLIO_URL || 'http://127.0.0.1:4187/'
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] })
const failures = []
try {
  const blocked = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  await blocked.route(/\/(?:src\/RobotLab\.jsx|assets\/RobotLab-[^/]+\.js)(?:\?.*)?$/, route => route.abort('failed'))
  await blocked.goto(base)
  try {
    await expect(blocked.locator('.studio-home')).toBeVisible({ timeout: 4000 })
    await expect(blocked.locator('.studio-loading-error')).toBeVisible({ timeout: 4000 })
    await blocked.getByRole('button', { name: '프로젝트 탐색', exact: true }).click()
    await expect(blocked.locator('#selected-work')).toBeVisible()
    console.log('PASS unavailable RobotLab module preserves entire portfolio and static fallback')
  } catch (error) { failures.push(`Module failure containment: ${error.message}`) }
  await blocked.close()

  const faulty = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  await faulty.addInitScript(() => {
    window.__contexts = []
    window.__faults = 0
    const get = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
      const c = get.call(this, type, ...args)
      if (c && type.includes('webgl') && !window.__contexts.includes(c)) window.__contexts.push(c)
      return c
    }
    const create = WebGL2RenderingContext.prototype.createFramebuffer
    WebGL2RenderingContext.prototype.createFramebuffer = function() {
      // Production stack names are minified: fromScene is a stable public API frame.
      if (/PMREMGenerator|fromScene/.test(new Error().stack)) { window.__faults++; throw new Error('QA framebuffer allocation failure') }
      return create.call(this)
    }
  })
  await faulty.goto(base)
  try {
    await expect(faulty.locator('.robot-lab-fallback')).toContainText('정적 미리보기', { timeout: 8000 })
    await faulty.waitForTimeout(150)
    expect(await faulty.evaluate(() => window.__faults)).toBeGreaterThan(0)
    expect(await faulty.evaluate(() => window.__contexts.filter(c => !c.isContextLost()).length)).toBe(0)
    await faulty.evaluate(() => { location.hash = '/projects' })
    await expect(faulty.locator('.studio-projects')).toBeVisible()
    await faulty.evaluate(() => { location.hash = '/' })
    await expect(faulty.locator('.robot-lab-fallback')).toContainText('정적 미리보기')
    await faulty.waitForTimeout(150)
    expect(await faulty.evaluate(() => window.__contexts.filter(c => !c.isContextLost()).length)).toBe(0)
    console.log('PASS initialization exception releases all WebGL contexts, including remount')
  } catch (error) { failures.push(`Initialization cleanup: ${error.message}`) }
  await faulty.close()
  if (failures.length) throw new Error(failures.join('\n\n'))
} finally { await browser.close() }
