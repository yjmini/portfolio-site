import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  BASE_PORTFOLIO_PAGES,
  DETAIL_PAGES_PER_PROJECT,
  detailBlueprints,
  firstProjectPage,
  totalPortfolioPages,
} from '../src/portfolioPrintPlan.js'

const printSource = readFileSync(new URL('../src/PrintPortfolio.jsx', import.meta.url), 'utf8')
const dataSource = readFileSync(new URL('../src/data.js', import.meta.url), 'utf8')

const detailProjects = detailBlueprints
  .map((blueprint) => ({ ...blueprint, index: blueprint.index }))
  .sort((a, b) => Number(a.index) - Number(b.index))

test('experience and education becomes page 1 while the former cover becomes page 2', () => {
  const experiencePosition = printSource.indexOf('<ExperienceEducationPage />')
  const coverPosition = printSource.indexOf('<CoverPage />')

  assert.ok(experiencePosition >= 0)
  assert.ok(coverPosition > experiencePosition)
})

test('profile location is not rendered in the print portfolio', () => {
  assert.doesNotMatch(printSource, /profile\.location/u)
  assert.doesNotMatch(printSource, /Gwangju, Korea/u)
  assert.match(dataSource, /location: 'Gwangju, Korea'/u)
})

test('top-right explanatory prose is removed from the old pages 2, 3, and 4', () => {
  assert.doesNotMatch(printSource, /단순 참여 목록 대신/u)
  assert.doesNotMatch(printSource, /GitHub 공개 프로젝트의 사용 기술과/u)
  assert.doesNotMatch(printSource, /강화학습·시뮬레이션에서 ROS2 시스템 통합과/u)
})

test('each selected project receives two detail sheets and page references stay consistent', () => {
  assert.equal(BASE_PORTFOLIO_PAGES, 4)
  assert.equal(DETAIL_PAGES_PER_PROJECT, 2)
  assert.equal(totalPortfolioPages(detailProjects.length), 16)
  assert.deepEqual(detailProjects.map((_, index) => firstProjectPage(index)), [5, 7, 9, 11, 13, 15])
  assert.match(printSource, /<ProjectOverviewPage/u)
  assert.match(printSource, /<ProjectTroubleshootingPage/u)
})

test('every project exposes at least three structured troubleshooting records', () => {
  assert.equal(detailProjects.length, 6)

  for (const project of detailProjects) {
    assert.ok(project.troubleshooting.length >= 3, `${project.slug} needs at least three troubleshooting records`)
    for (const item of project.troubleshooting) {
      for (const field of ['question', 'problem', 'cause', 'action', 'result']) {
        assert.equal(typeof item[field], 'string', `${project.slug}/${item.title} missing ${field}`)
        assert.ok(item[field].trim().length >= 12, `${project.slug}/${item.title} ${field} is too short`)
      }
    }
  }
})

test('project technology environment is rendered at the top and not duplicated at the bottom', () => {
  assert.match(printSource, /className="detail-environment"/u)
  assert.doesNotMatch(printSource, /className="detail-stack"/u)
  assert.doesNotMatch(printSource, /project\.stack\.slice\(0,\s*4\)/u)
})

test('troubleshooting questions use an explicit question label', () => {
  assert.match(printSource, /className="troubleshooting-question"/u)
  assert.match(printSource, />질문<\/strong>/u)
})

test('private project repositories and public-evidence claims stay out of the print portfolio', () => {
  const thing = detailBlueprints.find((project) => project.slug === 'thing-robot-hand')

  assert.ok(thing)
  assert.doesNotMatch(JSON.stringify(thing), /공개 제어 테스트|공개 저장소/u)
  assert.match(printSource, /project\.private !== true/u)
  assert.doesNotMatch(printSource, /PUBLIC CONTROL TEST FILES/u)
})

test('project award highlights are available directly below project titles', () => {
  const thing = detailBlueprints.find((project) => project.slug === 'thing-robot-hand')
  const go1 = detailBlueprints.find((project) => project.slug === 'go1-remote-inspection')

  assert.ok(thing.recognition?.some((item) => item.includes('공통프로젝트 우수상')))
  assert.ok(go1.recognition?.some((item) => item.includes('졸업연구작품 우수상')))
  assert.ok(go1.recognition?.some((item) => item.includes('AI Festa 경진대회 우수상')))
  assert.match(printSource, /className="detail-recognition"/u)
})
