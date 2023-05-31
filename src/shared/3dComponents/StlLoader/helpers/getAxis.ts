import * as THREE from 'three'
import { Axis } from './customTransferController';

export const getAxis = (camera:THREE.PerspectiveCamera, object:THREE.Object3D<THREE.Event>) => {
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    const objectPosition = object.position.clone();
    const objectDirection = objectPosition.sub(camera.position).normalize();

    const dotX = Math.abs(objectDirection.dot(new THREE.Vector3(1, 0, 0)));
    const dotY = Math.abs(objectDirection.dot(new THREE.Vector3(0, 1, 0)));
    const dotZ = Math.abs(objectDirection.dot(new THREE.Vector3(0, 0, 1)));

    let dominantAxis = '';

    if (dotX > dotY && dotX > dotZ) {
        dominantAxis = Axis.Z;
    } else if (dotY > dotX && dotY > dotZ) {
        dominantAxis = Axis.X;
    } else if (dotZ > dotX && dotZ > dotY) {
        dominantAxis = Axis.Y;
    }

    return dominantAxis;
};

