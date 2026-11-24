import { useEffect } from 'react'
import { ArrowLeft, ExternalLink, Github, Mail, Printer } from 'lucide-react'
import { awards, certifications, profile } from './data'
import { editorialProjects, supportProjects, coreSkills, supportSkills } from './portfolioEditorial'
import { kinderbotEditorial } from './kinderbotCase'
import { cadflowEditorialProject } from './cadflowCase'
import './print-portfolio.css'
import './vantage-print.css'
import CaseMeasurements from './CaseMeasurements'

const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
const printProjects = [...editorialProjects, kinderbotEditorial, cadflowEditorialProject]
const totalPages = 2 + printProjects.length * 2 + 2
const skillIconFiles = { ROS2: 'ros', Python: 'python', 'Isaac Lab': 'nvidia', PyTorch: 'pytorch', 'RTAB-Map': 'ros', YOLOv10: 'yolo', PyQt5: 'qt' }
const projectNames = Object.fromEntries([...editorialProjects, ...supportProjects].map(project => [project.slug, project.title]))
const educationActivities = [
  { period: '2026.01 — 현재', title: 'SSAFY 15기 Embedded Robotics Track', organizer: '삼성 청년 SW·AI 아카데미', detail: 'C/C++, Python, Linux, ROS2 기반 로봇 프로젝트. 삼성 SW 역량 테스트 A형 취득.' },
  { period: '2024.12 — 2025.02', title: '심층강화학습 윈터스쿨', organizer: '한국기술교육대학교', detail: 'Unity ML-Agents와 Hugging Face Deep RL Course 기반 학습 및 강화학습 구조 발표.' },
  { period: '2023.03 — 2023.06', title: '군 SW·AI 역량강화 교육', organizer: '대한민국 육군', detail: 'Python, 데이터 분석, AI 기초 교육과 팀 프로젝트. 국방부 장관 명의 수료증.' },
  { period: '2022.05 — 2022.12', title: '메타버스 아카데미 1기 · 콘텐츠 창작자 과정', organizer: '한국전파진흥협회', detail: '3ds Max, Unity, The Sandbox 기반 3D 에셋과 인터랙션 제작.' },
]

function PageFooter({ page }) {
  return <footer className="portfolio-page-footer"><span>윤정민 / ROBOT SOFTWARE</span><span>{String(page).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}</span></footer>
}

function Sheet({ page, label, className = '', children }) {
  return <section className={`portfolio-sheet ${className}`} aria-label={label} data-page={page}>
    <div className="sheet-content">{children}</div><PageFooter page={page} />
  </section>
}

function RecognitionList({ items }) {
  return <ul className="recognition-list">{items.map(([name, meta]) => <li key={name}><span>{name}</span><small>{meta}</small></li>)}</ul>
}

function ProfilePage() {
  return <Sheet page={1} label="자기소개와 주요 이력" className="profile-sheet">
    <header className="profile-header vp-cover">
      <div><p className="eyebrow">Robot software engineer</p><h1>윤정민 <small>Yoon Jeongmin</small></h1><h2>학습한 동작을 실제 로봇에서 구현하는 개발자</h2></div>
      <figure className="vp-cover-figure vp-frame">
        <img src={asset('assets/vantage/arm-cloud.svg')} alt="SO-101 로봇팔의 3D 메시를 점으로 표현한 일러스트" />
        <figcaption>SO-101 <span>/ 메시 일러스트</span></figcaption>
      </figure>
    </header>
    <div className="vp-profile-summary">
    <img className="vp-portrait" src={asset('assets/profile/yoon-jeongmin.png')} alt="윤정민 프로필" />
    <p className="profile-intro">Isaac Lab에서 유압 로봇의 PPO 정책을 학습하고 실제 로봇에 적용했습니다.<br />ROS2 로봇 손 프로젝트에서는 명령 중재와 안전 상태 관리를 맡았습니다.<br />로봇이 의도와 다르게 움직일 때, 모델부터 명령 처리와 구동계까지 원인을 찾아 수정합니다.</p>
    <div className="profile-contact"><a href={`mailto:${profile.email}`}><Mail size={14} />{profile.email}</a><a href={profile.github}><Github size={14} />github.com/yjmini</a></div>
    </div>
    <section className="profile-strengths"><h3>핵심 강점</h3><dl>
      <div><dt>학습 기반 제어</dt><dd>물리 모델과 보상을 구성하고, 로그와 실제 동작을 비교해 정책을 수정합니다.</dd></div>
      <div><dt>로봇 제어 소프트웨어</dt><dd>제어권 충돌, 통신 단절, 비상 정지 상황을 명령 처리와 상태 전이에 반영합니다.</dd></div>
      <div><dt>장비와 소프트웨어 통합</dt><dd>센서, 온보드 컴퓨터, 원격 화면을 연결하고 실제 장비에서 문제를 확인합니다.</dd></div>
    </dl></section>
    <section className="profile-background"><h3>학력 및 연구 경험</h3>
      <div className="timeline-row"><time>2025.06 — 2025.12</time><div><strong>한국원자력연구원 로봇응용연구실 / 인턴연구원</strong><p>유압 로봇 강화학습, MoveIt 공정 자동화, PyQt5 로봇 제어 UI 개선</p></div></div>
      <div className="timeline-row"><time>2020.03 — 2026.02</time><div><strong>한국기술교육대학교 컴퓨터공학부</strong><p>학사 졸업 / 학점 4.12 / 4.5</p></div></div>
    </section>
    <section className="profile-education"><h3>교육 및 활동</h3>{educationActivities.map(item => <div className="timeline-row" key={item.title}><time>{item.period}</time><div><strong>{item.title}</strong><span className="organizer">{item.organizer}</span><p>{item.detail}</p></div></div>)}</section>
    <section className="profile-awards"><h3>수상</h3><RecognitionList items={awards} /></section>
  </Sheet>
}

