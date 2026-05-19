import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  void main() {
    vec2 uv = vUv;
    float n = noise(uv * 3.0 + uTime * 0.08);
    n += noise(uv * 6.0 - uTime * 0.05) * 0.5;
    n *= 0.67;
    vec3 purple = vec3(0.42, 0.30, 0.90);
    vec3 teal = vec3(0.43, 0.83, 0.77);
    vec3 col = mix(purple, teal, n);
    gl_FragColor = vec4(col, n * 0.18);
  }
`;

function NebulaMesh() {
  const ref = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh>
      <planeGeometry args={[10, 10]} />
      <shaderMaterial ref={ref} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} transparent depthWrite={false} />
    </mesh>
  );
}

export default function NebulaBackground() {
  return (
    <div className="absolute inset-0 z-0 opacity-80">
      <Canvas camera={{ position: [0, 0, 5] }} dpr={[1, 1]} style={{ background: 'transparent' }} gl={{ alpha: true, antialias: false }}>
        <NebulaMesh />
      </Canvas>
    </div>
  );
}
