import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import FeatureOverlay, { featureCaption } from './FeatureOverlay'

// Lightweight "crystal heart" — instanced heart-curve points orbiting a central glowing heart,
// with optional ukulele audio that drives intensity via AudioAnalyser.
export default function CrystalHeart() {
  const ref = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const mount = ref.current
    if (!mount) return
    const W = mount.clientWidth
    const H = mount.clientHeight

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#16000a')
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 1000)
    camera.position.set(0, 0, 50)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    mount.appendChild(renderer.domElement)

    // Central heart: many particles tightly packed on heart curve
    const heartPts = 1500
    const heartGeo = new THREE.BufferGeometry()
    const hp = new Float32Array(heartPts * 3)
    for (let i = 0; i < heartPts; i++) {
      const t = Math.random() * Math.PI * 2
      const r = 0.85 + Math.random() * 0.3
      const x = 16 * Math.pow(Math.sin(t), 3) * r
      const y =
        (13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t)) *
        r
      hp[i * 3] = x * 0.6
      hp[i * 3 + 1] = y * 0.6
      hp[i * 3 + 2] = (Math.random() - 0.5) * 1.6
    }
    heartGeo.setAttribute('position', new THREE.BufferAttribute(hp, 3))
    const heartMat = new THREE.PointsMaterial({
      color: 0xff89ac,
      size: 0.28,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const heart = new THREE.Points(heartGeo, heartMat)
    scene.add(heart)

    // Orbiting halo of 1500 sparkles
    const halo = 1500
    const haloGeo = new THREE.BufferGeometry()
    const hap = new Float32Array(halo * 3)
    const haloRadii = new Float32Array(halo)
    const haloAng = new Float32Array(halo)
    const haloSpeed = new Float32Array(halo)
    const haloTilt = new Float32Array(halo)
    for (let i = 0; i < halo; i++) {
      haloRadii[i] = 14 + Math.random() * 10
      haloAng[i] = Math.random() * Math.PI * 2
      haloSpeed[i] = 0.002 + Math.random() * 0.006
      haloTilt[i] = (Math.random() - 0.5) * 6
    }
    haloGeo.setAttribute('position', new THREE.BufferAttribute(hap, 3))
    const colors = [0xffffff, 0xff4d6d, 0xffb3c8, 0xff70a6, 0xfff0f5]
    const haloMat = new THREE.PointsMaterial({
      color: colors[1],
      size: 0.12,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const haloPts = new THREE.Points(haloGeo, haloMat)
    scene.add(haloPts)

    // Audio analyser
    let analyser: AnalyserNode | null = null
    let freqData: Uint8Array | null = null
    let audioCtx: AudioContext | null = null
    const audio = new Audio()
    audio.crossOrigin = 'anonymous'
    audio.src = 'https://assets.codepen.io/74321/ukulele.mp3'
    audio.loop = true
    audioRef.current = audio

    const setupAudio = () => {
      if (analyser) return
      audioCtx = new (window.AudioContext ||
        (window as any).webkitAudioContext)()
      const src = audioCtx.createMediaElementSource(audio)
      analyser = audioCtx.createAnalyser()
      analyser.fftSize = 64
      src.connect(analyser)
      analyser.connect(audioCtx.destination)
      freqData = new Uint8Array(analyser.frequencyBinCount)
    }

    const onPlay = () => {
      setupAudio()
      audioCtx?.resume()
    }
    audio.addEventListener('play', onPlay)

    let raf = 0
    let t0 = performance.now()
    let entryScale = 0.01
    const animate = () => {
      raf = requestAnimationFrame(animate)
      const t = (performance.now() - t0) * 0.001

      // entry elastic-ish ease-out toward 1
      entryScale += (1 - entryScale) * 0.05

      // audio-driven intensity
      let bass = 0.3
      if (analyser && freqData) {
        analyser.getByteFrequencyData(freqData)
        let sum = 0
        for (let i = 0; i < freqData.length; i++) sum += freqData[i]
        bass = sum / (freqData.length * 255)
      }
      const pulse = entryScale * (1 + Math.sin(t * 2.6) * 0.05 + bass * 0.4)
      heart.scale.setScalar(pulse)
      heart.rotation.y = t * 0.4
      heartMat.opacity = 0.85 + bass * 0.3

      const arr = haloGeo.attributes.position.array as Float32Array
      for (let i = 0; i < halo; i++) {
        haloAng[i] += haloSpeed[i] * (1 + bass * 1.4)
        const r = haloRadii[i] * (0.95 + bass * 0.2)
        arr[i * 3] = Math.cos(haloAng[i]) * r
        arr[i * 3 + 1] = Math.sin(haloAng[i]) * r * 0.8 + haloTilt[i]
        arr[i * 3 + 2] = Math.sin(haloAng[i] * 2 + i) * 4
      }
      haloGeo.attributes.position.needsUpdate = true
      haloPts.rotation.z = t * 0.1

      camera.position.x = Math.sin(t * 0.3) * 6
      camera.position.y = Math.cos(t * 0.25) * 3
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
      window.removeEventListener('resize', onResize)
      audio.removeEventListener('play', onPlay)
      audio.pause()
      audio.src = ''
      audioCtx?.close()
      heartGeo.dispose()
      heartMat.dispose()
      haloGeo.dispose()
      haloMat.dispose()
      renderer.dispose()
      try {
        mount.removeChild(renderer.domElement)
      } catch {}
    }
  }, [])

  const togglePlay = () => {
    const a = audioRef.current
    if (!a) return
    if (playing) {
      a.pause()
      setPlaying(false)
    } else {
      a.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  return (
    <FeatureOverlay background="#16000a">
      <div ref={ref} style={{ position: 'absolute', inset: 0 }} />
      <button
        type="button"
        onClick={togglePlay}
        style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          border: '1px solid rgba(255,255,255,0.3)',
          color: 'white',
          padding: '10px 22px',
          borderRadius: 100,
          cursor: 'pointer',
          fontSize: 15,
          zIndex: 5,
        }}
      >
        {playing ? '❚❚ pause our song' : '▶ play our song'}
      </button>
      <div
        style={{
          ...featureCaption,
          bottom: 36,
          fontSize: 'clamp(0.95rem, 2vw, 1.2rem)',
          color: '#ffdada',
        }}
      >
        this song makes me think of you
      </div>
    </FeatureOverlay>
  )
}
