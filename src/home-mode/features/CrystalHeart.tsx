import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import FeatureOverlay, { featureCaption } from './FeatureOverlay'

const SONG_URL = '/home-mode/song.mp3'

function buildHeartShape(): THREE.Shape {
  const shape = new THREE.Shape()
  const steps = 100
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2
    const x = 16 * Math.pow(Math.sin(t), 3)
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
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

  // Three.js setup (mount once)
  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const w = mount.clientWidth
    const h = mount.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000)
    camera.position.z = 4.5
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    mount.appendChild(renderer.domElement)

    const shape = buildHeartShape()
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 4,
      bevelEnabled: true,
      bevelSize: 2,
      bevelThickness: 1.5,
      bevelSegments: 6,
      curveSegments: 24,
    })
    geom.center()
    const mat = new THREE.MeshStandardMaterial({
      color: 0xff89ac,
      metalness: 0.3,
      roughness: 0.4,
    })
    const heart = new THREE.Mesh(geom, mat)
    heart.rotation.z = Math.PI
    heart.scale.setScalar(0.01)
    scene.add(heart)

    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambient)
    const goldLight = new THREE.PointLight(0xffd700, 1.2, 100)
    goldLight.position.set(2, 3, 4)
    scene.add(goldLight)
    const roseLight = new THREE.PointLight(0xff89ac, 0.8, 100)
    roseLight.position.set(-3, -1, 2)
    scene.add(roseLight)

    // Snow hearts
    const snowCount = 250
    const snowGeom = new THREE.BufferGeometry()
    const snowPos = new Float32Array(snowCount * 3)
    const snowVel = new Float32Array(snowCount)
    const snowColors = new Float32Array(snowCount * 3)
    const palette = [
      [1, 0.4, 0.6],
      [1, 0.7, 0.8],
      [1, 0.45, 0.7],
      [1, 0.71, 0.76],
    ]
    for (let i = 0; i < snowCount; i++) {
      snowPos[i * 3] = (Math.random() - 0.5) * 12
      snowPos[i * 3 + 1] = Math.random() * 8 - 4
      snowPos[i * 3 + 2] = (Math.random() - 0.5) * 6
      snowVel[i] = 0.005 + Math.random() * 0.012
      const c = palette[Math.floor(Math.random() * palette.length)]
      snowColors[i * 3] = c[0]
      snowColors[i * 3 + 1] = c[1]
      snowColors[i * 3 + 2] = c[2]
    }
    snowGeom.setAttribute('position', new THREE.BufferAttribute(snowPos, 3))
    snowGeom.setAttribute('color', new THREE.BufferAttribute(snowColors, 3))
    const snowMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const snow = new THREE.Points(snowGeom, snowMat)
    scene.add(snow)

    const scaleStart = performance.now()
    const targetScale = 0.12

    let raf = 0
    let mouseX = 0
    let mouseY = 0
    let cameraZTarget = 4.5

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.4
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4
    }
    window.addEventListener('mousemove', onMouseMove)

    const animate = (t: number) => {
      raf = requestAnimationFrame(animate)
      const elapsed = (t - scaleStart) / 1000

      const springProgress = Math.min(elapsed / 1.5, 1)
      const eased =
        springProgress < 1
          ? 1 - Math.cos(springProgress * Math.PI * 2.5) * Math.exp(-springProgress * 4)
          : 1
      let scale = targetScale * eased

      let bass = 0
      let mid = 0
      if (analyserRef.current && dataArrayRef.current && isPlayingRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current as Uint8Array<ArrayBuffer>)
        let bassSum = 0
        for (let i = 0; i < 8; i++) bassSum += dataArrayRef.current[i]
        bass = bassSum / 8
        let midSum = 0
        for (let i = 9; i < 41; i++) midSum += dataArrayRef.current[i]
        mid = midSum / 32

        scale =
          targetScale + (bass / 255) * 0.06 + Math.sin(elapsed * 1.2) * 0.006
        goldLight.intensity = 1.2 + (bass / 255) * 1.5
        roseLight.intensity = 0.8 + (mid / 255) * 1.2

        if (bass > 200) cameraZTarget = 3.5
      }

      cameraZTarget += (4.5 - cameraZTarget) * 0.04
      camera.position.z += (cameraZTarget - camera.position.z) * 0.1
      camera.position.x += (mouseX - camera.position.x) * 0.05
      camera.position.y += (-mouseY - camera.position.y) * 0.05
      camera.lookAt(0, 0, 0)

      heart.scale.setScalar(scale)
      heart.position.y = Math.sin(elapsed * 0.8) * 0.08
      heart.rotation.y += 0.004 + (mid / 255) * 0.015

      const sp = snowGeom.attributes.position.array as Float32Array
      for (let i = 0; i < snowCount; i++) {
        const speedMul = 1 + (bass / 255) * 1.5
        sp[i * 3 + 1] -= snowVel[i] * speedMul
        if (sp[i * 3 + 1] < -4) sp[i * 3 + 1] = 4
      }
      snowGeom.attributes.position.needsUpdate = true

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
      geom.dispose()
      mat.dispose()
      snowGeom.dispose()
      snowMat.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  // Audio cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      try {
        sourceRef.current?.disconnect()
        analyserRef.current?.disconnect()
        if (
          audioCtxRef.current &&
          audioCtxRef.current.state !== 'closed'
        ) {
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
      src.connect(analyser)
      analyser.connect(ctx.destination)
      audioCtxRef.current = ctx
      sourceRef.current = src
      analyserRef.current = analyser
      dataArrayRef.current = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount))
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
    <FeatureOverlay background="#16000a">
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

      {isPlaying && !ended && (
        <div
          style={{
            ...featureCaption,
            bottom: '15%',
            fontSize: '1.2rem',
            color: '#ffdada',
            opacity: 0,
            animation: 'hm-fade-in 2s ease 1s forwards',
          }}
        >
          this song makes me think of you
        </div>
      )}
      {ended && (
        <div
          style={{
            ...featureCaption,
            bottom: '15%',
            fontSize: '1.3rem',
            color: '#ffdada',
            animation: 'hm-fade-in 1s ease',
          }}
        >
          i hope you felt that ♡
        </div>
      )}

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
    </FeatureOverlay>
  )
}
