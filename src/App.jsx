import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown,
  Download, Github, Mail, MapPin, Menu, Search, Send, X,
} from 'lucide-react'
import { awards, certifications, experience, profile, projects, toolGroups } from './data'
import { hideCursor, positionCursor } from './cursor'
import PrintPortfolio from './PrintPortfolio'

const publicAsset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

const routeLabel = {
  '/': 'Home', '/projects': 'Projects', '/work': 'Work', '/about': 'About',
  '/resume': 'Résumé', '/portfolio-pdf': 'PDF Portfolio', '/contact': 'Contact',
}

function normalizeHash() {
  const raw = window.location.hash.replace(/^#/, '') || '/'
  return raw.startsWith('/') ? raw : `/${raw}`
}

function useRoute() {
  const [route, setRoute] = useState(normalizeHash)
  useEffect(() => {
    const onHash = () => {
      setRoute(normalizeHash())
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return route
}

const Link = forwardRef(function Link({ to, children, className = '', onClick, ...props }, ref) {
  const href = to.startsWith('http') || to.startsWith('mailto:') ? to : `#${to}`
  const external = to.startsWith('http')
  return <a ref={ref} href={href} className={className} onClick={onClick} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} {...props}>{children}</a>
})

function Eyebrow({ children }) {
  return <div className="eyebrow"><span aria-hidden="true" />{children}</div>
}

function Status({ children, current = false }) {
  return <div className="status"><span className={`status-dot${current ? ' ping' : ''}`} />{children}</div>
}

function CTA({ to, children, secondary = false, external = false, download = false, asset = false }) {
  const CIcon = download ? Download : external ? ArrowUpRight : ArrowRight
  if (asset) {
    return <a href={publicAsset(to)} className={secondary ? 'cta-secondary' : 'cta-primary'} download={download || undefined} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>{children}<CIcon size={16} /></a>
  }
  return <Link to={to} className={secondary ? 'cta-secondary' : 'cta-primary'} download={download || undefined}>{children}<CIcon size={16} /></Link>
}

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el?.classList.add('is-visible')
      return
    }
    const revealFallback = window.setTimeout(() => el.classList.add('is-visible'), 1200)
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('is-visible')
        window.clearTimeout(revealFallback)
        observer.disconnect()
      }
    }, { rootMargin: '0px 0px -12% 0px' })
    observer.observe(el)
    return () => {
      window.clearTimeout(revealFallback)
      observer.disconnect()
    }
  }, [])
  return <div ref={ref} className={`reveal ${className}`} style={{ '--delay': `${delay}s` }}>{children}</div>
}

function VisualFrame({ project, compact = false, staticImage = false }) {
  return <div className={`visual-wrap${compact ? ' compact' : ''}${staticImage ? ' static' : ''}`}>
    {!compact && <div className="visual-glow" aria-hidden="true" />}
    <div className="visual-frame">
      <div className="visual-chrome">
        <span /><span /><span />
        <small>{project.links?.[0]?.href?.replace('https://', '') || `CASE STUDY / ${project.slug}`}</small>
      </div>
      <div className="visual-viewport">
        {project.image ? <img src={publicAsset(project.image)} alt={`${project.title} 프로젝트 화면`} style={{ objectPosition: project.imagePosition || 'top' }} /> : <ProjectPlaceholder project={project} />}
      </div>
    </div>
  </div>
}

function ProjectPlaceholder({ project }) {
  return <div className="project-placeholder" aria-label={`${project.title} 그래픽`}>
    <div className="placeholder-grid" />
    <span className="placeholder-index">{project.index}</span>
    <div className="placeholder-center">
      <span>{project.shortTitle}</span>
      <small>{project.stack.slice(0, 3).join(' / ')}</small>
    </div>
  </div>
}

function ProjectCard({ project, delay = 0 }) {
  return <Reveal delay={delay}>
    <Link to={`/projects/${project.slug}`} className="project-card">
      <VisualFrame project={project} compact />
      <div className="project-card-meta"><span>{project.year}</span><Status>{project.status}</Status></div>
      <h3>{project.title}</h3>
      <p>{project.tagline}</p>
    </Link>
  </Reveal>
}

