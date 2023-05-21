import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import * as THREE from 'three';
import { STLLoader as Loader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // Import OrbitControls
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

import { AddController } from './helpers/addController';
import { rendererStl } from './helpers/renderStl';

import styles from './style.module.css'
import { createAnimate } from './helpers/animate';
import { STATIC_MODELS, defaultWhiteTexutre } from '../cosntants';

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
  const [screwModels, setScrewModels] = useState<THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[]>[]>([])
  const [transformControls, setTransformControls] = useState<TransformControls>();
  const [orbitControls, setOrbitControls] = useState<SetStateAction<OrbitControls>>()


  // create scene
  useEffect(() => {
    const scene = new THREE.Scene();
    setScene(scene);

		const camera = new THREE.PerspectiveCamera(750, width / height, 10, 100000);
    setCamera(camera);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
		setRenderer(renderer);
	}, []);

  // configure scene
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
      renderer.domElement.addEventListener('dblclick', addScrew);
		}
	}, [renderer, camera, scene]);


  // mouse events
  const addScrew = (event: MouseEvent) => {
    if (!scene || !camera || !renderer) return
    event.preventDefault();
    const mouse = new THREE.Vector2(
      (event.clientX / width) * 2 - 1,
      -(event.clientY / height) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
      const intersect = intersects[0];
      const position = new THREE.Vector3().copy(intersect.point);
      const rotation = new THREE.Euler();

      // Load and add screw
      const ScrewModel = STATIC_MODELS.SCREW;
      const newScrew = rendererStl(ScrewModel, scene, textureLoader, loader, defaultWhiteTexutre, position, rotation);
      if (newScrew) {
        setScrewModels(prevScrews => [...prevScrews, newScrew])
      } else {
        //TODO: solve issue with tracking model now all models are undefined
        console.log('model loadin issue!')
      }
    }
  }

  // orbit controller
	useEffect(() => {
		if (!orbitControls) return
    (orbitControls as OrbitControls).maxDistance = 450;
    (orbitControls as OrbitControls).minDistance = 125;

	}, [orbitControls]);

  return ( 
      <>
        <div ref={containerRef} style={{ width: width, height: height }} className={styles.Viewer}/>
      </>
    )
};

export default Viewer;