function SkillsPage() {
  return <Sheet page={2} label="핵심 기술과 활용 근거" className="skills-sheet">
    <header className="section-heading"><p className="eyebrow">TECHNICAL SKILLS</p><h2>핵심 기술과 구현 경험</h2></header>
    <p className="skill-definition"><b>구현</b> 직접 기능을 작성하고 문제를 수정한 기술 / <b>활용</b> 기존 도구를 설정하고 프로젝트에 적용한 기술</p>
    <div className="editorial-skills">{coreSkills.map(skill => <article key={skill.name}>
      <div className="skill-name"><img src={asset(`assets/tech-icons/${skillIconFiles[skill.name]}.svg`)} alt="" aria-hidden="true" /><strong>{skill.name}</strong><span>{skill.level}</span></div>
      <div><p>{skill.evidence}</p><small>{projectNames[skill.project]}</small></div>
    </article>)}</div>
    <section className="support-skills"><h3>보조 기술</h3><p>{supportSkills.join(', ')}</p></section>
    <section className="ai-tool-note"><h3>개발 보조 도구</h3><p>Hermes Agent와 Codex를 자료 조사, 구현 초안, 테스트 작성과 코드 리뷰에 활용합니다. 생성된 변경은 실행 결과와 테스트, 화면 출력을 확인한 뒤 반영합니다.</p></section>
    <section className="qualifications"><h3>자격 및 어학</h3><RecognitionList items={certifications.map(([name, meta]) => [name === 'Samsung SW Competency A' ? '삼성 SW 역량 테스트 A형' : name, meta])} /></section>
  </Sheet>
}

function ProjectLinks({ project }) {
  return project.links?.length > 0 && <div className="project-links">{project.links.map(link => <a key={link.href} href={link.href}><ExternalLink size={12} /><span>{link.label} / {link.href.replace('https://', '')}</span></a>)}</div>
}

function Gallery({ project }) {
  return <div className={`evidence-gallery media-${project.gallery.length}`}>
    {project.gallery.map((media, index) => <figure key={media.src}>
      <div className="vp-frame"><img src={asset(media.src)} alt={media.alt} /></div>
      <figcaption><b>그림 {index + 1}.</b> {media.caption}</figcaption>
    </figure>)}
  </div>
}

function Flow({ items }) {
  return <section className="flow-section"><h3>시스템 흐름</h3><ol className="project-flow">{items.map((item, index) => <li key={item}><span>{item}</span>{index < items.length - 1 && <b aria-hidden="true">→</b>}</li>)}</ol></section>
}

function Contributions({ project }) {
  return <section className="contributions"><h3>내가 구현한 기능</h3>{project.contributions.map((item, index) => <article key={item.title}>
    <h4><span>{String(index + 1).padStart(2, '0')}</span>{item.title}</h4><p>{item.body}</p><p className="evidence-reference">{item.proof}</p>
  </article>)}</section>
}

function ProjectOverviewPage({ project, page, index }) {
  return <Sheet page={page} label={`${project.title} 개요와 구현`} className={`overview-sheet project-${project.slug}`}>
    <header className="project-header"><p className="eyebrow">PROJECT {String(index + 1).padStart(2, '0')} / 개요와 구현</p><h2>{project.title}</h2><p>{project.period}</p></header>
    <div className="project-meta"><p><b>팀 구성</b><span>{project.team}</span></p><p><b>담당 역할</b><span>{project.role}</span></p><p><b>개발 환경</b><span>{project.stack.join(', ')}</span></p></div>
    <div className="project-context"><section><h3>배경과 목표</h3><p>{project.background}</p><p>{project.goal}</p></section><section><h3>주요 기능</h3><ul>{project.features.map(item => <li key={item}>{item}</li>)}</ul></section></div>
    <Gallery project={project} />
    <Flow items={project.flow} />
    <Contributions project={project} />
    <ProjectLinks project={project} />
  </Sheet>
}

