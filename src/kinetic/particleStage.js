import * as THREE from 'three';

const TAU = Math.PI * 2;
const vertexShader = `
attribute vec3 aWave;
attribute vec3 aGrid;
attribute float aSeed;
uniform vec3 uMorph;
uniform float uTime;
uniform float uProgress;
uniform float uDpr;
uniform vec2 uPointer;
uniform float uHover;
uniform vec2 uShockCenter;
uniform float uShock;
varying vec3 vColor;
varying float vAlpha;
void main(){
  vec3 p=position*uMorph.x+aWave*uMorph.y+aGrid*uMorph.z;
  float breath=sin(uTime*.48+position.x*1.2+position.y*.6)*.035;
  p+=normalize(p+vec3(.001))*(breath+uProgress*(.5+1.8*aSeed));
  p.z+=sin(p.x*2.+uTime*.55)*.035;
  vec4 mv=modelViewMatrix*vec4(p,1.);
  vec4 projected=projectionMatrix*mv;
  vec2 screen=projected.xy/projected.w;
  vec2 delta=screen-uPointer;
  float distanceToPointer=length(delta);
  float repel=exp(-distanceToPointer*distanceToPointer*15.)*uHover;
  mv.xy+=normalize(delta+vec2(.0001))*repel*.68;
  mv.z+=repel*.55;
  float shockDistance=length(screen-uShockCenter);
  float shock=exp(-pow((shockDistance-uShock*1.9)*9.,2.))*max(0.,1.-uShock);
  mv.xy+=normalize(screen-uShockCenter+vec2(.001))*shock*.52;
  gl_Position=projectionMatrix*mv;
  gl_PointSize=clamp((1.8+2.4*pow(aSeed,9.))*uDpr*(6.5/-mv.z),.7,6.);
  float light=.55+.45*sin(position.y*1.5+position.z*.7+aSeed*2.);
  vec3 ivory=vec3(.89,.92,.85);
  vec3 lime=vec3(.72,1.,.11);
  float limeBand=smoothstep(.38,.65,sin(aSeed*15.+position.x*.85));
  vColor=mix(ivory,lime,limeBand*.9)*(light*1.65+repel*.65+shock*.8);
  vAlpha=clamp(.35+light*.55+repel*.35,0.,1.);
}`;
const fragmentShader = `
varying vec3 vColor;
varying float vAlpha;
void main(){
 float r=length(gl_PointCoord-.5)*2.;
 if(r>1.) discard;
 float core=exp(-r*r*2.2);
 gl_FragColor=vec4(vColor,core*vAlpha);
}`;
const lineFragment = `varying vec3 vColor; varying float vAlpha; void main(){gl_FragColor=vec4(vColor,vAlpha*.48);}`;

/** Pure, deterministic toroidal fiber geometry, also used by the static checks. */
export function buildParticleGeometry(strands = 72, samples = 384) {
  const count = strands * samples;
  const orbit = new Float32Array(count * 3);
  const wave = new Float32Array(count * 3);
  const grid = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const lines = [];
  for (let s = 0; s < strands; s++) {
    const v = s / strands * TAU;
    for (let j = 0; j < samples; j++) {
      const i = s * samples + j;
      const u = j / samples * TAU;
      const winding = v + u * 3;
      const tube = .58 + .13 * Math.sin(u * 3 + v * 2);
      const radius = 1.92 + tube * Math.cos(winding);
      orbit.set([radius * Math.cos(u), radius * Math.sin(u), tube * Math.sin(winding) + .32 * Math.sin(u * 2)], i * 3);
      const x = (j / (samples - 1) - .5) * 6.8;
      const z = (s / (strands - 1) - .5) * 3.7;
      wave.set([x, Math.sin(x * 1.4 + z * 1.15) * .68 + Math.cos(z * 1.8) * .24, z], i * 3);
      const gx = (j % 32) / 31;
      const gy = Math.floor(j / 32) / Math.max(1, Math.ceil(samples / 32) - 1);
      grid.set([(gx - .5) * 4.4, (gy - .5) * 4.4, (s / (strands - 1) - .5) * 2.6], i * 3);
      seeds[i] = ((i * 16807 + 97) % 65521) / 65521;
      if (s % 4 === 0 && j < samples - 1) lines.push(i, i + 1);
    }
  }
  return { orbit, wave, grid, seeds, lines, count };
}

