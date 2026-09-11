import { useEffect } from 'react'
import { ArrowLeft, ExternalLink, Github, Mail, Printer } from 'lucide-react'
import { awards, certifications, profile, projects } from './data'
import {
  detailBlueprints,
  firstProjectPage,
  totalPortfolioPages,
} from './portfolioPrintPlan'
import './print-portfolio.css'

const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

const detailProjects = detailBlueprints.map((blueprint) => ({
  ...projects.find((project) => project.slug === blueprint.slug),
  ...blueprint,
})).sort((a, b) => Number(a.index) - Number(b.index))

const educationActivities = [
  {
    period: '2026.01 — 현재',
    title: 'SSAFY 15기 · Embedded Robotics Track',
    organizer: '삼성 청년 SW·AI 아카데미',
    purpose: 'C/C++ 알고리즘과 Python·Linux·ROS2 기반 임베디드·로봇 SW 개발 역량 강화',
    achievement: '삼성 SW 역량 테스트 A형 취득 · B형 대비 C/C++ 문제풀이 · 삼성 청년 SW·AI 아카데미 공통프로젝트 우수상(1등) 수상',
  },
  {
    period: '2024.12 — 2025.02',
    title: '심층강화학습 윈터스쿨',
    organizer: '한국기술교육대학교',
    purpose: 'PPO·보상 설계·observation/action space의 로봇 제어 문제 적용',
    achievement: 'Unity ML-Agents·Hugging Face Deep RL Course 기반 강화학습 구조 발표 및 후속 Isaac Lab 프로젝트 연결',
  },
  {
    period: '2023.03 — 2023.06',
    title: '군 SW·AI 역량강화 교육',
    organizer: '대한민국 육군',
    purpose: '군 복무 중 SW·AI 전문 지식과 프로그래밍 실무 역량 강화',
    achievement: 'Python·데이터 분석·AI 기초 교육과 팀 프로젝트 수행 · 국방부 장관 명의 수료증 취득',
  },
  {
    period: '2022.05 — 2022.12',
    title: '메타버스 아카데미 1기 · 콘텐츠 창작자 과정',
    organizer: '한국전파진흥협회',
    purpose: '3D 콘텐츠 제작·실시간 인터랙션 구현과 가상환경 제작 흐름 습득',
    achievement: '3ds Max, Unity, The Sandbox 기반 3D 에셋·인터랙션 구현 및 시뮬레이션 이해 기반 확보',
  },
]

const skillColumns = [
  {
    name: 'Robotics / Simulation / RL',
    items: [
      { name: 'ROS2 Humble', level: 4, icons: [['ros', 'ROS']], description: '노드·토픽·서비스·launch와 실제 장비 통합 및 테스트 경험' },
      { name: 'Isaac Lab / Isaac Sim', level: 4, icons: [['nvidia', 'NVIDIA']], description: '로봇 모델·환경·reward를 구성하고 PPO 학습과 rollout 분석 수행' },
      { name: 'RSL-RL / PPO / PyTorch', level: 4, icons: [['pytorch', 'PyTorch'], ['weightsandbiases', 'Weights & Biases']], description: '정책 학습, W&B·TensorBoard 로그와 실패 행동을 함께 분석' },
      { name: 'MoveIt / Nav2 / RoboDK', level: 3, icons: [['ros', 'ROS']], description: '경로 계획, ROS2 이동, 로봇 공정 시뮬레이션에 적용' },
      { name: 'SLAM / RTAB-Map / RViz', level: 4, icons: [['ros', 'ROS']], description: '3D 지도 생성, 센서 통합, 원격 GCS 시각화 경험' },
    ],
  },
  {
    name: 'Programming / Vision / UI',
    items: [
      { name: 'Python', level: 4, icons: [['python', 'Python']], description: 'ROS2, 강화학습, 비전, 자동화 스크립트의 주 개발 언어' },
      { name: 'C / C++', level: 3, icons: [['c', 'C'], ['cplusplus', 'C++']], description: '임베디드 제어와 알고리즘 문제풀이, ROS2 구성 요소 구현 경험' },
      { name: 'PyQt5 / Qt Designer', level: 4, icons: [['qt', 'Qt']], description: 'ROS2 상태 구독·명령 발행과 안전 조건을 반영한 제어 UI 구현' },
      { name: 'YOLO / OpenCV / Roboflow', level: 4, icons: [['yolo', 'YOLO'], ['opencv', 'OpenCV'], ['roboflow', 'Roboflow']], description: '탐지·추적·영상 처리·데이터셋 관리 파이프라인 구성' },
      { name: 'RGB-D / Point Cloud', level: 4, icons: [['intel', 'Intel RealSense'], ['opencv', 'OpenCV']], description: 'RGB-D 입력과 3D 좌표를 SLAM·검사·원격 점검에 연결' },
    ],
  },
  {
    name: 'Infrastructure / Web / AI',
    items: [
      { name: 'Linux / Ubuntu', level: 4, icons: [['linux', 'Linux'], ['ubuntu', 'Ubuntu']], description: '로봇 개발 환경, 장치 권한, 네트워크 및 런타임 진단' },
      { name: 'Docker / NVIDIA Container', level: 3, icons: [['docker', 'Docker'], ['nvidia', 'NVIDIA']], description: 'GPU·ROS2 개발 환경 재현과 배포 구성' },
      { name: 'Django / Vue / WebSocket', level: 3, icons: [['django', 'Django'], ['vuedotjs', 'Vue.js']], description: '로봇 상태 API·실시간 이벤트·관제 화면을 연결' },
      { name: 'Git / GitHub / GitLab / Jira', level: 3, icons: [['git', 'Git'], ['github', 'GitHub'], ['gitlab', 'GitLab']], description: '공개 저장소, 협업 이력, 문서·이슈 기반 개발 관리' },
      { name: 'Qwen-VL / Hugging Face / LangGraph', level: 3, icons: [['qwen', 'Qwen'], ['huggingface', 'Hugging Face'], ['langchain', 'LangChain']], description: 'VLM·모델 허브·에이전트 워크플로 실습 및 공개 프로젝트 경험' },
    ],
  },
]

