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


    getNextMP(){
        const storeData = this.storeData;
        const psfd = JSON.parse(localStorage.getItem("projectSelectionFilterData"));
        if(storeData && psfd){
            let stepIdx = psfd.steps.indexOf(psfd.currentStep);
            if(!stepIdx) stepIdx = 0;
            let stepNextIdx = (stepIdx+1)%psfd.steps.length;

            let htvIdx = storeData.fileNames.indexOf(psfd.fileName);
            let htvNextIdx = (htvIdx+1)%storeData.fileNames.length;
            const monopiles = storeData[storeData.fileNames[htvIdx]].monopiles;
            let mpIdx = monopiles.indexOf(psfd.monopileName);
            let mpNextIdx = (mpIdx+1)%monopiles.length;
            let selectedHtvIdx = mpNextIdx === 0 ? htvNextIdx : htvIdx;
            let selectedHtvName = storeData.fileNames[selectedHtvIdx];
            return storeData[selectedHtvName].monopiles[mpNextIdx];
        }
        return null;
    }

    step(){
        const storeData = this.storeData;
        const psfd = JSON.parse(localStorage.getItem("projectSelectionFilterData"));
        if(storeData && psfd){
            let stepIdx = psfd.steps.indexOf(psfd.currentStep);
            if(stepIdx===null) {
                console.log(stepIdx);
                return;
            }
            let stepNextIdx = (stepIdx+1)%psfd.steps.length;

            let htvIdx = storeData.fileNames.indexOf(psfd.fileName);
            let htvNextIdx = (htvIdx+1)%storeData.fileNames.length;
            const monopiles = storeData[storeData.fileNames[htvIdx]].monopiles;
            let mpIdx = monopiles.indexOf(psfd.monopileName);
            let mpNextIdx = (mpIdx+1)%monopiles.length;
            let selectedMpIdx = stepNextIdx===0 ? mpNextIdx : mpIdx;
            let selectedHtvIdx = mpNextIdx === 0 ? htvNextIdx : htvIdx;
            let selectedHtvName = storeData.fileNames[selectedHtvIdx];
            if(mpNextIdx===0) {
                document.getElementById('file-names').value = selectedHtvName;
                onHtvDropdownChange({target: {value: selectedHtvName}});
            }
            if(stepNextIdx === 0) {
                let selectedMonopileName = storeData[selectedHtvName].monopiles[selectedMpIdx];
                document.getElementById('sheet-names').value = selectedMonopileName;
                onMonopileDropdownChange({target: {value: selectedMonopileName}});
            }
            onStepClick(psfd.steps[stepNextIdx]);
        }
    }

    update(){
        let delta = this.clock.getDelta();
        if(this.doSteps) {
            this.elapsed += delta;
            if (this.elapsed > 1) {
                this.step();
                this.elapsed =0;
            }
        }
    }
}