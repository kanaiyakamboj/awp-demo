import * as THREE from 'three';

export class Snapper {

    doSnap = false;

    constructor() {

        window.toggleSnap = ()=> {
            this.doSnap = !this.doSnap;
            const snapFreeButton = document.getElementById('snapFreeButton');
            if(snapFreeButton){
                snapFreeButton.innerText = this.doSnap? 'Free' : 'Snap';
            }
        };

        window.toggleCam = ()=>{
            this.angle = (this.angle+1)%this.angles.length;
            const cameraButton = document.getElementById('cameraButton');
            if(cameraButton) {
                cameraButton.innerText = this.angles[this.angle].name;
            }
        }
        toggleCam();
    }

    get ang() {
        return this.angles[this.angle];
    }

    angle = -1;

    idxs = ['Iso','Top', 'Left', 'Front'];
    angles = [
        {
            name: 'Iso',
            rotate: false,
            zoom: 375,
            x: -5,
            y: 5,
            z: 5,
            yOff: 40
        },{
            name: 'Top',
            rotate: true,
            zoom: 375,
            x: 0,
            y: 10,
            z: 0,
            yOff: 0
        },{
            name: 'Left',
            rotate: false,
            zoom: 375,
            x: 0,
            y: 0,
            z: 10,
            yOff: 60
        },{
            name: 'Front',
            rotate: false,
            zoom: 375,
            x: -10,
            y: 0,
            z: 0,
            yOff: 60
        }

    ];

    setFor(waterLevelCylinder, fleetManager, renderer){
        let pos = new THREE.Vector3();
        let rot = new THREE.Quaternion();
        fleetManager.thalf.getWorldPosition(pos);
        // thalf.getWorldQuaternion(rot);
        rot.invert();
        let ang = this.angles[this.idxs.indexOf(renderer.angle)];
        pos.y+=ang.yOff/5000;
        renderer.camera.position.copy(pos);
        renderer.camera.quaternion.copy(rot);
        // console.log(htv.rotation);


        let offset = new THREE.Vector3(ang.x,ang.y,ang.z);
        let worldQuat = new THREE.Quaternion();
        fleetManager.thalf.getWorldQuaternion(worldQuat);
        offset.applyQuaternion(worldQuat);

        renderer.camera.position.add(offset);

        // renderer.camera.translateX(ang.x);
        // renderer.camera.translateY(ang.y);
        // renderer.camera.translateZ(ang.z);
        renderer.camera.lookAt(pos);
        if(ang.rotate) renderer.camera.rotateZ(fleetManager.thalf.rotation.y-Math.PI*3/4);
        renderer.camera.zoom = ang.zoom/(window.fullScreen?1:2);
        if(ang.y > 0) {
            waterLevelCylinder.scale.y=1;
            waterLevelCylinder.position.y = 0;
            waterLevelCylinder.translateY(-1);
        }
    }

}