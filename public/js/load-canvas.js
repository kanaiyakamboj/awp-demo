
import {ThreejsRendererBoilerplate} from "./../old-app/ThreejsRendererBoilerplate.js";
import {ThreejsSceneBoilerplate} from "./../old-app/ThreejsSceneBoilerplate.js";
import {ThreejsMonopileGenerator} from "./../old-app/ThreejsMonopileGenerator.js";


import * as THREE from 'three';
// import * as UTM  from 'https://unpkg.com/utm-latlng@1.0.7/UTMLatLng.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let materials;
let scene;
let htvGroup = new THREE.Group();
htvGroup.scale.x=0.0001;
htvGroup.scale.y=0.0001;
htvGroup.scale.z=0.0001;
let htv;
let thalf;
let controls;
let cylinders = [];
let waterLevelTorus;
let compass = new THREE.Group();
let circles = new THREE.Group();
let piles = new THREE.Group();
let target = new THREE.Vector3(0,0,0);
let cWidth;
let cHeight;
let mcWidth;
let mcHeight;
let renderer;
let miniRenderer;
let mono2htvMap = {};

let xMin = 10000;
let zMin = 10000;
let xMax = -10000;
let zMax = -10000;
let storeData;
let plane;

    /***Code for Canvas */
window.loadCanvas = ()=> {
    console.log("toLatLon(623338, 4469958, 18, 'N')");

    console.log(toLatLon(623338, 4469958, 18, 'N'));


    materials =[ new THREE.MeshBasicMaterial(
        {
            color: 0x999999
        }),new THREE.MeshBasicMaterial(
        {
            color: 0xff9999
        }),new THREE.MeshBasicMaterial(
        {
            color: 0xff0000
        }),new THREE.MeshBasicMaterial(
        {
            color: 0x000000
        }),new THREE.MeshBasicMaterial(
        {
            color: 0xff00ff
        })];
    scene =  new ThreejsSceneBoilerplate();
    renderer = new ThreejsRendererBoilerplate(document.getElementById('fields-canvas-container'));
    miniRenderer = new ThreejsRendererBoilerplate(document.getElementById('first-panel-content-right-menu'));

    renderer.orth = true;
    miniRenderer.orth = true;
    renderer.camera.rotateX(-Math.PI/2);
    miniRenderer.camera.rotateX(-Math.PI/2);


    // miniRenderer.canvas.style.width = '50%';
    controls = new OrbitControls( renderer.camera, renderer.renderer.domElement );
    // renderer.camera.zoom = 5;
    // controls.autoRotate = true;
    // controls.autoRotateSpeed = 1.0;
    controls.target = new THREE.Vector3(0, 0,0);
    // controls.enableRotate = false;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI*2/5;
    controls.update();
    let cam = {
        "type": "orth",
        "offset": {
            "x": 0,
            "y": 30,
            "z": 0
        }
    };
    {
        scene.scene.clear();
        scene.torus = null;
        scene.scene.background = new THREE.Color(0xf3f6fc);

        const size = 500;
        const divisions = 50;
        const gridHelper = new THREE.GridHelper(size, divisions, 0xDD2E1A, 0x0699D6);
        scene.scene.add(gridHelper);
        waterLevelTorus = new THREE.Mesh(new THREE.TorusGeometry(100, 100, 2, 50), new THREE.MeshBasicMaterial(
            {
                color: 0x0699D6,
                transparent: true,
                opacity: 0.25
            }));
        waterLevelTorus.rotateX(Math.PI / 2);
        scene.scene.add(waterLevelTorus);
        scene.scene.add(circles);
        scene.scene.add(piles);

        // for (let i = 3; i < 15; i++) {
        //     for (let j = 0; j < i; j++) {
        //         const geometry = new THREE.CylinderGeometry(0.1, 0.15, 1, 12);
        //         const material = new THREE.MeshBasicMaterial({color: 0x00ff33});
        //         const cylinder = new THREE.Mesh(geometry, material);
        //         cylinder.translateX(i + j * 0.33333 - 10);
        //         cylinder.translateZ(j - 5);
        //         scene.scene.add(cylinder);
        //     }
        // }

    }

    {
        // instantiate a loader
        const loader = new SVGLoader();

// load a SVG resource
        loader.load(
            // resource URL
            'assets/world2.svg',
            // called when the resource is loaded
            function ( data ) {

                const paths = data.paths;
                const group = new THREE.Group();

                for ( let i = 0; i < paths.length; i ++ ) {

                    const path = paths[ i ];

                    const material = new THREE.MeshBasicMaterial( {
                        color: 0x999999,
                        side: THREE.DoubleSide
                        // depthWrite: false
                    } );

                    const shapes = SVGLoader.createShapes( path );

                    for ( let j = 0; j < shapes.length; j ++ ) {

                        const shape = shapes[ j ];
                        const geometry = new THREE.ShapeGeometry( shape );
                        const mesh = new THREE.Mesh( geometry, material );
                        group.add( mesh );

                    }

                }
                // group.scale.x*=0.1;
                // group.scale.y*=0.1;
                // group.scale.z*=0.1;
                group.rotateX(Math.PI/2);
                group.translateX(-5760/2 + 4.5);
                group.translateY(-2880/2 + 75.5);
                group.translateZ(-0.001);
                group.scale.x = 5760/720;
                group.scale.y = 2880/ 347.25;
                // group.translateZ(-1);
                scene.scene.add( group );

            }
        );
        loader.load(
            // resource URL
            'assets/icon0-vector-723-01.svg',
            // called when the resource is loaded
            function ( data ) {

                const paths = data.paths;
                const group = new THREE.Group();
                console.log(group);

                for ( let i = 0; i < paths.length; i ++ ) {

                    const path = paths[ i ];

                    const material = new THREE.MeshBasicMaterial( {
                        color: path.color,
                        side: THREE.DoubleSide,
                        // depthWrite: false
                    } );

                    const shapes = SVGLoader.createShapes( path );

                    for ( let j = 0; j < shapes.length; j ++ ) {

                        const shape = shapes[ j ];
                        const geometry = new THREE.ShapeGeometry( shape );
                        const mesh = new THREE.Mesh( geometry, material );
                        group.add( mesh );

                    }

                }
                group.scale.x*=1/1600;
                // group.scale.y*=0.1;
                group.scale.y*=1/1600;
                group.rotateX(Math.PI/2);
                group.translateX(-1/2);
                group.translateY(-1/2);
                // group.translateZ(-1);
                compass.add(group);
                // scene.scene.add( compass );

            }
        );
        console.log(scene.scene);
    }
    {
        const geometry = new THREE.PlaneGeometry( 1, 1 );
        const material = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide, transparent: true} );

        plane = new THREE.Mesh( geometry, material );
        plane.rotateX(-Math.PI/2)
        // scene.scene.add( plane );

        const texture = new THREE.TextureLoader().load( "assets/legend.png" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.colorSpace =  THREE.SRGBColorSpace;
        // texture.repeat.set( 4, 4 );
        material.map = texture;
    }

    {

        // Instantiate a loader
        const loader = new GLTFLoader();

// Load a glTF resource
        loader.load( './../old-AWP-demo/content/Models/150450.27000-3D-320-01-1.gltf',(gltf)=>{
            htv=gltf.scene.children[0];
            htv.material = new THREE.MeshBasicMaterial(
                {
                    color: 0x00ff00
                });
            console.log(htv);
            loader.load( './../old-AWP-demo/content/Models/150333.00000-3D-THIALF-MAIN.gltf',(gltf)=>{
                thalf=gltf.scene.children[0];
                thalf.material = new THREE.MeshBasicMaterial(
                    {
                        color: 0x00ff00
                    });
                console.log(thalf);
                htv.add(thalf);

                thalf.rotateY(-Math.PI/2);

                thalf.translateZ(-100);
                thalf.translateX(50);
                htvGroup.add(htv);
                htv.translateZ(100);
                htv.translateX(-70);

                htv.rotateY(Math.PI/4);
                // htvGroup.position.y+=2;
                scene.scene.add(htvGroup);
            } );
        } );

    }

    cWidth = renderer.canvas.width;
    cHeight = renderer.canvas.height;
    mcWidth = miniRenderer.canvas.width;
    mcHeight = miniRenderer.canvas.height;



    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const raw = new THREE.Vector4();

    function onPointerMove( event ) {
        let cRect = renderer.canvas.getBoundingClientRect();
        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components

        raw.x=event.clientX-cRect.x;
        raw.y=event.clientY-cRect.y;
        raw.z=cRect.width;
        raw.w=cRect.height;

        pointer.x = (raw.x)/raw.z * 2-1;//( event.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = -(raw.y)/raw.w * 2+1;// - ( event.clientY / window.innerHeight ) * 2 + 1;

    }

    function onClick() {
        console.log(raw);
        console.log("Canvas Clicked at "+pointer.x + " " + pointer.y);
        // update the picking ray with the camera and pointer position
        if(raw.z-raw.x < 60 && raw.y < 60){
            target=new THREE.Vector3((xMin+xMax)/2, 0, (zMin+zMax)/2);
            controls.object.position.x=target.x;
            controls.object.position.y=20;
            controls.object.position.z=target.z;
            controls.target=target;

            controls.object.zoom = 3*(cWidth/1000)/(Math.max(1,zMax-zMin));
            controls.update();
        }
        raycaster.setFromCamera( pointer, renderer.camera );

        // calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects( circles.children );
        console.log(intersects);

        for ( let i = 0; i < intersects.length; i ++ ) {

            console.log(intersects[i].object.name);
            let htv = mono2htvMap[intersects[i].object.name];
            if(htv) {
                document.getElementById('file-names').value = htv;
                onHtvDropdownChange({target: {value: htv}});
            }

            document.getElementById('sheet-names').value = intersects[i].object.name;
            onMonopileDropdownChange({target:{value:intersects[i].object.name}});

        }

    }

    window.addEventListener( 'pointermove', onPointerMove );
    window.addEventListener( 'click', onClick );



    function update() {
        requestAnimationFrame(update);

        let rect = renderer.div.getBoundingClientRect();
        let miniRect = miniRenderer.div.getBoundingClientRect();
        scene.update();
        // controls.object.position.x=target.x;
        // controls.object.position.z=target.z;
        // controls.target=target;
        let rezoom = renderer.canvas.width / cWidth;
        controls.object.zoom *= rezoom;
        cWidth = renderer.canvas.width;
        cHeight = renderer.canvas.height;
        // rezoom = miniRenderer.canvas.width / mcWidth;
        // miniRenderer.camera.zoom *= rezoom;
        // mcWidth = miniRenderer.canvas.width;
        // mcHeight = miniRenderer.canvas.height;

        miniRenderer.camera.zoom = 1.5*(miniRenderer.canvas.width/270)/(Math.max(1,zMax-zMin));
        miniRenderer.camera.updateProjectionMatrix();
        controls.update();
        renderer.camera.updateProjectionMatrix();

        // console.log(vec);
        // renderer.camera.position.x=target.x;
        // renderer.camera.position.z=target.z;

        // console.log(1/controls.object.zoom);
        let highlighted = [];
        let black = [];
        let purple = [];
        let selected = null;


        const psfd = JSON.parse(localStorage.getItem("projectSelectionFilterData"));
        if(storeData && psfd){
            for(let i = 0; i < storeData.fileNames.length; i++){
                if(storeData.fileNames[i]===psfd.fileName){
                    for(let j = 0; j < storeData[storeData.fileNames[i]].monopiles.length; j++){
                        if(!psfd.monopileName) break;
                        if(storeData[storeData.fileNames[i]].monopiles[j]===psfd.monopileName) break;
                        purple.push(storeData[storeData.fileNames[i]].monopiles[j]);
                    }
                    break;
                }
                black = black.concat(storeData[storeData.fileNames[i]].monopiles);
            }
            highlighted = storeData[psfd.fileName].monopiles;
            if(psfd.monopileName) selected = psfd.monopileName;
        }

        let zoom;
        let vec;

        zoom = renderer.camera.zoom;


        // console.log(black);
        cylinders.forEach((c)=>{
           c.scale.x =  Math.max(0.1, Math.min(2.0,7.5/zoom));
           c.scale.z =  Math.max(0.1, Math.min(2.0,7.5/zoom));
            c.mono.scale.x=0.0001 * Math.max(2.0,125/zoom);
            c.mono.scale.y=0.0001 * Math.max(2.0,125/zoom);
            c.mono.scale.z=0.0001 * Math.max(2.0,125/zoom);
            let idx = c.name===selected ? 2:(highlighted.includes(c.name)?(purple.includes(c.name)?4:1):(black.includes(c.name)?3:0));
           c.material = materials[idx];
           c.mono.visible = idx===3 || idx===4;
           c.mono.children.forEach((ch)=>{
               ch.material = materials[idx];
           });
           if(c.name===selected){
               htvGroup.position.x = c.position.x;
               htvGroup.position.z= c.position.z+0.07;
               htvGroup.scale.x=0.0001 * Math.max(2.0,25/zoom);
               htvGroup.scale.y=0.0001 * Math.max(2.0,25/zoom);
               htvGroup.scale.z=0.0001 * Math.max(2.0,25/zoom);



           }
        });

        renderer.render(scene);

        vec = new THREE.Vector3((rect.width-75)/rect.width,(rect.height-75)/rect.height,-0.0);
        vec.unproject(renderer.camera);
        compass.position.copy(vec);
        compass.scale.x= 1/controls.object.zoom;
        compass.scale.y= 1/controls.object.zoom;
        compass.scale.z= 1/controls.object.zoom;

        renderer.renderer.render(compass, renderer.camera);


        zoom = miniRenderer.camera.zoom;


        // console.log(black);
        cylinders.forEach((c)=>{
            c.scale.x =  Math.max(0.1, Math.min(2.0,7.5/zoom));
            c.scale.z =  Math.max(0.1, Math.min(2.0,7.5/zoom));
            // c.mono.scale.x=0.0001 * Math.max(2.0,125/zoom);
            // c.mono.scale.y=0.0001 * Math.max(2.0,125/zoom);
            // c.mono.scale.z=0.0001 * Math.max(2.0,125/zoom);
            let idx = c.name===selected ? 2:(highlighted.includes(c.name)?(purple.includes(c.name)?4:1):(black.includes(c.name)?3:0));
            c.material = materials[idx];
            // c.mono.visible = idx===3 || idx===4;
            // c.mono.children.forEach((ch)=>{
            //     ch.material = materials[idx];
            // });
            // if(c.name===selected){
            //     htvGroup.position.x = c.position.x;
            //     htvGroup.position.z= c.position.z+0.07;
            //     htvGroup.scale.x=0.00005 * Math.max(2.0,25/zoom);
            //     htvGroup.scale.y=0.00005 * Math.max(2.0,25/zoom);
            //     htvGroup.scale.z=0.00005 * Math.max(2.0,25/zoom);
            //
            //
            //
            // }
        });

        miniRenderer.render(scene);


        vec = new THREE.Vector3((miniRect.width-75)/miniRect.width,(miniRect.height-75)/miniRect.height,-0.0);
        vec.unproject(miniRenderer.camera);
        compass.position.copy(vec);
        compass.scale.x= 1/miniRenderer.camera.zoom;
        compass.scale.y= 1/miniRenderer.camera.zoom;
        compass.scale.z= 1/miniRenderer.camera.zoom;

        miniRenderer.renderer.render(compass, miniRenderer.camera);

        vec = new THREE.Vector3((-miniRect.width+70)/miniRect.width,(-miniRect.height+55)/miniRect.height,-0.5);
        vec.unproject(renderer.camera);
        plane.position.copy(vec);
        plane.scale.x= 5/renderer.camera.zoom;
        plane.scale.y= 5/renderer.camera.zoom;
        plane.scale.z= 5/renderer.camera.zoom;
        plane.quaternion.copy(renderer.camera.quaternion);


        renderer.renderer.render(plane, renderer.camera);



        // controls.target.y*=0.95;
        // console.log(document.getElementById("file-names"));
    }
    // document.getElementById('sheet-names').addEventListener('change', (event)=>{
    //     console.log(event.target);
    // })
    // document.getElementById('sheet-names').value = 'EW1-B01';
    // onMonopileDropdownChange({target:{value:'EW1-B01'}});

    update();
}

