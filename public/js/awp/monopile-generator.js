import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { LuminosityShader } from 'three/addons/shaders/LuminosityShader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

export class MonopileGenerator {
    static font;
    static loader = new FontLoader();
    static init(callback){
        if(!MonopileGenerator.font) {
            MonopileGenerator.loader.load('../../assets/helvetiker_regular.typeface.json', function (font) {
                MonopileGenerator.font = font;
                console.log(font);
                callback();
            });
        } else {
            callback();
        }
    }


    static curveText(mesh, radius) {
        const posArray = mesh.geometry.attributes.position.array;
        const newPositions = [];
        for(let i = 0; i < posArray.length; i+=3){
            const oldPos = new THREE.Vector3(posArray[i],posArray[i+1], posArray[i+2]);
            const newPos = oldPos.clone();
            const v2 = new THREE.Vector2(newPos.x, newPos.z);
            const origL = v2.y+radius;
            v2.y+=radius;
            v2.normalize();
            v2.multiplyScalar(origL);
            v2.y-=radius;
            // console.log(v2);
            newPos.x = v2.x;
            newPos.z = v2.y;


            newPositions.push(newPos.x);
            newPositions.push(newPos.y);
            newPositions.push(newPos.z);
        }
        const vertices = new Float32Array(newPositions);
        const buff = new THREE.Float32BufferAttribute( vertices, 3 );
        mesh.geometry.setAttribute( 'position', buff);
    }

