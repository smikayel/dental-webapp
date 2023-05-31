import * as THREE from 'three'


export enum modeOfTransformer {
    MOVE = 'move',
    ROTATE = 'rotate'
}

export enum Axis {
    X = 'X',
    Y = 'Y',
    Z = 'Z'
}

interface customTransformControlI{
    attach(object: THREE.Object3D<THREE.Event>): void;
    detach(): void;
    changeAxis(axis: string): void;
}

export class customTransformControl implements customTransformControlI{

    mode: string;
    axis: string;
    object: THREE.Object3D<THREE.Event> | undefined

    private _circle: string;
    private _arrows: string;
    private _controller: string[];
    
    constructor () {
        // TODO: add all which needed to be in constracter
        this._circle = 'assets/images/Viewer/large-red-circle.png'
        this._arrows = 'assets/images/Viewer/rotation-arrows.png'
        this.mode = modeOfTransformer.MOVE; 
        this.axis = Axis.X
        this._controller = []
    }

    _getPositionals(axis: string) {
        let position1 = {x: 0, y: 10, z: 0} 
        let position2 = {...position1}

        if (axis == Axis.X) {
            position1 = {x: 0, y: 10, z: 0} 
            position2 = {...position1} 
            position2.y = -10
        } else if (axis == Axis.Y) {
            position1 = {x: 0, y: 0, z: 10} 
            position2 = {...position1} 
            position2.z = -10
        } else if (axis == Axis.Z) {
            position1 = {x: 10, y: 0, z: 0} 
            position2 = {...position1} 
            position2.x = -10
        }
        const position = {
            x1: position1.x,
            y1: position1.y,
            z1: position1.z,
            x2: position2.x,
            y2: position2.y,
            z2: position2.z
        }
        return position
    }
    
    attach(object: THREE.Object3D<THREE.Event>) {
        //attach to object 
        this.object = object
        const textureLoader = new THREE.TextureLoader();
        const imageTexture = textureLoader.load(this._circle);
        const spriteMaterial = new THREE.SpriteMaterial({ map: imageTexture });
        const sprite1 = new THREE.Sprite(spriteMaterial);
        const sprite2 = new THREE.Sprite(spriteMaterial);
        const spriteRadius = 2
        sprite1.scale.set(spriteRadius, spriteRadius, 1);
        sprite2.scale.set(spriteRadius, spriteRadius, 1);
        // add unique property to be able delete from scene
        sprite1.name = 'sprite1'
        this._controller.push(sprite1.uuid)
        sprite2.name = 'sprite2'
        this._controller.push(sprite2.uuid)
        const position = this._getPositionals(this.axis) 
        // add positions for sprites 
        sprite1.position.set(position.x1, position.y1, position.z1);
        sprite2.position.set(position.x2, position.y2, position.z2);
        // TODO: add something other for rotation to understand that it's rotation mode
        object.add(sprite1);
        object.add(sprite2);
    }

    detach() {
        for (let uuid of this._controller) {
            this.object?.children.map(el => {
                if (el.uuid === uuid) {
                    this.object?.remove(el)
                }
            })
        }
        this.object = undefined
        this.axis = Axis.X
    }

    changeAxis(axis:string) {
        this.axis = axis
        const position = this._getPositionals(this.axis)
        if (this.object) {
            for (let el of this.object.children) {
                if (el.name === 'sprite1') {
                    el.position.set(position.x1, position.y1, position.z1);
                } else if (el.name === 'sprite2') {
                    el.position.set(position.x2, position.y2, position.z2);
                }
            }
        }
    }
}

