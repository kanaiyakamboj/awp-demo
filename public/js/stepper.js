import * as THREE from 'three';
export class Stepper {
    storeData;
    doSteps = false;
    constructor(storeData) {
        this.storeData = storeData;
        window.toggleStep = ()=> {
            this.doSteps = !this.doSteps;
            document.getElementById('playPauseButton').innerText = this.doSteps? 'Pause' : 'Play';
        };
    }

    clock = new THREE.Clock();
    elapsed = 0;

    step(){
        const storeData = this.storeData;
        const psfd = JSON.parse(localStorage.getItem("projectSelectionFilterData"));
        if(storeData && psfd){
            let htvIdx = storeData.fileNames.indexOf(psfd.fileName);
            let htvNextIdx = (htvIdx+1)%storeData.fileNames.length;
            let mpIdx = storeData[storeData.fileNames[htvIdx]].monopiles.indexOf(psfd.monopileName);
            let mpNextIdx = (mpIdx+1)%storeData[storeData.fileNames[htvIdx]].monopiles.length;
            let selectedHtvIdx = mpNextIdx === 0 ? htvNextIdx : htvIdx;
            let selectedHtvName = storeData.fileNames[selectedHtvIdx];
            if(mpNextIdx===0) {
                document.getElementById('file-names').value = selectedHtvName;
                onHtvDropdownChange({target: {value: selectedHtvName}});
            }
            let selectedMonopileName = storeData[selectedHtvName].monopiles[mpNextIdx];
            document.getElementById('sheet-names').value = selectedMonopileName;
            onMonopileDropdownChange({target:{value:selectedMonopileName}});
        }
    }

    update(){
        let delta = this.clock.getDelta();
        if(this.doSteps) {
            this.elapsed += delta;
            if (this.elapsed > 1) {
                this.step();
                this.elapsed -= 1;
            }
        }
    }
}