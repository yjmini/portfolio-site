import { useEffect, useId, useRef, useState } from 'react'
import './robot-lab.css'

const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function RobotLab({ className = '' }) {
  const rootRef = useRef(null)
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)
  const [status, setStatus] = useState('loading')
  const [mode, setMode] = useState('solid')
  const [angle, setAngle] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion)
  const [playing, setPlaying] = useState(() => !prefersReducedMotion())
  const sliderId = useId()
  const hintId = useId()

  useEffect(() => {
    let cancelled = false
    let started = false
    let visible = false
    let scene = null
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fail = () => {
      if (cancelled) return
      setStatus('fallback')
      setPlaying(false)
      sceneRef.current = null
      // A context-lost event may arrive during rendering; release it outside the callback.
      queueMicrotask(() => { scene?.dispose(); scene = null })
    }
    async function load() {
      if (started || cancelled) return
      started = true
      try {
        const { createRobotLabScene } = await import('./robotLabScene.js')
        if (cancelled) return
        scene = createRobotLabScene(canvasRef.current, {
          onError: fail,
          onInteraction: () => {
            if (cancelled) return
            setPlaying(false)
            scene?.setPlaying(false)
          },
        })
        if (!scene) return
        sceneRef.current = scene
        scene.setReducedMotion(motion.matches)
        scene.setPlaying(!motion.matches)
        scene.setVisible(visible)
        setStatus('ready')
      } catch { fail() }
    }
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting
      if (visible) load()
      scene?.setVisible(visible)
    }, { threshold: 0.01 })
    observer.observe(rootRef.current)
    const motionChanged = (event) => {
      setReducedMotion(event.matches)
      // Preference changes never restart motion without a deliberate user action.
      setPlaying(false)
      scene?.setPlaying(false)
      scene?.setReducedMotion(event.matches)
    }
    motion.addEventListener('change', motionChanged)
    return () => {
      cancelled = true
      observer.disconnect()
      motion.removeEventListener('change', motionChanged)
      scene?.dispose()
      sceneRef.current = null
    }
  }, [])

  function changeMode(value) { setMode(value); sceneRef.current?.setMode(value) }
  function changeAngle(event) {
    const value = Number(event.target.value)
    setAngle(value)
    setPlaying(false)
    sceneRef.current?.setPlaying(false)
    sceneRef.current?.setAngle(value)
  }
  function toggleMotion() {
    const next = !playing
    setPlaying(next)
    sceneRef.current?.setPlaying(next)
  }
  function reset() {
    setAngle(0)
    setMode('solid')
    setPlaying(false)
    sceneRef.current?.setPlaying(false)
    sceneRef.current?.reset()
  }
  const ready = status === 'ready'

  return (
    <section className={`robot-lab ${className}`} ref={rootRef} aria-label="인터랙티브 로봇 암 시각화">
      <div className="robot-lab-heading">
        <span className="robot-lab-eyebrow"><i aria-hidden="true" /> INTERACTIVE STUDY</span>
        <span className="robot-lab-caption">시각화 데모</span>
      </div>
      <div className="robot-lab-stage">
        <div className="robot-lab-grid" aria-hidden="true" />
        <span className="robot-lab-spec robot-lab-spec-top" aria-hidden="true">ARTICULATED ARM<br />KINEMATIC EXPLORATION</span>
        <canvas ref={canvasRef} className={`robot-lab-canvas${ready ? ' robot-lab-canvas-ready' : ''}`} role="img" aria-label="금속 로봇 암 3D 모델. 아래 버튼과 관절 슬라이더로 조작할 수 있습니다." />
        {!ready && <div className="robot-lab-fallback">
          <StaticArm />
          <p role="status">{status === 'loading' ? '3D 스터디 준비 중' : '정적 미리보기 · 이 환경에서는 3D를 표시할 수 없습니다.'}</p>
        </div>}
        {ready && <>
          <span className="robot-lab-spec robot-lab-spec-bottom" aria-hidden="true">01 / FORM IN MOTION</span>
          <div className="robot-lab-orbit" role="group" aria-label="카메라 회전">
            <button type="button" aria-label="카메라 왼쪽 회전" onClick={() => sceneRef.current?.orbit(-0.2)}>←</button>
            <span aria-hidden="true">ORBIT</span>
            <button type="button" aria-label="카메라 오른쪽 회전" onClick={() => sceneRef.current?.orbit(0.2)}>→</button>
          </div>
        </>}
      </div>
      {ready && <div className="robot-lab-panel">
        <div className="robot-lab-toolbar">
          <div className="robot-lab-modes" role="group" aria-label="로봇 표시 방식">
            {['solid', 'wire', 'points'].map(value => <button type="button" key={value} aria-pressed={mode === value} onClick={() => changeMode(value)}>{value}</button>)}
          </div>
          <div className="robot-lab-actions">
            <button type="button" className="robot-lab-motion" disabled={reducedMotion} aria-label={reducedMotion ? '동작 줄이기 설정으로 자동 모션이 꺼져 있습니다' : playing ? '자동 모션 일시정지' : '자동 모션 재생'} aria-pressed={playing} onClick={toggleMotion}>
              <span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span><span>{playing ? 'Pause' : 'Play'}</span>
            </button>
            <button type="button" className="robot-lab-reset" onClick={reset} aria-label="로봇 자세와 카메라 초기화">↺ <span>Reset</span></button>
          </div>
        </div>
        <div className="robot-lab-joint">
          <label htmlFor={sliderId}>J01 <span>베이스 회전</span></label>
          <input id={sliderId} type="range" min="-90" max="90" step="1" value={angle} onChange={changeAngle} aria-describedby={hintId} aria-valuetext={`${angle}도`} />
          <output htmlFor={sliderId}>{angle > 0 ? '+' : ''}{angle}°</output>
        </div>
        <p className="robot-lab-hint" id={hintId}>{reducedMotion ? '동작 줄이기 적용 · 슬라이더와 버튼으로 직접 탐색하세요.' : '드래그로 둘러보기 · 슬라이더로 관절 조작'}</p>
      </div>}
    </section>
  )
}