function RobotScene() {
  return <div className="robot-scene" aria-label="로봇 소프트웨어 시스템을 표현한 그래픽">
    <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
    <div className="robot-card grain">
      <div className="robot-card-top"><span>ROBOT_STACK / LIVE</span><span className="live-mark">●</span></div>
      <svg viewBox="0 0 520 440" role="img" aria-labelledby="robotTitle">
        <title id="robotTitle">센서, 인식, 계획, 제어 계층으로 연결된 로봇 시스템</title>
        <defs>
          <linearGradient id="arm" x1="0" x2="1"><stop offset="0" stopColor="#353c42"/><stop offset="1" stopColor="#171b1e"/></linearGradient>
          <filter id="soft"><feGaussianBlur stdDeviation="8"/></filter>
        </defs>
        <circle cx="260" cy="214" r="142" fill="none" stroke="#262b30" strokeDasharray="3 8"/>
        <circle cx="260" cy="214" r="104" fill="#0e1113" stroke="#d9663d" strokeOpacity=".35"/>
        <circle cx="260" cy="214" r="62" fill="#d9663d" fillOpacity=".08" filter="url(#soft)"/>
        <g className="robot-arm-svg">
          <rect x="226" y="183" width="68" height="70" rx="14" fill="url(#arm)" stroke="#5f686f"/>
          <circle cx="260" cy="218" r="18" fill="#d9663d" fillOpacity=".85"/>
          <path d="M229 204 L165 158 L119 193" fill="none" stroke="url(#arm)" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M291 204 L355 149 L405 187" fill="none" stroke="url(#arm)" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="165" cy="158" r="16" fill="#d9663d"/><circle cx="355" cy="149" r="16" fill="#d9663d"/>
          <path d="M119 193 L104 268 M405 187 L422 263" stroke="#30373d" strokeWidth="20" strokeLinecap="round"/>
          <path d="M94 267 l-20 34 M111 269 l6 40 M412 263 l-6 42 M430 261 l20 35" stroke="#8a929b" strokeWidth="8" strokeLinecap="round"/>
        </g>
        <g className="sensor-lines" fill="none" stroke="#d9663d" strokeOpacity=".62">
          <path d="M260 112 V48 H370"/><path d="M157 214 H66 V119"/><path d="M363 214 H459 V320"/><path d="M260 317 V382 H148"/>
        </g>
        <g fill="#c7c3ba" fontFamily="Geist Mono" fontSize="12">
          <text x="379" y="51">SENSOR</text><text x="42" y="111">PERCEPTION</text>
          <text x="421" y="339">CONTROL</text><text x="83" y="399">SIMULATION</text>
        </g>
        <g fill="#d9663d"><circle cx="260" cy="48" r="4"/><circle cx="66" cy="119" r="4"/><circle cx="459" cy="320" r="4"/><circle cx="148" cy="382" r="4"/></g>
      </svg>
      <div className="robot-readout"><span><b>ROS2</b> orchestration</span><span><b>PPO</b> policy</span><span><b>RGB-D</b> perception</span></div>
    </div>
  </div>
}

function TerminalPanel() {
  const lines = [
    '$ ros2 launch system bringup.launch.py',
    '✓ sensors / perception / control',
    '✓ policy latency within test budget',
    '✓ state transition verified',
    'robot@edge:~$ ready_',
  ]
  return <div className="terminal-panel grain" aria-label="로봇 시스템 터미널 상태">
    <div className="terminal-title"><span /><span /><span /><b>jeongmin@robot-stack</b></div>
    <div className="terminal-lines">{lines.map((line, i) => <div key={line} style={{ '--line': i }}>{line}</div>)}</div>
  </div>
}

function Header({ route, onSearch }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menuButton = useRef(null)
  const firstLink = useRef(null)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    document.body.classList.toggle('menu-locked', open)
    if (open) setTimeout(() => firstLink.current?.focus(), 60)
    const onKey = e => {
      if (e.key === 'Escape' && open) { setOpen(false); menuButton.current?.focus() }
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.classList.remove('menu-locked') }
  }, [open])
  useEffect(() => setOpen(false), [route])
  const navs = [['01', '/projects', 'Projects'], ['02', '/work', 'Work'], ['03', '/about', 'About']]
  const active = path => path === '/projects' ? route.startsWith('/projects') : route === path
  return <header className={`site-header${scrolled || open ? ' is-scrolled' : ''}`}>
    <div className="container header-inner">
      <Link to="/" className="logo" aria-label="윤정민 포트폴리오 홈">jeongmin<span>.</span>yoon</Link>
      <nav className="desktop-nav" aria-label="주요 메뉴">
        {navs.map(([n, path, label]) => <Link key={path} to={path} className={active(path) ? 'active' : ''} aria-current={active(path) ? 'page' : undefined}><small>{n}</small>{label}</Link>)}
      </nav>
      <div className="header-utils">
        <button className="search-trigger" onClick={onSearch}><Search size={16}/><span>Search</span><kbd>Ctrl K</kbd></button>
        <Link to="/resume" className="resume-link">Résumé</Link>
        <Link to="/contact" className="contact-link">Get in touch</Link>
      </div>
      <button ref={menuButton} className="mobile-toggle" aria-label={open ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={open} onClick={() => setOpen(v => !v)}>{open ? <X/> : <Menu/>}</button>
    </div>
    <div className={`mobile-panel${open ? ' open' : ''}`} aria-hidden={!open}>
      <div><nav>
        {navs.map(([n, path, label], i) => <Link ref={i === 0 ? firstLink : undefined} key={path} to={path}><small>{n}</small>{label}</Link>)}
        <Link to="/resume"><small>04</small>Résumé</Link>
        <Link to="/contact" className="mobile-cta">Get in touch <ArrowRight size={16}/></Link>
      </nav></div>
    </div>
  </header>
}

