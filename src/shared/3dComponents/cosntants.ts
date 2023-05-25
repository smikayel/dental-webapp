import { MainConfig } from "./StlLoader/viewerInterfacies"
import * as THREE from 'three'

export const defaultWhiteTexutre = 'assets/models/GlobalTexturs/whiteTextureBasic.jpg'

export const WINGS = [
    {name: 'Screw for wing', icon: 'assets/models/screw/screw.png', model: 'assets/models/screw/screw.png'},
    {name: 'Distance', icon: 'assets/models/wings/longWing/tectonic_long_preview.png', model: 'assets/models/wings/longWing/tectonic_long.stl'},
    {name: 'Single', icon: 'assets/models/wings/singleWing/tectonic_single_preview.png', model: 'assets/models/wings/singleWing/tectonic_single.stl'},
    {name: 'Obtuse', icon: 'assets/models/wings/straightWing/tectonic_straight_preview.png', model: 'assets/models/wings/straightWing/tectonic_straight.stl'},
    {name: 'Acute', icon: 'assets/models/wings/angle1Wing/tectonic_angle1_preview.png', model: 'assets/models/wings/angle1Wing/tectonic_angle1.stl'},
    {name: 'Ninety', icon: 'assets/models/wings/angle2Wing/tectonic_angle2_preview.png', model: 'assets/models/wings/angle2Wing/tectonic_angle2.stl'},
]

export const WINGS_SEARCHABLE_OBJECT = {
    'Screw for wing': {icon: 'assets/models/screw/screw.png', model: 'assets/models/screw/screw.png'},
    'Distance': {icon: 'assets/models/wings/longWing/tectonic_long_preview.png', model: 'assets/models/wings/longWing/tectonic_long.stl'},
    'Single': {icon: 'assets/models/wings/singleWing/tectonic_single_preview.png', model: 'assets/models/wings/singleWing/tectonic_single.stl'},
    'Obtuse': {icon: 'assets/models/wings/straightWing/tectonic_straight_preview.png', model: 'assets/models/wings/straightWing/tectonic_straight.stl'},
    'Acute': {icon: 'assets/models/wings/angle1Wing/tectonic_angle1_preview.png', model: 'assets/models/wings/angle1Wing/tectonic_angle1.stl'},
    'Ninety': {icon: 'assets/models/wings/angle2Wing/tectonic_angle2_preview.png', model: 'assets/models/wings/angle2Wing/tectonic_angle2.stl'},
}

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

export const SCENE_BACKGROUND_COLOR = 0x968368
