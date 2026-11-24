import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { awards, certifications, projects } from '../src/data.js'

const source = readFileSync(new URL('../src/PrintPortfolio.jsx', import.meta.url), 'utf8')
const css = readFileSync(new URL('../src/print-portfolio.css', import.meta.url), 'utf8')
const siteCss = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8')
const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')

test('submission introduction is two pages without the redundant project index or cover counters', () => {
  assert.match(source, /<ProfilePage\s*\/>/u)
  assert.match(source, /<SkillsPage\s*\/>/u)
  assert.doesNotMatch(source, /SummaryPage|cover-evidence-strip|cover-ai|Detailed projects|Control test files/u)
  assert.ok(source.indexOf('<ProfilePage />') < source.indexOf('<SkillsPage />'))
})

test('specific contributions and their evidence are rendered together', () => {
  for (const field of ['item.title', 'item.body', 'item.proof']) assert.ok(source.includes(field))
  assert.match(source, /<figcaption>/u)
  assert.match(source, /주요 기능/u)
  assert.match(source, /팀 구성/u)
  assert.match(source, /시스템 흐름/u)
  assert.doesNotMatch(source, /검증 근거|질문에서 시작한 문제 해결|증상 나열이 아닌|모호한 운전 상태 잔류/u)
})

test('troubleshooting presents before/cause/action/after and a separate outcome and reflection', () => {
  for (const field of ['item.before', 'item.cause', 'item.action', 'item.after', 'project.outcome', 'project.reflection', 'project.nextStep']) assert.ok(source.includes(field), field)
  assert.match(source, /관찰한 변화/u)
  assert.match(source, /성과/u)
  assert.match(source, /회고/u)
  assert.match(source, /다음에는/u)
  assert.doesNotMatch(source, /troubleshooting-question|item.question/u)
})

test('skill scope is backed by concrete implementation evidence instead of uncalibrated scores', () => {
  assert.match(source, /skill.evidence/u)
  assert.match(source, /skill.project/u)
  assert.match(source, /skill.level/u)
  assert.doesNotMatch(source, /SkillMeter|skill-meter|5칸 중/u)
  assert.match(source, /보조 기술/u)
  assert.match(source, /Hermes Agent/u)
  assert.match(source, /Codex/u)
})

test('corrected academic and education facts remain exact and chronological', () => {
  assert.match(source, /한국기술교육대학교 컴퓨터공학부/u)
  assert.match(source, /학점 4\.12 \/ 4\.5/u)
  assert.match(source, /period: '2024\.12 — 2025\.02'[\s\S]*title: '심층강화학습 윈터스쿨'[\s\S]*organizer: '한국기술교육대학교'/u)
  assert.match(source, /period: '2023\.03 — 2023\.06'[\s\S]*title: '군 SW·AI 역량강화 교육'[\s\S]*organizer: '대한민국 육군'/u)
  assert.match(source, /title: '메타버스 아카데미 1기 · 콘텐츠 창작자 과정'[\s\S]*organizer: '한국전파진흥협회'/u)
  assert.doesNotMatch(source, /삼성 청년 SW 아카데미|메카트로닉스공학부|학점 3\.62|한국로봇학회|KAIST 메타버스/u)
})

test('official awards, qualifications and verified project facts are preserved', () => {
  assert.ok(awards.some(([name]) => name === '삼성 청년 SW·AI 아카데미 공통프로젝트 우수상(1등)'))
  assert.deepEqual(certifications.find(([name]) => name === 'TOEIC Speaking'), ['TOEIC Speaking', 'IH'])
  assert.match(source, /className="recognition-list"/u)
  assert.equal(projects.find(p => p.slug === 'smart-assembly-transport').period, '2026.05 — 2026.06')
  assert.equal(projects.find(p => p.slug === 'thing-robot-hand').links[0].href, 'https://github.com/yjmini/THING')
})

test('A4 print pages reserve footer space and reset screen overflow containment', () => {
  assert.match(css, /@page\s*\{\s*size:\s*A4 portrait;\s*margin:\s*0/u)
  assert.match(css, /height:\s*297mm/u)
  assert.match(css, /width:\s*210mm/u)
  assert.match(css, /padding:\s*13mm 15mm 19mm/u)
  assert.match(css, /overflow:\s*visible\s*!important/u)
  assert.match(css, /\.portfolio-toolbar\s*\{\s*display:\s*none\s*!important/u)
  assert.match(app, /<footer className="site-footer">/u)
  assert.match(siteCss, /@media print\{\.site-header,\.site-footer,/u)
})

test('uncropped evidence and self-hosted typography remain available', () => {
  assert.match(css, /object-fit:\s*contain/u)
  assert.doesNotMatch(css, /object-fit:\s*cover/u)
  assert.match(css, /font-family:\s*"Pretendard"/u)
  assert.ok(existsSync(new URL('../src/assets/fonts/pretendard/Pretendard-Regular.woff2', import.meta.url)))
  assert.doesNotMatch(css, /font(?:-weight)?:\s*9\d\d/u)
})

test('print handler, navigation and document title lifecycle are maintained', () => {
  assert.match(source, /window.print\(\)/u)
  assert.match(source, /href="#\/resume"/u)
  assert.match(source, /document.title = previousTitle/u)
  assert.match(source, /classList.remove\('print-portfolio-active'\)/u)
  assert.match(source, /data-print/u)
})