const coverCapabilities = [
  ['Robot Intelligence', 'Isaac Lab PPO 정책 학습과 reward·rollout·실기체 적용 제약의 동시 검토'],
  ['Robot Software', 'ROS2 제어권·명령 검증·안전 상태·UI의 실제 모터 직전 경계 구현'],
  ['System Integration', 'RGB-D·SLAM·비전·로봇·웹 관제의 단일 실행 흐름과 검증 절차 연결'],
]

const aiUsage = [
  {
    name: 'Hermes Agent',
    icons: [['hermes-agent', 'Hermes Agent']],
    description: '조사 → 파일 수정 → 테스트·빌드 → 브라우저·PDF 검증의 도구 호출 연결과 메모리·스킬 기반 맥락 유지',
  },
  {
    name: 'Codex · AI-assisted coding',
    icons: [['openai.png', 'OpenAI']],
    description: '기능 구현·오류 원인 분리·테스트 우선 변경·코드 리뷰 활용 후 실제 명령과 렌더링 결과 재검증',
  },
  {
    name: 'Qwen-VL · Hugging Face · LangGraph',
    icons: [['qwen', 'Qwen'], ['huggingface', 'Hugging Face'], ['langchain', 'LangChain']],
    description: 'VLM 실험·모델 허브 활용·상태 기반 에이전트 워크플로의 공개 프로젝트·실습 적용',
  },
]

function PageFooter({ page }) {
  return <footer className="portfolio-page-footer">
    <span>YOON JEONGMIN · ROBOT SOFTWARE PORTFOLIO</span>
    <span>{String(page).padStart(2, '0')} / {String(totalPortfolioPages(detailProjects.length)).padStart(2, '0')}</span>
  </footer>
}

function SkillMeter({ level }) {
  return <span className="skill-meter" aria-label={`5칸 중 ${level}칸`}>
    {Array.from({ length: 5 }, (_, index) => <i className={index < level ? 'filled' : ''} key={index} />)}
  </span>
}

function SkillIcons({ icons }) {
  return <span className="skill-icons">
    {icons.map(([file, label]) => {
      const filename = file.includes('.') ? file : `${file}.svg`
      return <img src={asset(`assets/tech-icons/${filename}`)} alt="" aria-hidden="true" title={label} key={file} />
    })}
  </span>
}

function SkillCard({ name, level, icons, description }) {
  return <article className="portfolio-skill-card">
    <div className="skill-card-heading"><SkillIcons icons={icons} /><SkillMeter level={level} /></div>
    <strong>{name}</strong>
    <p className="skill-description">{description}</p>
  </article>
}

function RecognitionList({ items }) {
  return <ul className="recognition-list">
    {items.map(([name, meta]) => <li key={`${name}-${meta}`}><b>{name}</b><span>{meta}</span></li>)}
  </ul>
}

