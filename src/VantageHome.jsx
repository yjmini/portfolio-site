import { useRef, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react'
import { profile, projects } from './data.js'
import { filterProjects, selectedProjects } from './projectExplorer.js'
import { resolvePublicAsset } from './publicAsset.js'
import './vantage-home.css'

const publicAsset = path => resolvePublicAsset(import.meta.env.BASE_URL, path)
const detail = slug => `#/projects/${slug}`
const selection = selectedProjects(projects)
const filters = [ ['all', '전체'], ['learning', '강화학습'], ['control', '제어'], ['perception', '인지'], ['software', '소프트웨어'] ]
const subject = projects.find(p => p.slug === 'hydraulic-robot-rl')
const titles = {
  'hydraulic-robot-rl': '유압식 로봇의 전진 정책', kinderbot: 'KinderBot', cadflow: 'CADFlow',
  'thing-robot-hand': 'THING 로봇 손', 'smart-assembly-transport': '스마트 조립·무인 운송',
  'go1-remote-inspection': 'Go1 원격 점검',
}
const figureSrc = publicAsset('assets/vantage/arm-cloud.svg')
const number = n => String(n).padStart(2, '0')

function SectionLabel({ n, children }) {
  return <p className="vh-label"><span>{n}</span><i aria-hidden="true" />{children}</p>
}

function ProjectIndex({ headingRef }) {
  const [filter, setFilter] = useState('all')
  const shown = filterProjects(selection, filter)
  return <section className="vh-wrap vh-section" aria-labelledby="vh-index">
    <SectionLabel n="02">Project index</SectionLabel>
    <div className="vh-section-head"><h2 ref={headingRef} id="vh-index" tabIndex={-1}>선별 프로젝트</h2><a className="vh-link" href="#/projects">전체 프로젝트 <ArrowUpRight /></a></div>
    <div className="vh-filterline"><div className="vh-filters" role="group" aria-label="프로젝트 분야 필터">
      {filters.map(([id, label]) => <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>)}
    </div><span className="vh-count" role="status">{shown.length}개 프로젝트</span></div>
    <ol className="vh-list">{shown.map(p => <li key={p.slug}><a href={detail(p.slug)}>
      <span className="vh-no" aria-hidden="true">{number(selection.indexOf(p) + 1)}</span>
      <span className="vh-record"><strong>{titles[p.slug] ?? p.shortTitle}</strong><span>{p.tagline}</span></span>
      <span className="vh-year">{p.year}</span><ArrowUpRight className="vh-record-arrow" aria-hidden="true" />
    </a></li>)}</ol>
  </section>
}

export default function VantageHome() {
  const headingRef = useRef(null)
  const goToProjects = () => {
    headingRef.current?.focus({ preventScroll: true })
    headingRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  return <main className="vantage-home" lang="ko" id="main-content" tabIndex={-1}>
    <section className="vh-wrap vh-hero" aria-labelledby="vh-title">
      <div className="vh-hero-copy">
        <p className="vh-byline"><i aria-hidden="true"/>{profile.name}<span aria-hidden="true">/</span><span lang="en">{profile.role}</span></p>
        <h1 id="vh-title">로봇 제어와<br/>강화학습</h1>
        <p className="vh-intro">Isaac Lab에서 유압식 로봇의 전진 동작을 학습시켰습니다. KinderBot에서는 Isaac Sim으로 교실을 만들고 교구를 옮기는 동작을 시험했습니다.</p>
        <button type="button" className="vh-primary" onClick={goToProjects}>프로젝트 보기 <ArrowDown size={17} aria-hidden="true"/></button>
      </div>
      <figure className="vh-figure">
        <div className="vh-stage"><img className="vh-cloud" src={figureSrc} alt="로봇팔의 베이스와 관절, 말단 장치를 점으로 표현한 모델 기반 일러스트레이션" fetchPriority="high"/><img className="vh-scan" src={figureSrc} alt="" aria-hidden="true"/></div>
        <figcaption><span>Fig. 01 <i aria-hidden="true"/> SO-101</span><span>3D 모델의 표면을 점으로 표현</span></figcaption>
      </figure>
    </section>
    <section className="vh-band" aria-labelledby="vh-study"><div className="vh-wrap vh-study">
      <div className="vh-study-copy"><SectionLabel n="01">Field study</SectionLabel><h2 id="vh-study">전진 보상은 올랐는데,<br/>로봇은 제자리였다.</h2>
        <p>유압식 로봇이 몸만 흔들어도 보상을 받았다. 실패 영상과 학습 로그를 함께 보며 전진 속도와 자세 안정성의 보상을 다시 나눴다.</p>
        <a className="vh-link" href={detail(subject.slug)}>유압식 로봇 PPO 제어 읽기 <ArrowRight/></a>
      </div>
      <figure className="vh-photo"><img loading="lazy" src={publicAsset(subject.printGallery[0].src)} alt={subject.printGallery[0].alt}/><figcaption><span>Fig. 02 <i aria-hidden="true"/> 유압식 고하중 로봇 실기체</span><span>{subject.year}</span></figcaption></figure>
    </div></section>
    <section className="vh-wrap vantage-case-pair" aria-label="최근 작업"><a href={detail('kinderbot')}><img loading="lazy" src={publicAsset('assets/kinderbot-case/bench-arm.webp')} alt="실험대 위 로봇팔과 상자에 놓인 교구"/><h2>KinderBot <ArrowUpRight/></h2><p>교구를 집은 수와 테이블에 놓은 수를 따로 셌습니다.</p></a><a href={detail('cadflow')}><img loading="lazy" src={publicAsset('assets/cadflow-case/demo-footprint-viewer.webp')} alt="CADFlow 시연 화면의 핀 목록과 기판 패드 배치"/><h2>CADFlow <ArrowUpRight/></h2><p>핀 번호를 따라 기판의 패드를 찾고, 기존 파일과 겹쳐 보며 다른 부분을 확인했습니다.</p></a></section>
    <ProjectIndex headingRef={headingRef}/>
    <section className="vh-wrap vh-profile" aria-labelledby="vh-person"><div><SectionLabel n="03">Profile & contact</SectionLabel>
      <h2 id="vh-person">{profile.name}</h2><p>{profile.role} <span aria-hidden="true">/</span> {profile.location}</p>
      <a className="vh-email" href={`mailto:${profile.email}`}>{profile.email} <ArrowUpRight/></a></div>
      <nav aria-label="프로필과 기록" className="vh-profilenav">{[['#/about','소개 및 기술'],['#/projects/robot-study','로보틱스 학습 기록'],['#/lab-archive','인터랙티브 랩 아카이브'],['#/contact','연락처']].map(([href,label])=><a key={href} href={href}>{label}<ArrowUpRight/></a>)}</nav>
    </section>
  </main>
}
