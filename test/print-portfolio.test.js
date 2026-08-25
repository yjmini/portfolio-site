import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { awards, certifications, projects } from '../src/data.js'

const printSource = readFileSync(new URL('../src/PrintPortfolio.jsx', import.meta.url), 'utf8')
const printCss = readFileSync(new URL('../src/print-portfolio.css', import.meta.url), 'utf8')
const siteCss = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8')
const featureCss = readFileSync(new URL('../src/feature-pages.css', import.meta.url), 'utf8')
const appSource = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
const pythonIcon = readFileSync(new URL('../public/assets/tech-icons/python.svg', import.meta.url), 'utf8')
const favicon = readFileSync(new URL('../public/favicon.svg', import.meta.url), 'utf8')
const smartAssemblyDiagram = readFileSync(new URL('../public/assets/projects/smart-assembly.svg', import.meta.url), 'utf8')

test('recognition and certification render as structured lists', () => {
  assert.match(printSource, /className="recognition-list"/u)
  assert.match(printSource, /<ul[^>]*className="recognition-list"/u)
  assert.ok(awards.length >= 4)
  assert.ok(certifications.length >= 4)
  assert.ok(awards.some(([name]) => name === '삼성 청년 SW 아카데미 공통 프로젝트 우수상(1등)'))
  assert.doesNotMatch(printSource, /experience\.slice\(/u)
})

test('TOEIC Speaking IH is included in the shared certifications data', () => {
  assert.deepEqual(
    certifications.find(([name]) => name === 'TOEIC Speaking'),
    ['TOEIC Speaking', 'IH'],
  )
})

test('Samsung is shown as the organizer of the common project award', () => {
  assert.deepEqual(
    awards.find(([name]) => name === '삼성 청년 SW 아카데미 공통 프로젝트 우수상(1등)'),
    ['삼성 청년 SW 아카데미 공통 프로젝트 우수상(1등)', 'Samsung · 2026'],
  )
})

test('print portfolio reserves compact cover spacing above its page footer', () => {
  assert.match(printCss, /\.portfolio-cover\{[^}]*padding-bottom\s*:\s*20mm/u)
  assert.match(printCss, /\.cover-header\{[^}]*padding-bottom\s*:\s*6mm/u)
  assert.match(printCss, /\.cover-summary\{[^}]*margin\s*:\s*5mm 0 0/u)
  assert.match(printCss, /\.cover-contact\{[^}]*margin-top\s*:\s*3mm[^}]*padding\s*:\s*2\.5mm 0/u)
  assert.match(printCss, /\.cover-columns\{[^}]*margin-top\s*:\s*3\.5mm/u)
  assert.match(printCss, /\.portfolio-section-title\{[^}]*margin-bottom\s*:\s*3\.5mm/u)
  assert.match(printCss, /\.portfolio-skill-list\{[^}]*gap\s*:\s*3\.5mm/u)
  assert.match(printCss, /\.cover-timeline article\{[^}]*padding\s*:\s*0 0 3\.2mm/u)
  assert.match(printCss, /\.cover-recognition\{[^}]*margin-top\s*:\s*4mm[^}]*padding\s*:\s*2\.5mm 0 0/u)
})

