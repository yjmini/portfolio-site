import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

/* The spherical-cap particle sampling below is adapted from ThreeUI Structure Flow.
 * Copyright (c) 2026 Meng To. MIT License.
 * https://github.com/MengTo/threeui/blob/main/src/shaders/structure-flow/structureFlowRenderer.ts
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const ACCENT = 0xe8ff47
const HOME_YAW = 0.48
const HOME_PITCH = 1.15
const clamp = THREE.MathUtils.clamp

/** Roll back even partially constructed GPU resources before reporting a fallback. */
export function createRobotLabScene(canvas, options = {}) {
  const rollback = []
  try {
    return initializeRobotLabScene(canvas, options, rollback)
  } catch (error) {
    for (const release of rollback.reverse()) {
      try { release() } catch { /* Context loss can make individual disposals fail. */ }
    }
    // A WebGLRenderer constructor can throw after acquiring a context but before returning.
    try { canvas.getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext() } catch { /* No context available. */ }
    options.onError?.(error)
    return null
  }
}

/** Imperative, disposable renderer. The React component owns loading and UI state. */
function initializeRobotLabScene(canvas, { onError = () => {}, onInteraction = () => {} }, rollback) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
  rollback.push(() => { renderer.dispose(); renderer.forceContextLoss() })
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 40)
  renderer.setClearColor(0x151513, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  const resources = new Set()
  rollback.push(() => resources.forEach(resource => resource.dispose()))
  const own = (resource) => { resources.add(resource); return resource }
  const pmrem = new THREE.PMREMGenerator(renderer)
  rollback.push(() => pmrem.dispose())
  const room = new RoomEnvironment()
  rollback.push(() => room.dispose())
  const environment = pmrem.fromScene(room, 0.04)
  scene.environment = environment.texture
  room.dispose()
  pmrem.dispose()
  own(environment)

  const metal = own(new THREE.MeshStandardMaterial({ color: 0x5a5852, metalness: 0.87, roughness: 0.3 }))
  const shell = own(new THREE.MeshStandardMaterial({ color: 0x77766d, metalness: 0.82, roughness: 0.27 }))
  const graphite = own(new THREE.MeshStandardMaterial({ color: 0x242521, metalness: 0.72, roughness: 0.39 }))
  const black = own(new THREE.MeshStandardMaterial({ color: 0x10120f, metalness: 0.28, roughness: 0.65 }))
  const yellow = own(new THREE.MeshBasicMaterial({ color: ACCENT, toneMapped: false }))
  const wireMaterial = own(new THREE.MeshBasicMaterial({ color: 0xa7afa0, wireframe: true, transparent: true, opacity: 0.24 }))
  const pointMaterial = own(new THREE.PointsMaterial({ color: ACCENT, size: 0.018, sizeAttenuation: true, transparent: true, opacity: 0.8 }))
  const variants = []
  let seed = 173
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }

  function part(parent, geometry, material, position = [0, 0, 0], rotation = [0, 0, 0], switchable = true) {
    own(geometry)
    const group = new THREE.Group()
    group.position.set(...position)
    group.rotation.set(...rotation)
    parent.add(group)
    const solid = new THREE.Mesh(geometry, material)
    solid.castShadow = true
    solid.receiveShadow = true
    group.add(solid)
    if (switchable) {
      const wire = new THREE.Mesh(geometry, wireMaterial)
      const pointGeometry = own(sampleSurface(geometry, random))
      const points = new THREE.Points(pointGeometry, pointMaterial)
      wire.visible = points.visible = false
      group.add(wire, points)
      variants.push({ solid, wire, points })
    }
    return group
  }
  const cylinder = (top, bottom, height, segments = 48) => new THREE.CylinderGeometry(top, bottom, height, segments, 1)
  const box = (x, y, z, radius = 0.06) => new RoundedBoxGeometry(x, y, z, 3, radius)
  const torus = (radius, tube = 0.015) => new THREE.TorusGeometry(radius, tube, 8, 80)
  const robot = new THREE.Group()
  scene.add(robot)
  part(robot, cylinder(1.04, 1.15, 0.16), graphite, [0, 0.08, 0])
  part(robot, cylinder(0.99, 1.04, 0.08), metal, [0, 0.2, 0])
  part(robot, torus(1.02, 0.011), yellow, [0, 0.22, 0], [Math.PI / 2, 0, 0])
  part(robot, cylinder(0.64, 0.78, 0.18), black, [0, 0.32, 0])
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6
    part(robot, cylinder(0.027, 0.027, 0.018, 6), shell, [Math.cos(a) * 0.9, 0.247, Math.sin(a) * 0.9])
  }
  const base = new THREE.Group()
  base.position.y = 0.42
  robot.add(base)
  part(base, cylinder(0.46, 0.59, 0.33), shell, [0, 0.12, 0])
  part(base, cylinder(0.47, 0.47, 0.055), yellow, [0, 0.3, 0])
  part(base, box(0.56, 0.52, 0.48), graphite, [0, 0.46, 0])
  const shoulder = new THREE.Group()
  shoulder.position.y = 0.55
  base.add(shoulder)

  function joint(parent, radius) {
    part(parent, cylinder(radius, radius, 0.59), metal, [0, 0, 0], [Math.PI / 2, 0, 0])
    for (const side of [-1, 1]) {
      part(parent, cylinder(radius * 0.84, radius * 0.84, 0.055), yellow, [0, 0, side * 0.32], [Math.PI / 2, 0, 0])
      part(parent, cylinder(radius * 0.56, radius * 0.56, 0.065), graphite, [0, 0, side * 0.36], [Math.PI / 2, 0, 0])
      part(parent, cylinder(radius * 0.2, radius * 0.2, 0.075, 6), shell, [0, 0, side * 0.38], [Math.PI / 2, 0, 0])
    }
  }
  function link(parent, length, width) {
    part(parent, box(width, length - 0.12, 0.38, 0.085), shell, [0, length / 2, 0])
    for (const side of [-1, 1]) {
      part(parent, box(width * 0.64, length * 0.65, 0.03, 0.01), graphite, [0, length / 2, side * 0.203])
      part(parent, box(0.024, length * 0.45, 0.014, 0.004), yellow, [-width * 0.19, length / 2, side * 0.224])
      for (const y of [0.25, length - 0.25]) {
        part(parent, cylinder(0.028, 0.028, 0.03, 6), metal, [width * 0.19, y, side * 0.227], [Math.PI / 2, 0, 0])
      }
    }
    const cableCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(width / 2, 0.1, -0.04), new THREE.Vector3(width / 2 + 0.14, length * 0.3, -0.04),
      new THREE.Vector3(width / 2 + 0.11, length * 0.76, -0.04), new THREE.Vector3(width / 2, length - 0.1, -0.04),
    ])
    part(parent, new THREE.TubeGeometry(cableCurve, 24, 0.035, 8, false), black)
  }
  joint(shoulder, 0.34)
  link(shoulder, 1.63, 0.43)
  const elbow = new THREE.Group()
  elbow.position.y = 1.63
  shoulder.add(elbow)
  joint(elbow, 0.28)
  link(elbow, 1.46, 0.35)
  const wrist = new THREE.Group()
  wrist.position.y = 1.46
  elbow.add(wrist)
  joint(wrist, 0.2)
  part(wrist, cylinder(0.16, 0.2, 0.32), graphite, [0, 0.21, 0])
  part(wrist, cylinder(0.18, 0.18, 0.075), yellow, [0, 0.38, 0])
  part(wrist, box(0.44, 0.17, 0.28, 0.025), metal, [0, 0.48, 0])
  for (const sign of [-1, 1]) {
    part(wrist, box(0.065, 0.36, 0.12, 0.013), shell, [sign * 0.19, 0.68, 0], [0, 0, sign * 0.12])
    part(wrist, box(0.095, 0.13, 0.14, 0.009), black, [sign * 0.14, 0.86, 0])
  }

  const floor = part(scene, new THREE.CircleGeometry(5.7, 96), own(new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.4 })), [0, -0.025, 0], [-Math.PI / 2, 0, 0], false)
  floor.children[0].castShadow = false
  const lineMaterial = own(new THREE.LineBasicMaterial({ color: 0x73775c, transparent: true, opacity: 0.18 }))
  for (const radius of [1.6, 2.2, 2.8, 3.4]) {
    const points = Array.from({ length: 129 }, (_, i) => new THREE.Vector3(Math.cos(i / 128 * Math.PI * 2) * radius, -0.018, Math.sin(i / 128 * Math.PI * 2) * radius))
    scene.add(new THREE.LineLoop(own(new THREE.BufferGeometry().setFromPoints(points)), lineMaterial))
  }
  const particlePositions = new Float32Array(1200 * 3)
  // ThreeUI spherical-cap sampling, seeded here for stable StrictMode remounts.
  for (let i = 0; i < 1200; i++) {
    const theta = random() * Math.PI * 2
    const phi = Math.acos(random() * 0.8 + 0.2)
    const radius = 3.4
    particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    particlePositions[i * 3 + 1] = radius * Math.cos(phi) - 0.65
    particlePositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
  }
  const particleGeometry = own(new THREE.BufferGeometry())
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
  const particles = new THREE.Points(particleGeometry, own(new THREE.PointsMaterial({ color: ACCENT, size: 0.012, transparent: true, opacity: 0.34, blending: THREE.AdditiveBlending, depthWrite: false })))
  scene.add(particles)
  scene.add(new THREE.HemisphereLight(0xf6f3da, 0x333e2b, 0.8))
  const key = new THREE.DirectionalLight(0xfff5dd, 3)
  key.position.set(-3, 6, 5)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  key.shadow.camera.left = key.shadow.camera.bottom = -4
  key.shadow.camera.right = key.shadow.camera.top = 4
  key.shadow.normalBias = 0.04
  key.shadow.bias = -0.0003
  scene.add(key)
  const rim = new THREE.DirectionalLight(0xe8ffb0, 2.5)
  rim.position.set(3, 3, -4)
  scene.add(rim)

  let disposed = false
  let failed = false
  let playing = false
  let reducedMotion = false
  let visible = true
  let frame = 0
  let previousTime = 0
  let elapsed = 0
  let baseAngle = 0
  let yaw = HOME_YAW
  let pitch = HOME_PITCH
  let distance = 6.8
  let drag = null
  const canRender = () => !disposed && !failed && visible && !document.hidden
  const isAnimating = () => playing && !reducedMotion && !drag
  function pose() {
    const wave = Math.sin(elapsed * 0.46)
    base.rotation.y = THREE.MathUtils.degToRad(baseAngle) + Math.sin(elapsed * 0.25) * 0.16
    shoulder.rotation.z = 0.51 + wave * 0.12
    elbow.rotation.z = -1.9 + Math.sin(elapsed * 0.46 + 0.5) * 0.13
    wrist.rotation.z = -1.68 - wave * 0.09
    particles.rotation.y = elapsed * 0.015
    camera.position.set(Math.sin(yaw) * Math.sin(pitch) * distance, 1.34 + Math.cos(pitch) * distance, Math.cos(yaw) * Math.sin(pitch) * distance)
    camera.lookAt(0.13, 1.35, 0)
  }
  function draw(time) {
    frame = 0
    if (!canRender()) { previousTime = 0; return }
    if (isAnimating()) elapsed += previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0
    previousTime = time
    pose()
    try { renderer.render(scene, camera) } catch (error) { fail(error); return }
    if (isAnimating()) frame = requestAnimationFrame(draw)
  }
  function invalidate() {
    if (canRender() && !frame) frame = requestAnimationFrame(draw)
  }
  function suspend() {
    cancelAnimationFrame(frame)
    frame = 0
    previousTime = 0
  }
  function resize() {
    if (disposed || failed) return
    const { width, height } = canvas.getBoundingClientRect()
    if (!width || !height) return
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 600 ? 1 : 1.5))
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    distance = camera.aspect < 0.9 ? 7.6 : 6.8
    camera.updateProjectionMatrix()
    invalidate()
  }
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)
  function handleVisibility() { suspend(); invalidate() }
  function fail(error) {
    if (disposed || failed) return
    failed = true
    suspend()
    onError(error)
  }
  function contextLost(event) { event.preventDefault(); fail(new Error('WebGL context lost')) }
  function pointerDown(event) {
    if (event.button !== 0 || drag || failed) return
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, touch: event.pointerType === 'touch', accepted: event.pointerType !== 'touch' }
    if (drag.accepted) canvas.setPointerCapture(event.pointerId)
  }
  function pointerMove(event) {
    if (!drag || drag.id !== event.pointerId) return
    const dx = event.clientX - drag.x
    const dy = event.clientY - drag.y
    if (!drag.accepted) {
      const totalX = Math.abs(event.clientX - drag.startX)
      const totalY = Math.abs(event.clientY - drag.startY)
      if (totalY > totalX && totalY > 8) { drag = null; invalidate(); return }
      if (totalX < 8) return
      drag.accepted = true
      canvas.setPointerCapture(event.pointerId)
    }
    yaw -= dx * 0.008
    if (!drag.touch) pitch = clamp(pitch - dy * 0.005, 0.7, 1.48)
    drag.x = event.clientX
    drag.y = event.clientY
    onInteraction()
    invalidate()
  }
  function pointerUp(event) {
    if (drag?.id !== event.pointerId) return
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
    drag = null
    previousTime = 0
    invalidate()
  }
  canvas.addEventListener('pointerdown', pointerDown)
  canvas.addEventListener('pointermove', pointerMove)
  canvas.addEventListener('pointerup', pointerUp)
  canvas.addEventListener('pointercancel', pointerUp)
  canvas.addEventListener('lostpointercapture', pointerUp)
  canvas.addEventListener('webglcontextlost', contextLost)
  document.addEventListener('visibilitychange', handleVisibility)
  const controller = {
    setMode(mode) {
      for (const variant of variants) {
        variant.solid.visible = mode === 'solid'
        variant.wire.visible = mode === 'wire'
        variant.points.visible = mode === 'points'
      }
      invalidate()
    },
    setAngle(value) { baseAngle = clamp(Number(value) || 0, -90, 90); invalidate() },
    setPlaying(value) { playing = Boolean(value); suspend(); invalidate() },
    setReducedMotion(value) { reducedMotion = Boolean(value); suspend(); invalidate() },
    setVisible(value) { visible = Boolean(value); suspend(); invalidate() },
    orbit(delta) { yaw += delta; invalidate() },
    reset() { elapsed = 0; baseAngle = 0; yaw = HOME_YAW; pitch = HOME_PITCH; this.setMode('solid'); invalidate() },
    dispose() {
      if (disposed) return
      disposed = true
      suspend()
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      canvas.removeEventListener('webglcontextlost', contextLost)
      canvas.removeEventListener('pointerdown', pointerDown)
      canvas.removeEventListener('pointermove', pointerMove)
      canvas.removeEventListener('pointerup', pointerUp)
      canvas.removeEventListener('pointercancel', pointerUp)
      canvas.removeEventListener('lostpointercapture', pointerUp)
      if (drag && canvas.hasPointerCapture(drag.id)) canvas.releasePointerCapture(drag.id)
      drag = null
      key.shadow.map?.dispose()
      key.shadow.mapPass?.dispose()
      resources.forEach(resource => resource.dispose())
      scene.clear()
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
  rollback.push(() => controller.dispose())
  resize()
  return controller
}

// Uniform barycentric samples reveal the actual surfaces, rather than box corners.
function sampleSurface(geometry, random) {
  const position = geometry.getAttribute('position')
  const index = geometry.getIndex()
  const count = index ? index.count : position.count
  const points = []
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3()
  const ab = new THREE.Vector3(), ac = new THREE.Vector3()
  for (let i = 0; i < count; i += 3) {
    a.fromBufferAttribute(position, index ? index.getX(i) : i)
    b.fromBufferAttribute(position, index ? index.getX(i + 1) : i + 1)
    c.fromBufferAttribute(position, index ? index.getX(i + 2) : i + 2)
    const area = ab.subVectors(b, a).cross(ac.subVectors(c, a)).length() * 0.5
    const samples = Math.ceil(area * 480)
    for (let j = 0; j < samples; j++) {
      const u = Math.sqrt(random()), v = random()
      points.push((1 - u) * a.x + u * (1 - v) * b.x + u * v * c.x,
        (1 - u) * a.y + u * (1 - v) * b.y + u * v * c.y,
        (1 - u) * a.z + u * (1 - v) * b.z + u * v * c.z)
    }
  }
  const result = new THREE.BufferGeometry()
  result.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
  return result
}