function ProjectRoleList({ role, compact = false }) {
  const items = role.split('·').map((item) => item.trim()).filter(Boolean)
  return <ul className={`project-role-list${compact ? ' compact' : ''}`}>
    {items.map((item) => <li key={item}>{item}</li>)}
  </ul>
}

function EmphasizedText({ text, phrases = [] }) {
  const matches = phrases
    .map((phrase) => ({ phrase, start: text.indexOf(phrase) }))
    .filter(({ start }) => start >= 0)
    .sort((a, b) => a.start - b.start)

  if (!matches.length) return text

  const parts = []
  let cursor = 0
  matches.forEach(({ phrase, start }, index) => {
    if (start < cursor) return
    if (start > cursor) parts.push(text.slice(cursor, start))
    parts.push(<strong className="contribution-highlight" key={`${phrase}-${index}`}>{phrase}</strong>)
    cursor = start + phrase.length
  })
  if (cursor < text.length) parts.push(text.slice(cursor))
  return parts
}

function ProjectGallery({ project }) {
  const gallery = project.printGallery?.length
    ? project.printGallery
    : [{ src: project.printImage || project.image, alt: `${project.title} 프로젝트 이미지`, caption: project.title }]

  const galleryCount = Math.min(gallery.length, 5)

  const singleMediaContext = project.slug === 'hydraulic-robot-rl'
    ? {
        eyebrow: 'SIM-TO-REAL CHECK',
        title: project.tagline,
        body: '실제 유압 로봇 policy 적용 전 command limit·제어 주기·응답 지연의 통합 점검',
      }
    : project.slug === 'hazardous-process-automation'
      ? {
          eyebrow: 'SOFTWARE + FIXTURE',
          title: '경로 코드와 전용 가이드의 동시 보정',
          body: '접근 방향·작업물 기준 위치·SolidWorks 가이드의 반복성 조건 통합 검토',
        }
      : null

  return <div className={`detail-media-gallery media-count-${galleryCount} project-media-${project.slug}`}>
    <div className={`gallery-grid gallery-count-${galleryCount}`}>
      {gallery.map((media) => <figure key={media.src}>
        <img src={asset(media.src)} alt={media.alt} style={{ objectPosition: project.imagePosition || 'center' }} />
        <figcaption>{media.caption}</figcaption>
      </figure>)}
      {singleMediaContext && galleryCount === 1 && <aside className="single-media-context">
        <span>{singleMediaContext.eyebrow}</span>
        <strong>{singleMediaContext.title}</strong>
        <p>{singleMediaContext.body}</p>
      </aside>}
    </div>
    <div className="visual-caption"><b>{project.index}</b><span>PROJECT MEDIA</span></div>
  </div>
}

function CoverPage() {
  return <section className="portfolio-sheet portfolio-cover" aria-label="프로필과 포트폴리오 방향">
    <header className="cover-header">
      <img src={asset('assets/profile/yoon-jeongmin.png')} alt="윤정민 프로필" />
      <div>
        <p className="portfolio-kicker">PHYSICAL AI · ROBOT SYSTEMS</p>
        <h1>윤정민 <small>Yoon Jeongmin</small></h1>
        <h2>로봇 지능의 실제 시스템 연결과 검증</h2>
      </div>
    </header>
    <p className="cover-summary">Isaac Lab/PPO 정책 학습 · ROS2 제어 · RGB-D 비전·SLAM · 실제 하드웨어 통합 경험<br />모델 성능뿐 아니라 <b>입력–상태–출력 · 실패 조건 · 반복 가능한 확인 절차</b>까지 기록</p>
    <div className="cover-contact">
      <span><Mail size={15} />{profile.email}</span>
      <a href={profile.github}><Github size={15} />github.com/yjmini</a>
    </div>

    <div className="cover-capabilities">
      {coverCapabilities.map(([name, description], index) => <article key={name}>
        <span>0{index + 1}</span><h3>{name}</h3><p>{description}</p>
      </article>)}
    </div>
    <div className="cover-evidence-strip">
      <article><strong>{detailProjects.length}</strong><span>Detailed projects</span></article>
      <article><strong>5</strong><span>ROS2 control & safety nodes</span></article>
      <article><strong>16</strong><span>Control test files</span></article>
      <article><strong>{awards.length}</strong><span>Project awards</span></article>
    </div>
    <div className="cover-ai">
      <p className="portfolio-kicker">AI-ASSISTED ENGINEERING · AI 활용 방식</p>
      <div>{aiUsage.map((item) => <article key={item.name}>
        <SkillIcons icons={item.icons} />
        <strong>{item.name}</strong>
        <p>{item.description}</p>
      </article>)}</div>
    </div>
    <PageFooter page={1} />
  </section>
}

