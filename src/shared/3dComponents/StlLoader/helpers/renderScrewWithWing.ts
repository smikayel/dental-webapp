import * as THREE from "three";
import { STLLoader as Loader } from 'three/examples/jsm/loaders/STLLoader';
import { ConfigInterface } from "./helpersInterfacies";
import { DELTA_COFICENT, SCREW_COLOR, STATIC_MODELS, WINGS_SEARCHABLE_OBJECT, WING_COLOR } from "../../cosntants";

export type WingType = keyof typeof WINGS_SEARCHABLE_OBJECT

export const scaleOfWings = {x: 0.8, y: 0.8, z: 0.8}

// TODO: maybe it's not good plkace for this functionality 
export const wingConfigs = {
    'Distance': {
        rotation: {x: 0, y: THREE.MathUtils.degToRad(90), z: 0},
        scale: scaleOfWings,
        position: {x: 2, y: 0, z: -3.2}
    },
    'Single': {
        rotation: {x: 0, y: THREE.MathUtils.degToRad(90), z: 0},
        scale: scaleOfWings,
        position: {x: 2, y: 0, z: 3.5}
    },
    'Obtuse': {
        rotation: {x: 0, y: THREE.MathUtils.degToRad(90), z: 0},
        scale: scaleOfWings,
        position: {x: 2, y: 0, z: 0}
    },
    'Acute': {
        rotation: {x: 0, y: THREE.MathUtils.degToRad(90), z: 0},
        scale: scaleOfWings,
        position: {x: 2, y: -2.5, z: 1}
    },
    'Ninety': {
        rotation: {x: 0, y: THREE.MathUtils.degToRad(90), z: 0},
        scale: scaleOfWings,
        position: {x: 2, y: -1, z: 0}
    }
}

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
    if (wingType === 'Screw for wing') return // it should be simple screw not needed any type of wing 

    loader.load(STATIC_MODELS.SCREW, (geometry) => { 
        // load screw 
        const screwMaterial = new THREE.MeshMatcapMaterial({
            color: SCREW_COLOR, // color for texture
            matcap: textureLoader.load(textur)
        });
        const mesh = new THREE.Mesh(geometry, screwMaterial);
        mesh.geometry.computeVertexNormals();
        mesh.geometry.center();

        mesh.position.set(posConfigs.x || 0, (posConfigs.y && posConfigs.y + DELTA_COFICENT) || 0, posConfigs.z || 0);
        mesh.rotation.set(rotationConfigs.x || 0, rotationConfigs.y || 0, rotationConfigs.z || 0);
      
        loader.load(WINGS_SEARCHABLE_OBJECT[wingType].model, (wingGeometry)=> {
            const wingMaterial = new THREE.MeshMatcapMaterial({
                color: WING_COLOR, // color for texture
                matcap: textureLoader.load(textur),
                transparent: true,
                opacity: 0.8,
            });
            const wingMesh = new THREE.Mesh(wingGeometry, wingMaterial);
            wingMesh.geometry.computeVertexNormals();
            wingMesh.geometry.center();
            // config position/rotation/scale of the wings
            wingMesh.position.set(
                wingMesh.position.x + wingConfigs[wingType]?.position.x || 0,
                wingMesh.position.y + wingConfigs[wingType]?.position.y || 0,
                wingMesh.position.z + wingConfigs[wingType]?.position.z || 0
            );
            wingMesh.rotation.set(
                wingConfigs[wingType]?.rotation?.x || 0,
                wingConfigs[wingType]?.rotation?.y || 0,
                wingConfigs[wingType]?.rotation?.z || 0
            );
            wingMesh.scale.set(
                wingConfigs[wingType]?.scale?.x,
                wingConfigs[wingType]?.scale?.y,
                wingConfigs[wingType]?.scale?.z
            );
            
            mesh.add(wingMesh)
            scene.add(mesh);
            //TODO: fix this functionality
            // in busines logic it should given only when need to save the mesh in some of the states
            saveModelInState && saveModelInState(prevState => [...prevState, mesh])

            // if need to select model (as expected it should be screw)
            selectModelOnCreation && selectModelOnCreation(mesh)
            })
    });
};
