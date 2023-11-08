import * as THREE from 'three';
export class FleetManager{

    objLoader = new THREE.ObjectLoader();
    htvGroup = new THREE.Group();
    thialfGroup = new THREE.Group();

    htvs = new Map();
    hlvs = new Map();

    constructor() {
    }

    setVisible(htvFileName, hlvFileName){
        this.htvs.forEach((value, key)=>{
            value.visible = key === htvFileName;
        })
        this.hlvs.forEach((value, key)=>{
            value.visible = key === hlvFileName;
        })
    }

    load(materialManager, htvFileNameSet, hlvFileNameSet, delegate){
        this.htvGroup.clear();
        this.thialfGroup.clear();

        this.htvs = new Map();
        this.hlvs = new Map();

        let loading = 0;

        getDataFromIndexedDB("projectStoreGltfData").then(res=>{
            // console.log(res);

            htvFileNameSet.forEach(value=>{
                loading++;
                const htvFileName = value.substring(0, value.length-5);
                this.objLoader.parse(res[htvFileName], (htvParsed)=>{
                    loading--;
                    // this.htv = htvParsed;
                    this.htvs.set(value,htvParsed);
                    // console.log(htv);
                    materialManager.countMeshes(htvParsed);
                    materialManager.setMatRec(htvParsed, true);
                    this.htvGroup.add(htvParsed);
                    // this.htv.rotateY(Math.PI/4+Math.PI);
                    if(loading===0) {
                        delegate();
                        window.needsRedraw =3;
                    }
                });
            });
            hlvFileNameSet.forEach(value=> {
                loading++;
                const hlvFileName = value.substring(0, value.length - 5);
                this.objLoader.parse(res[hlvFileName], (hlvParsed)=>{
                    loading--;
                    // this.thalf = hlvParsed;
                    this.hlvs.set(value,hlvParsed);
                    // console.log(thalf);
                    materialManager.countMeshes(hlvParsed);
                    materialManager.setMatRec(hlvParsed,  true);

                    // this.thalf.rotateY(-Math.PI/2);
                    //
                    // this.thalf.translateZ(-100);
                    // this.thalf.translateX(25);
                    this.thialfGroup.add(hlvParsed);
                    // htv.translateZ(100);
                    // htv.translateX(+20);
                    if(loading===0) {
                        delegate();
                        window.needsRedraw =3;
                    }
                });
            });
        });
    }
}