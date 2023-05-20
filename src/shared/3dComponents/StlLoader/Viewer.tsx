import { STLLoader as Loader } from 'three/examples/jsm/loaders/STLLoader';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // Import OrbitControls
import * as THREE from 'three';
import styles from './style.module.css'

const rendererStl = (
  containerRef: React.RefObject<HTMLDivElement>,
  stlUrl: string,
  setCamera:  Dispatch<SetStateAction<THREE.PerspectiveCamera | undefined>>
) => {
  const loader = new Loader();
  const container = containerRef.current;
  if (!container) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 15000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  loader.load(stlUrl, geometry => {
    console.log(stlUrl)
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    renderer.render(scene, camera);
  });

  setCamera(camera)
  return () => {
    container.removeChild(renderer.domElement);
  };
}

const AddController = (
  containerRef: React.RefObject<HTMLDivElement>,
  setObtainControlls: Dispatch<SetStateAction<OrbitControls>>,
  camera?: THREE.PerspectiveCamera,
) => {

  const container = containerRef.current;
  if (!container || !camera) return 
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Create OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();
  setObtainControlls(controls)
}

const Viewer = ({ stlUrl = 'assets/models/JawModel/Jaw.stl', width = window.innerWidth, height = window.innerHeight }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera>()
  const [obtainControlls, setObtainControlls] = useState<SetStateAction<OrbitControls>>()

  useEffect(() => {
    // load and render Jaw model
    rendererStl(containerRef, stlUrl, setCamera)
    // load controller
    AddController(containerRef, setObtainControlls, camera)
  }, [stlUrl]);

  return ( 
      <>
        <div ref={containerRef} style={{ width: width, height: height }} className={styles.Viewer}/>
      </>
    )
};

export default Viewer;
