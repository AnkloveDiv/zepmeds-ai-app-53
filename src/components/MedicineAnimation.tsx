
import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, PresentationControls, Environment, Float } from "@react-three/drei";
import { Group } from "three";

function PillModel({ ...props }) {
  // We'll simulate a pill model since we don't have an actual model
  return (
    <group {...props}>
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[0.5, 1.5, 8, 16]} />
        <meshStandardMaterial color="#2f32bd" />
      </mesh>
    </group>
  );
}

function MedicineBottle({ ...props }) {
  const groupRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });
  
  return (
    <group ref={groupRef} {...props}>
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1, 2.5, 32]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.7} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.8, 1, 0.3, 32]} />
        <meshStandardMaterial color="#2f32bd" />
      </mesh>
      
      {/* Pills inside */}
      <PillModel position={[0.3, 0, 0.3]} rotation={[Math.PI / 6, 0, Math.PI / 4]} />
      <PillModel position={[-0.3, 0.2, -0.3]} rotation={[Math.PI / 3, Math.PI / 6, 0]} />
      <PillModel position={[0, -0.3, 0]} rotation={[0, 0, Math.PI / 2]} />
    </group>
  );
}

const MedicineAnimation = () => {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
      <color attach="background" args={['#050816']} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
      <pointLight position={[-10, -10, -10]} />
      
      <PresentationControls
        global
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 4, Math.PI / 4]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
        config={{ mass: 2, tension: 400 }}
        snap={{ mass: 4, tension: 400 }}
      >
        <Float rotationIntensity={0.5} floatIntensity={1} speed={2}>
          <MedicineBottle position={[0, 0, 0]} scale={[1, 1, 1]} />
        </Float>
      </PresentationControls>
      
      <Environment preset="city" />
    </Canvas>
  );
};

export default MedicineAnimation;
