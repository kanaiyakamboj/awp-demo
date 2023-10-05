import {ThreejsRendererBoilerplate} from "./../old-app/ThreejsRendererBoilerplate.js";
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { loadSVGInto } from './svg-loader.js';
import { getDiskColors } from './disk-colors.js';
import { Stepper } from './stepper.js';
import { Snapper } from './snapper.js';
import {CanvasClicker} from "./canvas-clicker.js";
import { OutlineMaterialManager } from './outline-material-manager.js';
import {MonoManager} from "./mono-manager.js";
import {FleetManager} from "./fleet-manager.js";

let scene;
let controls;
let compass = new THREE.Group();
let installRenderers = [];
let renderer;
let miniRenderer;
let mono2htvMap = {};
let storeData;
let stepper;
let monoManager = new MonoManager();
let materialManager;
let fleetManager = new FleetManager();
window.filterType = 'field';

window.loadCanvas = ()=> {
    scene =  new THREE.Scene();
    scene.background = new THREE.Color(0xf3f6fc);
    renderer = new ThreejsRendererBoilerplate(document.getElementById('fields-canvas-container'));
    miniRenderer = new ThreejsRendererBoilerplate(document.getElementById('first-panel-content-right-menu'));

    renderer.orth = true;
    miniRenderer.orth = true;
    renderer.camera.rotateX(-Math.PI/2);
    miniRenderer.camera.rotateX(-Math.PI/2);
    const installViews = [{
        divName: 'install-top-left-canvas-container',
        angle: 'Left'
    },{
        divName: 'install-top-right-canvas-container',
        angle: 'Iso'
    },{
        divName: 'install-bottom-canvas-container',
        angle: 'Top'
    }]
    installViews.forEach((divData=>{
        let ren = new ThreejsRendererBoilerplate(document.getElementById(divData.divName));
        ren.orth = true;
        ren.angle = divData.angle;
        // ren.resize(500, 500);
        installRenderers.push(ren);
    }));

    let cRect = renderer.canvas.getBoundingClientRect();
    let renderTarget = new THREE.WebGLRenderTarget(cRect.width,cRect.height);
    renderTarget.width = cRect.width;
    renderTarget.height=cRect.height;

    // miniRenderer.canvas.style.width = '50%';
    controls = new OrbitControls( renderer.camera.clone(true), renderer.renderer.domElement );
    controls.target = new THREE.Vector3(0, 0,0);
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI*2/5;
    controls.update();

    scene.clear();
    scene.torus = null;
    scene.background = new THREE.Color(0xf3f6fc);

    const size = 500;
    const divisions = 50;
    const gridHelper = new THREE.GridHelper(size, divisions, 0xDD2E1A, 0x0699D6);
    scene.add(gridHelper);
    let waterLevelCylinder = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 2, 32), new THREE.MeshBasicMaterial(
        {
            color: 0x0699D6,
            transparent: true,
            opacity: 0.25
        }));
    waterLevelCylinder.translateY(-1);
    // waterLevelTorus.rotateX(Math.PI / 2);
    scene.add(waterLevelCylinder);
    scene.add(monoManager.circles);
    scene.add(monoManager.piles);


    loadSVGInto(scene, 'assets/world2.svg', 5760, 2880, 4.50-5760/2, 75.5-2880/2, -0.001, 0x999999);
    loadSVGInto(compass, 'assets/icon0-vector-723-01.svg', 1, 1, -0.5, -0.5, 0);
    scene.add(fleetManager.htvGroup);
    scene.add(fleetManager.thialfGroup);

    let cWidth = renderer.canvas.width;


    const raycaster = new THREE.Raycaster();

    new CanvasClicker(renderer.canvas, (pointer, raw)=>{
        if(raw.z-raw.x < 60 && raw.y < 60){
            controls.object.position.x=monoManager.target.x;
            controls.object.position.y=20;
            controls.object.position.z=monoManager.target.z;
            controls.target.copy(monoManager.target);

            controls.object.zoom = 3*(cWidth/1000)/(Math.max(1,monoManager.zMax-monoManager.zMin));
            controls.update();
        }
        raycaster.setFromCamera(pointer, renderer.camera);

        // calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(monoManager.circles.children);
        // console.log(intersects);

        for (let i = 0; i < intersects.length; i++) {

            // console.log(intersects[i].object.name);
            let htv = mono2htvMap[intersects[i].object.name];
            if (htv) {
                document.getElementById('file-names').value = htv;
                onHtvDropdownChange({target: {value: htv}});
            }

            document.getElementById('sheet-names').value = intersects[i].object.name;
            onMonopileDropdownChange({target: {value: intersects[i].object.name}});

        }});

    const snapper = new Snapper();

    function doMiniRenderer(){

        materialManager.material.uniforms.camDir.value =  new THREE.Vector3(0,1,0);

        miniRenderer.camera.zoom = 1.5*(miniRenderer.canvas.width/270)/(Math.max(1,monoManager.zMax-monoManager.zMin));
        miniRenderer.camera.updateProjectionMatrix();

        materialManager.setColorsOf(['15045027000-3D-320-01-1001','Mesh'], 255,255,255);

        const zoom = miniRenderer.camera.zoom;

        fleetManager.htvGroup.scale.x=0.00005 * Math.max(2.0,25/zoom);
        fleetManager.htvGroup.scale.y=0.00005 * Math.max(2.0,25/zoom);
        fleetManager.htvGroup.scale.z=0.00005 * Math.max(2.0,25/zoom);

        fleetManager.thialfGroup.scale.x=0.00005 * Math.max(2.0,25/zoom);
        fleetManager.thialfGroup.scale.y=0.00005 * Math.max(2.0,25/zoom);
        fleetManager.thialfGroup.scale.z=0.00005 * Math.max(2.0,25/zoom);
        // console.log(black);
        monoManager.circles.children.forEach((c)=>{

            c.scale.x =  Math.max(0.1, Math.min(2.0,7.5/zoom));
            c.scale.z =  Math.max(0.1, Math.min(2.0,7.5/zoom));
            c.mono.visible = false;
            c.visible = true;
        });

        miniRenderer.renderSimple(scene);
    }

    function doCompass(renderer){
        const rect = renderer.div.getBoundingClientRect();
        let vec = new THREE.Vector3((rect.width-75)/rect.width,(rect.height-75)/rect.height,-0.0);
        vec.unproject(renderer.camera);
        compass.position.copy(vec);
        compass.scale.x= 1/renderer.camera.zoom;
        compass.scale.y= 1/renderer.camera.zoom;
        compass.scale.z= 1/renderer.camera.zoom;
        renderer.renderSimple(compass);
    }

    let columnMap = {
        htvDraft : 'Eng_Data *HTV DRAFT',
        hlvDraft : 'Eng_Data *HLV DRAFT',
        htvDistHlv : 'Eng_Data *HTV DIST HLV',
        psBoom : 'HLV_PS_Crane *PS BOOM',
        sbBoom : 'HLV_SB_Crane *SB BOOM',
        psSlew : 'HLV_PS_Crane *PS SLEW',
        sbSlew : 'HLV_SB_Crane *SB SLEW',
        htvPosInField : 'HTV Position In Field',

    }

    function update() {
        requestAnimationFrame(update);
        if(!materialManager) return;
        // if(window.fieldCanvasDisabled) return;
        waterLevelCylinder.position.x = monoManager.target.x;
        // waterLevelTorus.position.y = -0.01;
        waterLevelCylinder.position.z = monoManager.target.z;
        waterLevelCylinder.scale.y=1;
        waterLevelCylinder.position.y = 0;
        waterLevelCylinder.translateY(-1);

        if(stepper) stepper.update();

        materialManager.setColorsOf(['Mesh009', 'Mesh001', 'Mesh002', 'Mesh010',
            'Thialf--THIPMB', 'Thialf--THIPAB', 'Thialf--THIPWB', 'Thialf--THISMB', 'Thialf--THISAB', 'Thialf--THISWB',],
            128,128,128);
        for(let i = 0; i < 55; i++) materialManager.colors[i] = new THREE.Vector3(128/255, 128/255, 128/255);
        const deckLayout = storeData.Deck_Layout_HTV01.Sheet1.steps.map(x=>storeData.Deck_Layout_HTV01.Sheet1.stepsData[x]);


        const psfd = JSON.parse(localStorage.getItem("projectSelectionFilterData"));
        const csd = (psfd && psfd.stepsData && psfd.currentStep) ?psfd.stepsData[psfd.currentStep] : null;
        const {pink, black, purple, red}=getDiskColors(storeData, psfd);



        monoManager.circles.children.forEach((c)=>{

            const idx = red.includes(c.name) ? 2:(pink.includes(c.name)?(purple.includes(c.name)?4:1):(black.includes(c.name)?3:0));
            c.material = monoManager.materials[idx];
            if(red.includes(c.name)){
                const nextMPPos = monoManager.nameMap.get(stepper.getNextMP()).position;
                let htvPos = new THREE.Vector3();
                htvPos.copy(c.position);
                let lerpFac;
                if(csd[columnMap.htvPosInField] === 'offset from e/n cur pile') lerpFac = 0;
                if(csd[columnMap.htvPosInField] === 'interpolation') lerpFac = 0.5;
                if(csd[columnMap.htvPosInField] === 'offset from e/n next pile') lerpFac = 1;
                htvPos.lerp(nextMPPos, lerpFac);

                fleetManager.htvGroup.position.x = htvPos.x + Number(csd.HTV_X) / 5000;
                fleetManager.htvGroup.position.y = Number(csd.HTV_Z)/ 5000;
                fleetManager.htvGroup.position.z= htvPos.z- Number(csd.HTV_Y)/ 5000;

                let htvGroupQuat = new THREE.Quaternion(Number(csd.HTV_QX), Number(csd.HTV_QZ), -Number(csd.HTV_QY), Number(csd.HTV_QW));
                htvGroupQuat.invert();
                fleetManager.htvGroup.quaternion.copy(htvGroupQuat);
                if(csd[columnMap.htvPosInField] === 'interpolation') {
                    fleetManager.htvGroup.lookAt(nextMPPos.x, 0, nextMPPos.z);
                    fleetManager.htvGroup.rotateY(-Math.PI/2);
                }

                fleetManager.thialfGroup.position.x = c.position.x + Number(csd.HLV_X) / 5000;
                fleetManager.thialfGroup.position.y = Number(csd.HLV_Z)/ 5000;
                fleetManager.thialfGroup.position.z= c.position.z- Number(csd.HLV_Y)/ 5000;

                let thialfGroupQuat = new THREE.Quaternion(Number(csd.HLV_QX), Number(csd.HLV_QZ), -Number(csd.HLV_QY), Number(csd.HLV_QW));
                thialfGroupQuat.invert();
                fleetManager.thialfGroup.quaternion.copy(thialfGroupQuat);

                // console.log(monoManager.nameMap.get(stepper.getNextMP()));

            }
        });

        doMiniRenderer();
        doCompass(miniRenderer);

        const rect = renderer.div.getBoundingClientRect();
        materialManager.material.uniforms.winWidth.value = rect.width;
        materialManager.material.uniforms.winHeight.value = rect.height;

        renderer.camera.updateProjectionMatrix();
        materialManager.setColorsOf(['15045027000-3D-320-01-1001','Mesh'], 205,205,205);

        const zoom = renderer.camera.zoom;

        fleetManager.htvGroup.scale.x=0.0001 * Math.max(2.0,25/zoom);
        fleetManager.htvGroup.scale.y=0.0001 * Math.max(2.0,25/zoom);
        fleetManager.htvGroup.scale.z=0.0001 * Math.max(2.0,25/zoom);

        fleetManager.thialfGroup.scale.x=0.0001 * Math.max(2.0,25/zoom);
        fleetManager.thialfGroup.scale.y=0.0001 * Math.max(2.0,25/zoom);
        fleetManager.thialfGroup.scale.z=0.0001 * Math.max(2.0,25/zoom);

        // console.log(black);
        monoManager.circles.children.forEach((c)=>{

           c.scale.x =  Math.max(0.1, Math.min(2.0,7.5/zoom));
           c.scale.z =  Math.max(0.1, Math.min(2.0,7.5/zoom));
           c.position.y =  (c.mono.jsonProperties.seaLevel+1) * 0.0001 * Math.max(2.0,125/zoom);
            c.mono.scale.x=0.0001 * Math.max(2.0,125/zoom);
            c.mono.scale.y=0.0001 * Math.max(2.0,125/zoom);
            c.mono.scale.z=0.0001 * Math.max(2.0,125/zoom);

            c.mono.position.x=c.position.x;
            c.mono.position.z=c.position.z;
            c.mono.position.y=0;
            c.mono.quaternion.copy(c.quaternion);
            const idx = red.includes(c.name) ? 2:(pink.includes(c.name)?(purple.includes(c.name)?4:1):(black.includes(c.name)?3:0));


           c.mono.visible = !(snapper.doSnap || window.filterType !== 'field') && idx!==0;
           c.visible = !(snapper.doSnap && idx!==2 || window.filterType !== 'field');

           if(fleetManager.htv && fleetManager.thalf && (idx===1||idx===2)){

               if(idx===2){
                   waterLevelCylinder.scale.y=-0.0001*c.mono.jsonProperties.seaLevel;
                   waterLevelCylinder.position.y = 0;
                   waterLevelCylinder.translateY(-waterLevelCylinder.scale.y);
                    // console.log(c.mono.selectionId);
                   materialManager.material.uniforms.selectedObjId.value = c.mono.selectionId/256;
                   materialManager.groupMap.get(materialManager.nameObjIdMap.get('Mesh009')).rotation.y=Number(csd[columnMap.sbSlew])/180*(Math.PI);
                   materialManager.groupMap.get(materialManager.nameObjIdMap.get('Mesh001')).rotation.y=Number(csd[columnMap.psSlew])/180*(Math.PI);
                    //PS
                   let psBoomAngle = Number(csd[columnMap.psBoom])/180*(Math.PI);
                   if(!psBoomAngle) psBoomAngle = Math.PI/3;
                   materialManager.groupMap.get(materialManager.nameObjIdMap.get('Mesh002')).rotation.z=psBoomAngle;
                   materialManager.groupMap.get(materialManager.nameObjIdMap.get('Thialf--THIPMB')).rotation.z=-psBoomAngle;
                   materialManager.groupMap.get(materialManager.nameObjIdMap.get('Thialf--THIPAB')).rotation.z=-psBoomAngle;
                   materialManager.groupMap.get(materialManager.nameObjIdMap.get('Thialf--THIPWB')).rotation.z=-psBoomAngle;
                   //SB
                   let sbBoomAngle = Number(csd[columnMap.sbBoom])/180*(Math.PI);
                   if(!sbBoomAngle) sbBoomAngle = Math.PI/3;
                   materialManager.groupMap.get(materialManager.nameObjIdMap.get('Mesh010')).rotation.z=sbBoomAngle;
                   materialManager.groupMap.get(materialManager.nameObjIdMap.get('Thialf--THISMB')).rotation.z=-sbBoomAngle;
                   materialManager.groupMap.get(materialManager.nameObjIdMap.get('Thialf--THISAB')).rotation.z=-sbBoomAngle;
                   materialManager.groupMap.get(materialManager.nameObjIdMap.get('Thialf--THISWB')).rotation.z=-sbBoomAngle;



                   let monoData = csd;//idx==2?csd:data;

                   let rot = new THREE.Quaternion();
                   let pos = new THREE.Vector3();
                   fleetManager.thalf.getWorldQuaternion(rot);
                   let localRot = new THREE.Quaternion(Number(monoData.MP_QX), Number(monoData.MP_QZ), -Number(monoData.MP_QY), Number(monoData.MP_QW));
                   let preRot = new THREE.Quaternion();
                   preRot.setFromEuler(new THREE.Euler( -Math.PI/2, -Math.PI/2, 0));
                   localRot.premultiply(preRot);
                   rot.multiply(localRot);
                   // rot = new THREE.Quaternion(Number(monoData.MP_QX),Number(monoData.MP_QZ), -Number(monoData.MP_QY), Number(monoData.MP_QW));
                   c.mono.visible = true;
                   c.mono.quaternion.copy(rot);
                   pos = new THREE.Vector3(Number(monoData.MP_X),Number(monoData.MP_Z), -Number(monoData.MP_Y));

                   // console.log(pos);
                   // pos.y+=14;
                   // console.log(pos);
                   c.mono.position.copy(fleetManager.thalf.localToWorld(pos));
               } else {
                   const myIndex = storeData[psfd.fileName].monopiles.indexOf(c.name);
                   const myPosData = deckLayout[myIndex];
                   // console.log(myPosData);
                   const data = storeData[psfd.fileName][c.name].stepsData[storeData[psfd.fileName][c.name].steps[0]];
                   let rot = new THREE.Quaternion();
                   let pos = new THREE.Vector3();
                   fleetManager.htv.getWorldQuaternion(rot);
                   rot.multiply(new THREE.Quaternion(Number(myPosData.HTV_DL_QX), Number(myPosData.HTV_DL_QZ), -Number(myPosData.HTV_DL_QY), Number(myPosData.HTV_DL_QW)));
                   c.mono.visible = true;
                   c.mono.quaternion.copy(rot);
                   pos = new THREE.Vector3(Number(myPosData.HTV_DL_X), Number(myPosData.HTV_DL_Z) , -Number(myPosData.HTV_DL_Y));
                   // console.log(pos);
                   pos.y+=14;
                   // console.log(pos);
                   c.mono.position.copy(fleetManager.htv.localToWorld(pos));
               }


               c.mono.scale.x=0.0002 ;//* Math.max(2.0,25/zoom);
               c.mono.scale.y=0.0002 ;//* Math.max(2.0,25/zoom);
               c.mono.scale.z=0.0002 ;//* Math.max(2.0,25/zoom);
           }

           c.mono.children.forEach((ch)=>{
               // ch.material = materials[idx];
           });

        });

        if(snapper.doSnap || window.filterType !== 'field'){
            let pos = new THREE.Vector3();
            let rot = new THREE.Quaternion();
            fleetManager.thalf.getWorldPosition(pos);
            // thalf.getWorldQuaternion(rot);
            rot.invert();
            let ang = snapper.ang;
            pos.y+=ang.yOff/5000;
            renderer.camera.position.copy(pos);
            renderer.camera.quaternion.copy(rot);
            // console.log(htv.rotation);


            let offset = new THREE.Vector3(ang.x,ang.y,ang.z);
            let worldQuat = new THREE.Quaternion();
            fleetManager.thalf.getWorldQuaternion(worldQuat);
            offset.applyQuaternion(worldQuat);
            // fleetManager.thalf.localToWorld(offset);

            renderer.camera.position.add(offset);
            // renderer.camera.translateX(ang.x);
            // renderer.camera.translateY(ang.y);
            // renderer.camera.translateZ(ang.z);
            renderer.camera.lookAt(pos);
            if(ang.rotate) renderer.camera.rotateZ(fleetManager.thalf.rotation.y-Math.PI*3/4);
            renderer.camera.zoom = ang.zoom;
        } else {
            renderer.camera.position.copy(controls.object.position);
            renderer.camera.quaternion.copy(controls.object.quaternion);
            renderer.camera.zoom = controls.object.zoom;
        }

        if(window.filterType === 'field') {
            renderer.camera.updateProjectionMatrix();
            if (renderTarget.width !== rect.width || renderTarget.height !== rect.height) renderTarget.setSize(rect.width, rect.height);

            let rezoom = renderer.canvas.width / cWidth;
            controls.object.zoom *= rezoom;
            controls.update();
            cWidth = renderer.canvas.width;

            let camDir = new THREE.Vector3(0, 0, 0);
            camDir.subVectors(renderer.camera.position, snapper.doSnap ? fleetManager.thalf.getWorldPosition(new THREE.Vector3(0, 0, 0)) : controls.target);
            camDir.normalize();
            materialManager.material.uniforms.camDir.value = camDir;

            materialManager.material.uniforms.renderSurfaceIds.value = true;
            materialManager.material.uniforms.objectIdTex.value = null;
            renderer.renderer.setRenderTarget(renderTarget);
            renderer.renderer.clearColor();
            waterLevelCylinder.visible = false;
            renderer.renderSimple(scene);
            // outlineMeshes.forEach((mesh)=>{
            //     renderer.renderSimple(mesh);
            // })
            materialManager.material.uniforms.renderSurfaceIds.value = false;
            materialManager.material.uniforms.objectIdTex.value = renderTarget.texture;
            renderer.renderer.setRenderTarget(null);
            waterLevelCylinder.visible = true;
            renderer.renderSimple(scene);

            doCompass(renderer);
        }
        if(window.filterType === 'install') {
            installRenderers.forEach((ren)=>{
                ren.camera.updateProjectionMatrix();
                snapper.setFor(waterLevelCylinder, fleetManager, ren);
                let camDir = new THREE.Vector3(0, 0, 0);
                camDir.subVectors(ren.camera.position,  fleetManager.thalf.getWorldPosition(new THREE.Vector3(0, 0, 0)));
                camDir.normalize();
                // ren.resize();
                materialManager.material.uniforms.camDir.value = camDir;

                const rect = ren.div.getBoundingClientRect();
                materialManager.material.uniforms.winWidth.value = rect.width;
                materialManager.material.uniforms.winHeight.value = rect.height;
                renderTarget.setSize(rect.width, rect.height);
                materialManager.material.uniforms.renderSurfaceIds.value = true;
                materialManager.material.uniforms.objectIdTex.value = null;
                ren.renderer.setRenderTarget(renderTarget);
                ren.renderer.clearColor();
                waterLevelCylinder.visible = false;
                ren.renderSimple(scene);

                materialManager.material.uniforms.renderSurfaceIds.value = false;
                materialManager.material.uniforms.objectIdTex.value = renderTarget.texture;
                ren.renderer.setRenderTarget(null);
                waterLevelCylinder.visible = true;
                ren.renderSimple(scene);
            });
        }


    }
    if(localStorage.getItem("selectedProjectStore")!== null) datastoreLoaded();
    update();
}