function CaseStudy({ item, index }) {
  return <article className="case-study"><h3><span>{String(index + 1).padStart(2, '0')}</span>{item.title}</h3>
    <dl><div><dt>문제 현상</dt><dd>{item.before}</dd></div><div><dt>원인</dt><dd>{item.cause}</dd></div><div className="case-action"><dt>수정한 내용</dt><dd>{item.action}</dd></div><div className="case-after"><dt>관찰한 변화</dt><dd>{item.after}</dd></div></dl>
  </article>
}

function Outcome({ project }) {
  return <section className="project-outcome"><h3>성과와 회고</h3><dl><div><dt>성과</dt><dd>{project.outcome}</dd></div><div><dt>회고</dt><dd>{project.reflection}</dd></div><div><dt>다음에는</dt><dd>{project.nextStep}</dd></div></dl></section>
}

function ProjectTroubleshootingPage({ project, page, index }) {
  return <Sheet page={page} label={`${project.title} 문제 해결과 회고`} className="troubleshooting-sheet">
    <header className="continuation-header"><p className="eyebrow">PROJECT {String(index + 1).padStart(2, '0')} / {project.title}</p><h2>문제 해결과 회고</h2></header>
    <div className="case-list">{project.cases.map((item, index) => <CaseStudy item={item} index={index} key={item.title} />)}</div>
    <CaseMeasurements slug={project.slug}/>
    <Outcome project={project} />
  </Sheet>
}

function SupportingPage({ project, page }) {
  return <Sheet page={page} label={`${project.title} 추가 경험`} className="supporting-sheet">
    <header className="project-header"><p className="eyebrow">ADDITIONAL EXPERIENCE / 시스템 통합</p><h2>{project.title}</h2><p>{project.period}</p></header>
    <p className="support-role"><b>담당 역할</b> {project.role}</p><p>{project.background}</p>
    <Gallery project={project} /><Contributions project={project} />
    {project.cases.map((item, index) => <CaseStudy item={item} index={index} key={item.title} />)}
    <Outcome project={project} /><ProjectLinks project={project} />
  </Sheet>
}

function ResearchExtrasPage({ page }) {
  return <Sheet page={page} label="연구 인턴 추가 경험" className="research-extras-sheet">
    <header className="section-heading"><p className="eyebrow">ADDITIONAL EXPERIENCE / KAERI</p><h2>공정 자동화와 로봇 제어 UI</h2></header>
    {supportProjects.slice(1).map(project => <article className="research-extra" key={project.slug}>
      <header><h3>{project.title}</h3><span>{project.period}</span></header>
      <p className="support-role"><b>담당 역할</b> {project.role}</p>
      <div className="extra-content"><Gallery project={project} /><div><p>{project.background}</p>{project.contributions.map(item => <p key={item.title}><b>{item.title}</b><br />{item.body}</p>)}</div></div>
      {project.cases.map(item => <dl className="extra-case" key={item.title}><div><dt>문제</dt><dd>{item.before}</dd></div><div><dt>수정</dt><dd>{item.action}</dd></div><div><dt>결과</dt><dd>{item.after}</dd></div></dl>)}
      <p className="extra-reflection"><b>회고</b> {project.reflection} <span>{project.nextStep}</span></p>
    </article>)}
  </Sheet>
}

export default function PrintPortfolio() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = '윤정민 로봇 소프트웨어 포트폴리오'
    document.body.classList.add('print-portfolio-active')
    return () => { document.title = previousTitle; document.body.classList.remove('print-portfolio-active') }
  }, [])
  return <div className="print-portfolio-page">
    <div className="portfolio-toolbar" role="region" aria-label="포트폴리오 인쇄 도구"><a href="#/resume"><ArrowLeft size={17} />포트폴리오 사이트</a><div><strong>A4 / {totalPages}페이지</strong><span>배경 그래픽 켜기 · 여백 없음 · 배율 100%</span></div><button type="button" data-print onClick={() => window.print()}><Printer size={17} />PDF로 인쇄</button></div>
    <main className="portfolio-document">
      <ProfilePage />
      <SkillsPage />
      {printProjects.flatMap((project, index) => {
        const startPage = 3 + index * 2
        return [<ProjectOverviewPage key={`${project.slug}-overview`} project={project} index={index} page={startPage} />, <ProjectTroubleshootingPage key={`${project.slug}-cases`} project={project} index={index} page={startPage + 1} />]
      })}
      <SupportingPage project={supportProjects[0]} page={totalPages - 1} />
      <ResearchExtrasPage page={totalPages} />
    </main>
  </div>
}
