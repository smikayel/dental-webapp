import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import * as THREE from 'three';
import { STLLoader as Loader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // Import OrbitControls
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

import { AddController } from './helpers/addController';
import { rendererStl } from './helpers/renderStl';

import styles from './style.module.css'
import { createAnimate } from './helpers/animate';
import { defaultWhiteTexutre } from '../cosntants';

const textureLoader = new THREE.TextureLoader();
const loader = new Loader();

const Viewer = ({
    stlUrl = 'assets/models/JawModel/Jaw.stl',
    width = window.innerWidth,
    height = window.innerHeight 
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scene, setScene] = useState<THREE.Scene>()
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer>()
  const [camera, setCamera] = useState<THREE.PerspectiveCamera>()
  const [transformControls, setTransformControls] = useState<TransformControls>();
  const [orbitControls, setOrbitControls] = useState<SetStateAction<OrbitControls>>()
  
  // create configure scene
  useEffect(() => {
    const scene = new THREE.Scene();
    setScene(scene);

		const camera = new THREE.PerspectiveCamera(750, width / height, 10, 100000);
    setCamera(camera);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
		setRenderer(renderer);
	}, []);

  useEffect(() => {
		if (renderer && camera && scene) {
			setTransformControls(new TransformControls(camera, renderer.domElement));
			renderer.setSize(width, height);
			setOrbitControls(new OrbitControls(camera, renderer.domElement));

			if (containerRef.current) (containerRef.current as any).appendChild(renderer.domElement);
			const animate = createAnimate(scene, camera, renderer);
			camera.position.z = 350;
			animate.animate();

			rendererStl(stlUrl, scene, textureLoader, loader, defaultWhiteTexutre);
		}
	}, [renderer, camera, scene]);


  return ( 
      <>
        <div ref={containerRef} style={{ width: width, height: height }} className={styles.Viewer}/>
      </>
    )
};

export default Viewer;
