import { useEffect, useRef, useState } from 'react'
import { animate as animeAnimate, stagger } from 'animejs'
import { motion, MotionConfig, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowDown, ArrowUpRight, Copy, Check, RotateCcw, Pause, Play, MoveUpRight } from 'lucide-react'
import { profile } from '../data'
import ParticleStage from './ParticleStage'
import KineticProjects from './KineticProjects'
import './immersive-home.css'

function jumpTo(id, instant = false) {
  const el = document.getElementById(id)
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 76, behavior: instant ? 'instant' : 'smooth' })
}

function Magnetic({ children, href, className = '', disabledMotion, ...props }) {
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 16 }), sy = useSpring(y, { stiffness: 220, damping: 16 })
  const Tag = href ? motion.a : motion.button
  return <Tag href={href} className={`km-magnetic ${className}`} style={{x:sx,y:sy}}
    onPointerMove={e => { if (disabledMotion || e.pointerType !== 'mouse') return; const r=e.currentTarget.getBoundingClientRect(); x.set((e.clientX-r.left-r.width/2)*.22); y.set((e.clientY-r.top-r.height/2)*.22) }}
    onPointerLeave={()=>{x.set(0);y.set(0)}} {...props}>{children}</Tag>
}

function SplitTitle({children}) {
  return <span className="kh-line" aria-hidden="true">{[...children].map((c,i)=><span key={i} className="kh-letter" aria-hidden="true">{c}</span>)}</span>
}

function Hero({paused}) {
  const root=useRef(null), viewport=useRef(null), title=useRef(null)
  const [mode,setMode]=useState('orbit')
  const [stageState,setStageState]=useState('loading')
  const {scrollYProgress:rawScroll}=useScroll({target:root,offset:['start start','end end']})
  // A spring-owned value keeps pinned-section transforms on the measured JS timeline.
  // Native ViewTimeline acceleration can resolve the wrong range inside clipped ancestors.
  const scrollYProgress=useSpring(rawScroll,{stiffness:260,damping:40})
  const y=useTransform(scrollYProgress,[0,.65],[0,-180])
  const rotate=useTransform(scrollYProgress,[0,.65],[0,-7])
  const scale=useTransform(scrollYProgress,[0,.65],[1,.78])
  const opacity=useTransform(scrollYProgress,[0,.34,.56],[1,.85,0])
  const outroOpacity=useTransform(scrollYProgress,[.38,.65],[0,1])
  const outroY=useTransform(scrollYProgress,[.38,1],[90,-25])
  useEffect(()=>{
    if(paused) return
    const intro=animeAnimate(title.current.querySelectorAll('.kh-letter'),{translateY:['105%','0%'],rotate:[7,0],opacity:[0,1],delay:stagger(25),duration:1100,ease:'outExpo'})
    return ()=>intro.revert()
  },[paused])
  const move=e=>{
    if(paused) return
    const rect=viewport.current.getBoundingClientRect()
    viewport.current.style.setProperty('--lens-x',`${e.clientX-rect.left}px`)
    viewport.current.style.setProperty('--lens-y',`${e.clientY-rect.top}px`)
    viewport.current.style.setProperty('--lens-r',e.pointerType==='touch'?'105px':'185px')
  }
  return <section className="kh-scroll" ref={root} aria-labelledby="kinetic-title">
    <div className="kh-viewport" ref={viewport} onPointerMove={move} onPointerDown={move} onPointerLeave={()=>viewport.current?.style.setProperty('--lens-r','0px')}>
      <div className="kh-grid" aria-hidden="true"/>
      <ParticleStage progress={scrollYProgress} mode={mode} paused={paused} onStateChange={setStageState}/>
      <div className="kh-coordinates"><span>윤정민 <i/> ROBOT SOFTWARE ENGINEER</span><span>AN INTERACTIVE PORTFOLIO ↗</span></div>
      <motion.div ref={title} className="kh-title-wrap" style={paused?{y:0,rotate:0,scale:1,opacity:1}:{y,rotate,scale,opacity}}>
        <h1 id="kinetic-title" aria-label="MAKE MACHINES MOVE."><SplitTitle>MAKE</SplitTitle><SplitTitle>MACHINES</SplitTitle><SplitTitle>MOVE.</SplitTitle></h1>
      </motion.div>
      <motion.div className="kh-reveal" aria-hidden="true" style={paused?{}:{opacity}}><div className="kh-reveal-grid"/><div className="kh-secret"><span>THINK.</span><span>LEARN.</span><span>ACT.</span></div><span className="kh-reveal-caption">UNDER THE SURFACE / POLICY → ACTION</span></motion.div>
      <motion.div className="kh-outro" style={paused?{opacity:0}:{opacity:outroOpacity,y:outroY}} aria-hidden="true"><span>FROM SIMULATION</span><strong>INTO<br/><em>REALITY.</em></strong><p>학습한 정책을, 실제 움직임으로.</p></motion.div>
      <div className="kh-side-note" aria-hidden="true">REINFORCEMENT LEARNING<br/>ROS2 · SIMULATION · CONTROL</div>
      <div className="kh-bottom">
        <div className="kh-intro"><p>로봇이 배우고,<br/>움직이는 방법을 만듭니다.</p><Magnetic className="kh-work-link" onClick={()=>jumpTo('kinetic-projects',paused)} disabledMotion={paused} aria-label="프로젝트 바로 보기">EXPLORE WORK <ArrowDown size={18}/></Magnetic></div>
        <div className="kh-interaction"><span className="kh-hint">{stageState==='fallback'?'STATIC PREVIEW · 3D UNAVAILABLE':paused?'CHOOSE A SHAPE · MOTION IS OFF':'MOVE TO REVEAL · CLICK TO PULSE'}</span><div className="kh-mode-control" role="group" aria-label="입자 조형 모드">{['orbit','wave','grid'].map((m,i)=><button key={m} aria-label={m[0].toUpperCase()+m.slice(1)} aria-pressed={mode===m} disabled={stageState!=='ready'} onClick={()=>setMode(m)}><small aria-hidden="true">0{i+1}</small>{m[0].toUpperCase()+m.slice(1)}</button>)}</div></div>
        <div className="kh-scroll-mark"><span>SCROLL TO TRANSFORM</span><div><motion.i style={{scaleX:scrollYProgress}}/></div></div>
      </div>
    </div>
  </section>
}

