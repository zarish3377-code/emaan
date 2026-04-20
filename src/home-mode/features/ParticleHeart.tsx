import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import FeatureOverlay, { featureCaption } from './FeatureOverlay'

export default function ParticleHeart() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = ref.current
    if (!mount) return

    const w = mount.clientWidth
    const h = mount.clientHeight
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#16000a')
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 2000)
    camera.position.z = 60
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    mount.appendChild(renderer.domElement)

    const N = 4000
    const targets = new Float32Array(N * 3)
    const current = new Float32Array(N * 3)
    const speeds = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      const t = Math.random() * Math.PI * 2
      const x = 16 * Math.pow(Math.sin(t), 3)
      const y =
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t)
      const jx = (Math.random() - 0.5) * 1.5
      const jy = (Math.random() - 0.5) * 1.5
      const jz = (Math.random() - 0.5) * 4
      targets[i * 3] = x + jx
      targets[i * 3 + 1] = y + jy
      targets[i * 3 + 2] = jz
      current[i * 3] = (Math.random() - 0.5) * 80
      current[i * 3 + 1] = (Math.random() - 0.5) * 80
      current[i * 3 + 2] = (Math.random() - 0.5) * 80
      speeds[i] = 0.012 + Math.random() * 0.025
    }

    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(current, 3))
    const mat = new THREE.PointsMaterial({
      color: 0xffd1dd,
      size: 0.22,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const points = new THREE.Points(geom, mat)
    scene.add(points)

    let raf = 0
    let t0 = 0
    const animate = (t: number) => {
      raf = requestAnimationFrame(animate)
      const pos = geom.attributes.position.array as Float32Array
      for (let i = 0; i < N; i++) {
        const s = speeds[i]
        pos[i * 3] += (targets[i * 3] - pos[i * 3]) * s
        pos[i * 3 + 1] += (targets[i * 3 + 1] - pos[i * 3 + 1]) * s
        pos[i * 3 + 2] += (targets[i * 3 + 2] - pos[i * 3 + 2]) * s
      }
      geom.attributes.position.needsUpdate = true
      points.rotation.y = Math.sin((t - t0) * 0.0004) * 0.3
      points.scale.setScalar(1 + Math.sin(t * 0.002) * 0.04)
      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame((t) => {
      t0 = t
      animate(t)
    })

    const onResize = () => {
      const ww = mount.clientWidth
      const hh = mount.clientHeight
      camera.aspect = ww / hh
      camera.updateProjectionMatrix()
      renderer.setSize(ww, hh)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      geom.dispose()
      mat.dispose()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <FeatureOverlay background="#16000a">
      <div ref={ref} style={{ position: 'absolute', inset: 0 }} />
      <div
        style={{
          ...featureCaption,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
          color: 'rgba(255,225,235,0.95)',
          animation: 'hm-pulse 2.4s ease-in-out infinite',
        }}
      >
        i love you
      </div>
    </FeatureOverlay>
  )
}
