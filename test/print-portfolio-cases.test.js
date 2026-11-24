import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

test('submission route includes both new case pairs, local evidence and consecutive footers', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, watch: null }, appType: 'custom' })
  try {
    const { default: PrintPortfolio } = await server.ssrLoadModule('/src/PrintPortfolio.jsx')
    const html = renderToStaticMarkup(createElement(PrintPortfolio))
    // Isolate each sheet including its footer, not React's image preload hints.
    const sheets = html.match(/<section class="portfolio-sheet [\s\S]*?<\/footer><\/section>/gu) ?? []
    assert.equal(sheets.length, 14)
    sheets.forEach((sheet, i) => {
      assert.ok(sheet.includes(`data-page="${i + 1}"`))
      assert.ok(sheet.includes(`${String(i + 1).padStart(2, '0')} / 14`))
    })
    for (const [offset, title] of [[8, 'KinderBot'], [10, 'CADFlow']]) {
      const [overview, cases] = sheets.slice(offset, offset + 2)
      assert.ok(overview.includes(title) && cases.includes(title))
      assert.ok(overview.includes('내가 구현한 기능') && cases.includes('문제 해결과 회고'))
      assert.doesNotMatch(overview + cases, /<a\b|(?:github|gitlab)\./iu)
      const images = [...overview.matchAll(/<img src="([^"]+)" alt="([^"]+)"/gu)]
      assert.ok(images.length > 0, `${title}: no evidence`)
      for (const [, src, alt] of images) {
        const local = src.replace(/^(?:\.\/|\/)/u, '')
        assert.match(local, /^assets\/[\w./-]+$/u)
        assert.ok(!local.includes('..') && existsSync(new URL(`../public/${local}`, import.meta.url)), local)
        assert.ok(alt.trim())
      }
    }
    assert.match(sheets[12], /supporting-sheet/u)
    assert.match(sheets[13], /research-extras-sheet/u)
  } finally {
    await server.close()
  }
})