function ScrollManifesto({paused}) {
  const ref=useRef(null)
  const {scrollYProgress:rawScroll}=useScroll({target:ref,offset:['start .9','end .35']})
  const scrollYProgress=useSpring(rawScroll,{stiffness:240,damping:36})
  const x=useTransform(scrollYProgress,[0,1],['10%','-12%'])
  const words=['SIMULATE.','LEARN.','DEPLOY.']
  return <section className="km-manifesto" ref={ref} aria-label="개발 방향">
    <div className="km-running-line" aria-hidden="true"><motion.div style={paused?{x:0}:{x}}>CODE ↗ LEARN ↗ MOVE ↗ CODE ↗ LEARN ↗ MOVE ↗</motion.div></div>
    <div className="km-manifesto-content"><p className="km-eyebrow">01 / BETWEEN INTELLIGENCE & HARDWARE</p><h2>{words.map((w,i)=><ManifestoWord key={w} progress={scrollYProgress} index={i} paused={paused}>{w}</ManifestoWord>)}</h2><div className="km-manifesto-note"><span className="km-cross">✳</span><p>시뮬레이션에서 시작해<br/>현실의 로봇까지.</p><Magnetic href="#/about" className="km-round-link" disabledMotion={paused} aria-label="윤정민 소개 보기"><ArrowUpRight/></Magnetic></div></div>
  </section>
}
function ManifestoWord({children,progress,index,paused}) {
  const opacity=useTransform(progress,[index*.16,.35+index*.16],[.6,1])
  const x=useTransform(progress,[index*.16,.35+index*.16],[60,0])
  return <motion.span style={paused?{opacity:1,x:0}:{opacity,x}}>{children}</motion.span>
}

