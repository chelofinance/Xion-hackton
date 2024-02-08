import { type MeshProps, useFrame, useThree, extend } from '@react-three/fiber';
import { forwardRef, useRef } from 'react';
import THREE, { Mesh, Vector3 } from 'three';

extend({ Mesh });

const TorusMeshForwarder = (props: MeshProps) => {
  const meshRef = useRef<Mesh>(null);
  // const viewport = useThree((state) => state.viewport);
  const meshScale = new Vector3(0.3, 0.3, 0.3);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta / 4;
      meshRef.current.rotation.y += delta / 4;
    }
  });

  return (
    <mesh ref={meshRef} {...props} scale={meshScale}>
      <torusGeometry args={[10, 4, 20, 100]} />

      {/** @see https://threejs.org/docs/#api/en/materials/MeshPhongMaterial performance */}
      <meshPhongMaterial flatShading={true} />
    </mesh>
  );
};

const TorusMesh = forwardRef(TorusMeshForwarder);

export default TorusMesh;
