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
import { Axis, customTransformControl } from './helpers/customTransferController';

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
  const [transformControls, setTransformControls] = useState<customTransformControl>()
  const [selectedModel, setSelectedModel] = useState<THREE.Mesh | undefined>()
  const [orbitControls, setOrbitControls] = useState<SetStateAction<OrbitControls>>()  
  const [isDrag, setIsDrag] = useState<boolean>(false)
  const { choosedWingType } = useContext(WingContext);
  
  const screwModelsRef = useRef(screwModels);
  const orbitControlsRef = useRef(orbitControls);
  const choosedWingTypeRef = useRef(choosedWingType);
  const selectedModelRef = useRef(selectedModel)
  const transformControlsRef = useRef(transformControls)

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
  
  const onMouseMoveChangeAxis = function (event: MouseEvent) {
    if (!camera || !selectedModelRef.current) return
    const axis = getAxis(camera, selectedModelRef.current)
    if (transformControlsRef.current && axis !== transformControlsRef.current.axis) {
      console.log(axis)
      transformControlsRef.current.changeAxis(axis)
    }
  }

  const onMouseDown = (event: MouseEvent) => {
    if (!selectedModelRef.current || !renderer || !camera) return;

    const mouse = new THREE.Vector2(
      (event.clientX / width) * 2 - 1,
      -(event.clientY / height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(selectedModelRef.current);
    if (intersects.length > 0) {
      const intersect = intersects[0];

      (orbitControlsRef.current as OrbitControls).enabled = false

      const offset = new THREE.Vector3().subVectors(
        intersect.point,
        selectedModelRef.current.position
      );

      const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(
        camera.getWorldDirection(new THREE.Vector3()),
        selectedModelRef.current.position
      );

      const onMouseMove = (event: MouseEvent) => {
        const mouse = new THREE.Vector2(
          (event.clientX / width) * 2 - 1,
          -(event.clientY / height) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const origin = camera.position.clone();
        const direction = raycaster.ray.direction;

        const denominator = plane.normal.dot(direction);
        if (denominator !== 0) {
          const t = -(origin.dot(plane.normal) + plane.constant) / denominator;
          const intersectPoint = origin.clone().add(direction.clone().multiplyScalar(t));
          const newPossition = intersectPoint.sub(offset) 
          let newVector3 = new THREE.Vector3(intersect.object.position.x, newPossition.y, newPossition.z)
          if (transformControlsRef.current?.axis === Axis.X) {
            newVector3 = new THREE.Vector3(newPossition.x, intersect.object.position.y, newPossition.z)
          } else if (transformControlsRef.current?.axis === Axis.Y) {
            newVector3 = new THREE.Vector3( newPossition.x, newPossition.y, intersect.object.position.z)
          } else if (transformControlsRef.current?.axis === Axis.Z) {
            newVector3 = new THREE.Vector3(intersect.object.position.x, newPossition.y, newPossition.z)
          }
          selectedModelRef.current?.position.copy(newVector3);

        }
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        (orbitControlsRef.current as OrbitControls).enabled = true
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
  };


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
        if (intersectedObject.uuid === selectedModelRef.current?.uuid) {
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
      transformControls?.detach()
    }
  };

  // keyboard events
  const keyEvenets = (event: KeyboardEvent) => {
    console.log(event.key)
    switch(event.key) {
      case 'd':
      case 'Delete':
        if (!selectedModelRef.current) return
        if (!selectedModelRef.current.children.length) {
          scene?.remove(selectedModelRef.current)
          if (!transformControlsRef?.current?.mode) return
            transformControlsRef.current.detach()
        } else {
          const wing = selectedModelRef.current.children.find(el => el.name === 'wing')
          wing && selectedModelRef.current.remove(wing)
        }
        break
      case 'r':
        if (!transformControlsRef?.current?.mode) return
        if (transformControlsRef.current.mode === 'move') {
          transformControlsRef.current.mode = 'rotate';
        } else {
          transformControlsRef.current.mode = 'move';
        }
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

      const transformControls = new customTransformControl()
      setTransformControls(transformControls);
      
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
      renderer.domElement.addEventListener('mousemove', onMouseMoveChangeAxis);
      renderer.domElement.addEventListener('mousedown', onMouseDown);

      window.addEventListener('keydown', keyEvenets)

      return () => {
				renderer.domElement.removeEventListener('dblclick', addScrewOrWing);
        renderer.domElement.removeEventListener('click', reselectOrReset);
        renderer.domElement.removeEventListener('mousemove', onMouseMoveChangeAxis);
        renderer.domElement.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('keydown', keyEvenets)

			};
		}
	}, [renderer, camera, scene]);

  // orbit controller
	useEffect(() => {
		if (!orbitControls) return
    (orbitControls as OrbitControls).maxDistance = 450;
    (orbitControls as OrbitControls).minDistance = 125;
    orbitControlsRef.current = orbitControls
	}, [orbitControls]);


  useEffect(() => {
    // TODO: add buttons for changing the possition
    
    if (selectedModel) {
      transformControls?.attach(selectedModel);
      selectedModelRef.current = selectedModel

    } else {
      transformControls?.detach();
      selectedModelRef.current = undefined
    }

  }, [selectedModel])

  useEffect(() => {
    screwModelsRef.current = screwModels
    choosedWingTypeRef.current = choosedWingType
  }, [screwModels, choosedWingType])

  useEffect(() => {
    transformControlsRef.current = transformControls

  }, [transformControls])

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
