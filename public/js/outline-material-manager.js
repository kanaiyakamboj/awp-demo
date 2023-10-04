import * as THREE from 'three';
import { getShaderMaterial } from './shader-fetcher.js';
export class OutlineMaterialManager{

    material = getShaderMaterial('./../old-app/shader.gl');

    colors = [];

    meshNum = 1;
    getObject3DAncestor(child){
        let parent = child.parent;
        if(parent === null) return child;
        if(parent.type!=='Mesh') return parent;
        return this.getObject3DAncestor(parent);
    }

    nameObjIdMap = new Map();
    setMatRec(obj, fixUVs){
        obj.updateMatrix();
        for(let i = 0; i < obj.children.length; i++){
            let child = obj.children[i];
            if(child.type==='Mesh'){
                child.material=this.material;
                let meshIndex = this.getObject3DAncestor(child).selectionId;
                child.selectionId = meshIndex;
                this.nameObjIdMap.set(child.name, child.selectionId);
                {
                    //child.geometry.attributes.uv1 = child.geometry.attributes.uv;
                    let uv1 = child.geometry.attributes.uv1;
                    if(!uv1) child.geometry.setAttribute('uv1', new THREE.BufferAttribute(new Float32Array(child.geometry.attributes.position.array.length), 2));
                    {
                        let objIds = [];
                        for(let i = 0; i < child.geometry.attributes.position.array.length; i++){
                            objIds.push(meshIndex/256);
                        }
                        child.geometry.setAttribute( 'objId', new THREE.BufferAttribute( new Float32Array(objIds), 1 ) );
                        // console.log(child.geometry.attributes);
                    }
                }
            }
            this.setMatRec(child, fixUVs);
        }
    }

    groupMap = new Map();
    outlineMeshes = [];

    countMeshes(obj){
        obj.selectionId=this.meshNum;
        this.meshNum++;
        this.countMeshesRec(obj);
    }
    countMeshesRec(obj){
        for(let i = 0; i < obj.children.length; i++){
            let child = obj.children[i];
            if(child.type!=='Mesh'){
                // console.log(child.name);
                this.meshNum++;
                child.selectionId = this.meshNum;
                this.groupMap.set(this.meshNum, child);

            } else{
                this.outlineMeshes.push(child);
            }
            // if(child.type==='Mesh'){
            //     meshNum++;
            // }
            this.countMeshesRec(child);
        }
    }

    setColorsOf (names, r,g,b){
        names.forEach((name)=>{this.colors[this.nameObjIdMap.get(name)] = new THREE.Vector3(r/255, g/255, b/255)});
    }

    constructor() {
        for(let i = 0; i < 256; i++) {
            let vec = new THREE.Vector3(1,1,1);
            // vec.random();
            this.colors.push(vec);
        }
        this.material.uniforms = {
            winWidth: { value: 0 },
            winHeight: { value: 0 },
            objectIdTex: {value: null},
            objectNum: {value: 256},
            renderSurfaceIds:{value: false},
            hoverObjId: {value:-1},
            selectedObjId: {value: -1},
            camDir: {value: new THREE.Vector3(0,1,0)},
            colors: {value: this.colors}
        };
    }
}