function ExperienceEducationPage() {
  return <section className="portfolio-sheet portfolio-experience" aria-label="경험과 교육 및 활동">
    <header className="profile-page-header">
      <div><p className="portfolio-kicker">EXPERIENCE & EDUCATION</p><h2>경험 · 교육 및 활동</h2></div>
    </header>

    <div className="experience-foundation">
      <article>
        <span>ACADEMIC</span><time>2020.03 — 2026.02</time>
        <h3>한국기술교육대학교 컴퓨터공학부</h3>
        <p>학사 졸업 · 학점 4.12 / 4.5</p>
      </article>
      <article>
        <span>RESEARCH EXPERIENCE</span><time>2025.06 — 2025.12</time>
        <h3>한국원자력연구원 로봇응용연구실 · 인턴연구원</h3>
        <p>Isaac Lab/PPO 제어 · MoveIt 기반 공정 자동화 · PyQt5·ROS2 제어 UI 개선 수행</p>
      </article>
    </div>

    <div className="education-grid">
      {educationActivities.map((activity, index) => <article className={`education-card education-card-${index + 1}`} key={activity.title}>
        <header><div><time>{activity.period}</time><h3>{activity.title}</h3></div><span>{activity.organizer}</span></header>
        <p><b>참여 목적</b><span>{activity.purpose}</span></p>
        <p><b>성취</b><span>{activity.achievement}</span></p>
      </article>)}
    </div>
    <PageFooter page={2} />
  </section>
}

function SkillsRecognitionPage() {
  return <section className="portfolio-sheet portfolio-skills-page" aria-label="스킬, 자격증과 수상">
    <header className="profile-page-header skills-page-header">
      <div><p className="portfolio-kicker">SKILLS · CERTIFICATIONS · AWARDS</p><h2>Skills · 자격증 · 수상</h2></div>
    </header>

    <div className="skills-columns">
      {skillColumns.map((column) => <section className="skills-column" key={column.name}>
        <h3>{column.name}</h3>
        {column.items.map((skill) => <SkillCard key={skill.name} {...skill} />)}
      </section>)}
    </div>

    <div className="skills-recognition">
      <section><h3>수상</h3><RecognitionList items={awards} /></section>
      <section><h3>자격 · 어학</h3><RecognitionList items={certifications} /></section>
    </div>
    <PageFooter page={3} />
  </section>
}

function SummaryPage() {
  return <section className="portfolio-sheet portfolio-summary" aria-label="프로젝트 요약">
    <header className="portfolio-page-header">
      <div><p className="portfolio-kicker">PROJECT INDEX</p><h2>Projects Summary</h2></div>
    </header>
    <div className="summary-list">
      {detailProjects.map((project, index) => <article key={project.slug} className="summary-project">
        <div className="summary-number">{String(index + 1).padStart(2, '0')}</div>
        <div className="summary-main">
          <div className="summary-title"><h3>{project.title}</h3><span>p.{firstProjectPage(index)}–{firstProjectPage(index) + 1}</span></div>
          <dl>
            <div><dt>기간</dt><dd>{project.period}</dd></div>
            <div><dt>참여</dt><dd>{project.type}</dd></div>
            <div className="wide"><dt>개요</dt><dd>{project.tagline}</dd></div>
            <div className="wide"><dt>기술 환경</dt><dd>{project.stack.join(', ')}</dd></div>
            <div className="wide"><dt>담당 역할</dt><dd><ProjectRoleList role={project.role} compact /></dd></div>
          </dl>
        </div>
      </article>)}
    </div>
    <PageFooter page={4} />
  </section>
}

function Flow({ items }) {
  return <div className="project-flow" aria-label="시스템 흐름">
    {items.map((item, index) => <div key={item}><span>{item}</span>{index < items.length - 1 && <b aria-hidden="true">→</b>}</div>)}
  </div>
}

function ProjectHeader({ project, section }) {
  return <header className="detail-header">
    <p className="portfolio-kicker">{project.eyebrow}</p>
    <h2>{project.title}</h2>
    {project.recognition?.length > 0 && <div className="detail-recognition">
      {project.recognition.map((item) => <strong key={item}>🏆 {item}</strong>)}
    </div>}
    <div className="detail-meta"><strong>{section}</strong><span>{project.type}</span><span>{project.period}</span></div>
  </header>
}

