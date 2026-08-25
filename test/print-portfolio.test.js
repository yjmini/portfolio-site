import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { awards, certifications, projects } from '../src/data.js'

const printSource = readFileSync(new URL('../src/PrintPortfolio.jsx', import.meta.url), 'utf8')
const printCss = readFileSync(new URL('../src/print-portfolio.css', import.meta.url), 'utf8')
const siteCss = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8')
const appSource = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')

test('recognition and certification render as structured lists', () => {
  assert.match(printSource, /className="recognition-list"/u)
  assert.match(printSource, /<ul[^>]*className="recognition-list"/u)
  assert.ok(awards.length >= 4)
  assert.ok(certifications.length >= 4)
  assert.ok(awards.some(([name]) => name === '삼성 청년 SW 아카데미 공통 프로젝트 우수상(1등)'))
  assert.doesNotMatch(printSource, /experience\.slice\(/u)
})

test('TOEIC Speaking IH is included in the shared certifications data', () => {
  assert.deepEqual(
    certifications.find(([name]) => name === 'TOEIC Speaking'),
    ['TOEIC Speaking', 'IH'],
  )
})

test('Samsung is shown as the organizer of the common project award', () => {
  assert.deepEqual(
    awards.find(([name]) => name === '삼성 청년 SW 아카데미 공통 프로젝트 우수상(1등)'),
    ['삼성 청년 SW 아카데미 공통 프로젝트 우수상(1등)', 'Samsung · 2026'],
  )
})

test('print portfolio reserves compact cover spacing above its page footer', () => {
  assert.match(printCss, /\.portfolio-cover\{[^}]*padding-bottom\s*:\s*20mm/u)
  assert.match(printCss, /\.cover-header\{[^}]*padding-bottom\s*:\s*6mm/u)
  assert.match(printCss, /\.cover-summary\{[^}]*margin\s*:\s*5mm 0 0/u)
  assert.match(printCss, /\.cover-contact\{[^}]*margin-top\s*:\s*3mm[^}]*padding\s*:\s*2\.5mm 0/u)
  assert.match(printCss, /\.cover-columns\{[^}]*margin-top\s*:\s*3\.5mm/u)
  assert.match(printCss, /\.portfolio-section-title\{[^}]*margin-bottom\s*:\s*3\.5mm/u)
  assert.match(printCss, /\.portfolio-skill-list\{[^}]*gap\s*:\s*3\.5mm/u)
  assert.match(printCss, /\.cover-timeline article\{[^}]*padding\s*:\s*0 0 3\.2mm/u)
  assert.match(printCss, /\.cover-recognition\{[^}]*margin-top\s*:\s*4mm[^}]*padding\s*:\s*2\.5mm 0 0/u)
})

test('print media hides only the site footer and preserves portfolio page footers', () => {
  assert.match(appSource, /<footer className="site-footer">/u)
  assert.match(siteCss, /@media print\{\.site-header,\.site-footer,/u)
  assert.doesNotMatch(siteCss, /@media print\{\.site-header,footer,/u)
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

test('print portfolio gives experience-education and skills-recognition their own A4 sheets', () => {
  assert.match(printSource, /function ExperienceEducationPage\(/u)
  assert.match(printSource, /function SkillsRecognitionPage\(/u)
  assert.match(
    printSource,
    /<CoverPage\s*\/?>[\s\S]*<ExperienceEducationPage\s*\/?>[\s\S]*<SkillsRecognitionPage\s*\/?>[\s\S]*<SummaryPage\s*\/?>/u,
  )
  assert.match(printSource, /detailProjects\.length \+ 4/u)
  assert.match(printSource, /p\.\{index \+ 5\}/u)
  assert.match(printSource, /page=\{index \+ 5\}/u)
})

test('education activities include participation purpose and achievement evidence', () => {
  assert.match(printSource, /참여 목적/u)
  assert.match(printSource, /성취/u)
  assert.match(printSource, /삼성 SW 역량 테스트 A형 취득/u)
  assert.match(printSource, /대표 시뮬레이터를 활용한 환경 구축/u)
  assert.match(printSource, /국방부 장관 명의 수료증/u)
  assert.match(printSource, /대전정보문화산업진흥원장상/u)
})

test('education activities are presented in reverse chronological order', () => {
  const winterSchool = printSource.indexOf("title: '심층강화학습 윈터스쿨'")
  const metaverse = printSource.indexOf("title: 'KAIST 메타버스 아카데미 1기'")
  const military = printSource.indexOf("title: '군 AI·SW 전문인력 양성교육'")
  assert.ok(winterSchool >= 0 && metaverse > winterSchool && military > metaverse)
})

test('skills page uses five-cell meters with short evidence descriptions', () => {
  assert.match(printSource, /function SkillMeter\(/u)
  assert.match(printSource, /length:\s*5/u)
  assert.match(printSource, /className="skill-description"/u)
  assert.match(printSource, /DYNAMIXEL/u)
  assert.match(printSource, /TurtleBot3/u)
  assert.match(printSource, /WebSocket/u)
  assert.match(printSource, /Qwen-VL/u)
})

test('print galleries minimize framing whitespace without cropping source images', () => {
  assert.match(printSource, /project-media-\$\{project\.slug\}/u)
  assert.match(printCss, /\.media-count-1 \.gallery-grid img,\.media-count-2 \.gallery-grid img\{padding:\.6mm\}/u)
  assert.match(printCss, /\.project-media-hydraulic-robot-rl/u)
  assert.match(printCss, /\.project-media-hazardous-process-automation/u)
  assert.match(printCss, /\.gallery-grid img\{[^}]*object-fit:contain/u)
})

test('print detail pages follow the public project index order', () => {
  assert.match(printSource, /\.sort\(\(a, b\) => Number\(a\.index\) - Number\(b\.index\)\)/u)
})
