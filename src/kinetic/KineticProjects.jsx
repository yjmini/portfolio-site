import { useCallback, useEffect, useRef, useState } from 'react'
import { animate, motion as Motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { projects } from '../data'
import { selectedProjects, projectCategory, projectCategories } from '../projectExplorer'
import { resolvePublicAsset } from '../publicAsset'
import './kinetic-projects.css'

const work = selectedProjects(projects)
const pad = value => String(value).padStart(2, '0')
const asset = path => resolvePublicAsset(import.meta.env.BASE_URL, path)

function Arrow({ back = false }) {
  return <svg className="kp-arrow" viewBox="0 0 32 32" fill="none" aria-hidden="true" style={back ? { transform: 'rotate(180deg)' } : undefined}><path d="M5 16h21M17 6l10 10-10 10" stroke="currentColor" strokeWidth="1.7" /></svg>
}

function ProjectCard({ project, index, active, still, onFocus }) {
  const rx = useSpring(0, { stiffness: 170, damping: 24 })
  const ry = useSpring(0, { stiffness: 170, damping: 24 })
  const lightX = useMotionValue(50)
  const lightY = useMotionValue(50)
  const spotlight = useMotionTemplate`radial-gradient(circle at ${lightX}% ${lightY}%, rgba(217,255,67,.22), transparent 56%)`
  const reset = useCallback(() => { rx.set(0); ry.set(0) }, [rx, ry])
  useEffect(() => { if (still || !active) reset() }, [still, active, reset])
  const move = event => {
    if (still || event.pointerType !== 'mouse' || event.buttons) return
    const box = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - box.left) / box.width
    const py = (event.clientY - box.top) / box.height
    rx.set((.5 - py) * 5)
    ry.set((px - .5) * 6)
    lightX.set(px * 100)
    lightY.set(py * 100)
  }
  const image = project.printImage || project.printGallery?.[0]?.src || project.image
  const category = projectCategories.find(item => item.id === projectCategory(project))?.label
  return (
    <article className={`kp-card${active ? ' kp-card-active' : ''}`} aria-label={`${index + 1}. ${project.title}`}>
      <div className="kp-card-top"><span className="kp-number">/{pad(index + 1)}</span><span className="kp-category">{category}</span><span className="kp-period">{project.period}</span></div>
      <div className="kp-image-stage" onPointerMove={move} onPointerLeave={reset}>
        <Motion.div className="kp-image-plane" style={{ rotateX: still ? 0 : rx, rotateY: still ? 0 : ry }}>
          <img className="kp-image" src={asset(image)} alt={project.printGallery?.[0]?.alt || project.title} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" draggable="false" style={{ objectPosition: project.imagePosition || 'center' }} />
          <Motion.div className="kp-spotlight" style={{ background: spotlight }} aria-hidden="true" />
          <div className="kp-image-label" aria-hidden="true"><span>FIELD NOTES / {pad(index + 1)}</span><span>{project.slug === 'cadflow' ? 'CAD' : 'ROBOTICS'} ↗</span></div>
        </Motion.div>
      </div>
      <div className="kp-card-info">
        <div className="kp-card-heading"><h3 className="kp-card-title">{project.shortTitle || project.title}</h3><a className="kp-project-link" href={`#/projects/${project.slug}`} tabIndex={active ? 0 : -1} onFocus={onFocus} aria-label={`${project.title} 프로젝트 상세 보기`}><span className="kp-link-label">프로젝트 보기</span><Arrow /></a></div>
        <p className="kp-tagline">{project.tagline}</p>
        <div className="kp-detail"><span className="kp-detail-label">MY ROLE</span><p className="kp-role">{project.role}</p></div>
        <ul className="kp-stack" aria-label="사용 기술">{project.stack.slice(0, 4).map(tech => <li className="kp-tech" key={tech}>{tech}</li>)}</ul>
      </div>
    </article>
  )
}