window.datastoreLoaded = ()=>{
    storeData = JSON.parse(localStorage.getItem("selectedProjectStore"));

    storeData.fileNames.forEach((htv)=>{
        storeData[htv].monopiles.forEach((mono)=>{
            mono2htvMap[mono] = htv;
        });

    });
    console.log(mono2htvMap);
}

window.buildMonopile = (json)=>{
    let data = ThreejsMonopileGenerator.simplify(json[0]);
    let mono = ThreejsMonopileGenerator.generate(data,materials[0] );
    mono.scale.x=0.0001;
    mono.scale.y=0.0001;
    mono.scale.z=0.0001;
    let x = (json[0].properties.fieldPosition.easting - 623338) * 0.001;
    let z = (json[0].properties.fieldPosition.northing - 4469958) * 0.001;

    let latLon = toLatLon(json[0].properties.fieldPosition.easting, json[0].properties.fieldPosition.northing, 18, 'N');
    console.log(latLon);
    x = -latLon.longitude/180*5760/2;
    z = -latLon.latitude/90*2880/2;

    // x=-5760/2;
    // z=2880/2;

    const geometry = new THREE.CylinderGeometry(0.03, 0.035, 0.0002, 12);
    // const material = new THREE.MeshBasicMaterial({color: 0x00ff33});
    const cylinder = new THREE.Mesh(geometry, materials[0]);
    piles.add(mono);
    cylinder.name = json[0].properties.name;

    cylinder.mono = mono;
    cylinder.translateX(-x);
    cylinder.translateY(-0.03);
    cylinder.translateZ(z);
    mono.translateX(-x);
    mono.translateZ(z);
    cylinders.push(cylinder);
    xMin = 10000;
    zMin = 10000;
    xMax = -10000;
    zMax = -10000;
    cylinders.forEach((c)=>{
        xMin = Math.min(c.position.x, xMin);
        zMin = Math.min(c.position.z, zMin);
        xMax = Math.max(c.position.x, xMax);
        zMax = Math.max(c.position.z, zMax);
    });

    circles.add(cylinder);
    target=new THREE.Vector3((xMin+xMax)/2, 0, (zMin+zMax)/2);
    controls.object.position.x=target.x;
    controls.object.position.y=20;
    controls.object.position.z=target.z;
    controls.target=target;

    controls.object.zoom = 3*(cWidth/1000)/(Math.max(1,zMax-zMin));
    miniRenderer.camera.zoom = 7*(miniRenderer.canvas.width/270)/(Math.max(1,zMax-zMin));
    // miniRenderer.camera.zoom = controls.object.zoom*2;
    miniRenderer.camera.position.copy( controls.object.position);
    controls.update();

    waterLevelTorus.position.x = target.x;
    // waterLevelTorus.position.y = -0.01;
    waterLevelTorus.position.z = target.z;
    // mono.scale.x *=0.1;
    // mono.scale.y *=0.1;
    // mono.scale.z *=0.1;
    // mono.position.x+=x;
    // mono.position.z+=z;
    // scene.scene.add(mono);
}