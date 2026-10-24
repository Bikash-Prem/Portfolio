import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// A field of crisp dots rolling like terrain, a quiet nod to the geospatial work.
// Dots fade into the page background towards the edges, so there is no hard boundary.
export default function HeroWave() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(0, 3.2, 7)
    camera.lookAt(0, 0, 0)

    const cols = 90
    const rows = 46
    const spacing = 0.16
    const count = cols * rows
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const bg = new THREE.Color('#f7f6f2')
    const blue = new THREE.Color('#2563eb')
    const teal = new THREE.Color('#0f766e')
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const k = (i * rows + j) * 3
        const x = (i - cols / 2) * spacing
        const z = (j - rows / 2) * spacing
        positions[k] = x
        positions[k + 2] = z
        // Fade to the background colour towards the edges of the field
        const edge = Math.min(1, Math.hypot(x / ((cols / 2) * spacing), z / ((rows / 2) * spacing)))
        const c = blue.clone().lerp(teal, i / cols).lerp(bg, Math.pow(edge, 1.6) * 0.95 + 0.25)
        colors.set([c.r, c.g, c.b], k)
      }
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const material = new THREE.PointsMaterial({ size: 0.035, vertexColors: true })
    const points = new THREE.Points(geometry, material)
    scene.add(points)

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    const target = { x: 0 }
    const onPointer = (e) => { target.x = (e.clientX / window.innerWidth - 0.5) * 0.25 }
    window.addEventListener('pointermove', onPointer, { passive: true })

    const pos = geometry.attributes.position
    let time = 0
    const update = () => {
      for (let i = 0; i < count; i++) {
        const x = pos.array[i * 3]
        const z = pos.array[i * 3 + 2]
        pos.array[i * 3 + 1] = Math.sin(x * 0.9 + time) * 0.22 + Math.cos(z * 1.3 + time * 0.8) * 0.18
      }
      pos.needsUpdate = true
      points.rotation.y += (target.x - points.rotation.y) * 0.03
      renderer.render(scene, camera)
    }

    let last = performance.now()
    let frame = 0
    let running = false
    const tick = () => {
      const now = performance.now()
      time += Math.min((now - last) / 1000, 0.05) * 0.6
      last = now
      update()
      frame = requestAnimationFrame(tick)
    }
    const start = () => { if (!running && !reduceMotion) { running = true; last = performance.now(); tick() } }
    const stop = () => { running = false; cancelAnimationFrame(frame) }
    update()

    // Only animate while the hero is on screen
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    io.observe(mount)

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onPointer)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div className="hero-wave" ref={mountRef} aria-hidden="true" />
}
