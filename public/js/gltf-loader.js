import { set } from "https://unpkg.com/idb-keyval@5.0.2/dist/esm/index.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


window.parseGLTFs = (nurls, callback) =>{
    let actives = 0;
    nurls.forEach((nurl)=>{
        actives++;
        loadGLTF(nurl.name, nurl.url, ()=>{
            actives--;
            if(actives===0) callback();
        })
    })
}
const loader = new GLTFLoader();
window.loadGLTF = (name, url, callback)=>{
    loader.load( url,(gltf)=>{
        function updateMatrixRec(obj){
            obj.updateMatrix();
            obj.children.forEach((child)=>updateMatrixRec(child));
        }

        updateMatrixRec(gltf.scene);
        let data = gltf.scene.toJSON();
        set(name, data).then(callback(data));
    } );
}