function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const input = useRef(null)
  const items = useMemo(() => {
    const allItems = [
      ...Object.entries(routeLabel).map(([path, label]) => ({ label, path, keywords: `page ${label}` })),
      ...projects.map(p => ({ label: p.title, path: `/projects/${p.slug}`, keywords: `${p.stack.join(' ')} ${p.tagline}` })),
      { label: 'GitHub 열기', path: profile.github, keywords: 'external source code' },
      { label: '이메일 보내기', path: `mailto:${profile.email}`, keywords: 'contact email' },
    ]
    return allItems.filter(item => `${item.label} ${item.keywords}`.toLowerCase().includes(query.toLowerCase()))
  }, [query])
  useEffect(() => setSelected(0), [query])
  useEffect(() => {
    if (!open) return
    setQuery(''); setTimeout(() => input.current?.focus(), 0)
    document.body.classList.add('menu-locked')
    return () => document.body.classList.remove('menu-locked')
  }, [open])
  const choose = item => {
    if (!item) return
    if (item.path.startsWith('http') || item.path.startsWith('mailto:')) window.open(item.path, '_blank', 'noopener,noreferrer')
    else window.location.hash = item.path
    onClose()
  }
  const onKey = e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => (s + 1) % Math.max(items.length, 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => (s - 1 + items.length) % Math.max(items.length, 1)) }
    if (e.key === 'Enter') { e.preventDefault(); choose(items[selected]) }
    if (e.key === 'Escape') onClose()
  }
  if (!open) return null
  return <div className="palette-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <div className="palette" role="dialog" aria-modal="true" aria-label="사이트 검색">
      <div className="palette-input"><Search size={17}/><input ref={input} value={query} onChange={e => setQuery(e.target.value)} onKeyDown={onKey} placeholder="프로젝트, 기술 또는 페이지 검색" role="combobox" aria-controls="palette-results" aria-expanded="true" aria-activedescendant={`command-${selected}`}/></div>
      <div id="palette-results" role="listbox" className="palette-results">
        <div className="palette-group">Navigate</div>
        {items.length ? items.map((item, i) => <button id={`command-${i}`} role="option" aria-selected={i === selected} className={i === selected ? 'selected' : ''} key={`${item.path}-${i}`} onMouseMove={() => setSelected(i)} onClick={() => choose(item)}>{item.label}{i === selected && <span>↵</span>}</button>) : <p className="palette-empty">일치하는 항목이 없습니다.</p>}
      </div>
      <div className="palette-hints"><span>↑↓ 이동</span><span>↵ 열기</span><span>Esc 닫기</span></div>
    </div>
  </div>
}

