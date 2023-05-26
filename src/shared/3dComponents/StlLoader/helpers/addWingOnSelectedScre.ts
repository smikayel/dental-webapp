import * as THREE from "three";
import { STLLoader as Loader } from 'three/examples/jsm/loaders/STLLoader';
import {  WINGS_SEARCHABLE_OBJECT, WING_COLOR } from "../../cosntants";
import { WingType, wingConfigs } from "./renderScrewWithWing";


export const addWingOnSelectedScre = (
    wingType: WingType,
    intersectedObject: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[]>,
    textureLoader: THREE.TextureLoader,
    loader: Loader,
    textur: string,
) => {
    if (wingType === 'Screw for wing') return // it should be simple screw not needed any type of wing 
    if (intersectedObject.children.length) return
      
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
        
        intersectedObject.add(wingMesh)
    });
};
