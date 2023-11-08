import {RendererBoilerplate} from "./renderer-boilerplate.js";
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { loadSVGInto } from './svg-loader.js';
import { getDiskColors } from './disk-colors.js';
import { Stepper } from './stepper.js';
import { Snapper } from './snapper.js';
import {CanvasClicker} from "./canvas-clicker.js";
import { OutlineMaterialManager } from './outline-material-manager.js';
import { FallbackMaterialManager } from './fallback-material-manager.js';
import {MonoManager} from "./mono-manager.js";
import {FleetManager} from "./fleet-manager.js";
import {v3, v2, q} from "../tjs.js";
import {MonopileGenerator} from "./monopile-generator.js";
import {SubjectManager} from "./subject-manager.js";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

let scene;
let compass = new THREE.Group();
let installRenderers = [];
let miniRenderer;
let mono2htvMap = {};
let storeData;
let stepper;
let monoManager = new MonoManager();
let subjectManager = new SubjectManager();
let materialManager;

let fleetManager = new FleetManager();
let     dataLoaded = false;
// let snapper = new Snapper(true);

let currHTVName;
let currMPName;
let currSTEPName;
let currFilterType;
let controlsActive =false;

window.filterType = 'install';

function initInstallControls (storeData){
    const idxs = storeData.cameraConfig.angles.map(x=>x.name);
    console.log(idxs);
    storeData.cameraConfig.installViews.forEach((divData=>{
        let ren = new RendererBoilerplate(document.getElementById(divData.divName));
        ren.orth = true;
        ren.angle = idxs.indexOf(divData.angle);
        ren.camera.rotateX(-pi/2);
        ren.camera.near = -20 * 5000 ;
        ren.camera.far = 40 * 5000 ;
        ren.title = document.getElementById(divData.divName+"-title");
        // ren.resize(500, 500);
        installRenderers.push(ren);

    }));
    installRenderers.forEach((ren=>{
        ren.controls = new OrbitControls( ren.camera.clone(true), ren.renderer.domElement );
        ren.controls.target = new THREE.Vector3(0, 0,0);
        ren.controls.screenSpacePanning = false;
        // ren.controls.enablePan = true;
        // ren.controls.maxPolarAngle = pi*2/5;
        ren.controls.update();
        ren.snapper = new Snapper(storeData,false);
        ren.snapper.angle = ren.angle;
        ren.cWidth = ren.canvas.width;
        if(ren.cWidth===0)ren.cWidth=1;
    }));

    const raycaster = new THREE.Raycaster();

    installRenderers.forEach((ren=>{
        const raycaster = new THREE.Raycaster();
        new CanvasClicker(ren.canvas, async (pointer, raw)=>{
            if(raw.z-raw.x < 60 && raw.y < 60){
                ren.controls.object.position.x=monoManager.target.x;
                ren.controls.object.position.y=20;
                ren.controls.object.position.z=monoManager.target.z;
                ren.controls.target.copy(monoManager.target);

                ren.controls.object.zoom = 3*(ren.cWidth/1000)/(Math.max(1,monoManager.zMax-monoManager.zMin));
                ren.controls.update();
                window.needsRedraw = 5;
            }
            else if(raw.x < 60 && raw.y < 60){
                if(!ren.snapper.doSnap) {
                    ren.snapper.toggle();
                    ren.title.innerText = storeData.cameraConfig.angles[ren.snapper.angle].titleName;
                }
                else {
                    ren.snapper.next();
                    ren.title.innerText = storeData.cameraConfig.angles[ren.snapper.angle].titleName;
                }
            } else if(ren.snapper.doSnap) {
                ren.snapper.toggle();
                ren.title.innerText = 'Free';
            }
            raycaster.setFromCamera(pointer, ren.camera);
            console.log(raycaster.ray);
            const dir1k = v3.mul(raycaster.ray.direction, 10000);
            console.log(dir1k);
            const newOrigin = v3.sub(raycaster.ray.origin,dir1k);
            console.log(newOrigin);
            raycaster.ray.origin.copy( newOrigin);
            console.log(raycaster.ray);

            // calculate objects intersecting the picking ray
            const intersects = raycaster.intersectObjects(monoManager.circles.children);
            console.log(intersects);
            console.log(raw);
            console.log(pointer);
            console.log(raycaster);
            const psfd = LocalObjectStore.getDataByKey("projectSelectionFilterData");
            for (let i = 0; i < intersects.length; i++) {

                // console.log(intersects[i].object.name);
                let htv = mono2htvMap[intersects[i].object.name];
                if (htv && htv!==psfd.fileName) {
                    document.getElementById('file-names').value = htv;
                    await onHtvDropdownChange({target: {value: htv}});
                }
                document.getElementById('sheet-names').value = intersects[i].object.name;
                document.getElementById('template-name').innerHTML = intersects[i].object.name;
                await onMonopileDropdownChange({target: {value: intersects[i].object.name}});


            }});
    }));



    installRenderers.forEach(ren=>{
        ren.controls.addEventListener('start', () => {controlsActive=true;window.needsRedraw = 3;});

        // controls.addEventListener('change', () => console.log('dragged!'));

        ren.controls.addEventListener('end', () => { ren.controls.update(); controlsActive=false});
    });
}

