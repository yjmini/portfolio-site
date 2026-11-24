import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Copy, Github, Search } from 'lucide-react'
import { profile, projects } from './data'
import { filterProjects, projectCategories, projectCategory, selectedProjects } from './projectExplorer'
import { resolvePublicAsset } from './publicAsset'
import './interactive-portfolio.css'

const RobotLab = lazy(() => import('./RobotLab'))
const asset = path => resolvePublicAsset(import.meta.env.BASE_URL, path)
const work = selectedProjects(projects)
const categoryLabel = p => projectCategories.find(c => c.id === projectCategory(p))?.label

class RobotBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (!this.state.failed) return this.props.children
    return <div className="studio-loading studio-loading-error" role="status">
      <svg width="280" height="250" viewBox="0 0 280 250" aria-hidden="true">
        <ellipse cx="130" cy="219" rx="78" ry="17" fill="none" stroke="#687040"/>
        <path d="M130 209V167L82 75L200 56V115" fill="none" stroke="#919885" strokeWidth="22" strokeLinejoin="round"/>
        <path d="M185 113V137H191M215 113V137H209" fill="none" stroke="#919885" strokeWidth="6"/>
        <g fill="#e8ff47" stroke="#0b0c0a" strokeWidth="7"><circle cx="130" cy="167" r="17"/><circle cx="82" cy="75" r="17"/><circle cx="200" cy="56" r="17"/></g>
      </svg>
      <p>3D를 불러오지 못해 정적 미리보기로 표시합니다.</p>
      <a className="studio-text-link" href="#/projects">프로젝트 둘러보기 <ArrowUpRight size={17}/></a>
    </div>
  }
}

function SectionLabel({ number, children }) {
  return <div className="studio-label"><span>{number}</span>{children}</div>
}

function WorkPreview({ project }) {
  const [view, setView] = useState('overview')
  return <div className="work-preview" key={project.slug}>
    <a className="work-preview-image" href={`#/projects/${project.slug}`}>
      <img src={asset(project.printImage || project.image)} alt={`${project.title} 실제 프로젝트 자료`} loading="lazy"/>
      <span className="preview-open">프로젝트 열기 <ArrowUpRight size={19}/></span>
    </a>
    <div className="preview-caption"><span>{categoryLabel(project)}</span><span>{project.period}</span></div>
    <div className="preview-tabs" role="group" aria-label="프로젝트 요약 보기">
      <button aria-pressed={view === 'overview'} onClick={() => setView('overview')}>프로젝트</button>
      <button aria-pressed={view === 'role'} onClick={() => setView('role')}>담당 역할</button>
      <a href={`#/projects/${project.slug}`}>상세 보기 <ArrowUpRight size={15}/></a>
    </div>
    <p className="preview-description" aria-live="polite">{view === 'overview' ? project.tagline : project.role}</p>
  </div>
}

function SelectedWork() {
  const [active, setActive] = useState(work[0].slug)
  const project = work.find(p => p.slug === active)
  return <section className="studio-section selected-work" id="selected-work" aria-labelledby="selected-title">
    <div className="studio-section-top"><SectionLabel number="01">SELECTED WORK</SectionLabel><span className="studio-aside-label">실험에서 시스템까지</span></div>
    <div className="studio-heading"><h2 id="selected-title">생각을, <span>움직임으로.</span></h2><a href="#/projects" className="studio-text-link">모든 프로젝트 <ArrowUpRight size={19}/></a></div>
    <div className="work-browser">
      <WorkPreview key={project.slug} project={project}/>
      <div className="work-index" role="group" aria-label="대표 프로젝트 선택">
        {work.map((p, i) => <button key={p.slug} className={`work-index-row${active === p.slug ? ' is-active' : ''}`} aria-pressed={active === p.slug} onClick={() => setActive(p.slug)}>
          <span className="work-number">0{i + 1}</span><span className="work-index-copy"><small>{categoryLabel(p)}</small><strong>{p.shortTitle}</strong><span>{p.title}</span></span><ArrowUpRight className="work-index-arrow" size={22}/>
        </button>)}
        <div className="work-index-foot"><span className="studio-small-dot"/>프로젝트를 선택해 살펴보세요.</div>
      </div>
    </div>
  </section>
}

function Practice() {
  const [active, setActive] = useState('learning')
  const practices = [
    { id: 'learning', title: 'Learn.', subtitle: '강화학습과 시뮬레이션', keywords: ['Isaac Lab', 'PPO', 'PyTorch'], text: '학습 로그와 실패 영상을 함께 보며 보상 설계와 로봇의 움직임을 연결합니다.', href: '#/projects/hydraulic-robot-rl' },
    { id: 'connect', title: 'Connect.', subtitle: '인식부터 제어까지', keywords: ['ROS2', 'Python / C++', 'FSM'], text: '센서, 인식, 로봇과 웹을 하나의 실행 흐름으로 연결합니다.', href: '#/projects/smart-assembly-transport' },
    { id: 'protect', title: 'Protect.', subtitle: '실제 하드웨어의 안전 경계', keywords: ['State machine', 'Command Guard', 'E-Stop'], text: '오래된 명령과 통신 단절이 실제 모터의 위험한 동작으로 이어지지 않도록 제어 경계를 만듭니다.', href: '#/projects/thing-robot-hand' },
  ]
  const item = practices.find(p => p.id === active)
  return <section className="studio-section practice-section" aria-labelledby="practice-title">
    <div className="studio-section-top"><SectionLabel number="02">HOW I BUILD</SectionLabel><h2 id="practice-title">지능과 하드웨어 사이.</h2></div>
    <div className="practice-layout">
      <div className="practice-switches" role="group" aria-label="개발 분야 선택">{practices.map(p => <button key={p.id} onClick={() => setActive(p.id)} aria-pressed={p.id === active}><span>{p.title}</span><ArrowUpRight size={32}/></button>)}</div>
      <div className="practice-detail" aria-live="polite"><div className="practice-orbit" aria-hidden="true"><span/><i/><b>{active === 'learning' ? 'π' : active === 'connect' ? '↔' : '✓'}</b></div><h3>{item.subtitle}</h3><p>{item.text}</p><div className="practice-tags">{item.keywords.map(t => <span key={t}>{t}</span>)}</div><a href={item.href} className="studio-text-link">관련 프로젝트 <ArrowUpRight size={17}/></a></div>
    </div>
  </section>
}

