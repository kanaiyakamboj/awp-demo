import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { LuminosityShader } from 'three/addons/shaders/LuminosityShader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class ThreejsMonopileGenerator {

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
    static generate(jsonData, material, normalize= false){
        let monopileTop = -10000;
        let monopileBot = 10000;
        let waterHeight=0;
        let root = new THREE.Object3D();
        let calcHeight = 0;
        let num = jsonData.geometry.shapes.length;
        let divisorX = normalize ? 3 : 1;
        let divisorY = normalize ? num : 1;
        let shapes = jsonData.geometry.shapes;
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

            for(let i = 0; i < vertNum; i++)
            {
                let sinAt = Math.sin(Math.PI*2*(i/vertNum));
                let cosAt = Math.cos(Math.PI*2*(i/vertNum));
                let sinNext = Math.sin(Math.PI*2*((i+1)/vertNum));
                let cosNext = Math.cos(Math.PI*2*((i+1)/vertNum));

                //top
                verts.push(sinAt*topInnerRadius, height, cosAt*topInnerRadius);
                verts.push(sinAt*topOuterRadius, height, cosAt*topOuterRadius);
                verts.push(sinNext*topOuterRadius, height, cosNext*topOuterRadius);

                verts.push(sinAt*topInnerRadius, height, cosAt*topInnerRadius);
                verts.push(sinNext*topOuterRadius, height, cosNext*topOuterRadius);
                verts.push(sinNext*topInnerRadius, height, cosNext*topInnerRadius);

                for(let k = 0; k < 6; k++)  uvs.push(0/divisorX,j/divisorY);

                //bottom
                verts.push(sinAt*botInnerRadius, 0, cosAt*botInnerRadius);
                verts.push(sinNext*botOuterRadius, 0, cosNext*botOuterRadius);
                verts.push(sinAt*botOuterRadius, 0, cosAt*botOuterRadius);

                verts.push(sinAt*botInnerRadius, 0, cosAt*botInnerRadius);
                verts.push(sinNext*botInnerRadius, 0, cosNext*botInnerRadius);
                verts.push(sinNext*botOuterRadius, 0, cosNext*botOuterRadius);

                for(let k = 0; k < 6; k++) uvs.push(1/divisorX,j/divisorY);

                //outer
                verts.push(sinAt*topOuterRadius, height, cosAt*topOuterRadius);
                verts.push(sinAt*botOuterRadius, 0, cosAt*botOuterRadius);
                verts.push(sinNext*topOuterRadius, height, cosNext*topOuterRadius);

                verts.push(sinAt*botOuterRadius, 0, cosAt*botOuterRadius);
                verts.push(sinNext*botOuterRadius, 0, cosNext*botOuterRadius);
                verts.push(sinNext*topOuterRadius, height, cosNext*topOuterRadius);

                for(let k = 0; k < 6; k++) uvs.push(2/divisorX,j/divisorY);

                //inner
                verts.push(sinAt*topInnerRadius, height, cosAt*topInnerRadius);
                verts.push(sinNext*topInnerRadius, height, cosNext*topInnerRadius);
                verts.push(sinAt*botInnerRadius, 0, cosAt*botInnerRadius);

                verts.push(sinAt*botInnerRadius, 0, cosAt*botInnerRadius);
                verts.push(sinNext*topInnerRadius, height, cosNext*topInnerRadius);
                verts.push(sinNext*botInnerRadius, 0, cosNext*botInnerRadius);

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
            mesh.translateY(shape.position.z)
            mesh.name = j;
            mesh.shape = shape;
            mesh.index = j;
            root.add( mesh );
        }
        return root;
    }
}