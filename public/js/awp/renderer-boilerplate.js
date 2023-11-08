import * as THREE from 'three';

export class RendererBoilerplate {
    div;
    canvas;
    renderer;

    orthCamera;
    persCamera;
    orth;
    get camera() {
        return this.orth ? this.orthCamera : this.persCamera;
    }
    controls;

    constructor(div, orthographic) {
        this.orth = orthographic;
        this.div = div;
        this.canvas = this.div.getElementsByTagName('canvas')[0];

        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas,  preserveDrawingBuffer: true });
        this.renderer.setClearColor ( new THREE.Color(1.0, 0.5, 0.25), 0.5 );
        this.renderer.autoClear = false;
        this.orthCamera = new THREE.OrthographicCamera(
            this.div.getBoundingClientRect().width/ - 100,
            this.div.getBoundingClientRect().width / 100,
            this.div.getBoundingClientRect().height/ 100,
            this.div.getBoundingClientRect().height / - 100,
            -20, 40 );//
        this.persCamera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );//

        // this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        // this.controls.autoRotate = true;
        // this.controls.autoRotateSpeed = 1.0;
        // this.controls.target = new THREE.Vector3(0, 0,0);
        // this.persCamera.position.set( 0, 10, 10 );
        this.orthCamera.position.set( 0, 10, 0 );
        // this.persCamera.rotateX(-0.8);
        // this.orthCamera.rotateX(-Math.PI/2);
        // this.controls.update();
        this.resize();

        // this.div.addEventListener("resize", (event) => {
        //     this.resize();
        // });
        // const resizeObserver = new ResizeObserver((entries) => {
        //     for (const entry of entries) {
        //         console.log(entries);
        //         // ResizeObserverEntry.devicePixelContentBoxSize
        //         //this.resize(entry.contentRect.width, entry.contentRect.height);
        //
        //     }
        // });
        // resizeObserver.observe(this.div);
    }
    resize(width, height){
        if(!width) width = this.div.clientWidth;
        if(!height) height = this.div.clientHeight;
        let aspect = width/height;
        this.persCamera.aspect = aspect;
        let orthHeight = Math.abs(this.orthCamera.top - this.orthCamera.bottom);
        let zoom = this.orthCamera.zoom;
        this.orthCamera.left= width/ - 100;
        this.orthCamera.right=width/100;
        this.orthCamera.top= height/100;
        this.orthCamera.bottom=height/-100;
        this.persCamera.updateProjectionMatrix();
        this.orthCamera.updateProjectionMatrix();
        this.orthCamera.zoom = zoom;
        this.orthCamera.updateProjectionMatrix();
        this.renderer.setSize(width, height );
        // this.render();

    }
    // prevTarget = new THREE.Vector3(0,0,0);
    scene;

    renderSimple(scene){
        this.resize();
        this.renderer.render (scene, this.camera );
    }

    render(scene, cam){
        this.resize();
        this.renderer.clear();
        if(scene) this.scene = scene;
        // console.log(cam);

        if(this.scene){
            if(cam) {
                let offset = new THREE.Vector3(cam.offset.x, cam.offset.y, cam.offset.z);
                this.orth = cam.type === 'orth';
                if (this.orth) {
                    let dist = offset.length();
                    let width = this.div.getBoundingClientRect().width;
                    let height = this.div.getBoundingClientRect().height;
                    this.orthCamera.left = dist * width / -1000;
                    this.orthCamera.right = dist * width / 1000;
                    this.orthCamera.top = dist * height / 1000;
                    this.orthCamera.bottom = dist * height / -1000;
                    this.orthCamera.updateProjectionMatrix();
                }

                let pos = new THREE.Vector3(0, 0, 0);
                pos.addVectors(offset, this.scene.target)
                this.camera.position.set(pos.x, pos.y, pos.z);
                this.camera.lookAt(this.scene.target);
            }

            // this.controls.target = this.scene.target
            // console.log(this.controls.position0);
            // let pos = this.controls.position;
            // let delta = new THREE.Vector3(0,0,0);
            // delta.subVectors(this.scene.target, this.prevTarget);
            // pos.add(delta);
            // this.controls.position0 = pos;
            // this.controls.update();
            this.renderer.render( this.scene.scene, this.camera );
            // this.prevTarget =this.scene.target.copy();
        }
    }
}