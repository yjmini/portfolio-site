import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { appendSourceAttribution, attributionLine } from '../src/attribution.js'
import { copyrightPolicy } from '../src/legal.js'

test('copied portfolio text receives a canonical source line once', () => {
  const copied = appendSourceAttribution('ROS2 안전 경계를 구현했습니다.')
  assert.match(copied, /ROS2 안전 경계를 구현했습니다\./u)
  assert.match(copied, /출처: 윤정민 포트폴리오/u)
  assert.match(copied, /https:\/\/yjmini\.github\.io\/portfolio-site\//u)
  assert.equal(appendSourceAttribution(copied), copied)
  assert.match(attributionLine, /윤정민 포트폴리오/u)
})

test('policy reserves automated collection and requires attribution after permission', () => {
  assert.ok(copyrightPolicy.automatedAccess.some((item) => /크롤링|스크래핑/u.test(item)))
  assert.match(copyrightPolicy.attribution.required, /사전 서면 허가/u)
  assert.match(copyrightPolicy.attribution.format, /https:\/\/yjmini\.github\.io\/portfolio-site\//u)
  assert.match(copyrightPolicy.attribution.warning, /허가를 의미하지 않/u)
})

test('deployed crawler and TDM reservation files reserve the whole project path', () => {
  const robots = readFileSync(new URL('../public/robots.txt', import.meta.url), 'utf8')
  const tdm = JSON.parse(readFileSync(new URL('../public/.well-known/tdmrep.json', import.meta.url), 'utf8'))
  const llms = readFileSync(new URL('../public/llms.txt', import.meta.url), 'utf8')
  const copyright = readFileSync(new URL('../public/COPYRIGHT.txt', import.meta.url), 'utf8')
  const index = readFileSync(new URL('../index.html', import.meta.url), 'utf8')

  assert.match(robots, /User-agent: \*/u)
  assert.match(robots, /User-agent: \*[\s\S]*Allow: \//u)
  assert.match(robots, /User-agent: GPTBot[\s\S]*Disallow: \//u)
  assert.match(robots, /User-agent: ClaudeBot[\s\S]*Disallow: \//u)
  assert.match(robots, /User-agent: CCBot[\s\S]*Disallow: \//u)
  assert.deepEqual(tdm, [{ location: '/portfolio-site/', 'tdm-reservation': 1 }])
  assert.match(llms, /Do not crawl, scrape, index, archive/u)
  assert.match(llms, /Attribution does not grant permission/u)
  assert.match(copyright, /© 2026 Yoon Jeongmin/u)
  assert.match(copyright, /출처: 윤정민 포트폴리오/u)
  assert.match(index, /name="robots" content="index, follow"/u)
  assert.doesNotMatch(index, /noindex/u)
  assert.match(index, /name="tdm-reservation" content="1"/u)
  assert.match(index, /"creditText": "출처: 윤정민 포트폴리오/u)
})
