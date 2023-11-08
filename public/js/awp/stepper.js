import * as THREE from 'three';

let steIntervalId;
export class Stepper {

    storeData;
    doSteps = false;
    constructor(storeData) {
        this.storeData = storeData;
        window.toggleStep = ()=> {
            this.doSteps = !this.doSteps;
            // document.getElementById('playPauseButton').innerText = this.doSteps? 'Pause' : 'Play';
        };
        
        steIntervalId=setInterval(async()=>{
            if(this.doSteps) {
            await this.step();
            }
        },1000);
    }

    clock = new THREE.Clock();
    elapsed = 0;

    getNextMP(){
        const storeData = this.storeData;
        const psfd = getCurrentSelectionData();;
        if(storeData && psfd && psfd.steps){
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

    async step(){
        const storeData = this.storeData;
        const psfd =getCurrentSelectionData();
        if(storeData && psfd && psfd.steps){
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
            if(stepNextIdx === 0 && mpNextIdx===0) {
                document.getElementById('file-names').value = selectedHtvName;
                // document.getElementById('file-names').dispatchEvent(new Event('change'));
                 onHtvDropdownChange({target: {value: selectedHtvName}});
                let selectedMonopileName = storeData[selectedHtvName].monopiles[selectedMpIdx];
                 onMonopileDropdownChange({target: {value: selectedMonopileName}});
                 onStepClick(psfd.steps[0]);
            }
            else{
                if(stepNextIdx === 0) {
                    let selectedMonopileName = storeData[selectedHtvName].monopiles[selectedMpIdx];
                    document.getElementById('sheet-names').value = selectedMonopileName;
                    document.getElementById("template-name").innerHTML = selectedMonopileName;
                    // document.getElementById('sheet-names').dispatchEvent(new Event('change'));
                     onMonopileDropdownChange({target: {value: selectedMonopileName}});
                     onStepClick(psfd.steps[0]);
                }
                else {
                     onStepClick(psfd.steps[stepNextIdx]);
                }
            }
        }
    }

    async update(){
       // let delta = this.clock.getDelta();
    
/*
        if(this.doSteps) {
            this.elapsed += delta;
            console.log('elapsed', this.elapsed);
            if (this.elapsed > 1) {
               
                this.elapsed =0;
            }
        }
        */
    }
}

window.addEventListener('beforeunload', function() {
   this.clearInterval(steIntervalId);
  });