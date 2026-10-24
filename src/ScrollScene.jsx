import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// One point cloud behind the whole page. Scroll position (top to bottom) drives a morph
// through AI symbols: bot → neural network → "LLM" → chat bubble → AI sparkle → brain → bot.
const TAU = Math.PI * 2

// Deterministic pseudo-random in [0, 1) so shapes are identical on every load
const rand = (i, salt = 0) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

// Superellipsoid: a sphere pushed towards a rounded box
const boxy = (c, e = 0.35) => Math.sign(c) * Math.pow(Math.abs(c), e)

function onSphere(i, n) {
  const y = 1 - ((i + 0.5) / n) * 2
  const r = Math.sqrt(1 - y * y)
  const a = Math.PI * (3 - Math.sqrt(5)) * i
  return [Math.cos(a) * r, y, Math.sin(a) * r]
}

// Sample a point on a polyline made of [x1, y1, x2, y2] segments, weighted by length
function onSegments(segments, i, salt) {
  const lengths = segments.map(([x1, y1, x2, y2]) => Math.hypot(x2 - x1, y2 - y1))
  const total = lengths.reduce((a, b) => a + b, 0)
  let d = rand(i, salt) * total
  let k = 0
  while (k < segments.length - 1 && d > lengths[k]) { d -= lengths[k]; k++ }
  const [x1, y1, x2, y2] = segments[k]
  const t = lengths[k] ? d / lengths[k] : 0
  return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]
}

// Robot head. Eye points also report their eye centre, used for blinking.
function bot(n) {
  const parts = [['head', 0.56], ['eyes', 0.16], ['mouth', 0.06], ['antenna', 0.08], ['ears', 0.14]]
  const ranges = []
  let acc = 0
  for (const [name, share] of parts) { ranges.push([name, acc, acc + share]); acc += share }
  const head = Math.round(n * 0.56)
  return (i) => {
    const f = i / n
    const part = ranges.find(([, a, b]) => f >= a && f < b)?.[0] ?? 'head'
    if (part === 'head') {
      const [x, y, z] = onSphere(i, head)
      return { p: [boxy(x) * 1.3, boxy(y) * 1.05, boxy(z) * 0.95] }
    }
    if (part === 'eyes') {
      const side = i % 2 ? 1 : -1
      const r = Math.sqrt(rand(i, 1)) * 0.22
      const a = rand(i, 2) * TAU
      const cy = 0.12
      return { p: [side * 0.48 + Math.cos(a) * r, cy + Math.sin(a) * r * 1.15, 0.99], eye: cy }
    }
    if (part === 'mouth') {
      const t = rand(i, 3) * 2 - 1
      return { p: [t * 0.45, -0.45 - (1 - t * t) * 0.08, 0.97] }
    }
    if (part === 'antenna') {
      if (rand(i, 4) < 0.45) return { p: [0, 1.05 + rand(i, 5) * 0.45, 0] }
      const [x, y, z] = onSphere(i % 60, 60)
      return { p: [x * 0.13, 1.62 + y * 0.13, z * 0.13] }
    }
    const side = i % 2 ? 1 : -1
    const r = Math.sqrt(rand(i, 6)) * 0.3
    const a = rand(i, 7) * TAU
    return { p: [side * (1.33 + rand(i, 8) * 0.12), Math.sin(a) * r, Math.cos(a) * r] }
  }
}

function neuralNet(n) {
  const layers = [3, 4, 4, 2]
  const nodes = []
  layers.forEach((size, li) => {
    for (let k = 0; k < size; k++) nodes.push({ li, pos: [(li / (layers.length - 1) - 0.5) * 4.2, ((k + 0.5) / size - 0.5) * 3.2] })
  })
  const edges = []
  nodes.forEach((a) => nodes.forEach((b) => { if (b.li === a.li + 1) edges.push([a.pos, b.pos]) }))
  const nodeR = 0.24
  return (i) => {
    if (i / n < 0.3) {
      // Each node is a ring with a filled core, facing the viewer
      const [x, y] = nodes[i % nodes.length].pos
      const a = rand(i, 9) * TAU
      const r = i % 3 === 0 ? Math.sqrt(rand(i, 31)) * nodeR * 0.55 : nodeR
      return { p: [x + Math.cos(a) * r, y + Math.sin(a) * r, 0] }
    }
    // Connections stop at the ring edge so nodes stay distinct
    const [a, b] = edges[i % edges.length]
    const len = Math.hypot(b[0] - a[0], b[1] - a[1])
    const t = nodeR / len + rand(i, 10) * (1 - (2 * nodeR) / len)
    return { p: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, 0] }
  }
}

