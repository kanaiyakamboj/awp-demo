import * as THREE from 'three';
import { get} from "https://unpkg.com/idb-keyval@5.0.2/dist/esm/index.js";
export class FleetManager{
    objLoader = new THREE.ObjectLoader();
    htvGroup = new THREE.Group();
    htv;
    thalf;

    constructor() {
        this.htvGroup.scale.x=0.0001;
        this.htvGroup.scale.y=0.0001;
        this.htvGroup.scale.z=0.0001;
    }

    load(materialManager, htvFileName, thialfFileName){
        this.htvGroup.clear();
        this.htv=null;
        this.thalf=null;
        get(htvFileName).then((htvJson)=>{
            // console.log(htvJson);
            this.objLoader.parse(htvJson, (htvParsed)=>{
                this.htv = htvParsed;
                // console.log(htv);
                materialManager.countMeshes(this.htv);
                materialManager.setMatRec(this.htv, true);
                get(thialfFileName).then((thalfJson)=>{
                    this.objLoader.parse(thalfJson, (thalfParsed)=>{
                        this.thalf = thalfParsed;
                        // console.log(thalf);
                        materialManager.countMeshes(this.thalf);
                        materialManager.setMatRec(this.thalf,  true);
                        this.htv.add(this.thalf);
                        this.thalf.rotateY(-Math.PI/2);

                        this.thalf.translateZ(-100);
                        this.thalf.translateX(25);
                        this.htvGroup.add(this.htv);
                        // htv.translateZ(100);
                        // htv.translateX(+20);

                        this.htv.rotateY(Math.PI/4+Math.PI);
                    });
                });
            });
        });
    }
}