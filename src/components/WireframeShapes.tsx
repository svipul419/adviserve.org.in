import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

function WireframeShape({ geometry, position, rotationSpeed }: {
  geometry: 'icosahedron' | 'torus' | 'octahedron';
  position: [number, number, number];
  rotationSpeed: [number, number, number];
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.x += rotationSpeed[0];
    ref.current.rotation.y += rotationSpeed[1];
    ref.current.rotation.z += rotationSpeed[2];
  });

  const geo = {
    icosahedron: <icosahedronGeometry args={[1.5, 0]} />,
    torus: <torusGeometry args={[1.2, 0.3, 8, 16]} />,
    octahedron: <octahedronGeometry args={[1.2, 0]} />,
  };

  return (
    <mesh ref={ref} position={position}>
      {geo[geometry]}
      <meshBasicMaterial color="#7F1D1D" wireframe transparent opacity={0.12} />
    </mesh>
  );
}

export default function WireframeShapes() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <WireframeShape geometry="icosahedron" position={[4, 1.5, 0]} rotationSpeed={[0.002, 0.003, 0.001]} />
        <WireframeShape geometry="torus" position={[-3.5, -1, -2]} rotationSpeed={[0.001, -0.002, 0.002]} />
        <WireframeShape geometry="octahedron" position={[1, -2.5, -3]} rotationSpeed={[-0.002, 0.001, -0.001]} />
      </Canvas>
    </div>
  );
}