window.datastoreLoaded = ()=>{
    materialManager = new OutlineMaterialManager();
    monoManager.clear();
    storeData = JSON.parse(localStorage.getItem("selectedProjectStore"));
    stepper = new Stepper(storeData);
    // console.log(storeData);
    mono2htvMap = {};
    // console.log(storeData.fileNames);
    storeData.fileNames.forEach((htv)=>{
        // console.log(storeData[htv]);
        storeData[htv].monopiles.forEach((mono)=>{
            mono2htvMap[mono] = htv;
            let json = storeData[mono];
            // console.log(json);
            let monoMesh = monoManager.buildMonopile(json.properties?json:json[0]);
            materialManager.countMeshes(monoMesh);
            materialManager.setMatRec(monoMesh, false);
        });

    });
    monoManager.calculateBounds();
    controls.object.position.x=monoManager.target.x;
    controls.object.position.y=20;
    controls.object.position.z=monoManager.target.z;
    controls.target.copy(monoManager.target);

    controls.object.zoom = 3*(renderer.canvas.width/1000)/(Math.max(1,monoManager.zMax-monoManager.zMin));
    miniRenderer.camera.zoom = 7*(miniRenderer.canvas.width/270)/(Math.max(1,monoManager.zMax-monoManager.zMin));
    // miniRenderer.camera.zoom = controls.object.zoom*2;
    miniRenderer.camera.position.copy( controls.object.position);
    controls.update();
    // console.log(mono2htvMap);

    fleetManager.load(materialManager, '150450.27000-3D-320-01-1_full','THIALF' );
}