import * as THREE from 'three';

export class Snapper {
    doSnap = false;
    storeData;

    constructor(storeData, bind) {
        this.storeData=storeData;
        this.idxs = storeData.cameraConfig.angles.map(x=>x.name);
        if(bind) {
            window.toggleSnap = () => {
                this.toggle();
                const snapFreeButton = document.getElementById('snapFreeButton');
                if (snapFreeButton) {
                    snapFreeButton.innerText = this.doSnap ? 'Free' : 'Snap';
                }
                window.needsRedraw=3;
            };

            window.toggleCam = () => {
                this.next();
                const cameraButton = document.getElementById('cameraButton');
                if (cameraButton) {
                    cameraButton.innerText = this.storeData.cameraConfig.angles[this.angle].name;
                }
                window.needsRedraw=3;
            }
            toggleCam();
        }

    }


    next(){
        this.angle = (this.angle + 1) % this.storeData.cameraConfig.angles.length;
    }
    toggle() {
        this.doSnap = !this.doSnap;
    }

    get ang() {
        return this.storeData.cameraConfig.angles[this.angle];
    }

    angle = -1;

    idxs;


    setFor(waterLevelCylinder, hlv, renderer){
        let pos = new THREE.Vector3();
        let rot = new THREE.Quaternion();
        if(hlv) hlv.getWorldPosition(pos);
        // thalf.getWorldQuaternion(rot);
        rot.invert();
        let ang = this.storeData.cameraConfig.angles[this.storeidxs.indexOf(renderer.angle)];
        pos.y+=ang.yOff;
        renderer.camera.position.copy(pos);
        renderer.camera.quaternion.copy(rot);
        // console.log(htv.rotation);


        let offset = new THREE.Vector3(ang.x,ang.y,ang.z);
        let worldQuat = new THREE.Quaternion();
        if( hlv) hlv.getWorldQuaternion(worldQuat);
        offset.applyQuaternion(worldQuat);

        renderer.camera.position.add(offset);

        // renderer.camera.translateX(ang.x);
        // renderer.camera.translateY(ang.y);
        // renderer.camera.translateZ(ang.z);
        renderer.camera.lookAt(pos);
        if(ang.rotate && hlv) renderer.camera.rotateZ(hlv.rotation.y+Math.PI/2);
        renderer.camera.zoom = ang.zoom * Math.min(renderer.canvas.height, renderer.canvas.width) / 1000;
        if(ang.y > 0) {
            waterLevelCylinder.scale.y=1;
            waterLevelCylinder.position.y = 0;
            waterLevelCylinder.translateY(-1);
        }
    }

}