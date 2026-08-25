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
  assert.equal(thing.source, 'https://github.com/yjmini/THING')
  assert.equal(thing.licenseUrl, 'https://github.com/yjmini/THING/blob/main/LICENSE')
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

test('copyright policy links the official Nanum Gothic notice and OFL text publicly', () => {
  const font = copyrightPolicy.assetNotices.find((item) => item.asset === 'Nanum Gothic')
  assert.ok(font)
  const notice = readFileSync(new URL(`../public/${font.noticeUrl}`, import.meta.url), 'utf8')
  const license = readFileSync(new URL('../public/assets/fonts/nanum-gothic/LICENSE.txt', import.meta.url), 'utf8')

  assert.equal(font.rightsHolder, 'NAVER Corporation')
  assert.equal(font.license, 'SIL Open Font License 1.1')
  assert.equal(font.source, 'https://hangeul.naver.com/font')
  assert.match(font.noticeUrl, /^assets\/fonts\/nanum-gothic\/NOTICE\.txt$/u)
  assert.match(notice, /NAVER.*Nanum Gothic/u)
  assert.match(license, /SIL OPEN FONT LICENSE Version 1\.1/u)
})

test('technology icons expose bundled licenses and a pinned Hermes Agent source', () => {
  const simpleIcons = copyrightPolicy.assetNotices.find((item) => item.asset === 'Simple Icons 기술 브랜드 아이콘')
  const hermesIcon = copyrightPolicy.assetNotices.find((item) => item.asset === 'Hermes Agent 아이콘')
  const hermesLicense = readFileSync(new URL(`../public/${hermesIcon.noticeUrl}`, import.meta.url), 'utf8')

  assert.ok(simpleIcons)
  assert.match(simpleIcons.license, /CC0-1\.0/u)
  assert.ok(hermesIcon)
  assert.match(hermesIcon.source, /4c94396206965580e808ceb39ae1fe007511a898\/acp_registry\/icon\.svg$/u)
  assert.match(hermesIcon.license, /MIT/u)
  assert.match(hermesLicense, /Copyright \(c\) 2025 Nous Research/u)
  assert.match(hermesLicense, /Permission is hereby granted/u)
})

test('copyright UI renders every project and asset notice with a base-safe public URL', () => {
  const notices = [...copyrightPolicy.projectNotices, ...copyrightPolicy.assetNotices]

  assert.ok(notices.length >= 5)
  for (const item of notices) {
    assert.ok(item.noticeUrl)
    assert.doesNotThrow(() => readFileSync(new URL(`../public/${item.noticeUrl}`, import.meta.url), 'utf8'))
  }
  assert.equal(resolvePublicAsset('./', '/assets/projects/smart-assembly/NOTICE.txt'), './assets/projects/smart-assembly/NOTICE.txt')
  assert.equal(resolvePublicAsset('/portfolio-site/', 'assets/fonts/nanum-gothic/NOTICE.txt'), '/portfolio-site/assets/fonts/nanum-gothic/NOTICE.txt')
  assert.match(appSource, /\.\.\.copyrightPolicy\.projectNotices, \.\.\.copyrightPolicy\.assetNotices/u)
  assert.match(appSource, /href=\{publicAsset\(item\.noticeUrl\)\}/u)
})