function CustomCursor() {
  const dot = useRef(null), ring = useRef(null)
  useEffect(() => {
    if (!matchMedia('(pointer:fine)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches) return
    const move = e => positionCursor(dot.current, ring.current, e.clientX, e.clientY)
    const hide = () => hideCursor(dot.current, ring.current)
    const over = e => ring.current?.classList.toggle('hover', Boolean(e.target.closest('a,button,[data-cursor]')))
    window.addEventListener('pointermove', move, { passive: true }); document.addEventListener('pointerover', over)
    document.documentElement.addEventListener('mouseleave', hide); window.addEventListener('blur', hide)
    document.documentElement.classList.add('has-cursor')
    return () => { window.removeEventListener('pointermove', move); document.removeEventListener('pointerover', over); document.documentElement.removeEventListener('mouseleave', hide); window.removeEventListener('blur', hide); document.documentElement.classList.remove('has-cursor') }
  }, [])
  return <><span ref={dot} className="cursor-dot"/><span ref={ring} className="cursor-ring"/></>
}

function HomePage() {
  const selected = projects.filter(p => p.featured).slice(0, 3)
  return <main id="main-content" tabIndex="-1" className="page-enter">
    <section className="hero">
      <div className="hero-glow"/><div className="container hero-grid">
        <div className="hero-copy">
          <Status current>로봇 소프트웨어 직무를 찾고 있습니다</Status>
          <h1>로봇 지능을,<br/>실제로 <em>움직이게.</em></h1>
          <p>시뮬레이션에서 학습한 정책을 <strong>ROS2 제어</strong>, 센서·비전, 실제 하드웨어 제약까지 연결합니다. 구현한 기능은 로그와 상태 전이, 반복 실행으로 검증합니다.</p>
          <div className="hero-actions"><CTA to="/projects">프로젝트 보기</CTA><CTA to="/resume" secondary>Résumé</CTA></div>
        </div>
        <div className="hero-visual"><RobotScene/><TerminalPanel/></div>
      </div>
      <div className="scroll-cue"><span>SCROLL TO EXPLORE</span><ChevronDown size={16}/></div>
    </section>

    <section className="section"><div className="container">
      <div className="section-heading"><div><Eyebrow>Selected work</Eyebrow><h2>끝까지 연결해 본 작업.</h2></div><CTA to="/projects" secondary>모든 프로젝트</CTA></div>
      <div className="project-grid">{selected.map((p, i) => <ProjectCard key={p.slug} project={p} delay={i*.08}/>)}</div>
    </div></section>

    <section className="section"><div className="container"><Eyebrow>What I do</Eyebrow>
      <div className="capabilities">
        {[
          ['01','Robot intelligence','PPO 정책 학습, reward 설계, 실패 로그 분석을 통해 시뮬레이션 안의 성능을 설명 가능한 실험으로 만듭니다.'],
          ['02','System integration','ROS2 topic·FSM·WebSocket으로 센서, 인식, 제어, 관제 화면의 경계를 연결하고 실제 실행 흐름을 확인합니다.'],
          ['03','Hardware-aware delivery','제어 주기, 추론 지연, 좌표계, 통신과 기구 오차를 기능의 일부로 보고 Mock부터 실장비까지 단계적으로 검증합니다.'],
        ].map((item, i) => <Reveal key={item[0]} delay={i*.06} className="capability-row"><h3><span>{item[0]}</span>{item[1]}</h3><p>{item[2]}</p></Reveal>)}
      </div>
    </div></section>

    <section className="section currently"><div className="container current-row"><div><Eyebrow>Currently</Eyebrow><h2>SSAFY Embedded Robotics Track</h2><p>스마트 조립·검사·무인 운송을 하나의 ROS2 시스템으로 통합하고 있습니다.</p></div><CTA to="/work" secondary>전체 경로 보기</CTA></div></section>
    <ClosingCTA/>
  </main>
}

function ProjectsPage() {
  const featured = projects.filter(p => p.featured)
  const more = projects.filter(p => !p.featured)
  return <main id="main-content" tabIndex="-1" className="page-standard page-enter"><div className="container">
    <Eyebrow>Projects</Eyebrow><h1 className="page-title">모델, 로봇, 그리고<br/>그 사이의 시스템.</h1>
    <p className="page-lead">대표 연구 과제부터 공개 저장소와 초기 소프트웨어 프로젝트까지, 제가 직접 맡은 범위와 검증 근거를 기준으로 정리했습니다.</p>
    <div className="featured-list">
      {featured.map((project, i) => <Reveal key={project.slug}><article className={`featured-project${i%2 ? ' reverse' : ''}`}>
        <Link to={`/projects/${project.slug}`} className="featured-visual"><VisualFrame project={project}/></Link>
        <div className="featured-copy"><div className="project-index"><b>{project.index}</b><span>{project.year}</span><i/>{project.status}</div>
          <Link to={`/projects/${project.slug}`}><h2>{project.title}</h2></Link><p className="tagline">{project.tagline}</p><p className="description">{project.summary}</p>
          <div className="tag-list">{project.stack.map(s => <span key={s}>{s}</span>)}</div>
          <div className="metric-list">{project.metrics?.map(m => <div key={m.label}><b>{m.value}</b><span>{m.label}</span></div>)}</div>
          <div className="project-actions"><CTA to={`/projects/${project.slug}`} secondary>Case study</CTA>{project.links?.map(l => <CTA key={l.href} to={l.href} secondary external>{l.label}</CTA>)}</div>
        </div>
      </article></Reveal>)}
    </div>
    <section className="more-work"><div className="subsection-heading"><Eyebrow>More work</Eyebrow><p>공개 코드, 기술 실험, 초기 구현까지.</p></div>
      <div className="more-grid">{more.map((p, i) => <ProjectCard key={p.slug} project={p} delay={(i%3)*.06}/>)}</div>
    </section>
  </div></main>
}

function ProjectDetail({ project }) {
  const current = projects.indexOf(project), next = projects[(current+1)%projects.length]
  return <main id="main-content" tabIndex="-1" className="detail-page page-enter"><div className="container">
    <Link to="/projects" className="back-link"><ArrowLeft size={15}/> 프로젝트 목록</Link>
    <div className="detail-meta"><b>{project.year}</b><i/>{project.period}<i/>{project.status}</div>
    <h1>{project.title}</h1><p className="detail-lead">{project.summary}</p>
    <div className="detail-links">{project.links?.map(l => <CTA key={l.href} to={l.href} secondary external>{l.label}</CTA>)}{project.private && <span className="private-note">연구 자료는 공개 범위만 설명합니다.</span>}</div>
    <div className="detail-metrics"><div><b>{project.role}</b><span>담당 범위</span></div><div><b>{project.stack.length}</b><span>핵심 기술</span></div></div>
    <div className="detail-hero"><VisualFrame project={project} staticImage/></div>
    <div className="editorial-grid"><article className="editorial-prose">
      <Eyebrow>Problem</Eyebrow><p>{project.problem}</p>
      <Eyebrow>Decision</Eyebrow><p>{project.decision}</p>
      <Eyebrow>Result</Eyebrow><p>{project.result}</p>
    </article><aside className="detail-aside"><Eyebrow>Highlights</Eyebrow><ul>{project.highlights.map(h => <li key={h}>{h}</li>)}</ul><div className="built-with"><Eyebrow>Built with</Eyebrow><div className="tool-chips">{project.stack.map(s => <span key={s}>{s}</span>)}</div></div></aside></div>
    <Link to={`/projects/${next.slug}`} className="next-project"><span>Next project</span><strong>{next.title}</strong><ArrowUpRight/></Link>
  </div></main>
}

function WorkPage() {
  return <main id="main-content" tabIndex="-1" className="page-standard page-enter"><div className="container">
    <Eyebrow>Work</Eyebrow><h1 className="page-title">학습한 것을<br/>실제 시스템으로.</h1><p className="page-lead">로봇 연구, 팀 프로젝트, 집중 교육을 거치며 모델 성능과 현장 동작 사이의 간극을 좁혀 왔습니다.</p>
    <div className="timeline-list">{experience.map((item, i) => <Reveal key={item.period} delay={i*.05} className="timeline-row"><div className="timeline-meta"><div>{item.current && <span className="timeline-dot"/>}{item.period}</div><small>{item.location}</small></div><div><h2>{item.role} <span>@ {item.place}</span></h2><p>{item.summary}</p><ul>{item.bullets.map(b => <li key={b}>{b}</li>)}</ul></div></Reveal>)}</div>
    <div className="education-grid"><section><Eyebrow>Education</Eyebrow><h2>한국기술교육대학교 컴퓨터공학부</h2><p className="education-meta">2020.03 — 2026.02 · GPA 4.12 / 4.5</p><ul className="dash-list"><li>컴퓨터공학 전공</li><li>심층강화학습 윈터스쿨</li><li>졸업연구작품 우수상</li></ul></section>
      <section><Eyebrow>Recognition</Eyebrow><div className="recognition-list">{awards.map(([name, meta]) => <div key={name}><span>{name}</span><small>{meta}</small></div>)}</div><Eyebrow>Certifications</Eyebrow><div className="recognition-list">{certifications.map(([name, meta]) => <div key={name}><span>{name}</span><small>{meta}</small></div>)}</div></section></div>
  </div></main>
}

function AboutPage() {
  return <main id="main-content" tabIndex="-1" className="page-standard page-enter"><div className="container"><Eyebrow>About</Eyebrow>
    <div className="about-grid"><aside><div className="portrait-wrap"><div className="portrait-glow"/><img src={publicAsset('assets/profile/yoon-jeongmin.png')} alt="윤정민 프로필 사진"/></div>
      <dl className="facts"><div><dt>Based</dt><dd>Gwangju, Korea</dd></div><div><dt>Focus</dt><dd>Robot software</dd></div><div><dt>Languages</dt><dd>Korean / English</dd></div><div><dt>GitHub</dt><dd><Link to={profile.github}>@yjmini</Link></dd></div></dl></aside>
      <article className="about-story"><h1>로봇이 <em>왜 멈췄는지</em><br/>설명할 수 있게 만듭니다.</h1>
        <div className="story"><p>저는 새로운 모델을 붙이는 것보다, 그 모델이 센서 입력과 제어 명령 사이에서 어떻게 동작하는지 끝까지 확인하는 일을 좋아합니다. PPO 정책이 제자리에서 보상을 얻었을 때는 reward 항목을 분리했고, 원격 로봇의 화면이 멈췄을 때는 네트워크부터 ROS topic, 시각화까지 계층별로 좁혔습니다.</p><p>그래서 제 프로젝트에는 늘 실행 흐름이 있습니다. 입력과 출력, 상태 전이, 실패 조건을 먼저 적고 Mock에서 검증한 뒤 실장비로 옮깁니다. <em>기능을 만들었다는 말보다 재현 가능한 확인 절차</em>를 남기는 로봇 소프트웨어 엔지니어가 되고자 합니다.</p></div>
        <div className="now"><Eyebrow>Now</Eyebrow><ul><li>ROS2 기반 스마트 조립·무인 운송 시스템 고도화</li><li>Isaac Sim/Lab과 휴머노이드 강화학습 학습</li><li>C++/Python 로봇 소프트웨어 역량 강화</li></ul></div>
      </article></div>
    <section className="tools-section"><Eyebrow>Tools</Eyebrow><div className="tools-grid">{toolGroups.map(g => <div key={g.name}><h3><span/>{g.name}</h3><div className="tool-chips">{g.tools.map(t => <span key={t}>{t}</span>)}</div></div>)}</div></section>
  </div></main>
}

function ResumePage() {
  return <main id="main-content" tabIndex="-1" className="page-standard page-enter"><div className="container">
    <div className="resume-top"><div><Eyebrow>Résumé</Eyebrow><h1 className="page-title">경험을 한 장의<br/>실행 흐름으로.</h1><p className="page-lead">공개용 이력서에는 연락 가능한 이메일과 GitHub만 포함하며 상세 주소와 전화번호는 제외했습니다.</p></div>
      <div className="resume-actions"><CTA to="/portfolio-pdf">제출용 포트폴리오</CTA><CTA to="resume/yoon-jeongmin-resume-public.pdf" asset download>이력서 PDF</CTA><CTA to="resume/yoon-jeongmin-resume-public.pdf" asset secondary external>새 탭에서 열기</CTA></div></div>
    <div className="resume-preview"><img src={publicAsset('resume/yoon-jeongmin-resume-page-1.png')} alt="윤정민 공개용 이력서 1페이지 미리보기"/></div>
  </div></main>
}

function ContactPage() {
  const [errors, setErrors] = useState({}), [status, setStatus] = useState('')
  const submit = e => {
    e.preventDefault(); const form = e.currentTarget; const data = new FormData(form)
    if (data.get('company')) return
    const next = {}
    if (!data.get('name')?.trim()) next.name = '어떻게 불러드리면 될까요?'
    if (!/^\S+@\S+\.\S+$/.test(data.get('email') || '')) next.email = '회신 가능한 이메일을 입력해 주세요.'
    if (!data.get('message')?.trim()) next.message = '한두 줄이라도 내용을 남겨 주세요.'
    setErrors(next)
    if (Object.keys(next).length) { requestAnimationFrame(() => form.querySelector('[aria-invalid="true"]')?.focus()); return }
    const subject = encodeURIComponent(`[Portfolio] ${data.get('name')}님의 메시지`)
    const body = encodeURIComponent(`${data.get('message')}\n\nFrom: ${data.get('name')} <${data.get('email')}>`)
    setStatus('메일 앱을 열었습니다. 전송 버튼을 눌러 주세요.')
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  }
  return <main id="main-content" tabIndex="-1" className="contact-page page-enter"><div className="container"><Eyebrow>Contact</Eyebrow><h1>같이 움직일<br/>시스템이 있나요?</h1>
    <div className="contact-grid"><div><p className="contact-copy">로봇 소프트웨어, 강화학습 시뮬레이션, 비전·센서 통합에 관해 이야기하고 싶다면 편하게 연락해 주세요.</p><Link to={`mailto:${profile.email}`} className="email-link"><Mail size={22}/>{profile.email}</Link>
      <div className="social-list"><Link to={profile.github}><Github size={17}/>GitHub <ArrowUpRight size={14}/></Link><span><MapPin size={17}/>{profile.location}</span></div>
      <div className="contact-bot" aria-hidden="true"><span className="antenna"/><span className="bot-eye left"/><span className="bot-eye right"/><span className="bot-base"/></div>
    </div>
    <form onSubmit={submit} noValidate><div className="form-row"><Field name="name" label="Name" placeholder="성함" error={errors.name}/><Field name="email" type="email" label="Email" placeholder="name@example.com" error={errors.email}/></div><Field name="message" label="Message" textarea placeholder="프로젝트나 포지션에 관해 알려 주세요." error={errors.message}/><input className="honeypot" name="company" tabIndex="-1" autoComplete="off"/>
      <button className="cta-primary submit-button" type="submit">메시지 작성 <Send size={16}/></button><p className="form-note">전송 시 기본 메일 앱이 열립니다. 별도 서버에 입력 내용을 저장하지 않습니다.</p><p className="form-status" aria-live="polite">{status}</p></form></div>
  </div></main>
}

function Field({ name, label, error, textarea = false, ...props }) {
  const Tag = textarea ? 'textarea' : 'input'
  return <label className="field"><span>{label}</span><Tag name={name} rows={textarea ? 5 : undefined} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} {...props}/>{error && <small id={`${name}-error`}>{error}</small>}</label>
}

function ClosingCTA() {
  return <section className="closing-cta section"><div className="container"><h2>시뮬레이션을 넘어,<br/>실제로 움직이는 로봇까지.</h2><p>제가 맡은 범위와 검증 과정을 더 자세히 이야기해 보겠습니다.</p><CTA to="/contact">연락하기</CTA></div></section>
}

function Footer() {
  return <footer><div className="container"><div className="footer-top"><div><Link to="/" className="logo">jeongmin<span>.</span>yoon</Link><p>{profile.location}</p></div><nav aria-label="하단 메뉴"><Link to="/projects">Projects</Link><Link to="/work">Work</Link><Link to="/about">About</Link></nav><div className="footer-social"><Link to={profile.github}>GitHub</Link><Link to={`mailto:${profile.email}`}>Email</Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Yoon Jeongmin</span><span>Built with React · Deployed on GitHub Pages</span></div></div></footer>
}

function App() {
  const route = useRoute(), [paletteOpen, setPaletteOpen] = useState(false)
  useEffect(() => {
    const key = e => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPaletteOpen(v => !v) } }
    window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key)
  }, [])
  if (route === '/portfolio-pdf') return <PrintPortfolio/>
  let page
  if (route === '/') page = <HomePage/>
  else if (route === '/projects') page = <ProjectsPage/>
  else if (route.startsWith('/projects/')) {
    const p = projects.find(item => item.slug === route.split('/')[2]); page = p ? <ProjectDetail project={p}/> : <NotFound/>
  } else if (route === '/work') page = <WorkPage/>
  else if (route === '/about') page = <AboutPage/>
  else if (route === '/resume') page = <ResumePage/>
  else if (route === '/contact') page = <ContactPage/>
  else page = <NotFound/>
  return <><a className="skip-link" href="#main-content">본문으로 건너뛰기</a><Header route={route} onSearch={() => setPaletteOpen(true)}/><CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)}/><CustomCursor/>{page}<Footer/></>
}

function NotFound() {
  return <main id="main-content" className="not-found"><Eyebrow>404</Eyebrow><h1>이 경로에는 로봇이 없습니다.</h1><CTA to="/">홈으로 돌아가기</CTA></main>
}

export default App