// The letters "LLM" drawn as thick strokes with a little depth
function llm() {
  const h = 2
  const L = (x0) => [[x0, h / 2, x0, -h / 2], [x0, -h / 2, x0 + 1, -h / 2]]
  const M = (x0) => [[x0, -h / 2, x0, h / 2], [x0, h / 2, x0 + 0.65, -0.1], [x0 + 0.65, -0.1, x0 + 1.3, h / 2], [x0 + 1.3, h / 2, x0 + 1.3, -h / 2]]
  const segments = [...L(-2.05), ...L(-0.75), ...M(0.55)]
  return (i) => {
    const [x, y] = onSegments(segments, i, 15)
    const a = rand(i, 16) * TAU
    const r = Math.sqrt(rand(i, 17)) * 0.13
    return { p: [x + Math.cos(a) * r, y + Math.sin(a) * r, (rand(i, 18) - 0.5) * 0.3] }
  }
}

// Claude-style spark: tapered rays of uneven length radiating from a small core
function claudeSpark(n) {
  const rays = 12
  const lengths = Array.from({ length: rays }, (_, r) => 1.55 + rand(r, 40) * 0.6)
  const angles = Array.from({ length: rays }, (_, r) => (r / rays) * TAU + (rand(r, 41) - 0.5) * 0.12)
  return (i) => {
    if (i / n < 0.1) {
      const a = rand(i, 42) * TAU
      const r = Math.sqrt(rand(i, 43)) * 0.32
      return { p: [Math.cos(a) * r, Math.sin(a) * r, (rand(i, 44) - 0.5) * 0.15] }
    }
    const ray = i % rays
    const along = Math.sqrt(rand(i, 45))
    const d = 0.18 + along * lengths[ray]
    // Rays are wide at the root and taper to a rounded tip
    const half = 0.16 * (1 - along * 0.75)
    const off = (rand(i, 46) * 2 - 1) * half
    const a = angles[ray]
    return { p: [Math.cos(a) * d - Math.sin(a) * off, Math.sin(a) * d + Math.cos(a) * off, (rand(i, 47) - 0.5) * 0.15] }
  }
}

// Four-point AI sparkle (astroid) with a small companion sparkle
function sparkle(n) {
  return (i) => {
    const small = i / n > 0.8
    const a = rand(i, 25) * TAU
    const fill = i % 3 === 0 ? Math.sqrt(rand(i, 26)) : 1
    const s = (small ? 0.6 : 2.1) * fill
    const x = Math.sign(Math.cos(a)) * Math.pow(Math.abs(Math.cos(a)), 3) * s
    const y = Math.sign(Math.sin(a)) * Math.pow(Math.abs(Math.sin(a)), 3) * s
    const [ox, oy] = small ? [1.75, 1.55] : [0, 0]
    return { p: [x + ox, y + oy, (rand(i, 27) - 0.5) * 0.25] }
  }
}

function brain(n) {
  return (i) => {
    const side = i % 2 ? 1 : -1
    const [x, y, z] = onSphere(Math.floor(i / 2), Math.ceil(n / 2))
    // Folds: ripple the surface so it reads as a brain rather than two eggs
    const fold = 1 + 0.07 * Math.sin(y * 14 + z * 6) * Math.cos(z * 11 - x * 4)
    const px = side * 0.08 + side * Math.abs(x) * 1.05 * fold
    return { p: [px, y * 1.05 * fold + 0.1, z * 1.45 * fold] }
  }
}

// [shape, element whose centre crossing the viewport middle marks the stage, element to sit behind]
const STAGES = [
  [bot, null, null],
  [neuralNet, '.project:nth-child(1)', '.project:nth-child(1) .project-info'],
  [llm, '.project:nth-child(2)', '.project:nth-child(2) .project-info'],
  [claudeSpark, '.project:nth-child(3)', '.project:nth-child(3) .project-info'],
  [sparkle, '#skills .section-heading', null],
  [brain, '#about .about-grid', '#about .about-copy'],
  [bot, null, null],
]

