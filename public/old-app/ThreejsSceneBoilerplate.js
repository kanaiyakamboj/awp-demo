import * as THREE from 'three';
export class ThreejsSceneBoilerplate {
    scene;
    torus;

    target = new THREE.Vector3(0,0,0);
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf3f6fc);

        const size = 500;
        const divisions = 50;
        const gridHelper = new THREE.GridHelper( size, divisions,0xDD2E1A, 0x0699D6 );
        this.scene.add( gridHelper );
        const waterLevelTorus = new THREE.Mesh( new THREE.TorusGeometry( 100, 100, 2, 50 ), new THREE.MeshBasicMaterial(
            {
                color: 0x0699D6,
                transparent: true,
                opacity: 0.25
            } ) );
        waterLevelTorus.rotateX(Math.PI/2);
        this.scene.add(waterLevelTorus);
        {
            const cube = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1 ), new THREE.MeshBasicMaterial( { color: 0x00ff00 }));
            this.scene.add( cube );
            const torus = new THREE.Mesh(new THREE.TorusGeometry(1, 0.5, 16, 100), new THREE.MeshBasicMaterial({color: 0xffff00}));
            torus.translateX(2);
            let object = new THREE.Object3D();
            const torusKnot = new THREE.Mesh( new THREE.TorusKnotGeometry( 1, 0.25, 100, 16 ), new THREE.MeshBasicMaterial( { color: 0x00ffff } ) );
            this.scene.add( object );
            torusKnot.translateZ(3);
            object.add(torusKnot);
            this.torus = object;
            this.scene.add(torus);
        }
    }

    update(){
        if(this.torus) {
            this.torus.rotateX(0.01);
            this.torus.rotateY(0.00777);
            // console.log(this.torus.children[0]);
            this.torus.children[0].getWorldPosition(this.target);
        }
    }

}