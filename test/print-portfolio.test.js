import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { awards, certifications, projects } from '../src/data.js'

const printSource = readFileSync(new URL('../src/PrintPortfolio.jsx', import.meta.url), 'utf8')
const printCss = readFileSync(new URL('../src/print-portfolio.css', import.meta.url), 'utf8')
const siteCss = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8')

test('recognition and certification render as structured lists', () => {
  assert.match(printSource, /className="recognition-list"/u)
  assert.match(printSource, /<ul[^>]*className="recognition-list"/u)
  assert.ok(awards.length >= 4)
  assert.ok(certifications.length >= 4)
  assert.ok(awards.some(([name]) => name === '삼성 청년 SW 아카데미 공통 프로젝트 우수상(1등)'))
  assert.doesNotMatch(printSource, /experience\.slice\(/u)
})

test('print portfolio uses uncropped multi-image project galleries', () => {
  const thing = projects.find((project) => project.slug === 'thing-robot-hand')
  const smartAssembly = projects.find((project) => project.slug === 'smart-assembly-transport')

  assert.ok(thing.printGallery?.length >= 3)
  assert.ok(smartAssembly.printGallery?.length >= 5)
  assert.match(printSource, /project\.printGallery/u)
  assert.match(printSource, /detail-media-gallery/u)
  assert.match(printCss, /\.detail-media-gallery[\s\S]*object-fit\s*:\s*contain/u)
  assert.doesNotMatch(printCss, /\.detail-(?:visual|media-gallery)[^{]*img\s*\{[^}]*object-fit\s*:\s*cover/u)
})

test('GyeonggiTitle is self-hosted and applied to the website and print portfolio', () => {
  assert.match(siteCss, /@font-face\s*\{[^}]*font-family\s*:\s*["']GyeonggiTitle["']/u)
  assert.match(siteCss, /Title_Medium\.woff/u)
  assert.match(siteCss, /Title_Bold\.woff/u)
  assert.match(siteCss, /font-family\s*:\s*["']GyeonggiTitle["'][^;]*!important/u)
  assert.match(printCss, /font-family\s*:\s*["']GyeonggiTitle["']/u)
})

test('project detail content supports explicit emphasis and in-flow metadata', () => {
  assert.match(printSource, /className="detail-bottom"/u)
  assert.match(printSource, /className="contribution-highlight"/u)
  assert.doesNotMatch(printCss, /\.detail-stack\s*\{[^}]*position\s*:\s*absolute/u)
})
