import { MainConfig } from "./StlLoader/viewerInterfacies"
import * as THREE from 'three'

export const defaultWhiteTexutre = 'assets/models/GlobalTexturs/whiteTextureBasic.jpg'

export const STATIC_MODELS = {
    SCREW: 'assets/models/screw/Screw.stl'
}

export const SCREW_CONFIGURE: MainConfig = {
    position: {
        /* add configs for position by default it's 0 
        because models normal and 0 vector in the correct place 
        (in case of issues it can be fixed) */
    },
    rotation: {
        x: 0,
        y: THREE.MathUtils.degToRad(90), // be sure that it's returning 1.5707963267948966 (so in case of if you are using the degree call this method)
        z: THREE.MathUtils.degToRad(90),
    },
}