export function StudioContact() {
  const [status, setStatus] = useState('')
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  const copy = async () => {
    clearTimeout(timer.current)
    try { await navigator.clipboard.writeText(profile.email); setStatus('이메일을 복사했습니다.') }
    catch { setStatus('복사할 수 없습니다. 이메일 주소를 직접 선택해 주세요.') }
    timer.current = setTimeout(() => setStatus(''), 3500)
  }
  return <section className="studio-contact" aria-labelledby="studio-contact-title"><div className="studio-contact-inner">
    <SectionLabel number="03">LET’S CONNECT</SectionLabel><div className="studio-contact-heading"><h2 id="studio-contact-title">다음 움직임을,<br/><span>함께.</span></h2><a className="contact-orb" href={`mailto:${profile.email}`} aria-label="윤정민에게 이메일 보내기"><ArrowUpRight/></a></div>
    <div className="studio-contact-bottom"><div className="studio-email"><a href={`mailto:${profile.email}`}>{profile.email}</a><button onClick={copy} aria-label="이메일 주소 복사">{status.startsWith('이메일을') ? <Check size={18}/> : <Copy size={18}/>}</button><span role="status">{status}</span></div><a href={profile.github} target="_blank" rel="noreferrer" className="studio-text-link"><Github size={18}/>GitHub<ArrowUpRight size={15}/></a></div>
  </div></section>
}

export default function InteractiveHome() {
  const scrollToWork = () => {
    const target = document.getElementById('selected-work')
    if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 90, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  return <main id="main-content" tabIndex="-1" className="studio-home">
    <section className="studio-hero" aria-labelledby="studio-title">
      <div className="studio-hero-top"><span><i/>ROBOT SOFTWARE ENGINEER</span><span>YOON JEONGMIN / 윤정민</span></div>
      <div className="studio-hero-grid">
        <div className="studio-hero-copy"><p className="studio-hero-kicker">LEARNING. CONTROL. REAL WORLD.</p><h1 id="studio-title">Intelligence<br/>in <em>motion.</em></h1><p className="studio-hero-description">로봇 지능을, 실제로 움직이게.<br/><span>강화학습에서 ROS2, 그리고 하드웨어까지.</span></p><div className="studio-hero-actions"><button className="studio-primary" onClick={scrollToWork}>프로젝트 탐색<ArrowDown size={18}/></button><a className="studio-secondary" href="#/portfolio-pdf">PDF 포트폴리오<ArrowUpRight size={17}/></a></div></div>
        <div className="studio-hero-lab"><RobotBoundary><Suspense fallback={<div className="studio-loading" role="status">인터랙티브 스튜디오 준비 중<span/></div>}><RobotLab/></Suspense></RobotBoundary></div>
      </div>
      <div className="studio-hero-bottom"><span>SIMULATION <i/> INTELLIGENCE <i/> ROBOTICS</span><button onClick={scrollToWork}>SCROLL TO DISCOVER <ArrowDown size={15}/></button></div>
    </section>
    <div className="studio-body"><SelectedWork/><Practice/></div><StudioContact/>
  </main>
}

import {caseCover, shortDescriptions} from './casebook'
export function ProjectsExplorer() {
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const results = filterProjects(projects, category, query)
  return <main id="main-content" tabIndex="-1" className="studio-projects">
    <SectionLabel number="INDEX">PROJECT ARCHIVE</SectionLabel><div className="archive-heading"><h1>Built to<br/><em>move.</em></h1><p>모델, 로봇,<br/>그리고 그 사이의 시스템.</p></div>
    <div className="archive-toolbar"><div className="archive-filters" role="group" aria-label="프로젝트 분야">{projectCategories.map(c => <button key={c.id} aria-pressed={c.id === category} onClick={() => setCategory(c.id)}>{c.label}</button>)}</div><label className="archive-search"><Search size={17}/><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="프로젝트 · 기술 검색" aria-label="프로젝트 검색"/></label></div>
    <p className="archive-count" role="status">{String(results.length).padStart(2, '0')} PROJECTS</p>
    <div className="archive-grid">{results.map((p, i) => <a href={`#/projects/${p.slug}`} className="archive-card" key={p.slug}><div className="archive-image"><img src={asset(caseCover(p.slug).image)} alt={caseCover(p.slug).alt} loading={i > 1 ? 'lazy' : 'eager'}/><span className="archive-card-arrow"><ArrowUpRight size={24}/></span></div><div className="archive-card-meta"><span>{categoryLabel(p)}</span><span>{p.year}</span></div><h2>{p.title}</h2><p>{shortDescriptions[p.slug] || p.tagline}</p><div className="archive-stack">{p.stack.slice(0, 4).join(' / ')}</div></a>)}</div>
    {!results.length && <div className="archive-empty"><h2>일치하는 프로젝트가 없습니다.</h2><button className="studio-secondary" onClick={() => { setCategory('all'); setQuery('') }}>필터 초기화<ArrowRight size={16}/></button></div>}
    <a href="#/" className="archive-return">처음으로 <ArrowUpRight size={17}/></a>
  </main>
}
