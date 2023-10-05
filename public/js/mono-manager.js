import * as THREE from 'three';
import {ThreejsMonopileGenerator} from "../old-app/ThreejsMonopileGenerator.js";

export class MonoManager{
    nameMap = new Map();
    target = new THREE.Vector3(0,0,0);
    xMin; zMin; xMax; zMax;
    circles = new THREE.Group();
    piles = new THREE.Group();
    materials =[ new THREE.MeshBasicMaterial(
        {
            color: 0x999999 //gray
        }),new THREE.MeshBasicMaterial(
        {
            color: 0xff9999 //pink
        }),new THREE.MeshBasicMaterial(
        {
            color: 0xff0000 //red
        }),new THREE.MeshBasicMaterial(
        {
            color: 0x000000 //black
        }),new THREE.MeshBasicMaterial(
        {
            color: 0xff00ff //magenta
        })];

    clear(){
        this.circles.clear();
        this.piles.clear();
        this.nameMap.clear();
    }

    buildMonopile(json){
        // console.log(json);
        // console.log(json.properties.name);
        let data = json;//ThreejsMonopileGenerator.simplify(json);
        let mono = ThreejsMonopileGenerator.generate(data,null, true);

        mono.jsonProperties = data.properties;
        mono.scale.x=0.0001;
        mono.scale.y=0.0001;
        mono.scale.z=0.0001;

        const fieldPosition = json.properties.fieldPosition;
        let latLon = toLatLon(fieldPosition.easting, fieldPosition.northing, 18, 'N');
        // console.log(latLon);
        let x = -latLon.longitude/180*5760/2;
        let z = -latLon.latitude/90*2880/2;

        // x=-5760/2;
        // z=2880/2;

        // const material = new THREE.MeshBasicMaterial({color: 0x00ff33});
        const cylinderGeometry =new THREE.CylinderGeometry(0.03, 0.035, 0.0002, 32);
        const cylinder = new THREE.Mesh(cylinderGeometry, this.materials[0]);
        this.piles.add(mono);
        cylinder.name = json.properties.name;
        this.nameMap.set(cylinder.name, cylinder);
        cylinder.mono = mono;
        cylinder.translateX(-x);
        cylinder.translateY(-0.03);
        cylinder.translateZ(z);
        mono.translateX(-x);
        mono.translateZ(z);
        this.circles.add(cylinder);
        return mono;
    }

    calculateBounds(){
        this.xMin = 1000000000;
        this.zMin = 1000000000;
        this.xMax = -1000000000;
        this.zMax = -1000000000;
        this.circles.children.forEach((c)=>{

            this.xMin = Math.min(c.position.x, this.xMin);
            this.zMin = Math.min(c.position.z, this.zMin);
            this.xMax = Math.max(c.position.x, this.xMax);
            this.zMax = Math.max(c.position.z, this.zMax);
        });

        this.target=new THREE.Vector3((this.xMin+this.xMax)/2, 0, (this.zMin+this.zMax)/2);
    }
}