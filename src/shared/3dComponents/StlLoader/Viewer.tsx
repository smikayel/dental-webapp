import { Children, SetStateAction, useContext, useEffect, useRef, useState } from 'react';

import * as THREE from 'three';
import { MOUSE } from 'three';

import { STLLoader as Loader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // Import OrbitControls
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

import { rendererStl } from './helpers/renderStl';
import { createAnimate } from './helpers/animate';

import { SCENE_BACKGROUND_COLOR, SCREW_CONFIGURE, STATIC_MODELS, WINGS, WINGS_SEARCHABLE_OBJECT, defaultWhiteTexutre } from '../cosntants';

import styles from './style.module.css'
import { SideBar } from '../../components/SideBar';
import { WingContext } from '../../Contexts/ChoosedWingsContext/provider';
import { WingType, renderScrewWithWing } from './helpers/renderScrewWithWing';
import { addWingOnSelectedScre } from './helpers/addWingOnSelectedScre';
import { getAxis } from './helpers/getAxis';

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

  const [selectedModel, setSelectedModel] = useState<THREE.Mesh | undefined>()
  const [orbitControls, setOrbitControls] = useState<SetStateAction<OrbitControls>>()  
  const { choosedWingType } = useContext(WingContext);
  
  const screwModelsRef = useRef(screwModels);
  const choosedWingTypeRef = useRef(choosedWingType);
  const selectedModelRef = useRef(selectedModel)


  // mouse events
  const addScrewOrWing = (event: MouseEvent) => {
    if (!scene || !camera || !renderer) return
    event.preventDefault();
    const mouse = new THREE.Vector2(
      (event.clientX / width) * 2 - 1,
      -(event.clientY / height) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    // intersect with Jaw model (core model in scene )
    const intersects = raycaster.intersectObjects([scene.children[0]], true);
    const intersectsWithScrew = raycaster.intersectObjects(screwModelsRef.current, true);

    if (intersects.length > 0) {
      const intersect = intersects[0];
      const position = new THREE.Vector3().copy(intersect.point);
      const rotation = SCREW_CONFIGURE.rotation
      
      // Load and add screw (choosedWingType will give correct wing)
      const ScrewModel = STATIC_MODELS.SCREW;
      if (choosedWingTypeRef.current === WINGS[0].name) {
        rendererStl(ScrewModel, scene, textureLoader, loader, defaultWhiteTexutre, position, rotation, setScrewModels, setSelectedModel);
      } else {
        // add element with wing 
        renderScrewWithWing(
          choosedWingTypeRef.current as WingType,
          scene,
          textureLoader,
          loader,
          defaultWhiteTexutre,
          position,
          rotation,
          setScrewModels,
          setSelectedModel
        );
      }
    }   
  }
  
  const onMouseMove = function () {
    if (!camera || !selectedModelRef.current) return
    console.log(getAxis(camera, selectedModelRef.current))
  }

  const reselectOrReset = (event: MouseEvent) => {
    if (!scene || !camera || !renderer) return
    event.preventDefault();
    const mouse = new THREE.Vector2(
      (event.clientX / width) * 2 - 1,
      -(event.clientY / height) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    // intersect with Jaw model (core model in scene )
    const intersects = raycaster.intersectObjects(screwModelsRef.current, true);
    if (intersects.length > 0) {
      // understanding is it the screw or the screw with wing 
      const intersectedObject = intersects[0].object as THREE.Mesh
      // selection 
      if (intersectedObject.parent?.uuid === scene.uuid) {
        if (intersectedObject === selectedModelRef.current) {
          addWingOnSelectedScre(
            choosedWingTypeRef.current as WingType,
            intersectedObject,
            textureLoader,
            loader,
            defaultWhiteTexutre
          );
          return 
        }
        setSelectedModel(intersectedObject) // choosed the screw 
      } else {
        setSelectedModel(intersectedObject.parent as THREE.Mesh) // choosed the wing need to give the parrent screw for slection
      }
    } else {
      setSelectedModel(undefined)
      // TODO: add new controller
    }
  };

  const transformControlsDraging = (event: any) => {
    (orbitControls as OrbitControls).enabled = !event.value
  }

  // keyboard events
  const keyEvenets = (event: KeyboardEvent) => {
    console.log(event.key)
    switch(event.key) {
      case 'd':
      case 'Delete':
        if (!selectedModelRef.current) return
        if (!selectedModelRef.current.children.length) {
          // TODO: add new controller
          scene?.remove(selectedModelRef.current)
        } else {
          selectedModelRef.current.remove(selectedModelRef.current.children[0])
        }
        break
      case 'r':
        console.log('')
        // TODO: add new controller change mode
        // if (transformControlsRef?.current?.mode === 'translate') {
        //   transformControlsRef?.current?.setMode('rotate');
        // } else {
        //   transformControlsRef?.current?.setMode('translate');
        // }
    }
  }


  // create scene
  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(SCENE_BACKGROUND_COLOR);
    setScene(scene);
		const camera = new THREE.PerspectiveCamera(750, width / height, 10, 100000);
    setCamera(camera);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
		setRenderer(renderer);
	}, [width , height]);


  
  // configure scene
  useEffect(() => {
		if (renderer && camera && scene) {


      // setTransformControls(transformControls);
      // TODO: add new controller
      
			renderer.setSize(width, height);
      const newOrbitControls = new OrbitControls(camera, renderer.domElement)
			setOrbitControls(newOrbitControls);

			if (containerRef.current) (containerRef.current).appendChild(renderer.domElement);
			const animate = createAnimate(scene, camera, renderer);
			camera.position.z = 350;
			animate.animate();
      // render Jaw model
			rendererStl(
        stlUrl,
        scene,
        textureLoader,
        loader,
        defaultWhiteTexutre,
        undefined,
        undefined,
        undefined,
        undefined,
        true
      );
      renderer.domElement.addEventListener('dblclick', addScrewOrWing);
      renderer.domElement.addEventListener('click', reselectOrReset);
      renderer.domElement.addEventListener('mousemove', onMouseMove);

      window.addEventListener('keydown', keyEvenets)

      return () => {
				renderer.domElement.removeEventListener('dblclick', addScrewOrWing);
        renderer.domElement.removeEventListener('click', reselectOrReset);
        renderer.domElement.addEventListener('mousemove', onMouseMove);
        window.removeEventListener('keydown', keyEvenets)

			};
		}
	}, [renderer, camera, scene]);


    // orbit controller
	useEffect(() => {
		if (!orbitControls) return
    (orbitControls as OrbitControls).maxDistance = 450;
    (orbitControls as OrbitControls).minDistance = 125;

	}, [orbitControls]);


  useEffect(() => {
    // TODO: add buttons for changing the possition
    
    // if (selectedModel && transformControls) {
    //   scene?.add(transformControls);
    //   transformControls?.attach(selectedModel);
    //   selectedModelRef.current = selectedModel

    // } else {
    //   transformControls?.detach();
    //   selectedModelRef.current = undefined
    // }

    // if (!transformControls) {
    //   return
    // }

  }, [selectedModel])

  useEffect(() => {
    screwModelsRef.current = screwModels
    choosedWingTypeRef.current = choosedWingType
  }, [screwModels, choosedWingType])

  // useEffect(() => {
  //   // TODO: when attached model and trying to drag model disable
  //   transformControlsRef.current = transformControls
  //   transformControls?.addEventListener('dragging-changed', transformControlsDraging)

  // }, [transformControls])

  return (
      <>
        <div ref={containerRef} style={{ width: width, height: height }} className={styles.Viewer}/>
        <div className={styles.SideMenu}>
          <SideBar />
        </div>
      </>
    )
};

export default Viewer;
