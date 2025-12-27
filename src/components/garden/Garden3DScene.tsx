import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import * as THREE from 'three';

interface Flower {
  id: string;
  type: 'tulip' | 'daisy';
  x: number;
  y: number;
  scale: number;
  rotation: number;
  plantedAt: string;
}

interface Garden3DSceneProps {
  flowers: Flower[];
  timeOfDay: 'day' | 'night';
  tulipTexture: THREE.Texture | null;
  daisyTexture: THREE.Texture | null;
}

const worldXFromPct = (pct: number) => ((pct - 50) / 50) * 10; // -10..10
const worldZFromPct = (pct: number) => 5 - ((pct - 45) / 50) * 5; // 5..0

// ---------- Lightweight grass (instanced, mostly static) ----------
const InstancedGrass = ({ count, timeOfDay }: { count: number; timeOfDay: 'day' | 'night' }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const { positions, heights, rotations } = useMemo(() => {
    const positions: [number, number, number][] = [];
    const heights: number[] = [];
    const rotations: number[] = [];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 24;
      const z = Math.random() * 10 - 3; // -3..7
      positions.push([x, 0, z]);
      heights.push(0.15 + Math.random() * 0.25);
      rotations.push(Math.random() * Math.PI * 2);
    }

    return { positions, heights, rotations };
  }, [count]);

  useEffect(() => {
    if (!meshRef.current) return;

    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const [x, y, z] = positions[i];
      dummy.position.set(x, y, z);
      dummy.rotation.y = rotations[i];
      dummy.scale.set(1, heights[i], 1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count, positions, heights, rotations]);

  const grassColor = timeOfDay === 'day' ? '#4a9e64' : '#1a4a2e';

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <coneGeometry args={[0.03, 1, 4]} />
      <meshStandardMaterial color={grassColor} />
    </instancedMesh>
  );
};

// A small set of animated blades to keep the scene "alive" without killing WebGL.
const SwayGrass = ({ count, timeOfDay }: { count: number; timeOfDay: 'day' | 'night' }) => {
  const groupRef = useRef<THREE.Group>(null);
  const blades = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      key: i,
      x: (Math.random() - 0.5) * 22,
      z: Math.random() * 9 - 2.5,
      h: 0.25 + Math.random() * 0.35,
      sway: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const blade = blades[i];
      if (!blade) return;
      child.rotation.z = Math.sin(t * 1.2 + blade.sway) * 0.12;
    });
  });

  const grassColor = timeOfDay === 'day' ? '#57ad73' : '#1f5a36';

  return (
    <group ref={groupRef}>
      {blades.map((b) => (
        <mesh key={b.key} position={[b.x, 0, b.z]}>
          <coneGeometry args={[0.035, b.h, 4]} />
          <meshStandardMaterial color={grassColor} />
        </mesh>
      ))}
    </group>
  );
};

