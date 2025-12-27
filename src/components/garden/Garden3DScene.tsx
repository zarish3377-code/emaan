import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
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
const GrassBlade = ({ position, delay }: { position: [number, number, number]; delay: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialRotation = useMemo(() => Math.random() * 0.3 - 0.15, []);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + delay;
      meshRef.current.rotation.z = initialRotation + Math.sin(time * 1.5) * 0.1;
    }
  });

  const height = 0.15 + Math.random() * 0.2;
  
  return (
    <mesh ref={meshRef} position={position}>
      <coneGeometry args={[0.02, height, 4]} />
      <meshStandardMaterial color="#4a9e64" />
    </mesh>
  );
};

// Grass field with many blades
const GrassField = ({ count = 500 }: { count?: number }) => {
  const positions = useMemo(() => {
    const pos: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const z = Math.random() * 8 - 2;
      pos.push([x, 0, z]);
    }
    return pos;
  }, [count]);

  return (
    <group>
      {positions.map((pos, i) => (
        <GrassBlade key={i} position={pos} delay={i * 0.01} />
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
        scaleRef.current = Math.min(scaleRef.current + 0.02, 1);
      }
      
      // Gentle swaying
      const time = state.clock.elapsedTime + swayOffset;
      groupRef.current.rotation.z = Math.sin(time * 0.8) * 0.08;
      groupRef.current.scale.setScalar(scaleRef.current * flower.scale * 0.8);
    }
  });

  // Convert percentage position to 3D world position
  const x = ((flower.x - 50) / 50) * 10;
  const z = ((flower.y - 50) / 50) * 6;
  
  if (!texture) return null;

  return (
    <group ref={groupRef} position={[x, 0.5, z]}>
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        <mesh>
          <planeGeometry args={[1, 1.5]} />
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

// 3D Sun
const Sun = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[6, 5, -8]}>
      <sphereGeometry args={[1.2, 32, 32]} />
      <meshBasicMaterial color="#fdd835" />
      <pointLight color="#fff9c4" intensity={2} distance={50} />
    </mesh>
  );
};

// 3D Moon with craters
const Moon = () => {
  return (
    <group position={[6, 4, -8]}>
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#fffde7" emissive="#fffde7" emissiveIntensity={0.3} />
      </mesh>
      <pointLight color="#fffde7" intensity={0.5} distance={30} />
    </group>
  );
};

// Twinkling stars
const Stars = ({ count = 100 }: { count?: number }) => {
  const starsRef = useRef<THREE.Points>(null);
  
  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const scl = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = 3 + Math.random() * 6;
      pos[i * 3 + 2] = -10 - Math.random() * 5;
      scl[i] = Math.random();
    }
    return [pos, scl];
  }, [count]);

  useFrame((state) => {
    if (starsRef.current) {
      const time = state.clock.elapsedTime;
      const material = starsRef.current.material as THREE.PointsMaterial;
      material.opacity = 0.6 + Math.sin(time * 2) * 0.2;
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
      <pointsMaterial size={0.1} color="#ffffff" transparent opacity={0.8} sizeAttenuation />
    </points>
  );
};

// Ground plane with gradient texture
const Ground = ({ timeOfDay }: { timeOfDay: 'day' | 'night' }) => {
  const groundColor = timeOfDay === 'day' ? '#5BB374' : '#1a3a26';
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 2]} receiveShadow>
      <planeGeometry args={[25, 15]} />
      <meshStandardMaterial color={groundColor} />
    </mesh>
  );
};

// Sky dome
const Sky = ({ timeOfDay }: { timeOfDay: 'day' | 'night' }) => {
  const skyColor = timeOfDay === 'day' ? '#87CEEB' : '#1a1a2e';
  
  return (
    <mesh position={[0, 0, -12]}>
      <planeGeometry args={[50, 20]} />
      <meshBasicMaterial color={skyColor} />
    </mesh>
  );
};

const Garden3DScene = ({ flowers, timeOfDay, tulipTexture, daisyTexture }: Garden3DSceneProps) => {
  // Determine which flowers are "new" (planted within last 5 seconds)
  const now = Date.now();
  
  return (
    <Canvas
      camera={{ position: [0, 3, 8], fov: 50 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={timeOfDay === 'day' ? 0.6 : 0.2} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={timeOfDay === 'day' ? 1 : 0.3}
        castShadow
      />
      
      {/* Sky background */}
      <Sky timeOfDay={timeOfDay} />
      
      {/* Sun or Moon */}
      {timeOfDay === 'day' ? <Sun /> : (
        <>
          <Moon />
          <Stars />
        </>
      )}
      
      {/* Ground */}
      <Ground timeOfDay={timeOfDay} />
      
      {/* Grass blades */}
      <GrassField count={400} />
      
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
