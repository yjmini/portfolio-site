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
  assert.match(thing.result, /17개 테스트 파일.*2,000회.*실패 0건/u)
  assert.ok(thing.highlights.some((item) => item.includes('fail-closed')))
})

test('project indices remain unique and sequential after adding THING', () => {
  assert.deepEqual(
    projects.map((project) => project.index),
    projects.map((_, index) => String(index + 1).padStart(2, '0')),
  )
})