window.loadCanvas = ()=> {
    scene =  new THREE.Scene();
    scene.background = new THREE.Color(0xf3f6fc);
    miniRenderer = new RendererBoilerplate(document.getElementById('first-panel-content-right-menu'));



    miniRenderer.orth = true;
    miniRenderer.camera.rotateX(-pi/2);
    miniRenderer.camera.near = -20 * 5000 ;
    miniRenderer.camera.far = 40 * 5000 ;



    let renderTarget = new THREE.WebGLRenderTarget(100,100);

    // miniRenderer.canvas.style.width = '50%';
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
    // waterLevelTorus.rotateX(pi / 2);
    scene.add(waterLevelCylinder);
    scene.add(monoManager.circles);
    scene.add(monoManager.piles);

    {
        const w = 5760*5000;
        const h = 2880*5000;
        const xOff=  (4.50-5760/2)*5000;
        const yOff=  (75.5-2880/2)*5000;
        loadSVGInto(scene, 'assets/world2.svg', w,h ,xOff , yOff, -0.001*5000, 0x999999);

    }
    loadSVGInto(compass, 'assets/icon0-vector-723-01.svg', 1, 1, -0.5, -0.5, 0);
    const axesHelper =new THREE.Group();
    axesHelper.add(new THREE.AxesHelper( 1 ));
    const faces = [
        {
            rotation: q.eul(0,pi/2, 0),
            color: 0xff0000,
            translate: v3.new( 0.375, 0,0),
            text: 'X',
            textColor: 0xffffff
        },
        {
            rotation: q.eul(0,-pi/2, 0),
            color: 0x00ffff,
            translate: v3.new(-0.375, 0, 0),
            text: 'X',
            textColor: 0x000000
        },
        {
            rotation: q.eul(pi/2, 0,0),
            color: 0x00ff000,
            translate: v3.new(0,0.375,  0),
            text: 'Y',
            textColor: 0xffffff
        },
        {
            rotation: q.eul(-pi/2, 0,0),
            color: 0xff00ff,
            translate: v3.new(0,-0.375,  0),
            text: 'Y',
            textColor: 0x000000
        },
        {
            rotation: q.eul(0,0,pi/2),
            color: 0x0000ff,
            translate: v3.new(0, 0, 0.375),
            text: 'Z',
            textColor: 0xffffff
        },
        {
            rotation: q.eul(0,0,-pi/2),
            color: 0xffff00,
            translate: v3.new(0, 0, -0.375),
            text: 'Z',
            textColor: 0x000000
        }
    ];
    MonopileGenerator.init(()=>{
        faces.forEach((face)=>{
            const geometry = new THREE.PlaneGeometry( 0.75, 0.75 );
            const material = new THREE.MeshBasicMaterial( {color: face.color, side: THREE.DoubleSide} );
            const plane = new THREE.Mesh( geometry, material );
            // plane.translateX(0.5);
            // plane.translateY(0.5);
            // plane.translateZ(-0.375);
            plane.position.add(face.translate);
            plane.quaternion.copy(face.rotation);
            axesHelper.add( plane );
            {
                let geometry = new TextGeometry(face.text, {
                    font: MonopileGenerator.font,
                    size: 0.5,
                    height: 0.5*0.1,
                    curveSegments: 2,
                    bevelEnabled: false,
                    bevelThickness: 10,
                    bevelSize: 8,
                    bevelOffset: 0,
                    bevelSegments: 5
                });
                const mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({color: face.textColor}) );
                mesh.position.add(face.translate);
                mesh.quaternion.copy(face.rotation);
                // axesHelper.add( mesh );
            }

        });
    });

    scene.add(fleetManager.htvGroup);
    scene.add(fleetManager.thialfGroup);





    function doMiniRenderer(htv, hlv){

        materialManager.material.uniforms.camDir.value =  new THREE.Vector3(0,1,0);

        miniRenderer.camera.zoom = 1.5*(miniRenderer.canvas.width/270)/(Math.max(1,monoManager.zMax-monoManager.zMin));
        miniRenderer.camera.updateProjectionMatrix();

        materialManager.setColorsOf(['15045027000-3D-320-01-1001','Mesh'], 255,255,255);

        // monoManager.circles.children.forEach((c) => {
        //     c.mono.visible = false;
        //     c.visible = true;
        // });

        const zoom = miniRenderer.camera.zoom*5000;
        if(htv) {
            htv.scale.x = Math.max(0.5, 6.25 / zoom);
            htv.scale.y = Math.max(0.5, 6.25 / zoom);
            htv.scale.z = Math.max(0.5, 6.25 / zoom);
        }
        if(hlv) {
            hlv.scale.x = Math.max(0.5, 6.25 / zoom);
            hlv.scale.y = Math.max(0.5, 6.25 / zoom);
            hlv.scale.z = Math.max(0.5, 6.25 / zoom);
        }
        // console.log(black);
        monoManager.circles.children.forEach((c)=>{

            c.scale.x =  Math.max(1, Math.min(20,75/zoom)) * 500;
            c.scale.z =  Math.max(1, Math.min(20,75/zoom)) * 500;
            c.position.y = (c.mono.jsonProperties.seaLevel + 1) * 0.5 * Math.max(2.0, 125 / zoom) ;
            c.mono.visible = false;
            c.visible = true;
        });

        miniRenderer.renderSimple(scene);
    }

    function doCompass(renderer){
        const rect = renderer.div.getBoundingClientRect();
        let vec = new THREE.Vector3((rect.width-75)/rect.width,(rect.height-75)/rect.height,-0.9);
        vec.unproject(renderer.camera);
        compass.position.copy(vec);
        compass.scale.x= 1/renderer.camera.zoom;
        compass.scale.y= 1/renderer.camera.zoom;
        compass.scale.z= 1/renderer.camera.zoom;
        renderer.renderSimple(compass);
    }

    function doAxisHelper(renderer){
        const rect = renderer.div.getBoundingClientRect();
        let vec = new THREE.Vector3((-rect.width+75)/rect.width,(rect.height-75)/rect.height,-0.9);
        vec.unproject(renderer.camera);
        axesHelper.position.copy(vec);
        axesHelper.scale.x= 1/renderer.camera.zoom;
        axesHelper.scale.y= 1/renderer.camera.zoom;
        axesHelper.scale.z= 1/renderer.camera.zoom;
        renderer.renderSimple(axesHelper);
    }




    const needsToRedraw = (htv, mp, step) =>{
        let redraw = controlsActive;
        redraw |= currHTVName!==htv;
        currHTVName=htv;
        redraw |= currMPName!==mp;
        currMPName=mp;
        redraw |= currSTEPName!==step;
        currSTEPName=step;
        if(currFilterType!==window.filterType){
            redraw = true;
            currFilterType=window.filterType;
            window.needsRedraw=10;
        }

        redraw |= window.needsRedraw > 0;
        return true;//TODO: Enable and debug later
        return redraw;
    }

    const postDraw = () => {
        if(window.needsRedraw > 0){
            window.needsRedraw--;
            // controlsActive = true;

        }
        // else controlsActive = false;
    }

    const clock =new THREE.Clock();
    clock.start();
    let frameAccum = 0;

    function update() {
        requestAnimationFrame(update);
        frameAccum +=clock.getDelta();
        if(frameAccum > 0.5){
            frameAccum-=0.5;
            window.needsRedraw++;
        }
        if(!materialManager || !dataLoaded) return;
        // if(window.fieldCanvasDisabled) return;
        waterLevelCylinder.position.x = monoManager.target.x;
        // waterLevelTorus.position.y = -0.01;
        waterLevelCylinder.position.z = monoManager.target.z;
        waterLevelCylinder.scale.x=5000;
        waterLevelCylinder.scale.y=1;
        waterLevelCylinder.scale.z=5000;
        waterLevelCylinder.position.y = 0;
        waterLevelCylinder.translateY(-1);


        if(stepper) stepper.update().then(res=> {


            materialManager.setColorsOf(['Mesh009', 'Mesh001', 'Mesh002', 'Mesh010',
                    'Thialf--THIPMB', 'Thialf--THIPAB', 'Thialf--THIPWB', 'Thialf--THISMB', 'Thialf--THISAB', 'Thialf--THISWB',],
                128, 128, 128);
            // for (let i = 0; i < 55; i++) materialManager.colors[i] = new THREE.Vector3(128 / 255, 128 / 255, 128 / 255);
            monoManager.nameMap.forEach((value, key, map) => {
                materialManager.setColorsOf([key], 128, 128, 128);
            });

            evalContext = [];
            const psfd = LocalObjectStore.getDataByKey("projectSelectionFilterData");

            const getStepDataAt = (htvName, monoName, stepName) =>{
                return storeData[htvName][monoName].stepsData[stepName];
            }
            let iterMPName;

            if (!(storeData && psfd && psfd.stepsData && psfd.currentStep && storeData[storeData.transportDeckMap[psfd.fileName]])) return;
            const csd = getStepDataAt(psfd.fileName, psfd.monopileName, psfd.currentStep);//psfd.stepsData[psfd.currentStep];
            const msd = ()=>getStepDataAt(psfd.fileName, iterMPName, storeData[psfd.fileName][iterMPName].steps[0]);//psfd.stepsData[psfd.currentStep];
            let cGet = (n) => (csd[storeData.excelConfig.htvColumnMap[n]]);
            evalContext.push(cGet);
            let cNum = (n) => Number(cGet(n));
            evalContext.push(cNum);

            const redraw = needsToRedraw(psfd.fileName, psfd.monopileName, psfd.currentStep);
            // console.log(redraw);
            // console.log(controlsActive);

            const {pink, black, purple, red} = getDiskColors(storeData, psfd);
            const deckLayout = {};
            storeData[storeData.transportDeckMap[psfd.fileName]].Sheet1.steps.forEach((step)=>{
                const data = storeData[storeData.transportDeckMap[psfd.fileName]].Sheet1.stepsData[step];
                const dataName = data[storeData.excelConfig.deckColumnMap['deckPos']];
                deckLayout[dataName] = data;
            })
            // console.log(deckLayout);
            fleetManager.setVisible(cGet('htvModel'), cGet('hlvModel'));
            const htv = fleetManager.htvs.get(cGet('htvModel'));
            const hlv = fleetManager.hlvs.get(cGet('hlvModel'));
            let nextMPPos;
            evalContext.push(()=>nextMPPos);
            let currMPPos;
            evalContext.push(()=>currMPPos);
            let myPosData;
            let dGet = (n) => (myPosData[storeData.excelConfig.deckColumnMap[n]]);
            evalContext.push(dGet);
            let dNum = (n) => Number(dGet(n));
            evalContext.push(dNum);
            // let evalColumn = (v)=>eval(storeData.excelConfig[v]);



            evalContext.push(storeData.excelConfig);
            {
                const getMesh = (name) => materialManager.groupMap.get(materialManager.nameObjIdMap.get(name));
                evalContext.push(getMesh);
                evalContext.push(v3);
                evalContext.push(q);
                evalContext.push(htv);
                evalContext.push(hlv);

                // const setAnimation = (name, attribute, axis, value, mul) => {
                //     const mesh = getMesh(name);
                //     if (mesh) mesh[attribute][axis] = mul * cNum(value) / 180 * (pi);
                // }
                for (const [key, value] of Object.entries(storeData.excelConfig.animations)) {
                    evalAnim(key, value);
                }
            }


            let fGet = (n) => (msd()[storeData.excelConfig.htvColumnMap[n]]);
            evalContext.push(fGet);

            const doScales = (zoom)=>{
                if(htv) htv.scale.copy(v3.mul(v3.one, Math.max(1, 12.5 / zoom)));
                if(hlv) hlv.scale.copy(v3.mul(v3.one, Math.max(1, 12.5 / zoom)));
                monoManager.circles.children.forEach((c) => {
                    c.scale.x = Math.max(1, Math.min(20, 75 / zoom)) * 500 ;
                    c.scale.z = Math.max(1, Math.min(20, 75 / zoom)) * 500 ;
                    c.position.y = (c.mono.jsonProperties.seaLevel + 1) * 0.5 * Math.max(2.0, 125 / zoom) ;
                    c.mono.scale.x = Math.max(1.0, 62.5 / zoom);
                    c.mono.scale.y = Math.max(1.0, 62.5 / zoom);
                    c.mono.scale.z = Math.max(1.0, 62.5 / zoom);
                    const idx = red.includes(c.name) ? 2 : (pink.includes(c.name) ? (purple.includes(c.name) ? 4 : 1) : (black.includes(c.name) ? 3 : 0));
                    if(idx===1|| idx===2) {
                        c.mono.scale.x = 1;
                        c.mono.scale.y = 1;
                        c.mono.scale.z = 1;
                    }
                });
            }
            // doScales(miniRenderer.camera.zoom*5000/2);
            if(redraw) {
                doMiniRenderer(htv, hlv);
                doCompass(miniRenderer);
            }

            const rect = {
                width: 100,
                height: 100
            };

            materialManager.setColorsOf(['15045027000-3D-320-01-1001', 'Mesh'], 205, 205, 205);


            doScales(125);

            monoManager.circles.children.forEach((c) => {

                const idx = red.includes(c.name) ? 2 : (pink.includes(c.name) ? (purple.includes(c.name) ? 4 : 1) : (black.includes(c.name) ? 3 : 0));
                c.material = monoManager.materials[idx];
                if(getOS() ==='Android')c.mono.children.forEach((child)=>{ child.material = monoManager.materials[idx]; });
                if (red.includes(c.name)) {
                    const stepperData=stepper.getNextMP();
                    if(stepperData) {
                        nextMPPos = monoManager.nameMap.get(stepper.getNextMP()).position;
                        currMPPos = c.position.clone();

                        if (htv) {
                            htv.position.copy(calc('htvPos'));
                            htv.quaternion.copy(calc('htvRot'));
                            // htv.scale.copy(v3.mul(v3.one, Math.max(1, 12.5 / zoom)));
                        }
                        if (hlv) {
                            hlv.position.copy(calc('hlvPos'));
                            hlv.quaternion.copy(calc('hlvRot'));
                            // hlv.scale.copy(v3.mul(v3.one, Math.max(1, 12.5 / zoom)));
                        }
                    }
                }
            });

            // console.log(black);
            monoManager.circles.children.forEach((c) => {

                // c.scale.x = Math.max(1, Math.min(20, 75 / zoom)) * 500 ;
                // c.scale.z = Math.max(1, Math.min(20, 75 / zoom)) * 500 ;
                // c.position.y = (c.mono.jsonProperties.seaLevel + 1) * 0.5 * Math.max(2.0, 125 / zoom) ;
                // c.mono.scale.x = Math.max(1.0, 62.5 / zoom);
                // c.mono.scale.y = Math.max(1.0, 62.5 / zoom);
                // c.mono.scale.z = Math.max(1.0, 62.5 / zoom);


                c.mono.position.x = c.position.x;
                c.mono.position.z = c.position.z;
                c.mono.position.y = 0;
                c.mono.quaternion.copy(c.quaternion);
                c.mono.quaternion.setFromEuler(new THREE.Euler(-pi/2, 0, 0));

                const idx = red.includes(c.name) ? 2 : (pink.includes(c.name) ? (purple.includes(c.name) ? 4 : 1) : (black.includes(c.name) ? 3 : 0));


                // c.mono.visible = !(snapper.doSnap || window.filterType !== 'field') && idx !== 0;
                // c.visible = idx === 2 || !(snapper.doSnap || window.filterType !== 'field');

                if (hlv && htv && (idx === 1 || idx === 2)) {
                    let rot = new THREE.Quaternion();
                    let localRot = new THREE.Quaternion();
                    let pos = new THREE.Vector3();
                    let parent = null;
                    if (idx === 2) {
                        parent = hlv;
                        waterLevelCylinder.scale.y = -0.5 * c.mono.jsonProperties.seaLevel ;
                        waterLevelCylinder.position.y = 0;
                        waterLevelCylinder.translateY(-waterLevelCylinder.scale.y);
                        // console.log(c.mono.selectionId);
                        materialManager.material.uniforms.selectedObjId.value = c.mono.selectionId / 256;

                        localRot = calc('hlvObjectRot');
                        pos = calc('hlvObjectPos');
                    }
                    if(idx === 1) {
                        iterMPName = c.mono.name;
                        parent = htv;
                        const myIndex = storeData[psfd.fileName].monopiles.indexOf(c.name);
                        myPosData = deckLayout[fGet('deckPos')];
                        // console.log(iterMPName);
                        // console.log(fGet('deckPos'));
                        // console.log(myPosData);
                        localRot = calc('htvObjectRot');
                        pos = calc('htvObjectPos');
                    }
                    parent.getWorldQuaternion(rot);
                    rot.multiply(localRot);
                    c.mono.quaternion.copy(rot);
                    c.mono.position.copy(parent.localToWorld(pos));
                    c.mono.visible = true;
                    // c.mono.scale.x = 1;
                    // c.mono.scale.y = 1;
                    // c.mono.scale.z = 1;
                }
            });


            if (window.filterType === 'install') {
                installRenderers.forEach((ren) => {
                    if(true || ren.angle==='Iso'){
                        monoManager.circles.children.forEach((c) => {
                            const idx = red.includes(c.name) ? 2 : (pink.includes(c.name) ? (purple.includes(c.name) ? 4 : 1) : (black.includes(c.name) ? 3 : 0));
                            c.mono.visible = !(ren.snapper.doSnap) && idx !== 0;
                            c.visible = idx === 2 || !(ren.snapper.doSnap );
                            if(idx===1|| idx===2) c.mono.visible = true;
                            // c.mono.visible = true;
                            // c.visible = true;
                        });

                        const zoom = ren.camera.zoom*( 5000);
                        doScales(zoom);

                        let ang = ren.snapper.ang;
                        if (ren.snapper.doSnap ) {
                            let pos = new THREE.Vector3();
                            let rot = new THREE.Quaternion();
                            if(hlv) hlv.getWorldPosition(pos);
                            // thalf.getWorldQuaternion(rot);
                            rot.invert();

                            pos.y += ang.yOff;
                            ren.camera.position.copy(pos);
                            ren.camera.quaternion.copy(rot);
                            // console.log(htv.rotation);


                            let offset = new THREE.Vector3(ang.x, ang.y, ang.z);
                            let worldQuat = new THREE.Quaternion();
                            if(hlv) hlv.getWorldQuaternion(worldQuat);
                            offset.applyQuaternion(worldQuat);
                            // fleetManager.thalf.localToWorld(offset);

                            ren.camera.position.add(offset);
                            // ren.camera.translateX(ang.x);
                            // ren.camera.translateY(ang.y);
                            // ren.camera.translateZ(ang.z);
                            ren.camera.lookAt(pos);
                            if (ang.rotate && hlv) ren.camera.rotateZ(hlv.rotation.y + pi/2);
                            ren.camera.zoom = ang.zoom * Math.min(ren.canvas.height, ren.canvas.width) / 1000;
                            ren.controls.object.position.copy(ren.camera.position);
                            ren.controls.object.quaternion.copy(ren.camera.quaternion);
                            ren.controls.object.zoom = ren.camera.zoom;
                            ren.controls.target.copy(pos);
                            // window.toggleSnap();

                        } else {
                            ren.camera.position.copy(ren.controls.object.position);
                            ren.camera.quaternion.copy(ren.controls.object.quaternion);
                            ren.camera.zoom = ren.controls.object.zoom;
                            // if (ang.rotate && hlv) ren.camera.rotateZ(hlv.rotation.y + pi/2);
                        }
                        ren.camera.updateProjectionMatrix();
                        if (renderTarget.width !== rect.width || renderTarget.height !== rect.height) renderTarget.setSize(rect.width, rect.height);

                        let rezoom = ren.canvas.width / ren.cWidth;
                        ren.cWidth = ren.canvas.width;
                        if(ren.cWidth===0)ren.cWidth=1;
                        ren.controls.object.zoom *= rezoom;
                        ren.controls.update();


                        let camDir = new THREE.Vector3(0, 0, 0);
                        let pos = new THREE.Vector3();
                        if (hlv) {
                            hlv.getWorldPosition(pos);
                            pos.y += ang.yOff;
                        }
                        camDir.subVectors(ren.camera.position, (ren.snapper.doSnap && hlv) ? pos : ren.controls.target);
                        camDir.normalize();
                        materialManager.material.uniforms.camDir.value = camDir;
                        if(redraw){
                            if (getOS() !== 'Android') {
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
                                // outlineMeshes.forEach((mesh)=>{
                                //     ren.renderSimple(mesh);
                                // })
                                materialManager.material.uniforms.renderSurfaceIds.value = false;
                                materialManager.material.uniforms.objectIdTex.value = renderTarget.texture;
                                ren.renderer.setRenderTarget(null);
                            }
                            waterLevelCylinder.visible = true;
                            ren.renderSimple(scene);
                            doCompass(ren);
                            doAxisHelper(ren);
                        }
                    }
                });
            }
            postDraw();
        });

    }
    update();
}