function DetailEnvironment({ project }) {
  return <section className="detail-environment" aria-label="개발 환경">
    <strong>개발 환경</strong>
    <div>{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
  </section>
}

function ProjectOverviewPage({ project, page }) {
  return <section className="portfolio-sheet portfolio-detail portfolio-detail-overview" aria-label={`${project.title} 프로젝트 상세 1/2`}>
    <ProjectHeader project={project} section="PROJECT OVERVIEW · 1 / 2" />
    <DetailEnvironment project={project} />
    <ProjectGallery project={project} />

    <div className="detail-focus-grid">
      <div className="project-goal"><h3>프로젝트 목표</h3><p>{project.tagline}</p></div>
      <div className="project-scope"><h3>담당 범위</h3><ProjectRoleList role={project.role} /></div>
    </div>

    <Flow items={project.flow} />

    <div className="detail-achievement-grid">
      <section>
        <h3>기여한 부분 및 성과</h3>
        <ul className="contribution-list">{project.contribution.map((item) => <li key={item}><EmphasizedText text={item} phrases={project.emphasis} /></li>)}</ul>
      </section>
      <section className="evidence-box"><strong>검증 근거</strong><ul>{project.evidence.map((item) => <li key={item}>{item}</li>)}</ul></section>
    </div>

    {project.private !== true && project.links?.[0] && <a className="detail-repo" href={project.links[0].href}><Github size={14}/>{project.links[0].href.replace('https://', '')}<ExternalLink size={12}/></a>}
    <PageFooter page={page} />
  </section>
}

function ProjectTroubleshootingPage({ project, page }) {
  return <section className="portfolio-sheet portfolio-detail portfolio-troubleshooting" aria-label={`${project.title} 프로젝트 상세 2/2`}>
    <ProjectHeader project={project} section="DEVELOPMENT PROCESS · 2 / 2" />
    <div className="troubleshooting-intro">
      <div><span>질문에서 시작한 문제 해결</span><strong>증상 나열이 아닌 문제 → 원인 → 해결 → 결과 기록</strong></div>
      <p>정상 동작만 제시하지 않고, 무엇을 의심하고 어떤 순서로 원인을 좁혔는지 중심의 개발 과정</p>
    </div>
    <div className="troubleshooting-list expanded">{project.troubleshooting.map((item, index) => <article key={item.title}>
      <header><span>{String(index + 1).padStart(2, '0')}</span><h3>{item.title}</h3></header>
      <blockquote className="troubleshooting-question"><strong>질문</strong><span>{item.question}</span></blockquote>
      <dl>
        <div><dt>문제</dt><dd>{item.problem}</dd></div>
        <div><dt>원인</dt><dd>{item.cause}</dd></div>
        <div><dt>해결</dt><dd>{item.action}</dd></div>
        <div><dt>결과</dt><dd>{item.result}</dd></div>
      </dl>
    </article>)}</div>
    <PageFooter page={page} />
  </section>
}

export default function PrintPortfolio() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = '윤정민 로봇 소프트웨어 포트폴리오'
    document.body.classList.add('print-portfolio-active')
    return () => {
      document.title = previousTitle
      document.body.classList.remove('print-portfolio-active')
    }
  }, [])

  return <div className="print-portfolio-page">
    <div className="portfolio-toolbar" role="region" aria-label="포트폴리오 인쇄 도구">
      <a href="#/resume"><ArrowLeft size={17}/>포트폴리오 사이트</a>
      <div className="print-guidance"><strong>A4 · {totalPortfolioPages(detailProjects.length)}페이지</strong><span>배경 그래픽 켜기 · 여백 없음 · 배율 100%</span></div>
      <button type="button" onClick={() => window.print()}><Printer size={17}/>PDF로 인쇄</button>
    </div>
    <main className="portfolio-document">
      <CoverPage />
      <ExperienceEducationPage />
      <SkillsRecognitionPage />
      <SummaryPage />
      {detailProjects.flatMap((project, index) => {
        const startPage = firstProjectPage(index)
        return [
          <ProjectOverviewPage key={`${project.slug}-overview`} project={project} page={startPage} />,
          <ProjectTroubleshootingPage key={`${project.slug}-troubleshooting`} project={project} page={startPage + 1} />,
        ]
      })}
    </main>
  </div>
}
