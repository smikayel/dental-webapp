import * as THREE from "three";
import { STLLoader as Loader } from 'three/examples/jsm/loaders/STLLoader';
import { ConfigInterface } from "./helpersInterfacies";


export const rendererStl = (
    stlUrl: string,
    scene: THREE.Scene,
    textureLoader: THREE.TextureLoader,
    loader: Loader,
    textur: string,
    posConfigs: ConfigInterface = {x: 0, y: 0, z: 0}, // positional configuration
    rotationConfigs: ConfigInterface = {x: 0, y: 0, z: 0}, // rotation for current model
    saveModelInState?: React.Dispatch<React.SetStateAction<THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[]>[]>>,
    selectModelOnCreation?: React.Dispatch<React.SetStateAction<THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[]> | undefined>>
) => {
    loader.load(stlUrl, (geometry) => {
        const material = new THREE.MeshMatcapMaterial({
            color: 0xffffff, // color for texture
            matcap: textureLoader.load(textur)
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.geometry.computeVertexNormals();
        mesh.geometry.center();
        mesh.position.set(posConfigs.x || 0, posConfigs.y || 0, posConfigs.z || 0);
        mesh.rotation.set(rotationConfigs.x || 0, rotationConfigs.y || 0, rotationConfigs.z || 0);

        scene.add(mesh);
        // in busines logic it should given only when need to save the mesh in some of the states
        saveModelInState && saveModelInState(prevState => [...prevState, mesh])

        // if need to select model (as expected it should be screw)
        selectModelOnCreation && selectModelOnCreation(mesh)
    });
};