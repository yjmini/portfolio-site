import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { copyrightPolicy } from '../src/legal.js'
import { resolvePublicAsset } from '../src/publicAsset.js'

const appSource = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')

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

test('copyright policy separates Smart Assembly source-code and team-media rights', () => {
  const smartAssembly = copyrightPolicy.projectNotices.find((item) => item.project === '스마트 조립·무인 운송 시스템')
  const notice = readFileSync(new URL('../public/assets/projects/smart-assembly/NOTICE.txt', import.meta.url), 'utf8')

  assert.ok(smartAssembly)
  assert.match(smartAssembly.license, /MIT.*미디어.*권리 유보/u)
  assert.equal(smartAssembly.source, 'https://github.com/yjmini/smart-assembly-transport')
  assert.match(smartAssembly.noticeUrl, /smart-assembly\/NOTICE\.txt$/u)
  assert.match(notice, /소스 코드.*MIT/u)
  assert.match(notice, /팀.*공동 산출물/u)
  assert.match(notice, /EXIF.*GPS.*제거/u)
})

test('copyright policy links the official GyeonggiTitle notice publicly', () => {
  const font = copyrightPolicy.assetNotices.find((item) => item.asset === '경기천년제목')
  const notice = readFileSync(new URL(`../public/${font.noticeUrl}`, import.meta.url), 'utf8')

  assert.ok(font)
  assert.equal(font.rightsHolder, '경기도')
  assert.match(font.license, /공공누리 제1유형/u)
  assert.match(font.noticeUrl, /gyeonggi-title\/NOTICE\.txt$/u)
  assert.match(notice, /제작·배포: 경기도청/u)
  assert.match(notice, /공공누리 제1유형/u)
  assert.match(notice, /판매하거나 유료로 양도.*허용되지 않/u)
})

test('copyright UI renders every project and font notice with a base-safe public URL', () => {
  const notices = [...copyrightPolicy.projectNotices, ...copyrightPolicy.assetNotices]

  assert.equal(notices.length, 3)
  for (const item of notices) {
    assert.ok(item.noticeUrl)
    assert.doesNotThrow(() => readFileSync(new URL(`../public/${item.noticeUrl}`, import.meta.url), 'utf8'))
  }
  assert.equal(resolvePublicAsset('./', '/assets/projects/smart-assembly/NOTICE.txt'), './assets/projects/smart-assembly/NOTICE.txt')
  assert.equal(resolvePublicAsset('/portfolio-site/', 'assets/fonts/gyeonggi-title/NOTICE.txt'), '/portfolio-site/assets/fonts/gyeonggi-title/NOTICE.txt')
  assert.match(appSource, /\.\.\.copyrightPolicy\.projectNotices, \.\.\.copyrightPolicy\.assetNotices/u)
  assert.match(appSource, /href=\{publicAsset\(item\.noticeUrl\)\}/u)
})