    static simplify(originalJson){
        let jsonData = JSON.parse(JSON.stringify(originalJson));
        for(let j = 0; j < jsonData.geometry.shapes.length-1; j++)
        {
            let shape = jsonData.geometry.shapes[j];
            for(let i = j+1; i < jsonData.geometry.shapes.length; i++){
                let shape2 = jsonData.geometry.shapes[i];
                let sameRadii = shape.shapeProperties.radius1===shape.shapeProperties.radius2
                    && shape2.shapeProperties.radius1 === shape2.shapeProperties.radius2
                    && shape.shapeProperties.radius1 === shape2.shapeProperties.radius1;
                let sameRadiusIncrement = shape.shapeProperties.radius1 !==shape.shapeProperties.radius2
                    && shape2.shapeProperties.radius1 !== shape2.shapeProperties.radius2
                    && Math.abs((shape.shapeProperties.radius1 - shape.shapeProperties.radius2) - (shape2.shapeProperties.radius1 - shape2.shapeProperties.radius2)) < 0.2;
                let sameColor = shape.color.r === shape2.color.r && shape.color.g === shape2.color.g && shape.color.b === shape2.color.b;
                if(sameColor) {
                    if(sameRadii){
                        shape.shapeProperties.height+=shape2.shapeProperties.height;
                        shape.position.z = shape2.position.z;
                        jsonData.geometry.shapes.splice(i,1);
                        i--;
                    }
                    if(sameRadiusIncrement){
                        shape.shapeProperties.height+=shape2.shapeProperties.height;
                        shape.position.z = shape2.position.z;
                        shape.shapeProperties.radius1 = shape2.shapeProperties.radius1;
                        jsonData.geometry.shapes.splice(i,1);
                        i--;
                    }
                }
            }
        }
        return jsonData;
    }
    static generate(jsonData, material, normalize= false, axes = 'x y z'){
        if(!material) material  =new THREE.MeshBasicMaterial({color: 0xff00ff});
        let monopileTop = -10000;
        let monopileBot = 10000;
        let waterHeight=0;
        let root = new THREE.Object3D();
        let calcHeight = 0;
        let num = jsonData.geometry.shapes.length;
        let divisorX = normalize ? 3 : 1;
        let divisorY = normalize ? num : 1;
        let shapes = jsonData.geometry.shapes;
        const axArr = axes.split(' ');
        for(let j = 0; j < num; j++){
            const shape = jsonData.geometry.shapes[j];
            const topOuterRadius = shape.shapeProperties.radius2;
            const topInnerRadius = topOuterRadius - shape.shapeProperties.thickness;
            const botOuterRadius = shape.shapeProperties.radius1;
            const botInnerRadius = botOuterRadius - shape.shapeProperties.thickness;

            // console.log(topInnerRadius);
            // console.log(topOuterRadius);
            // console.log(botInnerRadius);
            // console.log(botOuterRadius);

            //let vertices = [];
            const vertNum = 50;
            let verts = [];
            let uvs = [];
            let height = shape.shapeProperties.height;
            calcHeight +=height;
            monopileTop = Math.max(monopileTop, shape.position.z+height);
            monopileBot = Math.min(monopileBot, shape.position.z);

            const push = (x,y,z)=>{
                let vec = {x:x, y:y, z:z};
                verts.push(vec[axArr[0]]);
                verts.push(vec[axArr[1]]);
                verts.push(vec[axArr[2]]);

            }

            for(let i = 0; i < vertNum; i++)
            {
                let sinAt = Math.sin(Math.PI*2*(i/vertNum));
                let cosAt = Math.cos(Math.PI*2*(i/vertNum));
                let sinNext = Math.sin(Math.PI*2*((i+1)/vertNum));
                let cosNext = Math.cos(Math.PI*2*((i+1)/vertNum));

                //top
                push(sinAt*topInnerRadius, height, cosAt*topInnerRadius);
                push(sinNext*topOuterRadius, height, cosNext*topOuterRadius);
                push(sinAt*topOuterRadius, height, cosAt*topOuterRadius);

                push(sinAt*topInnerRadius, height, cosAt*topInnerRadius);
                push(sinNext*topInnerRadius, height, cosNext*topInnerRadius);
                push(sinNext*topOuterRadius, height, cosNext*topOuterRadius);

                for(let k = 0; k < 6; k++)  uvs.push(0/divisorX,j/divisorY);

                //bottom
                push(sinAt*botInnerRadius, 0, cosAt*botInnerRadius);
                push(sinAt*botOuterRadius, 0, cosAt*botOuterRadius);
                push(sinNext*botOuterRadius, 0, cosNext*botOuterRadius);

                push(sinAt*botInnerRadius, 0, cosAt*botInnerRadius);
                push(sinNext*botOuterRadius, 0, cosNext*botOuterRadius);
                push(sinNext*botInnerRadius, 0, cosNext*botInnerRadius);

                for(let k = 0; k < 6; k++) uvs.push(1/divisorX,j/divisorY);

                //outer
                push(sinAt*topOuterRadius, height, cosAt*topOuterRadius);
                push(sinNext*topOuterRadius, height, cosNext*topOuterRadius);
                push(sinAt*botOuterRadius, 0, cosAt*botOuterRadius);

                push(sinAt*botOuterRadius, 0, cosAt*botOuterRadius);
                push(sinNext*topOuterRadius, height, cosNext*topOuterRadius);
                push(sinNext*botOuterRadius, 0, cosNext*botOuterRadius);

                for(let k = 0; k < 6; k++) uvs.push(2/divisorX,j/divisorY);

                //inner
                push(sinAt*topInnerRadius, height, cosAt*topInnerRadius);
                push(sinAt*botInnerRadius, 0, cosAt*botInnerRadius);
                push(sinNext*topInnerRadius, height, cosNext*topInnerRadius);

                push(sinAt*botInnerRadius, 0, cosAt*botInnerRadius);
                push(sinNext*botInnerRadius, 0, cosNext*botInnerRadius);
                push(sinNext*topInnerRadius, height, cosNext*topInnerRadius);

                for(let k = 0; k < 6; k++) uvs.push(3/divisorX,j/divisorY);

            }

            const geometry = new THREE.BufferGeometry();

            const vertices = new Float32Array(verts);
            const uvss = new Float32Array(uvs);

            geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
            geometry.setAttribute( 'uv', new THREE.BufferAttribute( uvss, 2 ) );
            geometry.setAttribute( 'uv1', new THREE.BufferAttribute( uvss, 2 ) );
            geometry.computeVertexNormals();

            const mesh = new THREE.Mesh( geometry, material );
            // mesh.translateY(shape.position.z);
            mesh.position[axArr[1]]+=(shape.position.z);
            mesh.name = j;
            mesh.shape = shape;
            mesh.index = j;
            root.add( mesh );

        }
        if(jsonData.properties.markings) {
            const textGroup = new THREE.Group();
            textGroup.skipMe = true;
            root.add(textGroup);
            jsonData.properties.markings.forEach(marking=>{
                 let [id, angle, height, radius, scale, text] = marking;
                 if(text === 'E') text = 'W';
                else if(text ==='W') text = 'E';
                // console.log(text);
                if(text && marking.length===6) {
                    let geometry = new TextGeometry(text, {
                        font: MonopileGenerator.font,
                        size: scale,
                        height: scale*0.025,
                        curveSegments: 2,
                        bevelEnabled: false,
                        bevelThickness: 10,
                        bevelSize: 8,
                        bevelOffset: 0,
                        bevelSegments: 5
                    });
                    if(text === 'I'){

                    }
                    const mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({color: 0x000000}) );
                    MonopileGenerator.curveText(mesh, radius+scale*0.025*0.5);
                    // mesh.name = text;
                    // console.log(mesh);
                    const textObject = new THREE.Object3D();
                    textGroup.add(textObject);
                    mesh.position[axArr[2]]+=radius+scale*0.025*0.5;
                    // mesh.position[axArr[0]]+=scale/2;
                    mesh.position[axArr[1]]+=height;
                    const rotationVector = new THREE.Vector3();
                    rotationVector[axArr[2]] = 1;
                    mesh.rotateOnAxis(rotationVector, Math.PI/1);
                    rotationVector[axArr[2]] = 0;

                    rotationVector[axArr[0]] = 1;
                    mesh.rotateOnAxis(rotationVector, -Math.PI/2);
                    rotationVector[axArr[0]] = 0;
                    rotationVector[axArr[1]] = 1;
                    textObject.add(mesh);
                    textObject.rotateOnAxis(rotationVector, (angle-scale*radius*(text.length*1.1+2))/180*Math.PI);
                }

            });
            {
                const first = jsonData.geometry.shapes[0];
                const second = jsonData.geometry.shapes[1];
                const combinedHeight = first.shapeProperties.height + second.shapeProperties.height;
                const position = second.position.z + combinedHeight / 2;
                const radius = (second.shapeProperties.radius1+second.shapeProperties.radius2)/2;


                for (let i = 0; i < 4; i++) {
                    const geometry = new THREE.BoxGeometry(0.05, 0.05, 1);
                    const mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({color: 0x000000}) );

                    const textObject = new THREE.Object3D();
                    textGroup.add(textObject);
                    mesh.position[axArr[2]]+=radius;
                    mesh.position[axArr[1]]+=position;
                    mesh.scale[axArr[1]]=combinedHeight;
                    const rotationVector = new THREE.Vector3();
                    rotationVector[axArr[1]] = 1;
                    textObject.add(mesh);
                    textObject.rotateOnAxis(rotationVector, i*Math.PI/2);
                }
            }
        }
        if(jsonData.properties.anodeStubs){
            const anodeStubGroup = new THREE.Group();
            anodeStubGroup.skipMe = true;
            root.add(anodeStubGroup);
            jsonData.properties.anodeStubs.forEach(anodeStub=>{
                const height = anodeStub.Elevation;
                const angle = anodeStub.Orientation;
                const radius = anodeStub.radius;
                const cylRadius = anodeStub.size[0]/2;
                const cylHeight = anodeStub.size[1];

                const geometry = new THREE.CylinderGeometry( cylRadius, cylRadius, cylHeight,12 );
                const mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({color: 0x000000}) );
                const stub = new THREE.Object3D();
                anodeStubGroup.add(stub);
                mesh.position[axArr[2]]+=radius+cylHeight/2;
                // mesh.position[axArr[0]]+=scale/2;
                mesh.position[axArr[1]]+=height;
                const rotationVector = new THREE.Vector3();
                rotationVector[axArr[1]] = 1;
                stub.add(mesh);
                stub.rotateOnAxis(rotationVector, (angle)/180*Math.PI);
            })
        }
        return root;
    }


}


