import { useHomeMode, FeatureKey } from './useHomeMode'
import ParticleHeart from './features/ParticleHeart'
import Fireworks from './features/Fireworks'
import CrystalHeart from './features/CrystalHeart'
import CanvasPulse from './features/CanvasPulse'
import FlowerBloom from './features/FlowerBloom'
import FallingHearts from './features/FallingHearts'
import ParticleField from './features/ParticleField'
import ButterflyParallax from './features/ButterflyParallax'
import NightSky from './features/NightSky'

const FEATURES: Record<FeatureKey, () => JSX.Element> = {
  'particle-heart': ParticleHeart,
  fireworks: Fireworks,
  'crystal-heart': CrystalHeart,
  'canvas-pulse': CanvasPulse,
  'flower-bloom': FlowerBloom,
  'falling-hearts': FallingHearts,
  'particle-field': ParticleField,
  'butterfly-parallax': ButterflyParallax,
  'night-sky': NightSky,
}

export default function FeaturePlaceholder() {
  const { activeFeature } = useHomeMode()
  if (!activeFeature) return null
  const Comp = FEATURES[activeFeature]
  return <Comp />
}
