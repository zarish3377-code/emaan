import { useRef, useMemo } from 'react';
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

// Animated grass blade component
const GrassBlade = ({ position, delay, timeOfDay }: { position: [number, number, number]; delay: number; timeOfDay: 'day' | 'night' }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialRotation = useMemo(() => Math.random() * 0.3 - 0.15, []);
  const height = useMemo(() => 0.2 + Math.random() * 0.3, []);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + delay;
      meshRef.current.rotation.z = initialRotation + Math.sin(time * 1.5) * 0.1;
    }
  });

  const grassColor = timeOfDay === 'day' ? '#4a9e64' : '#1a4a2e';
  
  return (
    <mesh ref={meshRef} position={position}>
      <coneGeometry args={[0.03, height, 4]} />
      <meshStandardMaterial color={grassColor} />
    </mesh>
  );
};

// Grass field with many blades
const GrassField = ({ count = 600, timeOfDay }: { count?: number; timeOfDay: 'day' | 'night' }) => {
  const positions = useMemo(() => {
    const pos: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 24;
      const z = Math.random() * 10 - 3; // -3 to 7
      pos.push([x, 0, z]);
    }
    return pos;
  }, [count]);

  return (
    <group>
      {positions.map((pos, i) => (
        <GrassBlade key={i} position={pos} delay={i * 0.01} timeOfDay={timeOfDay} />
      ))}
    </group>
  );
};

// Animated flower with bloom effect
const FlowerSprite = ({ 
  flower, 
  texture, 
  isNew 
}: { 
  flower: Flower; 
  texture: THREE.Texture | null;
  isNew: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const scaleRef = useRef(isNew ? 0 : 1);
  const swayOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Bloom animation
      if (scaleRef.current < 1) {
        scaleRef.current = Math.min(scaleRef.current + 0.015, 1);
      }
      
      // Gentle swaying
      const time = state.clock.elapsedTime + swayOffset;
      groupRef.current.rotation.z = Math.sin(time * 0.8) * 0.06;
      groupRef.current.scale.setScalar(scaleRef.current * flower.scale * 1.2);
    }
  });

  // Convert percentage position to 3D world position
  // x: 5-95% maps to -10 to 10
  // y: 45-95% maps to z 5 to 0 (closer flowers in front)
  const x = ((flower.x - 50) / 50) * 10;
  const z = 5 - ((flower.y - 45) / 50) * 5;
  
  if (!texture) return null;

  return (
    <group ref={groupRef} position={[x, 0.8, z]}>
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        <mesh>
          <planeGeometry args={[1.2, 1.8]} />
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

// 3D Sun with glow
const Sun = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={[8, 6, -15]}>
      {/* Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial color="#fff9c4" transparent opacity={0.3} />
      </mesh>
      {/* Sun core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#fdd835" />
      </mesh>
      <pointLight color="#fff9c4" intensity={2} distance={50} />
    </group>
  );
};

// 3D Moon with glow
const Moon = () => {
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (glowRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime) * 0.05;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={[8, 5, -15]}>
      {/* Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial color="#fffde7" transparent opacity={0.2} />
      </mesh>
      {/* Moon */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#fffde7" emissive="#fffde7" emissiveIntensity={0.4} />
      </mesh>
      <pointLight color="#fffde7" intensity={0.6} distance={40} />
    </group>
  );
};

// Twinkling stars
const Stars = ({ count = 150 }: { count?: number }) => {
  const starsRef = useRef<THREE.Points>(null);
  
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
    if (starsRef.current) {
      const material = starsRef.current.material as THREE.PointsMaterial;
      material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.15} color="#ffffff" transparent opacity={0.8} sizeAttenuation />
    </points>
  );
};

// Ground plane
const Ground = ({ timeOfDay }: { timeOfDay: 'day' | 'night' }) => {
  const groundColor = timeOfDay === 'day' ? '#5BB374' : '#1a3a26';
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 2]} receiveShadow>
      <planeGeometry args={[30, 20]} />
      <meshStandardMaterial color={groundColor} />
    </mesh>
  );
};

// Sky background
const Sky = ({ timeOfDay }: { timeOfDay: 'day' | 'night' }) => {
  const skyColor = timeOfDay === 'day' ? '#87CEEB' : '#0f1629';
  const horizonColor = timeOfDay === 'day' ? '#B0E0E6' : '#16213e';
  
  return (
    <group>
      {/* Sky backdrop */}
      <mesh position={[0, 5, -20]}>
        <planeGeometry args={[60, 25]} />
        <meshBasicMaterial color={skyColor} />
      </mesh>
      {/* Horizon gradient layer */}
      <mesh position={[0, 0, -18]}>
        <planeGeometry args={[60, 10]} />
        <meshBasicMaterial color={horizonColor} transparent opacity={0.7} />
      </mesh>
    </group>
  );
};

// Fluffy clouds for daytime
const Cloud = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const speed = useMemo(() => 0.1 + Math.random() * 0.1, []);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * speed) * 2;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
      <mesh position={[0.6, -0.1, 0]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
      <mesh position={[-0.5, -0.1, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
    </group>
  );
};

const Garden3DScene = ({ flowers, timeOfDay, tulipTexture, daisyTexture }: Garden3DSceneProps) => {
  const now = Date.now();
  
  return (
    <Canvas
      camera={{ position: [0, 4, 10], fov: 45 }}
      style={{ position: 'absolute', inset: 0 }}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={[timeOfDay === 'day' ? '#87CEEB' : '#0f1629']} />
      
      <ambientLight intensity={timeOfDay === 'day' ? 0.7 : 0.25} />
      <directionalLight 
        position={[5, 8, 5]} 
        intensity={timeOfDay === 'day' ? 1.2 : 0.4}
        castShadow
      />
      
      {/* Sky background */}
      <Sky timeOfDay={timeOfDay} />
      
      {/* Sun or Moon */}
      {timeOfDay === 'day' ? (
        <>
          <Sun />
          <Cloud position={[-6, 5, -12]} />
          <Cloud position={[3, 6, -14]} />
          <Cloud position={[-2, 4, -10]} />
        </>
      ) : (
        <>
          <Moon />
          <Stars count={200} />
        </>
      )}
      
      {/* Ground */}
      <Ground timeOfDay={timeOfDay} />
      
      {/* Grass blades */}
      <GrassField count={500} timeOfDay={timeOfDay} />
      
      {/* Flowers */}
      {flowers.map((flower) => {
        const plantedTime = new Date(flower.plantedAt).getTime();
        const isNew = now - plantedTime < 5000;
        
        return (
          <FlowerSprite
            key={flower.id}
            flower={flower}
            texture={flower.type === 'tulip' ? tulipTexture : daisyTexture}
            isNew={isNew}
          />
        );
      })}
    </Canvas>
  );
};

export default Garden3DScene;
