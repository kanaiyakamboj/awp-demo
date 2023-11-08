import * as THREE from 'three';
export class v3{
    static get zero(){
        return new THREE.Vector3(0,0,0);
    }
    static get one(){
        return new THREE.Vector3(1,1,1);
    }
    static new(x, y, z){
        return new THREE.Vector3(x,y,z);
    }
    static add(a, b) {
        let c = new THREE.Vector3();
        c.addVectors(a,b);
        return c;
    }

    static qmv(q, a){
        let c = a.clone();
        c.applyQuaternion(q);
        return c;
    }

    static sub(a, b) {
        let c = new THREE.Vector3();
        c.subVectors(a, b);
        return c;
    }

    static dot(a, b) {
        let c = a.clone();
        c.dot(b);
        return c;
    }

    static cross(a, b) {
        let c = new THREE.Vector3();
        c.crossVectors(a, b);
        return c;
    }

    static div(a, s) {
        let c = a.clone();
        c.divideScalar(s);
        return c;
    }

    static dist(a, b) {
        let c = a.clone();
        c.distanceTo(b);
        return c;
    }

    static distSq(a, b) {
        let c = a.clone();
        c.distanceToSquared(b);
        return c;
    }

    static lerp(a, b, f) {
        let c = new THREE.Vector3();
        c.lerpVectors(a, b, f);
        return c;
    }

    static mul(a, s) {
        let c = a.clone();
        c.multiplyScalar(s);
        return c;
    }

    static ran() {
        let c = new THREE.Vector3();
        c.random();
        return c;
    }

    static ranDir() {
        let c = new THREE.Vector3();
        c.randomDirection();
        return c;
    }

    static normed(v) {
        let c = v.clone();
        c.normalize();
        return c;
    }

    static neg(v) {
        let c = v.clone();
        c.negate();
        return c;
    }

    static unproject(v, camera) {
        let c = v.clone();
        c.unproject(camera);
        return c;
    }

    static project(v, camera) {
        let c = v.clone();
        c.project(camera);
        return c;
    }
}

export class q {

    static id() {
        let v = q.new();
        v.identity();
        return v;
    }
    static new(x,y,z,w) {
        return new THREE.Quaternion(x,y,z,w);
    }

    static eul(x,y,z) {
        let t = q.new();
        t.setFromEuler(new THREE.Euler(x,y,z));
        return t;
    }
    static inv(v) {
        let t = v.clone();
        t.invert();
        return t;
    }

    static mul(a, b){
        let c = a.clone();
        c.multiply(b);
        return c;
    }

    static look(dir, up) {
        let m4 = new THREE.Matrix4();
        m4.lookAt(v3.zero, dir, up);
        let r = q.new();
        r.setFromRotationMatrix(m4);
        return r;
    }
}

export class v2{
    static add(a, b) {
        let c = new THREE.Vector2();
        c.addVectors(a,b);
        return c;
    }

    static sub(a, b) {
        let c = new THREE.Vector2();
        c.sub(a, b);
        return c;
    }

}