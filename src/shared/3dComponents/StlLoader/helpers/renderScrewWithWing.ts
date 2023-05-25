import * as THREE from "three";
import { STLLoader as Loader } from 'three/examples/jsm/loaders/STLLoader';
import { ConfigInterface } from "./helpersInterfacies";
import { STATIC_MODELS, WINGS_SEARCHABLE_OBJECT } from "../../cosntants";

export type WingType = keyof typeof WINGS_SEARCHABLE_OBJECT

export const renderScrewWithWing = (
    wingType: WingType,
    scene: THREE.Scene,
    textureLoader: THREE.TextureLoader,
    loader: Loader,
    textur: string,
    posConfigs: ConfigInterface = {x: 0, y: 0, z: 0}, // positional configuration
    rotationConfigs: ConfigInterface = {x: 0, y: 0, z: 0}, // rotation for current model
    saveModelInState?: React.Dispatch<React.SetStateAction<THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[]>[]>>,
    selectModelOnCreation?: React.Dispatch<React.SetStateAction<THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[]> | undefined>>
) => {
    loader.load(STATIC_MODELS.SCREW, (geometry) => { 
        // load screw 
        const screwMaterial = new THREE.MeshMatcapMaterial({
            color: 0xdbd7de, // color for texture
            matcap: textureLoader.load(textur)
        });
        const mesh = new THREE.Mesh(geometry, screwMaterial);
        mesh.geometry.computeVertexNormals();
        mesh.geometry.center();
        mesh.position.set(posConfigs.x || 0, posConfigs.y || 0, posConfigs.z || 0);
        mesh.rotation.set(rotationConfigs.x || 0, rotationConfigs.y || 0, rotationConfigs.z || 0);
      
        loader.load(WINGS_SEARCHABLE_OBJECT[wingType].model, (wingGeometry)=> {
            const wingMaterial = new THREE.MeshMatcapMaterial({
                color: 0x9279d1, // color for texture
                matcap: textureLoader.load(textur),
                transparent: true,
                opacity: 0.8,
            });
            const wingMesh = new THREE.Mesh(wingGeometry, wingMaterial);
            wingMesh.geometry.computeVertexNormals();
            wingMesh.geometry.center();
            wingMesh.position.set(mesh.position.x || 0, mesh.position.y || 0, mesh.position.z || 0);
            wingMesh.rotation.set(mesh.position.x || 0, mesh.position.y || 0, mesh.position.z || 0);
            
            mesh.add(wingMesh)
            scene.add(mesh); 
            //TODO: fix this function
            // in busines logic it should given only when need to save the mesh in some of the states
            saveModelInState && saveModelInState(prevState => [...prevState, mesh])

            // if need to select model (as expected it should be screw)
            selectModelOnCreation && selectModelOnCreation(mesh)
            })
    });
};
