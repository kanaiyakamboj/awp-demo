import * as THREE from 'three';
export class Snapper {
    doSnap = false;
    constructor() {
        window.toggleSnap = ()=> {
            this.doSnap = !this.doSnap;
            document.getElementById('snapFreeButton').innerText = this.doSnap? 'Free' : 'Snap';
        };

        window.toggleCam = ()=>{
            this.angle = (this.angle+1)%this.angles.length;
            document.getElementById('cameraButton').innerText=this.angles[this.angle].name;
        }
        toggleCam();
    }

    get ang() {
        return this.angles[this.angle];
    }

    angle = -1;

    idxs = ['Top', 'Iso', 'Left', 'Front'];
    angles = [
        {
            name: 'Top',
            rotate: true,
            zoom: 375,
            x: 0,
            y: 10,
            z: 0
        },{
            name: 'Iso',
            rotate: false,
            zoom: 375,
            x: 7,
            y: 7,
            z: 0
        },{
            name: 'Left',
            rotate: false,
            zoom: 375,
            x: 7,
            y: 0,
            z: -7
        },{
            name: 'Front',
            rotate: false,
            zoom: 375,
            x: 7,
            y: 0,
            z: 7
        }

    ];

    setFor(waterLevelCylinder, fleetManager, renderer){
        let pos = new THREE.Vector3();
        let rot = new THREE.Quaternion();
        fleetManager.thalf.getWorldPosition(pos);
        // thalf.getWorldQuaternion(rot);
        rot.invert();
        renderer.camera.position.copy(pos);
        renderer.camera.quaternion.copy(rot);
        // console.log(htv.rotation);

        let ang = this.angles[this.idxs.indexOf(renderer.angle)];
        renderer.camera.translateX(ang.x);
        renderer.camera.translateY(ang.y);
        renderer.camera.translateZ(ang.z);
        renderer.camera.lookAt(pos);
        if(ang.rotate) renderer.camera.rotateZ(fleetManager.htv.rotation.y-Math.PI/2);
        renderer.camera.zoom = ang.zoom;
        if(ang.y > 0) {
            waterLevelCylinder.scale.y=1;
            waterLevelCylinder.position.y = 0;
            waterLevelCylinder.translateY(-1);
        }
    }

}