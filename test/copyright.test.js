import test from 'node:test'
import assert from 'node:assert/strict'
import { copyrightPolicy } from '../src/legal.js'

test('copyright policy identifies Yoon Jeongmin and preserves separate licenses', () => {
  assert.equal(copyrightPolicy.owner, 'Yoon Jeongmin')
  assert.equal(copyrightPolicy.email, 'jmyoon110@gmail.com')
  assert.match(copyrightPolicy.notice, /All rights reserved/u)
  assert.ok(copyrightPolicy.permissions.some((item) => /비영리.*학습.*참고/u.test(item)))
  assert.ok(copyrightPolicy.restrictions.some((item) => /AI 모델 학습/u.test(item)))
  assert.match(copyrightPolicy.separateLicenses, /팀 프로젝트.*제3자/u)
})

test('copyright policy attributes THING team media and its Apache license', () => {
  const thing = copyrightPolicy.projectNotices.find((item) => item.project === 'THING')

  assert.ok(thing)
  assert.equal(thing.rightsHolder, 'C103 Team')
  assert.equal(thing.license, 'Apache-2.0')
  assert.equal(thing.source, 'https://github.com/SeMinKong/THING')
})