export function createParticleStage(host, initial = {}, onFailure = () => {}) {
  let renderer, observer, intersection, raf = 0, disposed = false, failed = false;
  let visible = true, width = 1, height = 1, frames = 0, last = 0, elapsed = 0;
  let options = initial, unsubscribe, progressSource, scroll = 0, targetHover = 0;
  let shockActive = false;
  const resources = [];
  const cleanups = [];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 700px)').matches;
  const parent = host.parentElement || host;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, .1, 40);
  camera.position.z = 7.8;
  const group = new THREE.Group();
  scene.add(group);
  const uniforms = {
    uTime: { value: 0 }, uProgress: { value: 0 }, uDpr: { value: 1 },
    uMorph: { value: new THREE.Vector3(1, 0, 0) },
    uPointer: { value: new THREE.Vector2(9, 9) }, uHover: { value: 0 },
    uShockCenter: { value: new THREE.Vector2(0, 0) }, uShock: { value: 2 },
  };
  const targetMorph = new THREE.Vector3(1, 0, 0);
  const pointer = new THREE.Vector2(9, 9);
  const listen = (node, event, callback, config) => {
    node.addEventListener(event, callback, config);
    cleanups.push(() => node.removeEventListener(event, callback, config));
  };
  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(raf);
    unsubscribe?.(); observer?.disconnect(); intersection?.disconnect();
    cleanups.forEach(fn => fn());
    resources.forEach(item => item.dispose());
    if (renderer) { renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove(); }
  }
  function fail() {
    if (failed || disposed) return;
    failed = true;
    dispose();
    onFailure();
  }
  function active() { return !disposed && visible && !document.hidden; }
  function invalidate(budget = 65) {
    if (!active()) return;
    frames = reduced.matches || options.paused ? 1 : Math.max(frames, budget);
    if (!raf) raf = requestAnimationFrame(draw);
  }
  function draw(now) {
    raf = 0;
    if (!active()) { last = 0; return; }
    const dt = last ? Math.min((now - last) / 1000, .04) : 1 / 60;
    last = now;
    const animated = !options.paused && !reduced.matches;
    if (animated) elapsed += dt;
    const ease = reduced.matches || options.paused ? 1 : 1 - Math.exp(-dt * 7);
    uniforms.uMorph.value.lerp(targetMorph, ease);
    uniforms.uTime.value = elapsed;
    uniforms.uProgress.value += (scroll - uniforms.uProgress.value) * ease;
    uniforms.uPointer.value.lerp(pointer, ease);
    uniforms.uHover.value += (targetHover - uniforms.uHover.value) * ease;
    if (shockActive) {
      uniforms.uShock.value += dt * .8;
      if (uniforms.uShock.value >= 1.2) shockActive = false;
    }
    const p = uniforms.uProgress.value;
    group.rotation.set(.42 + Math.sin(elapsed * .13) * .12 + p * .5, -.35 + elapsed * .065 + p * 1.2, -.38 + Math.sin(elapsed * .1) * .07);
    group.scale.setScalar(1 + p * .13);
    group.position.x = width / height > 1.1 ? .8 : .15;
    group.position.y = -.08 - p * .3;
    try { renderer.render(scene, camera); } catch { fail(); return; }
    frames--;
    if (active() && (animated || frames > 0)) raf = requestAnimationFrame(draw);
    else last = 0;
  }
  function update(next) {
    options = next;
    targetMorph.set(next.mode === 'wave' ? 0 : next.mode === 'grid' ? 0 : 1, next.mode === 'wave' ? 1 : 0, next.mode === 'grid' ? 1 : 0);
    const source = next.progress;
    const setScroll = value => { scroll = Math.max(0, Math.min(1, Number(value) || 0)); invalidate(); };
    if (source !== progressSource) {
      unsubscribe?.(); unsubscribe = undefined; progressSource = source;
      if (source?.on) unsubscribe = source.on('change', setScroll);
    }
    setScroll(source?.get ? source.get() : source);
    invalidate();
  }
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'high-performance' });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.setAttribute('data-particle-canvas', '');
    host.appendChild(renderer.domElement);
    const data = buildParticleGeometry(mobile ? 48 : 72, mobile ? 288 : 384);
    const geometry = new THREE.BufferGeometry();
    resources.push(geometry);
    geometry.setAttribute('position', new THREE.BufferAttribute(data.orbit, 3));
    geometry.setAttribute('aWave', new THREE.BufferAttribute(data.wave, 3));
    geometry.setAttribute('aGrid', new THREE.BufferAttribute(data.grid, 3));
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(data.seeds, 1));
    const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    resources.push(material);
    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    group.add(points);
    const lineGeometry = new THREE.BufferGeometry();
    resources.push(lineGeometry);
    for (const [key, value] of Object.entries(geometry.attributes)) lineGeometry.setAttribute(key, value);
    lineGeometry.setIndex(data.lines);
    const lineMaterial = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader: lineFragment, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    resources.push(lineMaterial);
    const fibers = new THREE.LineSegments(lineGeometry, lineMaterial);
    fibers.frustumCulled = false;
    group.add(fibers);
    function resize() {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, rect.width); height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, width < 700 ? 1 : 1.5);
      renderer.setPixelRatio(dpr); renderer.setSize(width, height, false);
      uniforms.uDpr.value = dpr;
      camera.aspect = width / height;
      camera.position.z = camera.aspect < 1 ? 9.3 : 7.8;
      camera.updateProjectionMatrix(); invalidate();
    }
    observer = new ResizeObserver(resize); observer.observe(host);
    if ('IntersectionObserver' in window) {
      intersection = new IntersectionObserver(entries => {
        visible = entries[0]?.isIntersecting ?? true;
        if (!visible) { cancelAnimationFrame(raf); raf = 0; last = 0; }
        else invalidate();
      });
      intersection.observe(host);
    }
    const pointerAt = event => {
      const bounds = host.getBoundingClientRect();
      pointer.set((event.clientX - bounds.left) / Math.max(1, bounds.width) * 2 - 1, 1 - (event.clientY - bounds.top) / Math.max(1, bounds.height) * 2);
    };
    listen(parent, 'pointermove', event => { if (options.paused || reduced.matches) return; pointerAt(event); targetHover = 1; invalidate(); }, { passive: true });
    listen(parent, 'pointerleave', () => { targetHover = 0; invalidate(); }, { passive: true });
    listen(parent, 'pointerdown', event => {
      if (options.paused || reduced.matches) return;
      if (event.target.closest?.('a,button,input,textarea,select,[role="button"]')) return;
      pointerAt(event); uniforms.uShockCenter.value.copy(pointer);
      uniforms.uShock.value = reduced.matches ? 2 : 0; shockActive = !reduced.matches;
      invalidate(100);
    }, { passive: true });
    listen(document, 'visibilitychange', () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; last = 0; }
      else invalidate();
    });
    listen(reduced, 'change', () => invalidate());
    listen(renderer.domElement, 'webglcontextlost', event => { event.preventDefault(); fail(); });
    resize(); update(initial);
  } catch (error) { dispose(); throw error; }
  return { update, dispose };
}
