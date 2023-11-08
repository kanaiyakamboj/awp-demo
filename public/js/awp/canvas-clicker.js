import * as THREE from 'three';
export class CanvasClicker {

    constructor(canvas, callback) {
        let pointer = new THREE.Vector2();
        let raw = new THREE.Vector4();
        canvas.addEventListener( 'pointermove', ( event )=> {

            let cRect = canvas.getBoundingClientRect();
            // calculate pointer position in normalized device coordinates
            // (-1 to +1) for both components

            raw.x=event.clientX-cRect.x;
            raw.y=event.clientY-cRect.y;
            raw.z=cRect.width;
            raw.w=cRect.height;

            pointer.x = (raw.x)/raw.z * 2-1;//( event.clientX / window.innerWidth ) * 2 - 1;
            pointer.y = -(raw.y)/raw.w * 2+1;// - ( event.clientY / window.innerHeight ) * 2 + 1;

        } );
        canvas.addEventListener( 'click', () => {

            if(Math.abs(pointer.x) <= 1 && Math.abs(pointer.y) <= 1) {
                callback(pointer, raw);
            }
        });
    }
}