window.datastoreLoaded = (sd)=>{
    MonopileGenerator.init(()=>{



        dataLoaded = false;
        storeData = sd;

        initInstallControls(storeData);
        Object.entries(storeData).forEach(([key, val], index) => {

        });

        materialManager = getOS() ==='Android' ?  new FallbackMaterialManager() : new OutlineMaterialManager();

        monoManager.clear();
        subjectManager.clear();

        stepper = new Stepper(storeData);
        // console.log(storeData);
        mono2htvMap = {};

        const htvModelSet = new Set();
        const hlvModelSet = new Set();

        // console.log(storeData.fileNames);
        storeData.fileNames.forEach((htv)=>{

            storeData[htv].monopiles.forEach((mono)=>{
                // console.log(storeData[htv][mono]);
                storeData[htv][mono].steps.forEach(step=>{
                    const htvModel = storeData[htv][mono].stepsData[step]['HTV Model'];
                    const hlvModel = storeData[htv][mono].stepsData[step]['HLV Model'];

                    if(htvModel) htvModelSet.add(htvModel);
                    if(hlvModel) hlvModelSet.add(hlvModel);
                });




                mono2htvMap[mono] = htv;
                let json = storeData[mono];
                if(!json) json = storeData[mono+"_MP"];
                // console.log(json);
                if(json) {
                    let monoMesh = monoManager.buildMonopile(json.properties ? json : json[0]);
                    materialManager.countMeshes(monoMesh);
                    materialManager.setMatRec(monoMesh, false);
                }
            });

        });
        // console.log(htvModelSet);
        // console.log(hlvModelSet);
        subjectManager.parse(storeData);

        monoManager.calculateBounds();
        const t = new THREE.Vector3();
        t.x=monoManager.target.x;
        t.y=20;
        t.z=monoManager.target.z;
        miniRenderer.camera.zoom = 7*(miniRenderer.canvas.width/270)/(Math.max(1,monoManager.zMax-monoManager.zMin));
        miniRenderer.camera.position.copy( t);


        installRenderers.forEach((ren)=>{
            ren.controls.object.position.x=monoManager.target.x;
            ren.controls.object.position.y=20;
            ren.controls.object.position.z=monoManager.target.z;
            ren.controls.target.copy(monoManager.target);
            ren.controls.object.zoom = 3*(ren.canvas.width/1000)/(Math.max(1,monoManager.zMax-monoManager.zMin));
            ren.controls.update();
        });

        // console.log(mono2htvMap);

        fleetManager.load(materialManager, htvModelSet,hlvModelSet, ()=>{
            installRenderers.forEach((ren)=>{
                ren.snapper.doSnap = true;
            })
        });
        dataLoaded = true;
        // console.log(materialManager.nameObjIdMap);
        window.needsRedraw =10;
    });
}