// ---------- Flowers (billboard sprites) ----------
const FlowerSprite = ({ flower, texture }: { flower: Flower; texture: THREE.Texture | null }) => {
  const groupRef = useRef<THREE.Group>(null);
  const swayOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  // Bloom is based on plantedAt; prevents "pop in" and looks like a gentle reveal.
  useFrame((state) => {
    if (!groupRef.current) return;

    const plantedTime = new Date(flower.plantedAt).getTime();
    const ageMs = Date.now() - plantedTime;
    const bloom = THREE.MathUtils.clamp(ageMs / 2500, 0, 1);
    const eased = bloom * bloom * (3 - 2 * bloom); // smoothstep

    const t = state.clock.elapsedTime + swayOffset;
    groupRef.current.rotation.z = Math.sin(t * 0.9) * 0.05;
    groupRef.current.scale.setScalar((0.9 + eased * 0.3) * flower.scale);
  });

  if (!texture) return null;

  const x = worldXFromPct(flower.x);
  const z = worldZFromPct(flower.y);

  return (
    <group ref={groupRef} position={[x, 0.85, z]}>
      <Billboard>
        <mesh>
          <planeGeometry args={[1.25, 1.9]} />
          <meshStandardMaterial
            map={texture}
            transparent
            alphaTest={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Billboard>
    </group>
  );
};

// ---------- Sky bodies ----------
const Sun = () => (
  <group position={[8, 6, -15]}>
    <mesh>
      <sphereGeometry args={[1.4, 24, 24]} />
      <meshBasicMaterial color="#fdd835" />
    </mesh>
    <mesh>
      <sphereGeometry args={[2.4, 24, 24]} />
      <meshBasicMaterial color="#fff9c4" transparent opacity={0.22} />
    </mesh>
    <pointLight color="#fff9c4" intensity={1.6} distance={50} />
  </group>
);

const Moon = () => (
  <group position={[8, 5.5, -15]}>
    <mesh>
      <sphereGeometry args={[0.95, 24, 24]} />
      <meshStandardMaterial color="#fffde7" emissive="#fffde7" emissiveIntensity={0.35} />
    </mesh>
    <mesh>
      <sphereGeometry args={[1.8, 24, 24]} />
      <meshBasicMaterial color="#fffde7" transparent opacity={0.16} />
    </mesh>
    <pointLight color="#fffde7" intensity={0.6} distance={45} />
  </group>
);

const Stars = ({ count }: { count: number }) => {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = 2 + Math.random() * 8;
      pos[i * 3 + 2] = -15 - Math.random() * 10;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const m = ref.current.material as THREE.PointsMaterial;
    m.opacity = 0.55 + Math.sin(state.clock.elapsedTime * 1.8) * 0.25;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.14} color="#ffffff" transparent opacity={0.8} sizeAttenuation />
    </points>
  );
};

const Ground = ({ timeOfDay }: { timeOfDay: 'day' | 'night' }) => {
  const groundColor = timeOfDay === 'day' ? '#5BB374' : '#1a3a26';
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 2]} receiveShadow>
      <planeGeometry args={[30, 20]} />
      <meshStandardMaterial color={groundColor} />
    </mesh>
  );
};

// ---------- Main ----------
const Garden3DScene = ({ flowers, timeOfDay, tulipTexture, daisyTexture }: Garden3DSceneProps) => {
  const [contextLost, setContextLost] = useState(false);

  // If the GPU context dies (common on mobile or heavy scenes), show a graceful fallback.
  const onCreated = ({ gl }: { gl: THREE.WebGLRenderer }) => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const canvas = gl.domElement;
    const lost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };

    canvas.addEventListener('webglcontextlost', lost as EventListener, false);
  };

  if (contextLost) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="font-serif text-white/90">Your device paused the 3D garden — reopening should restore it.</p>
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 4, 10], fov: 45 }}
      style={{ position: 'absolute', inset: 0 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: 'low-power' }}
      onCreated={onCreated}
    >
      <color attach="background" args={[timeOfDay === 'day' ? '#87CEEB' : '#0f1629']} />

      <ambientLight intensity={timeOfDay === 'day' ? 0.7 : 0.25} />
      <directionalLight position={[5, 8, 5]} intensity={timeOfDay === 'day' ? 1.15 : 0.4} />

      {timeOfDay === 'day' ? <Sun /> : (
        <>
          <Moon />
          <Stars count={140} />
        </>
      )}

      <Ground timeOfDay={timeOfDay} />

      {/* Lightweight grass */}
      <InstancedGrass count={320} timeOfDay={timeOfDay} />
      <SwayGrass count={60} timeOfDay={timeOfDay} />

      {/* Flowers */}
      {flowers.map((flower) => (
        <FlowerSprite
          key={flower.id}
          flower={flower}
          texture={flower.type === 'tulip' ? tulipTexture : daisyTexture}
        />
      ))}
    </Canvas>
  );
};

export default Garden3DScene;
