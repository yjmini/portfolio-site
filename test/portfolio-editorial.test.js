import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'

const moduleUrl = new URL('../src/portfolioEditorial.js', import.meta.url)
const load = () => import(moduleUrl.href)
const majorSlugs = ['hydraulic-robot-rl', 'thing-robot-hand', 'go1-remote-inspection']
const minorSlugs = ['smart-assembly-transport', 'hazardous-process-automation', 'ros2-control-ui']
const nonempty = (value) => assert.ok(typeof value === 'string' && value.trim().length > 0)

test('THING reset requirement names only the latched safety states', async () => {
  const { editorialProjects } = await load()
  const thing = editorialProjects.find(p => p.slug === 'thing-robot-hand')
  assert.equal(thing.cases[1].after, '비정상 입력과 timeout 경로를 테스트했습니다. SAFE, FAULT, ESTOP은 정상 입력이 돌아와도 명시적 reset 전에는 재동작하지 않도록 했습니다.')
})

test('figure proofs stay concise while real-world limitations remain in outcomes and reflections', async () => {
  const { editorialProjects, supportProjects } = await load()
  const rl = editorialProjects[0]
  const go1 = editorialProjects.find(p => p.slug === 'go1-remote-inspection')
  const automation = supportProjects.find(p => p.slug === 'hazardous-process-automation')
  assert.equal(rl.contributions[0].proof, '그림 「병렬 학습 환경」: 로봇 모델의 시뮬레이션 구성을 보여줍니다.')
  assert.equal(rl.contributions[1].proof, '그림 「정책 적용 대상 실기체」: 실제 시험에 사용한 로봇입니다.')
  assert.equal(go1.contributions[0].proof, '그림 「Go1 실기체와 원격 GCS」: 로봇과 원격 시각화의 통합 구성입니다.')
  assert.equal(automation.contributions[0].proof, '그림 「공정 자동화 대상 로봇」: 경로와 장착 조건을 검토한 실기체입니다.')
  assert.equal(rl.cases[1].after, '조정 이후 실기체에서 시뮬레이션과 유사한 움직임을 관찰했습니다.')
  assert.match(rl.outcome, /반복 성공률과 오차는 정량화하지 않았습니다/)
  assert.match(rl.reflection, /조건별 반복 측정까지 남기지 못한/)
  assert.match(go1.reflection, /재부팅 뒤 상태까지 확인하는 절차가 부족/)
  assert.match(automation.reflection, /회전 여유와 간섭을 초기 모델에서 더 자세히 살피지 못/)
})

test('PyTorch evidence positively describes existing-library use without changing proficiency', async () => {
  const { coreSkills } = await load()
  const pytorch = coreSkills.find(s => s.name === 'PyTorch')
  assert.equal(pytorch.level, '활용')
  assert.equal(pytorch.evidence, '기존 학습 라이브러리로 정책을 학습하고 추론을 실행했습니다.')
})

// Keep the initial RED an explicit missing-feature assertion, not an import error.
test('print editorial data module exists', () => {
  assert.ok(existsSync(moduleUrl), 'The new print-only editorial module must exist')
})

test('three deep projects and three supporting projects retain the requested order', async () => {
  const { editorialProjects, supportProjects } = await load()
  assert.deepEqual(editorialProjects.map(p => p.slug), majorSlugs)
  assert.deepEqual(supportProjects.map(p => p.slug), minorSlugs)
  assert.equal(new Set([...editorialProjects, ...supportProjects].map(p => p.slug)).size, 6)
})