function generateCan(shape){
    const topOuterRadius = shape.shapeProperties.radius2;
    const topInnerRadius = topOuterRadius - shape.shapeProperties.thickness;
    const botOuterRadius = shape.shapeProperties.radius1;
    const botInnerRadius = botOuterRadius - shape.shapeProperties.thickness;

    //let vertices = [];
    const vertNum = 50;
    let verts = [];
    let height = shape.shapeProperties.height;

    const push = (x,y,z)=>{
        let vec = {x:x, y:y, z:z};
        verts.push(vec.x);
        verts.push(vec.y);
        verts.push(vec.z);
    }

    for(let i = 0; i < vertNum; i++)
    {
        let sinAt = Math.sin(Math.PI*2*(i/vertNum));
        let cosAt = Math.cos(Math.PI*2*(i/vertNum));
        let sinNext = Math.sin(Math.PI*2*((i+1)/vertNum));
        let cosNext = Math.cos(Math.PI*2*((i+1)/vertNum));

        //top
        push(sinAt*topInnerRadius, height, cosAt*topInnerRadius);
        push(sinAt*topOuterRadius, height, cosAt*topOuterRadius);
        push(sinNext*topOuterRadius, height, cosNext*topOuterRadius);

        push(sinAt*topInnerRadius, height, cosAt*topInnerRadius);
        push(sinNext*topOuterRadius, height, cosNext*topOuterRadius);
        push(sinNext*topInnerRadius, height, cosNext*topInnerRadius);


        //bottom
        push(sinAt*botInnerRadius, 0, cosAt*botInnerRadius);
        push(sinNext*botOuterRadius, 0, cosNext*botOuterRadius);
        push(sinAt*botOuterRadius, 0, cosAt*botOuterRadius);

        push(sinAt*botInnerRadius, 0, cosAt*botInnerRadius);
        push(sinNext*botInnerRadius, 0, cosNext*botInnerRadius);
        push(sinNext*botOuterRadius, 0, cosNext*botOuterRadius);


        //outer
        push(sinAt*topOuterRadius, height, cosAt*topOuterRadius);
        push(sinAt*botOuterRadius, 0, cosAt*botOuterRadius);
        push(sinNext*topOuterRadius, height, cosNext*topOuterRadius);

        push(sinAt*botOuterRadius, 0, cosAt*botOuterRadius);
        push(sinNext*botOuterRadius, 0, cosNext*botOuterRadius);
        push(sinNext*topOuterRadius, height, cosNext*topOuterRadius);

        //inner
        push(sinAt*topInnerRadius, height, cosAt*topInnerRadius);
        push(sinNext*topInnerRadius, height, cosNext*topInnerRadius);
        push(sinAt*botInnerRadius, 0, cosAt*botInnerRadius);

        push(sinAt*botInnerRadius, 0, cosAt*botInnerRadius);
        push(sinNext*topInnerRadius, height, cosNext*topInnerRadius);
        push(sinNext*botInnerRadius, 0, cosNext*botInnerRadius);


    }

    const geometry = new THREE.BufferGeometry();

    const vertices = new Float32Array(verts);

    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    geometry.computeVertexNormals();

    return geometry;
}