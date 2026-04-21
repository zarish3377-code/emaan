import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import FeatureOverlay from './FeatureOverlay'

const SONG_URL = '/home-mode/song.mp3'

function createHeartShape() {
  const shape = new THREE.Shape()
  const x = 0
  const y = 0
  shape.moveTo(x + 0.25, y + 0.25)
  shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y)
  shape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35)
  shape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 0.95)
  shape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35)
  shape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y)
  shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25)
  return shape
}

export default function CrystalHeart() {
  const mountRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const isPlayingRef = useRef(false)

  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [ended, setEnded] = useState(false)

  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const w = mount.clientWidth
    const h = mount.clientHeight

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0410)
    scene.fog = new THREE.FogExp2(0x0a0410, 0.08)

    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100)
    camera.position.set(0, 0, 2.8)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    mount.appendChild(renderer.domElement)

    // Heart geometry
    const shape = createHeartShape()
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.3,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 2,
      bevelSize: 0.06,
      bevelThickness: 0.06,
    })
    geometry.computeBoundingBox()
    const bb = geometry.boundingBox!
    geometry.translate(
      -(bb.max.x + bb.min.x) / 2,
      -(bb.max.y + bb.min.y) / 2,
      -(bb.max.z + bb.min.z) / 2
    )
    // Heart from these bezier coords points "down"; flip
    geometry.rotateZ(Math.PI)

    let material: THREE.Material
    try {
      material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#ff5577'),
        metalness: 0.0,
        roughness: 0.05,
        transmission: 0.6,
        thickness: 0.5,
        reflectivity: 0.8,
        ior: 1.8,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
      })
    } catch {
      material = new THREE.MeshStandardMaterial({
        color: 0xff5577,
        metalness: 0.15,
        roughness: 0.1,
        transparent: true,
        opacity: 0.9,
      })
    }

    const heart = new THREE.Mesh(geometry, material)
    heart.scale.setScalar(0)
    scene.add(heart)

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambient)
    const keyLight = new THREE.PointLight(0xffd700, 2.5, 20)
    keyLight.position.set(3, 4, 3)
    scene.add(keyLight)
    const fillLight = new THREE.PointLight(0xff89ac, 1.8, 20)
    fillLight.position.set(-3, -1, 2)
    scene.add(fillLight)
    const rimLight = new THREE.PointLight(0x9b6fcc, 1.2, 20)
    rimLight.position.set(0, 0, -4)
    scene.add(rimLight)

    // Particles around heart
    const particleCount = 2000
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const phases = new Float32Array(particleCount)
    const colorOptions = [
      new THREE.Color('#FF5577'),
      new THREE.Color('#FF89AC'),
      new THREE.Color('#FFD700'),
      new THREE.Color('#C44DFF'),
      new THREE.Color('#ffffff'),
    ]
    for (let i = 0; i < particleCount; i++) {
      const t = (i / particleCount) * Math.PI * 2
      const layer = Math.floor(i / (particleCount / 3))
      const scale = [0.9, 1.0, 1.15][layer] || 1.0
      const hx = scale * 16 * Math.pow(Math.sin(t), 3) * 0.06
      const hy =
        scale *
        (13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t)) *
        -0.06
      const hz = (Math.random() - 0.5) * 0.4
      positions[i * 3] = hx + (Math.random() - 0.5) * 0.15
      positions[i * 3 + 1] = hy + (Math.random() - 0.5) * 0.15
      positions[i * 3 + 2] = hz
      const col = colorOptions[Math.floor(Math.random() * colorOptions.length)]
      colors[i * 3] = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b
      phases[i] = Math.random() * Math.PI * 2
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const pMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    // Mouse drift target
    const camTarget = { x: 0, y: 0 }
    const onMouseMove = (e: MouseEvent) => {
      camTarget.x = (e.clientX / window.innerWidth - 0.5) * 0.4
      camTarget.y = (e.clientY / window.innerHeight - 0.5) * -0.3
    }
    window.addEventListener('mousemove', onMouseMove)

    // Entry tween
    const entryStart = performance.now()
    const entryDur = 1200

    const clock = new THREE.Clock()
    let raf = 0
    const animate = () => {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Entry elastic
      const ep = Math.min((performance.now() - entryStart) / entryDur, 1)
      const c4 = (2 * Math.PI) / 3
      const elastic =
        ep === 0
          ? 0
          : ep === 1
          ? 1
          : Math.pow(2, -10 * ep) * Math.sin((ep * 10 - 0.75) * c4) + 1

      // Audio
      let bass = 0
      let mid = 0
      if (analyserRef.current && dataArrayRef.current && isPlayingRef.current) {
        analyserRef.current.getByteFrequencyData(
          dataArrayRef.current as Uint8Array<ArrayBuffer>
        )
        const data = dataArrayRef.current
        let bs = 0
        for (let i = 0; i < 8; i++) bs += data[i]
        bass = bs / 8 / 255
        let ms = 0
        for (let i = 9; i < 40; i++) ms += data[i]
        mid = ms / 31 / 255
      }

      // Heart anim
      heart.rotation.y += 0.004 + bass * 0.018
      heart.rotation.x = Math.sin(t * 0.4) * 0.08
      const breathe = 1.0 + Math.sin(t * 1.4) * 0.04 + bass * 0.08
      heart.scale.setScalar(elastic * breathe)
      heart.position.y = Math.sin(t * 0.7) * 0.08

      // Lights orbit + react
      keyLight.position.x = Math.sin(t * 0.5) * 3
      keyLight.position.z = Math.cos(t * 0.5) * 3
      fillLight.position.x = Math.sin(t * 0.5 + Math.PI) * 3
      fillLight.position.z = Math.cos(t * 0.5 + Math.PI) * 3
      keyLight.intensity = 2.5 + bass * 3.0
      fillLight.intensity = 1.8 + mid * 2.0

      // Particle shimmer
      const posArr = pGeo.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3 + 2] += Math.sin(t * 2 + phases[i]) * 0.001
        if (bass > 0.6) {
          posArr[i * 3] *= 1.0 + bass * 0.003
          posArr[i * 3 + 1] *= 1.0 + bass * 0.003
        }
      }
      pGeo.attributes.position.needsUpdate = true
      pMat.size = 0.04 + bass * 0.02
      particles.rotation.y += 0.002 + bass * 0.008

      // Camera lerp toward mouse target
      camera.position.x += (camTarget.x - camera.position.x) * 0.03
      camera.position.y += (camTarget.y - camera.position.y) * 0.03
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(animate)

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
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      geometry.dispose()
      material.dispose()
      pGeo.dispose()
      pMat.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  // Audio cleanup
  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause()
      try {
        sourceRef.current?.disconnect()
        analyserRef.current?.disconnect()
        if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
          audioCtxRef.current.close()
        }
      } catch {
        /* noop */
      }
    }
  }, [])

  const togglePlay = async () => {
    if (!audioRef.current) return
    if (!audioCtxRef.current) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      const ctx = new Ctx()
      const src = ctx.createMediaElementSource(audioRef.current)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8
      src.connect(analyser)
      analyser.connect(ctx.destination)
      audioCtxRef.current = ctx
      sourceRef.current = src
      analyserRef.current = analyser
      dataArrayRef.current = new Uint8Array(
        new ArrayBuffer(analyser.frequencyBinCount)
      )
    }
    if (audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume()
    }
    if (audioRef.current.paused) {
      try {
        await audioRef.current.play()
        setIsPlaying(true)
        setEnded(false)
      } catch (err) {
        console.error('audio play failed', err)
      }
    } else {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const onTimeUpdate = () => {
    const a = audioRef.current
    if (!a || !a.duration) return
    setProgress(a.currentTime / a.duration)
  }

  return (
    <FeatureOverlay background="#0a0410">
      <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />

      <audio
        ref={audioRef}
        src={SONG_URL}
        preload="auto"
        onTimeUpdate={onTimeUpdate}
        onEnded={() => {
          setIsPlaying(false)
          setEnded(true)
        }}
      />

      {/* Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 100,
          padding: '12px 28px',
          zIndex: 10,
        }}
      >
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: 'none',
            background: 'transparent',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M7 4l13 8-13 8z" />
            </svg>
          )}
        </button>
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 14,
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          our song ♡
        </span>
        <div
          style={{
            width: 120,
            height: 3,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 100,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #FFD700, #F9C846)',
              transition: 'width 200ms linear',
            }}
          />
        </div>
      </div>

      {ended && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '18%',
            transform: 'translateX(-50%)',
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            color: '#ffdada',
            fontSize: '1.3rem',
            textShadow: '0 2px 16px rgba(0,0,0,0.7)',
            animation: 'hm-fade-in 1s ease',
          }}
        >
          i hope you felt that ♡
        </div>
      )}
    </FeatureOverlay>
  )
}
