import test from 'node:test'
import assert from 'node:assert/strict'
import { projects } from '../src/data.js'

test('THING is the first featured project with verified control and safety evidence', () => {
  const thing = projects.find((project) => project.slug === 'thing-robot-hand')

  assert.ok(thing, 'THING project should be present')
  assert.equal(projects[0], thing, 'THING should lead the project list')
  assert.equal(thing.featured, true)
  assert.equal(thing.private, true)
  assert.equal(thing.image, 'assets/projects/thing-highlights.webp')
  assert.equal(thing.printImage, 'assets/projects/thing-overview.jpg')
  assert.match(thing.summary, /21개.*landmark.*7축/u)
  assert.match(thing.role, /Command Manager.*Command Guard.*Safety Manager/u)
  assert.match(thing.result, /테스트 파일 16개.*경합 경로/u)
  assert.ok(thing.highlights.some((item) => item.includes('fail-closed')))
  assert.equal(thing.repository.license, 'Apache-2.0')
  assert.match(thing.repository.notice, /C103 Team/u)
  assert.match(thing.heroVideo.src, /live-mimic\.mp4$/u)
  assert.equal(thing.demos.length, 4)
  assert.equal(thing.evidence.length, 2)
  assert.equal(thing.pipeline.length, 6)
  assert.ok(thing.pipeline.some((step) => /Command Guard/u.test(step.title)))
  assert.ok(thing.verification.some((item) => /경합 경로.*통합 테스트/u.test(item)))
})

test('project indices remain unique and sequential after adding THING', () => {
  assert.deepEqual(
    projects.map((project) => project.index),
    projects.map((_, index) => String(index + 1).padStart(2, '0')),
  )
})
