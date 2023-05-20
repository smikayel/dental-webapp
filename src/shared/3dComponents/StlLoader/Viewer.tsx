import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// import * from '

const Viewer = ({ stlUrl = '../../../assets/models/JawModel/Jaw.stl' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create a scene
    const scene = new THREE.Scene();

    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create a STL loader
    const loader = new STLLoader();
    loader.load(stlUrl, geometry => {
      // Create a material
      const material = new THREE.MeshNormalMaterial();

      // Create a mesh and add it to the scene
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Render the scene
      renderer.render(scene, camera);
    });

    // Clean up on unmount
    return () => {
      container.removeChild(renderer.domElement);
    };
  }, [stlUrl]);

  return ( 
      <>
        <div>Hello</div>
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </>
    )
};

export default Viewer;
