import { chromium, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import { projects } from '../src/data.js'

const base = process.env.PORTFOLIO_URL || 'http://127.0.0.1:4187/'
const out = process.env.QA_OUTPUT || '/tmp/portfolio-interactive-qa'
await mkdir(out, { recursive: true })
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] })
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
const page = await context.newPage()
const errors = []
page.on('pageerror', e => errors.push(e.message))
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
const checks = []
const check = async (name, fn) => { await fn(); checks.push(name); console.log(`PASS ${name}`) }
const overflow = async () => {
  const widths = await page.evaluate(() => ({ actual: document.documentElement.scrollWidth, viewport: innerWidth }))
  expect(widths.actual).toBeLessThanOrEqual(widths.viewport)
}
const imagesLoaded = async () => {
  const broken = await page.locator('img').evaluateAll(images => images.filter(i => i.complete && i.naturalWidth === 0).map(i => i.src))
  expect(broken).toEqual([])
}
const audit = async (name) => {
  const results = await new AxeBuilder({ page }).include('main').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  await writeFile(`${out}/axe-${name}.json`, JSON.stringify(results.violations, null, 2))
  expect(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([])
}
try {
  await page.goto(base, { waitUntil: 'networkidle' })
  await check('interactive home renders', async () => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Intelligence')
    await expect(page.locator('.robot-lab canvas')).toBeVisible({ timeout: 20000 })
    await overflow()
  })
  await page.screenshot({ path: `${out}/desktop-home.png`, fullPage: true })
  await check('project CTA scrolls without corrupting hash route', async () => {
    await page.getByRole('button', { name: '프로젝트 탐색', exact: true }).click()
    expect(new URL(page.url()).hash).not.toContain('selected-work')
    expect(await page.locator('#selected-work').evaluate(el => el.getBoundingClientRect().top)).toBeLessThan(150)
  })
  await check('selected work and role toggle consume original records', async () => {
    await page.locator('.work-index-row').filter({ hasText: 'THING Robot Hand' }).click()
    await expect(page.locator('.work-preview-image')).toHaveAttribute('href', '#/projects/thing-robot-hand')
    await page.getByRole('button', { name: '담당 역할', exact: true }).click()
    await expect(page.locator('.preview-description')).toHaveText(projects.find(p => p.slug === 'thing-robot-hand').role)
    await page.locator('.work-preview-image').click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('THING · 7축 텐던 로봇 손')
    await expect(page.locator('video').first()).toBeVisible()
    await page.goBack()
    await expect(page.locator('.studio-home')).toBeVisible()
  })
  await check('practice switch changes description and related link', async () => {
    await page.getByRole('button', { name: 'Protect.', exact: true }).click()
    await expect(page.locator('.practice-detail h3')).toContainText('안전 경계')
    await expect(page.locator('.practice-detail a')).toHaveAttribute('href', '#/projects/thing-robot-hand')
  })
  await audit('home')
  await page.goto(`${base}#/projects`, { waitUntil: 'networkidle' })
  await check('archive preserves all project routes', async () => {
    expect(await page.locator('.archive-card').count()).toBe(projects.length)
    for (const p of projects) await expect(page.locator(`.archive-card[href="#/projects/${p.slug}"]`)).toHaveCount(1)
  })
  await check('combined domain filter, search and empty-state reset', async () => {
    await page.getByRole('button', { name: 'Learning & Simulation', exact: true }).click()
    await page.getByRole('searchbox', { name: '프로젝트 검색' }).fill('PPO')
    expect(await page.locator('.archive-card').count()).toBe(1)
    await expect(page.locator('.archive-card h2')).toHaveText('유압식 고하중 로봇 PPO 제어')
    await page.getByRole('searchbox', { name: '프로젝트 검색' }).fill('no-such-project-xyz')
    await expect(page.locator('.archive-empty')).toBeVisible()
    await page.getByRole('button', { name: '필터 초기화' }).click()
    expect(await page.locator('.archive-card').count()).toBe(projects.length)
  })
  await audit('archive')
  await page.screenshot({ path: `${out}/desktop-projects.png`, fullPage: true })
  for (const width of [360, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(base, { waitUntil: 'networkidle' })
    await check(`home width ${width} no overflow or broken images`, async () => { await overflow(); await imagesLoaded() })
    if (width === 390) {
      await page.screenshot({ path: `${out}/mobile-home.png`, fullPage: true })
      await audit('mobile-home')
      await check('mobile menu and Escape', async () => {
        await page.getByRole('button', { name: '메뉴 열기' }).click()
        await expect(page.getByRole('button', { name: '메뉴 닫기' })).toHaveAttribute('aria-expanded', 'true')
        await page.keyboard.press('Escape')
        await expect(page.getByRole('button', { name: '메뉴 열기' })).toHaveAttribute('aria-expanded', 'false')
      })
    }
    await page.goto(`${base}#/projects`, { waitUntil: 'networkidle' })
    await check(`archive width ${width} no overflow`, overflow)
    if (width === 390) await page.screenshot({ path: `${out}/mobile-projects.png`, fullPage: true })
  }
  await page.setViewportSize({ width: 1440, height: 1000 })
  await check('all existing routes still render', async () => {
    for (const route of ['/work', '/about', '/resume', '/contact', '/copyright', ...projects.map(p => `/projects/${p.slug}`)]) {
      await page.goto(`${base}#${route}`, { waitUntil: 'networkidle' })
      await expect(page.locator('main h1')).toBeVisible()
      await overflow()
      await imagesLoaded()
    }
  })
  await check('PDF route is retained without WebGL', async () => {
    const pdf = await context.newPage()
    const js = []
    pdf.on('request', r => { if (r.url().endsWith('.js')) js.push(r.url()) })
    await pdf.goto(`${base}#/portfolio-pdf`, { waitUntil: 'networkidle' })
    await expect(pdf.locator('canvas')).toHaveCount(0)
    await pdf.pdf({ path: `${out}/preserved-portfolio.pdf`, printBackground: true, preferCSSPageSize: true })
    expect(js.filter(u => /robotLabScene|RobotLab-/.test(u))).toEqual([])
    await pdf.close()
  })
  await check('no JavaScript or console errors', async () => expect(errors).toEqual([]))
  await writeFile(`${out}/report.json`, JSON.stringify({ base, checks, errors }, null, 2))
} finally { await browser.close() }
