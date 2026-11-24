import { useEffect, useRef, useState } from 'react';
import './particle-stage.css';

/** Transparent full-viewport sculpture. progress accepts a number or MotionValue. */
export default function ParticleStage({ progress = 0, mode = 'orbit', paused = false, onStateChange }) {
  const host = useRef(null);
  const engine = useRef(null);
  const latest = useRef({ progress, mode, paused });
  const [state, setState] = useState('loading');
  useEffect(() => { onStateChange?.(state); }, [state, onStateChange]);
  useEffect(() => { latest.current = { progress, mode, paused }; engine.current?.update(latest.current); }, [progress, mode, paused]);
  useEffect(() => {
    let disposed = false;
    let instance;
    const fail = () => { if (!disposed) setState('fallback'); };
    import('./particleStage.js').then(({ createParticleStage }) => {
      if (disposed || !host.current) return;
      try {
        instance = createParticleStage(host.current, latest.current, fail);
        engine.current = instance;
        setState('ready');
      } catch { fail(); }
    }).catch(fail);
    return () => { disposed = true; instance?.dispose(); engine.current = null; };
  }, []);
  return <div ref={host} className="particle-stage" data-state={state} aria-hidden="true">
    {state !== 'ready' && <svg className="particle-stage__fallback" viewBox="0 0 1200 900" fill="none" preserveAspectRatio="xMidYMid slice">
      <g transform="translate(710 445) rotate(-28)">
        {Array.from({ length: 42 }, (_, i) => <ellipse key={i} rx={250 + i * 2.1} ry={100 + i * 3.8} transform={`rotate(${i * 3.8})`} stroke={i % 4 ? '#eeeedd' : '#d9ff43'} strokeWidth={i % 4 ? '.65' : '1.3'} opacity={0.28 + (i % 5) * 0.12} />)}
      </g>
    </svg>}
  </div>;
}
