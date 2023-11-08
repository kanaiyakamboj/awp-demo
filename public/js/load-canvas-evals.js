const pi = Math.PI;
const tau = pi*2;
let evalContext;


function calc(entry) {
    const cGet = evalContext[0];
    const cNum = evalContext[1];
    const nextMPPos = evalContext[2]();
    const currMPPos = evalContext[3]();
    const dGet = evalContext[4];
    const dNum = evalContext[5];
    const excelConfig = evalContext[6];
    const getMesh = evalContext[7];
    const v3 = evalContext[8];
    const q = evalContext[9];
    const htv = evalContext[10];
    const hlv = evalContext[11];
    const fGet = evalContext[12];
    let evalColumn = (v)=>eval(excelConfig[v]);
    return evalColumn(entry);
}

function evalAnim(key, value) {
    const cGet = evalContext[0];
    const cNum = evalContext[1];
    const nextMPPos = evalContext[2]();
    const currMPPos = evalContext[3]();
    const dGet = evalContext[4];
    const dNum = evalContext[5];
    const excelConfig = evalContext[6];
    const getMesh = evalContext[7];
    const v3 = evalContext[8];
    const q = evalContext[9];
    const htv = evalContext[10];
    const hlv = evalContext[11];
    const fGet = evalContext[12];
    const mesh = getMesh(key);
    if(mesh){

        value.forEach(anim=>{
            eval(anim);
        });
    }
}