function StaticArm() {
  return <svg className="robot-lab-static" viewBox="0 0 500 390" role="img" aria-label="관절 로봇 암의 정적 일러스트">
    <ellipse cx="253" cy="336" rx="145" ry="28" fill="none" stroke="#62674e" strokeWidth="1" />
    <ellipse cx="253" cy="336" rx="100" ry="19" fill="#343630" stroke="#6f7162" />
    <path d="M218 318 L218 277 Q220 267 235 267 L271 267 Q286 269 288 282 L288 318" fill="#68685e" stroke="#aaa995" strokeWidth="2" />
    <path d="M244 277 L184 137 L211 126 L274 263 Z" fill="#858579" stroke="#b5b5a4" strokeWidth="2" />
    <path d="M202 123 L340 164 L329 194 L192 154 Z" fill="#75776a" stroke="#b5b5a4" strokeWidth="2" />
    <path d="M335 177 L323 236 L349 241 L359 181 Z" fill="#54574d" stroke="#b5b5a4" strokeWidth="2" />
    <path d="M319 235 L310 268 L320 271 M348 241 L343 274 L333 274" fill="none" stroke="#aeb09f" strokeWidth="9" />
    {[[252, 274, 25], [198, 139, 24], [343, 178, 19]].map(([cx, cy, r]) => <g key={cx}><circle cx={cx} cy={cy} r={r} fill="#e8ff47" /><circle cx={cx} cy={cy} r={r * 0.65} fill="#292d24" /><circle cx={cx} cy={cy} r="5" fill="#a3a78e" /></g>)}
    <path d="M230 230 L199 164 M231 148 L316 173" stroke="#e8ff47" strokeWidth="3" />
  </svg>
}