export default function KineticProjects({ paused = false }) {
  const reduced = useReducedMotion()
  const still = paused || reduced
  const viewport = useRef(null)
  const track = useRef(null)
  const points = useRef([])
  const activeRef = useRef(0)
  const animation = useRef(null)
  const dragged = useRef(false)
  const pointerOrigin = useRef(null)
  const [active, setActive] = useState(0)
  const [limit, setLimit] = useState(0)
  const [dragging, setDragging] = useState(false)
  const x = useMotionValue(0)
  const progress = useMotionValue(1 / work.length)

  const go = useCallback((index, immediate = false) => {
    const next = Math.max(0, Math.min(work.length - 1, index))
    activeRef.current = next
    setActive(next)
    animation.current?.stop()
    const target = -(points.current[next] || 0)
    if (still || immediate) x.set(target)
    else animation.current = animate(x, target, { type: 'spring', stiffness: 210, damping: 31, mass: .85 })
    progress.set((next + 1) / work.length)
  }, [still, x, progress])

  useEffect(() => {
    const measure = () => {
      if (!viewport.current || !track.current) return
      const cards = [...track.current.querySelectorAll('.kp-card')]
      const maximum = Math.max(0, track.current.scrollWidth - viewport.current.clientWidth)
      points.current = cards.map(card => Math.min(maximum, card.offsetLeft - (cards[0]?.offsetLeft || 0)))
      setLimit(maximum)
      go(activeRef.current, true)
    }
    const observer = new ResizeObserver(measure)
    observer.observe(viewport.current)
    observer.observe(track.current)
    measure()
    return () => { observer.disconnect(); animation.current?.stop() }
  }, [go])

  const finishDrag = (_, info) => {
    setDragging(false)
    const projected = -x.get() - (still ? 0 : Math.max(-450, Math.min(450, info.velocity.x * .18)))
    const nearest = points.current.reduce((best, value, index) => Math.abs(value - projected) < Math.abs(points.current[best] - projected) ? index : best, 0)
    go(nearest)
  }
  const key = event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    go(event.key === 'Home' ? 0 : event.key === 'End' ? work.length - 1 : activeRef.current + (event.key === 'ArrowRight' ? 1 : -1))
  }

  return (
    <section className={`kp-section${still ? ' kp-still' : ''}`} id="kinetic-projects" aria-labelledby="kp-heading">
      <header className="kp-header"><div className="kp-eyebrow"><span>02 / SELECTED WORK</span><span>IDEAS INTO MOTION</span></div><h2 className="kp-heading" id="kp-heading">PROJECTS<span className="kp-heading-star" aria-hidden="true">✳</span></h2><div className="kp-intro"><p className="kp-intro-text">화면 밖에서 움직이는 코드.<br />학습, 제어, 그리고 실제 로봇.</p><span className="kp-drag-cue"><span aria-hidden="true">↔</span> DRAG TO EXPLORE</span></div></header>
      <div ref={viewport} className={`kp-viewport${dragging ? ' kp-dragging' : ''}`} tabIndex={0} role="region" aria-roledescription="캐러셀" aria-label="선택한 프로젝트 갤러리. 좌우 방향키 또는 드래그로 이동" onKeyDown={key} onPointerDownCapture={event => { dragged.current = false; pointerOrigin.current = { x: event.clientX, y: event.clientY }; animation.current?.stop() }} onPointerMoveCapture={event => { if (pointerOrigin.current && Math.abs(event.clientX - pointerOrigin.current.x) > 7) dragged.current = true }} onPointerUpCapture={() => { pointerOrigin.current = null }} onPointerCancel={() => { pointerOrigin.current = null; setDragging(false); go(activeRef.current) }} onClickCapture={event => { if (dragged.current && event.detail !== 0) { event.preventDefault(); event.stopPropagation() } }}>
        <Motion.div ref={track} className="kp-track" style={{ x }} drag="x" dragConstraints={{ left: -limit, right: 0 }} dragElastic={still ? 0 : .055} dragMomentum={false} onDragStart={() => { dragged.current = true; setDragging(true) }} onDragEnd={finishDrag}>
          {work.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} active={active === index} still={still || dragging} onFocus={() => go(index)} />)}
        </Motion.div>
      </div>
      <footer className="kp-footer"><div className="kp-position"><span className="kp-current">{pad(active + 1)}</span><span className="kp-total">/ {pad(work.length)}</span></div><div className="kp-progress" aria-hidden="true"><Motion.span className="kp-progress-fill" style={{ scaleX: progress }} /></div><div className="kp-controls"><button className="kp-button" type="button" aria-label="이전 프로젝트" disabled={active === 0} onClick={() => go(active - 1)}><Arrow back /></button><button className="kp-button" type="button" aria-label="다음 프로젝트" disabled={active === work.length - 1} onClick={() => go(active + 1)}><Arrow /></button></div><a className="kp-all-link" href="#/projects">모든 프로젝트 <span aria-hidden="true">↗</span></a></footer>
      <p className="kp-sr-only" role="status" aria-live="polite" aria-atomic="true">{active + 1} / {work.length}: {work[active]?.title}</p>
    </section>
  )
}
