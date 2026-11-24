import test from 'node:test'
import assert from 'node:assert/strict'
import { projects } from '../src/data.js'
import { filterProjects, projectCategory, selectedProjects } from '../src/projectExplorer.js'

test('all projects are preserved and filtering does not mutate canonical portfolio data', () => {
 const before = JSON.stringify(projects)
 assert.deepEqual(filterProjects(projects, 'all', ''), projects)
 filterProjects(projects, 'learning', 'PPO')
 assert.equal(JSON.stringify(projects), before)
})
test('domain categories distinguish policy learning, robot control and perception', () => {
 assert.equal(projectCategory(projects.find(p => p.slug === 'hydraulic-robot-rl')), 'learning')
 assert.equal(projectCategory(projects.find(p => p.slug === 'thing-robot-hand')), 'control')
 assert.equal(projectCategory(projects.find(p => p.slug === 'go1-remote-inspection')), 'perception')
})
test('search is case insensitive, trims spaces, and intersects domain filter', () => {
 assert.ok(filterProjects(projects, 'learning', '  pPo ').some(p => p.slug === 'hydraulic-robot-rl'))
 assert.equal(filterProjects(projects, 'learning', 'THING').length, 0)
 assert.ok(filterProjects(projects, 'all', '손').some(p => p.slug === 'thing-robot-hand'))
 assert.equal(filterProjects(projects, 'all', 'no-such-project-xyz').length, 0)
})
test('selected work starts with learning and retains original project records', () => {
 const selected = selectedProjects(projects)
 assert.equal(selected[0].slug, 'hydraulic-robot-rl')
 assert.equal(new Set(selected.map(p => p.slug)).size, selected.length)
 assert.ok(selected.every(p => projects.includes(p)))
})
