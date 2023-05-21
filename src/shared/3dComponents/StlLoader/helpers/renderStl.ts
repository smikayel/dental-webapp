import * as THREE from "three";
import { STLLoader as Loader } from 'three/examples/jsm/loaders/STLLoader';

export interface ConfigInterface {
    x: number,
    y: number,
    z: number,
}

export const rendererStl = (
    stlUrl: string,
    scene: THREE.Scene,
    textureLoader: THREE.TextureLoader,
    loader: Loader,
    textur: string,
    posConfigs: ConfigInterface = {x: 0, y: 0, z: 0}, // positional configuration
    rotationConfigs: ConfigInterface = {x: 0, y: 0, z: 0} // rotation for current model
) : THREE.Mesh | undefined => {
    loader.load(stlUrl, (geometry) => {
        const material = new THREE.MeshMatcapMaterial({
            color: 0xffffff, // color for texture
            matcap: textureLoader.load(textur)
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.geometry.computeVertexNormals();
        mesh.geometry.center();
        mesh.position.set(posConfigs.x, posConfigs.y, posConfigs.z);
        mesh.rotation.set(rotationConfigs.x, rotationConfigs.y, rotationConfigs.z);

        scene.add(mesh);
        return mesh
    });
    return undefined
};