test('each project supplies narrative, implementation, cases and distinct future reflection', async () => {
  const { editorialProjects, supportProjects } = await load()
  for (const p of [...editorialProjects, ...supportProjects]) {
    const major = majorSlugs.includes(p.slug)
    for (const key of ['title', 'period', 'role', 'background', 'outcome', 'reflection', 'nextStep']) nonempty(p[key])
    assert.notEqual(p.reflection, p.nextStep)
    assert.equal(p.cases.length, major ? 2 : 1)
    assert.ok(p.contributions.length >= 1 && p.contributions.length <= (major ? 3 : 2))
    for (const c of p.contributions) {
      for (const key of ['title', 'body', 'proof']) nonempty(c[key])
      if (major) assert.ok(c.body.length >= 60 && c.body.length <= 110, `${p.slug}: contribution length ${c.body.length}`)
      assert.ok(p.gallery.some(g => c.proof.includes(g.caption)) || /\.(py|cpp|md|js)\b/.test(c.proof), `${p.slug}: named figure or source required`)
    }
    for (const c of p.cases) {
      nonempty(c.title)
      assert.ok(!c.title.includes('?'))
      for (const key of ['before', 'cause', 'action', 'after']) {
        nonempty(c[key])
        assert.ok(c[key].length >= 35 && c[key].length <= 90, `${p.slug}: ${key} length ${c[key].length}`)
      }
    }
    if (major) {
      for (const key of ['team', 'goal']) nonempty(p[key])
      for (const key of ['features', 'stack', 'flow']) {
        assert.ok(p[key].length >= 2)
        p[key].forEach(nonempty)
      }
    }
  }
})

test('existing gallery images are relative, descriptive and linked to real contributions', async () => {
  const { editorialProjects, supportProjects } = await load()
  for (const p of [...editorialProjects, ...supportProjects]) {
    const major = majorSlugs.includes(p.slug)
    assert.ok(major ? p.gallery.length >= 2 && p.gallery.length <= 3 : p.gallery.length === 1)
    for (const image of p.gallery) {
      assert.match(image.src, /^assets\//)
      assert.ok(!image.src.includes('..'))
      assert.ok(existsSync(new URL(`../public/${image.src}`, import.meta.url)), image.src)
      nonempty(image.alt)
      nonempty(image.caption)
      assert.ok(Number.isInteger(image.contributionIndex))
      assert.ok(image.contributionIndex >= 0 && image.contributionIndex < p.contributions.length)
    }
  }
})

test('only verified public repositories are linked; private and institutional projects have none', async () => {
  const { editorialProjects, supportProjects } = await load()
  const allowed = new Set(['https://github.com/yjmini/smart-assembly-transport', 'https://github.com/yjmini/yolov10_ros'])
  for (const p of [...editorialProjects, ...supportProjects]) {
    assert.ok(Array.isArray(p.links))
    for (const link of p.links) {
      nonempty(link.label)
      assert.ok(allowed.has(link.href))
    }
    if (['thing-robot-hand', 'hydraulic-robot-rl', 'hazardous-process-automation', 'ros2-control-ui'].includes(p.slug)) assert.deepEqual(p.links, [])
  }
})

test('skills describe single technologies and evidence, not invented proficiency ratings', async () => {
  const { coreSkills, supportSkills } = await load()
  assert.ok(coreSkills.length >= 6 && coreSkills.length <= 8)
  assert.equal(new Set(coreSkills.map(s => s.name)).size, coreSkills.length)
  for (const skill of coreSkills) {
    for (const key of ['name', 'evidence', 'project', 'icon']) nonempty(skill[key])
    assert.ok(['구현', '활용'].includes(skill.level))
    assert.ok([...majorSlugs, ...minorSlugs].includes(skill.project))
    assert.ok(!/[·/,]/.test(skill.name))
    assert.ok(!('rating' in skill) && !('score' in skill))
  }
  assert.ok(supportSkills.includes('Git') && supportSkills.includes('Jira'))
  supportSkills.forEach(nonempty)
})

test('team ownership and cautious real-robot results stay explicit without private notes', async () => {
  const { editorialProjects, supportProjects, coreSkills } = await load()
  const thing = editorialProjects.find(p => p.slug === 'thing-robot-hand')
  assert.match(thing.team, /하드웨어 2/)
  assert.match(thing.team, /ROS 소프트웨어 3/)
  assert.match(thing.team, /웹.*인프라 1/)
  assert.match(thing.role, /ROS/)
  const rl = editorialProjects[0]
  assert.match(JSON.stringify(rl.cases), /채터링/)
  assert.match(rl.outcome, /가능성/)
  const publicText = JSON.stringify({ editorialProjects, supportProjects, coreSkills })
  assert.doesNotMatch(publicText, /검증\s*근거|검증\s*확보|컨설턴트|9\/12|Hermes Brain|\/home\/jm|REDACTED|완전 적용|성능 보장|\d+%/)
})
