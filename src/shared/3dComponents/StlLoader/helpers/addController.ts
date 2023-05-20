import { Dispatch, SetStateAction } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export const AddController = (
    containerRef: React.RefObject<HTMLDivElement>,
    setObtainControlls: Dispatch<SetStateAction<OrbitControls>>,
    camera: THREE.PerspectiveCamera,
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