export default function ScrollScene() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const narrow = window.matchMedia('(max-width: 760px)').matches
    const last = STAGES.length - 1

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(0, 0, 8)

    const count = narrow ? 2200 : 3600
    const eyeY = new Float32Array(count).fill(NaN)
    const targets = STAGES.map(([make], s) => {
      const fn = make(count)
      const arr = new Float32Array(count * 3)
      for (let i = 0; i < count; i++) {
        const { p, eye } = fn(i)
        arr.set(p, i * 3)
        if (s === 0 && eye !== undefined) eyeY[i] = eye
      }
      return arr
    })

    const positions = new Float32Array(targets[0])
    const colors = new Float32Array(count * 3)
    const palette = ['#2563eb', '#6366f1', '#0f766e', '#d97757', '#7c3aed', '#0284c7', '#2563eb'].map((c) => new THREE.Color(c))
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const material = new THREE.PointsMaterial({ size: 0.034, vertexColors: true, transparent: true, opacity: narrow ? 0.42 : 0.55, depthWrite: false })
    const points = new THREE.Points(geometry, material)
    scene.add(points)

    // Screen pixels → world units on the z = 0 plane
    let unit = 1
    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      unit = (2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) / h
    }
    resize()

    // Page-space box of an element from layout offsets, so in-flight GSAP transforms don't skew it
    const box = (sel) => {
      let el = sel && document.querySelector(sel)
      if (!el) return null
      const w = el.offsetWidth
      const h = el.offsetHeight
      let x = 0
      let y = 0
      while (el) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent }
      return { left: x, right: x + w, top: y, width: w, height: h }
    }

    // Per stage: page progress at which it is fully formed, and its [x, y, scale]
    let stops = STAGES.map((_, i) => i / last)
    const layout = STAGES.map(() => [0, 0, 1])
    const measure = () => {
      const h = window.innerHeight
      const w = window.innerWidth
      const max = document.documentElement.scrollHeight - h
      if (max <= 0) return
      const toWorldX = (px) => (px - w / 2) * unit
      const toWorldY = (pyInView) => (h / 2 - pyInView) * unit

      STAGES.forEach(([, anchor, behind], i) => {
        if (i === 0 || i === last) return
        const a = box(anchor)
        if (!a) return
        // Fully formed when the anchor's centre crosses the middle of the viewport
        const scroll = Math.min(max, Math.max(0, a.top + a.height / 2 - h / 2))
        stops[i] = scroll / max
        const spot = box(behind) || a
        const x = narrow ? 0 : toWorldX(spot.left + spot.width / 2)
        const y = narrow ? 0 : toWorldY(spot.top + spot.height / 2 - scroll)
        const fit = narrow ? (w * unit) / 5.6 : Math.min(1.05, (spot.width * unit) / 4.6)
        layout[i] = [x, y, fit]
      })
      // Skills: the sparkle sits in the empty space right of the section heading
      const heading = box('#skills .section-heading')
      if (heading && !narrow) {
        const scroll = Math.min(max, Math.max(0, heading.top + heading.height / 2 - h / 2))
        layout[4] = [toWorldX(heading.left + heading.width * 0.78), toWorldY(heading.top + heading.height / 2 - scroll), 0.85]
      }
      stops[0] = 0
      stops[last] = 1
      for (let i = 1; i <= last; i++) stops[i] = Math.max(stops[i], stops[i - 1] + 0.001)

      // Hero bot: in the open space beside the intro paragraph, left of the portrait
      const text = box('.hero-text')
      const photo = box('.photo-frame')
      if (text && photo && !narrow) {
        const gap = (photo.left - text.right) * unit
        layout[0] = [toWorldX((text.right + photo.left) / 2 - 10), toWorldY(text.top + text.height * 0.5), Math.min(0.9, Math.max(0.55, gap / 2.9))]
      } else if (photo) {
        layout[0] = [toWorldX((photo.right + w) / 2), toWorldY(photo.top + photo.height * 0.62), Math.min(0.48, ((w - photo.right) * unit) / 2.7)]
      }
      // Closing bot: sits on top of the contact card when the page is scrolled to the end
      const card = box('.contact-card')
      if (card) {
        const s = narrow ? 0.36 : 0.68
        layout[last] = [0, toWorldY(card.top - max) + 0.85 * s, s]
      }
    }

    const target = new THREE.Vector2()
    const onPointer = (e) => target.set(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5)
    window.addEventListener('pointermove', onPointer, { passive: true })
    const look = new THREE.Vector2()

    // Scroll progress; the render loop eases towards it so the morph trails the scrollbar smoothly
    const state = { progress: 0, target: 0 }
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onRefresh: measure,
      onUpdate: (self) => { state.target = self.progress },
    })
    state.target = state.progress = st.progress
    const onResize = () => { resize(); measure() }
    window.addEventListener('resize', onResize)
    measure()
    // Lazy-loaded images and fonts change the page height after first paint; re-measure when they do
    let pending = 0
    const pageObserver = new ResizeObserver(() => {
      cancelAnimationFrame(pending)
      pending = requestAnimationFrame(() => ScrollTrigger.refresh())
    })
    pageObserver.observe(document.body)

    // Morph across the middle of each gap, so a shape holds while its section is on screen
    const smoother = (u) => u * u * u * (u * (u * 6 - 15) + 10)
    const clamp01 = (u) => Math.min(1, Math.max(0, u))
    const ease = (t) => smoother(clamp01((t - 0.12) / 0.76))
    // Each point starts its journey a little later than the last, so the cloud flows instead of snapping
    const delay = new Float32Array(count)
    for (let i = 0; i < count; i++) delay[i] = rand(i, 50) * 0.35
    const tmp = new THREE.Color()
    let time = 0
    let prev = performance.now()
    let frame = 0

    const render = (dt = 0) => {
      state.progress = reduceMotion || !dt ? state.target : state.progress + (state.target - state.progress) * (1 - Math.exp(-dt * 4.5))
      const p = state.progress
      let seg = 0
      while (seg < last - 1 && p > stops[seg + 1]) seg++
      const span = stops[seg + 1] - stops[seg] || 1
      const t = ease((p - stops[seg]) / span)
      const a = targets[seg]
      const b = targets[seg + 1]

      // How much "bot" is on screen: drives blinking and looking at the pointer
      const botWeight = seg === 0 ? 1 - t : seg === last - 1 ? t : 0
      // Soft blink: eyes close and reopen over ~0.3 s every 4 s
      const phase = (time % 4) - 3.7
      const blink = !reduceMotion && phase > 0 ? 1 - Math.sin((phase / 0.3) * Math.PI) * 0.92 : 1
      const wave = reduceMotion ? 0 : 0.035
      const raw = clamp01((p - stops[seg]) / span)

      for (let i = 0; i < count; i++) {
        const k = i * 3
        // Per-point progress, staggered within the morph window
        const ti = smoother(clamp01(ease(raw) * 1.35 - delay[i]))
        const lift = Math.sin(ti * Math.PI) * (0.35 + delay[i])
        let y = a[k + 1] + (b[k + 1] - a[k + 1]) * ti + Math.sin(time * 0.9 + i * 0.37) * wave
        if (botWeight > 0 && !Number.isNaN(eyeY[i])) y = eyeY[i] + (y - eyeY[i]) * (1 - (1 - blink) * botWeight)
        positions[k] = a[k] + (b[k] - a[k]) * ti
        positions[k + 1] = y
        positions[k + 2] = a[k + 2] + (b[k + 2] - a[k + 2]) * ti + lift
      }
      geometry.attributes.position.needsUpdate = true

      tmp.copy(palette[seg]).lerp(palette[seg + 1], t)
      for (let i = 0; i < count; i++) {
        const shade = (0.78 + rand(i, 30) * 0.3) * (!Number.isNaN(eyeY[i]) && botWeight > 0.5 ? 0.55 : 1)
        colors[i * 3] = tmp.r * shade
        colors[i * 3 + 1] = tmp.g * shade
        colors[i * 3 + 2] = tmp.b * shade
      }
      geometry.attributes.color.needsUpdate = true

      const [ax, ay, as] = layout[seg]
      const [bx, by, bs] = layout[seg + 1]
      points.position.set(ax + (bx - ax) * t, ay + (by - ay) * t, 0)
      points.scale.setScalar(as + (bs - as) * t)

      // Bots face the viewer and follow the pointer; symbols sway gently so their shape stays readable
      look.lerp(target, 0.06)
      const sway = Math.sin(time * 0.5) * 0.25
      points.rotation.y = look.x * 0.9 * botWeight + sway * (1 - botWeight)
      points.rotation.x = look.y * 0.5 * botWeight + Math.sin(time * 0.35) * 0.08 * (1 - botWeight)
      renderer.render(scene, camera)
    }

    const tick = () => {
      const now = performance.now()
      const dt = Math.min((now - prev) / 1000, 0.05)
      time += dt
      prev = now
      render(dt)
      frame = requestAnimationFrame(tick)
    }
    const renderStill = () => render()
    if (reduceMotion) {
      render()
      gsap.ticker.add(renderStill)
    } else {
      tick()
    }

    return () => {
      cancelAnimationFrame(frame)
      gsap.ticker.remove(renderStill)
      st.kill()
      pageObserver.disconnect()
      cancelAnimationFrame(pending)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointer)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div className="scroll-scene" ref={mountRef} aria-hidden="true" />
}
