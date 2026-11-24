import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('../src/PrintPortfolio.jsx', import.meta.url), 'utf8')
const sharedData = readFileSync(new URL('../src/data.js', import.meta.url), 'utf8')

test('print route selects an independent editorial plan without changing the normal website', () => {
  assert.match(source, /from '.\/portfolioEditorial'/u)
  assert.match(source, /printProjects\.flatMap/u)
  assert.match(source, /<ProjectOverviewPage/u)
  assert.match(source, /<ProjectTroubleshootingPage/u)
  assert.match(source, /<SupportingPage/u)
  assert.match(source, /<ResearchExtrasPage/u)
  assert.doesNotMatch(source, /profile\.location|Gwangju, Korea/u)
  assert.match(sharedData, /location: 'Gwangju, Korea'/u)
})

test('page numbers derive from introduction, main-project pairs and supporting sheets', () => {
  assert.match(source, /const totalPages = 2 \+ printProjects.length \* 2 \+ 2/u)
  assert.match(source, /const startPage = 3 \+ index \* 2/u)
  assert.match(source, /page=\{startPage \+ 1\}/u)
  assert.match(source, /page=\{totalPages - 1\}/u)
  assert.match(source, /page=\{totalPages\}/u)
})

test('private project sources are not rendered as public repository evidence', () => {
  assert.match(source, /project.links/u)
  assert.doesNotMatch(source, /PUBLIC CONTROL TEST FILES|공개 제어 테스트/u)
})

test('continuation pages have short contextual headers instead of a repeated cover title block', () => {
  assert.match(source, /className="continuation-header"/u)
  assert.match(source, /className="project-header"/u)
})