test('print media hides only the site footer and preserves portfolio page footers', () => {
  assert.match(appSource, /<footer className="site-footer">/u)
  assert.match(siteCss, /@media print\{\.site-header,\.site-footer,/u)
  assert.doesNotMatch(siteCss, /@media print\{\.site-header,footer,/u)
})

test('print portfolio uses multi-image project galleries that fill each media cell', () => {
  const thing = projects.find((project) => project.slug === 'thing-robot-hand')
  const smartAssembly = projects.find((project) => project.slug === 'smart-assembly-transport')

  assert.ok(thing.printGallery?.length >= 3)
  assert.ok(smartAssembly.printGallery?.length >= 5)
  assert.match(printSource, /project\.printGallery/u)
  assert.match(printSource, /detail-media-gallery/u)
  assert.match(printCss, /\.gallery-grid img\{[^}]*object-fit:cover/u)
})

test('Nanum Gothic is self-hosted and applied to the website and print portfolio', () => {
  assert.ok(existsSync(new URL('../src/assets/fonts/nanum-gothic/NanumGothic-Regular.woff2', import.meta.url)))
  assert.ok(existsSync(new URL('../src/assets/fonts/nanum-gothic/NanumGothic-Bold.woff2', import.meta.url)))
  assert.equal(existsSync(new URL('../src/assets/fonts/nanum-gothic/NanumGothic-ExtraBold.woff2', import.meta.url)), false)
  assert.match(siteCss, /font-family:"NanumGothic"/u)
  assert.match(siteCss, /NanumGothic-Regular\.woff2/u)
  assert.match(siteCss, /font-family:"NanumGothic"[^;]*!important/u)
  assert.match(printCss, /\.print-portfolio-page\{[^}]*font-family:"NanumGothic"/u)
  assert.doesNotMatch(siteCss, /font-family:"Paperlogy"|font-family:"GyeonggiTitle"/u)
  assert.doesNotMatch(`${siteCss}\n${featureCss}`, /Geist (?:Mono )?Variable/u)
})

test('project detail content supports explicit emphasis and in-flow metadata', () => {
  assert.match(printSource, /className="detail-bottom"/u)
  assert.match(printSource, /className="contribution-highlight"/u)
  assert.doesNotMatch(printCss, /\.detail-stack\s*\{[^}]*position\s*:\s*absolute/u)
})

test('print portfolio gives experience-education and skills-recognition their own A4 sheets', () => {
  assert.match(printSource, /function ExperienceEducationPage\(/u)
  assert.match(printSource, /function SkillsRecognitionPage\(/u)
  assert.match(
    printSource,
    /<CoverPage\s*\/?>[\s\S]*<ExperienceEducationPage\s*\/?>[\s\S]*<SkillsRecognitionPage\s*\/?>[\s\S]*<SummaryPage\s*\/?>/u,
  )
  assert.match(printSource, /detailProjects\.length \+ 4/u)
  assert.match(printSource, /p\.\{index \+ 5\}/u)
  assert.match(printSource, /page=\{index \+ 5\}/u)
})

test('education activities include participation purpose and achievement evidence', () => {
  assert.match(printSource, /참여 목적/u)
  assert.match(printSource, /성취/u)
  assert.match(printSource, /삼성 SW 역량 테스트 A형 취득/u)
  assert.match(printSource, /Hugging Face Deep RL Course/u)
  assert.match(printSource, /국방부 장관 명의 수료증/u)
  assert.match(printSource, /3ds Max, Unity, The Sandbox/u)
})

test('SSAFY education records only the verified common project first-place award', () => {
  assert.match(printSource, /공통 프로젝트 우수상\(1등\)/u)
  assert.doesNotMatch(printSource, /중간·최종 관통 프로젝트/u)
  assert.doesNotMatch(printSource, /각각 1등·2등/u)
})

test('education activities are presented in reverse chronological order', () => {
  const winterSchool = printSource.indexOf("title: '심층강화학습 윈터스쿨'")
  const metaverse = printSource.indexOf("title: '메타버스 아카데미 1기 · 콘텐츠 창작자 과정'")
  const military = printSource.indexOf("title: '군 AI·SW 전문인력 양성교육'")
  assert.ok(winterSchool >= 0 && metaverse > winterSchool && military > metaverse)
})

test('academic and education facts match the corrected source records', () => {
  assert.match(printSource, /한국기술교육대학교 컴퓨터공학부/u)
  assert.match(printSource, /학점 4\.12 \/ 4\.5/u)
  assert.match(printSource, /period: '2024\.12 — 2025\.02'[\s\S]*title: '심층강화학습 윈터스쿨'[\s\S]*organizer: '한국기술교육대학교'/u)
  assert.match(printSource, /title: '메타버스 아카데미 1기 · 콘텐츠 창작자 과정'[\s\S]*organizer: '한국전파진흥협회'/u)
  assert.doesNotMatch(printSource, /메카트로닉스공학부|학점 3\.62|한국로봇학회|KAIST 메타버스/u)
})

test('cover explains concrete AI usage instead of the working method strip', () => {
  assert.match(printSource, /AI 활용 방식/u)
  assert.match(printSource, /className="cover-ai"/u)
  assert.match(printCss, /\.cover-ai\{[^}]*min-height\s*:\s*64mm/u)
  assert.match(printSource, /Hermes Agent/u)
  assert.match(printSource, /Codex/u)
  assert.match(printSource, /Qwen-VL/u)
  assert.doesNotMatch(printSource, /WORKING METHOD/u)
  assert.doesNotMatch(printSource, /ROBOT SOFTWARE<br\s*\/?>PORTFOLIO \/ 2026/u)
  assert.doesNotMatch(printSource, /className="cover-mark"/u)
})

test('skills page uses five-cell meters and conventional software stacks', () => {
  assert.match(printSource, /function SkillMeter\(/u)
  assert.match(printSource, /length:\s*5/u)
  assert.match(printSource, /className="skill-description"/u)
  const skillsBlock = printSource.match(/const skillColumns = \[([\s\S]*?)\n\]\n\nconst coverCapabilities/u)?.[1]
  assert.ok(skillsBlock)
  assert.doesNotMatch(skillsBlock, /Unitree|DYNAMIXEL|TurtleBot3|Dobot/u)
  assert.match(skillsBlock, /Django \/ Vue \/ WebSocket/u)
  assert.match(skillsBlock, /Qwen-VL/u)
})

test('each skill card renders local brand icons and omits the meter legend block', () => {
  assert.match(printSource, /function SkillIcons\(/u)
  assert.match(printSource, /className="skill-icons"/u)
  assert.match(printSource, /alt="" aria-hidden="true"/u)
  assert.match(printSource, /assets\/tech-icons\//u)

  const skillsBlock = printSource.match(/const skillColumns = \[([\s\S]*?)\n\]\n\nconst coverCapabilities/u)?.[1]
  const skillCards = [...skillsBlock.matchAll(/\{\s*name: '([^']+)',\s*level: \d,\s*icons: \[(.*?)\],\s*description:/gsu)]

  assert.equal(skillCards.length, 15)
  for (const [, skillName, icons] of skillCards) {
    const iconFiles = [...icons.matchAll(/\['([^']+)',/gu)].map((match) => match[1])
    assert.ok(iconFiles.length > 0, `${skillName} must declare at least one icon`)
    for (const iconFile of iconFiles) {
      const filename = iconFile.includes('.') ? iconFile : `${iconFile}.svg`
      assert.ok(existsSync(new URL(`../public/assets/tech-icons/${filename}`, import.meta.url)), `${skillName} references missing ${filename}`)
    }
  }

  assert.doesNotMatch(printSource, /5칸은 단순 선호도/u)
  assert.doesNotMatch(printSource, /5칸 기준/u)
  assert.doesNotMatch(printSource, /4칸 프로젝트에서 직접 구현·통합/u)
  assert.doesNotMatch(printSource, /3칸 기능 단위 실습·적용/u)
})

test('print galleries remove image padding and fill their media cells', () => {
  assert.match(printSource, /project-media-\$\{project\.slug\}/u)
  assert.match(printCss, /\.project-media-hydraulic-robot-rl/u)
  assert.match(printCss, /\.project-media-hazardous-process-automation/u)
  assert.match(printCss, /\.gallery-grid\{[^}]*gap:0[^}]*padding:0/u)
  assert.match(printCss, /\.gallery-grid img\{[^}]*object-fit:cover[^}]*padding:0[^}]*filter:none/u)
  assert.doesNotMatch(printCss, /\.media-count-1 \.gallery-grid img,\.media-count-2 \.gallery-grid img\{padding:/u)
})

test('website and print portfolio use a restrained industrial sage palette', () => {
  assert.match(siteCss, /--ember:#7b9b82/u)
  assert.match(printCss, /--rust:#5f8068/u)
  assert.match(favicon, /#7b9b82/u)
  assert.doesNotMatch(`${siteCss}\n${favicon}\n${smartAssemblyDiagram}`, /#d9663d|#e8794e|#8e3e24|#3894e0|#63b3ed|rgba\(217,102,61|rgba\(56,148,224/u)
  assert.doesNotMatch(appSource, /#d9663d|#e8794e|#3894e0/u)
  assert.doesNotMatch(printCss, /#b94f2d|#ef8b66|#2f8fd5|#6ec1f2/u)
})

test('Nanum Gothic headings and emphasis avoid extra-bold weights', () => {
  assert.doesNotMatch(siteCss, /font(?:-weight)?:8\d\d/u)
  assert.doesNotMatch(printCss, /font(?:-weight)?:8\d\d/u)
  assert.match(siteCss, /font-weight:700/u)
  assert.match(printCss, /font:700/u)
})

test('cover and skills icons render without grayscale filters and use brand color SVGs', () => {
  assert.match(printCss, /\.skill-icons img\{[^}]*filter:none/u)
  assert.match(pythonIcon, /<svg[^>]*fill="#[0-9A-Fa-f]{6}"/u)
  assert.doesNotMatch(printCss, /\.skill-icons img\{[^}]*grayscale/u)
})

test('skills recognition headings and rows have stronger hierarchy and equal row spacing', () => {
  assert.match(printCss, /\.skills-recognition h3\{[^}]*10\.5pt/u)
  assert.match(printCss, /\.skills-recognition \.recognition-list li\{[^}]*min-height:8mm/u)
})

test('summary spacing keeps numbers close while separating titles from tables', () => {
  assert.match(printCss, /\.summary-project\{[^}]*grid-template-columns:10mm 1fr[^}]*gap:2\.5mm/u)
  assert.match(printCss, /\.summary-title\{[^}]*margin-bottom:2mm/u)
})

test('project responsibilities render as bullet lists in summary and detail pages', () => {
  assert.match(printSource, /function ProjectRoleList\(/u)
  assert.match(printSource, /className=\{`project-role-list/u)
  assert.match(printSource, /<ProjectRoleList role=\{project\.role\} compact/u)
  assert.match(printSource, /<ProjectRoleList role=\{project\.role\}/u)
})

test('THING repository links point to the owner repository', () => {
  const thing = projects.find((project) => project.slug === 'thing-robot-hand')
  assert.equal(thing.links[0].href, 'https://github.com/yjmini/THING')
  assert.equal(thing.repository.href, 'https://github.com/yjmini/THING')
  assert.doesNotMatch(JSON.stringify(thing), /SeMinKong/u)
})

test('print detail pages follow the public project index order', () => {
  assert.match(printSource, /\.sort\(\(a, b\) => Number\(a\.index\) - Number\(b\.index\)\)/u)
})