const skills=[
 {name:'ROS2',x:10,y:16,angle:-9,tone:'lime',tag:'SYSTEMS'},
 {name:'Isaac Lab',x:45,y:12,angle:8,tone:'paper',tag:'SIMULATION'},
 {name:'PPO',x:71,y:32,angle:-13,tone:'orange',tag:'LEARNING'},
 {name:'Python',x:17,y:51,angle:6,tone:'paper',tag:'CODE'},
 {name:'C++',x:50,y:48,angle:-8,tone:'lime',tag:'CONTROL'},
 {name:'PyTorch',x:61,y:73,angle:9,tone:'paper',tag:'LEARNING'},
 {name:'SIM → REAL',x:7,y:78,angle:-6,tone:'orange',tag:'ROBOTICS'},
]
function SkillChip({skill,bounds,paused}) {
  const x=useMotionValue(0),y=useMotionValue(0)
  const [moved,setMoved]=useState(false)
  const onKey=e=>{
    const delta={ArrowLeft:[-20,0],ArrowRight:[20,0],ArrowUp:[0,-20],ArrowDown:[0,20]}[e.key]
    if(!delta) return
    e.preventDefault()
    const r=bounds.current.getBoundingClientRect(), b=e.currentTarget.getBoundingClientRect()
    x.set(x.get()+Math.max(r.left-b.left,Math.min(delta[0],r.right-b.right)))
    y.set(y.get()+Math.max(r.top-b.top,Math.min(delta[1],r.bottom-b.bottom)))
    setMoved(true)
  }
  return <motion.button className={`kl-chip kl-${skill.tone}`} style={{left:`${skill.x}%`,top:`${skill.y}%`,rotate:skill.angle,x,y}} drag dragConstraints={bounds} dragElastic={.08} dragMomentum={!paused}
    whileDrag={{scale:1.09,rotate:0,zIndex:8,cursor:'grabbing'}} whileHover={paused?{}:{scale:1.06,rotate:0}} onDragStart={()=>setMoved(true)} onKeyDown={onKey} aria-label={`${skill.name} 옮기기`} aria-describedby="kl-help" data-moved={moved}><small>{skill.tag}</small><span>{skill.name}</span><MoveUpRight size={16}/></motion.button>
}
function Playground({paused}) {
  const bounds=useRef(null),[reset,setReset]=useState(0)
  return <section className="kinetic-lab" id="kinetic-lab" aria-labelledby="kl-title">
    <div className="kl-heading"><div><p className="km-eyebrow">03 / A LITTLE HANDS-ON</p><h2 id="kl-title">LESS LOOKING.<br/><em>MORE PLAYING.</em></h2></div><p id="kl-help">키워드를 잡아 움직여 보세요.<br/>키보드로는 선택 후 방향키.</p></div>
    <div className="kl-bounds" ref={bounds}><div className="kl-backdrop" aria-hidden="true"><span>PLAY</span><span>GROUND</span></div><div className="kl-axis" aria-hidden="true"><i/><i/></div>{skills.map(s=><SkillChip key={`${s.name}-${reset}`} skill={s} bounds={bounds} paused={paused}/>)}<span className="kl-corner kl-tl"/><span className="kl-corner kl-tr"/><span className="kl-corner kl-bl"/><span className="kl-corner kl-br"/></div>
    <div className="kl-footer"><span>TOOLS I BUILD WITH — NOT A STATIC LIST.</span><button onClick={()=>setReset(v=>v+1)} aria-label="플레이그라운드 초기화"><RotateCcw size={16}/>RESET PLAYGROUND</button></div>
  </section>
}

function Contact({paused}) {
  const [copied,setCopied]=useState(false),[copyError,setCopyError]=useState(false)
  const timer=useRef(null),root=useRef(null)
  useEffect(()=>()=>clearTimeout(timer.current),[])
  const copy=async()=>{try{await navigator.clipboard.writeText(profile.email);setCopied(true);setCopyError(false);clearTimeout(timer.current);timer.current=setTimeout(()=>setCopied(false),2500)}catch{setCopyError(true)}}
  const move=e=>{if(paused)return;const r=root.current.getBoundingClientRect();root.current.style.setProperty('--eye-x',`${(e.clientX-r.left-r.width/2)/r.width*16}px`);root.current.style.setProperty('--eye-y',`${(e.clientY-r.top-r.height/2)/r.height*16}px`)}
  return <section className="kinetic-contact" ref={root} onPointerMove={move} onPointerLeave={()=>{root.current?.style.setProperty('--eye-x','0px');root.current?.style.setProperty('--eye-y','0px')}} aria-labelledby="kc-title">
    <div className="kc-top"><span className="km-eyebrow">04 / NEXT MOVE</span><div className="kc-eyes" aria-hidden="true"><span><i/></span><span><i/></span></div><a href="#/portfolio-pdf">PDF PORTFOLIO <ArrowUpRight size={18}/></a></div>
    <Magnetic href={`mailto:${profile.email}`} className="kc-invitation" disabledMotion={paused}><h2 id="kc-title">LET’S<br/><em>BUILD.</em></h2><ArrowUpRight/></Magnetic>
    <div className="kc-bottom"><div><a href={`mailto:${profile.email}`}>{profile.email}</a><button onClick={copy} aria-label="이메일 주소 복사">{copied?<Check size={20}/>:<Copy size={20}/>}</button><span role="status">{copied?'복사했습니다.':copyError?'이메일 주소를 직접 선택해 주세요.':''}</span></div><a href={profile.github} target="_blank" rel="noreferrer">GITHUB <ArrowUpRight size={18}/></a><button onClick={()=>window.scrollTo({top:0,behavior:paused?'instant':'smooth'})}>BACK TO TOP ↑</button></div>
  </section>
}

export default function ImmersiveHome() {
  const reduced=useReducedMotion(),[motionOff,setMotionOff]=useState(false)
  const paused=Boolean(reduced||motionOff)
  return <MotionConfig reducedMotion="user"><main id="main-content" tabIndex="-1" className="kinetic-home" data-paused={paused}>
    <Hero paused={paused}/><ScrollManifesto paused={paused}/><KineticProjects paused={paused}/><Playground paused={paused}/><Contact paused={paused}/>
    <button className="km-motion-toggle" onClick={()=>setMotionOff(v=>!v)} aria-pressed={paused} disabled={Boolean(reduced)} aria-label={paused?'모션 켜기':'모션 끄기'}>{paused?<Play size={13}/>:<Pause size={13}/>}<span>{reduced?'REDUCED MOTION':paused?'MOTION OFF':'MOTION ON'}</span></button>
  </main></MotionConfig>
}
