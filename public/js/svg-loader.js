import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
export function loadSVGInto(scene, url, xScale, yScale, xOff, yOff, zOff, color){
    // instantiate a loader
    const loader = new SVGLoader();

// load a SVG resource
    loader.load(
        // resource URL
        url,
        // called when the resource is loaded
        function ( data ) {
            const paths = data.paths;
            const group = new THREE.Group();

            for ( let i = 0; i < paths.length; i ++ ) {

                const path = paths[ i ];

                const material = new THREE.MeshBasicMaterial( {
                    color: color?color:path.color,
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
            let viewBox = data.xml.attributes.viewBox.value.split(' ');

            group.rotateX(Math.PI/2);
            group.translateX(xOff);
            group.translateY(yOff);
            group.translateZ(zOff);
            group.scale.x = xScale/Number(viewBox[2]);
            group.scale.y = yScale/ Number(viewBox[3]);
            scene.add(group);

        }
    );
}