class DataManager{
    storeData;

    state = {
        htvName: null,
        monopileName: null,
        stepName: null
    }
    constructor(files) {
        FileLoader.loadFile((sd)=>{
            this.storeData = sd;

        });
    }



    getCurrentStepData(){
        if(!this.state ||!this.state.htvName || !this.state.monopileName || !this.state.stepName) return undefined;
        this.getStepDataAt(this.state.htvName, this.state.monopileName, this.state.stepName);
    }

    getNextStepData() {

    }

    getStepDataAt (htvName, monoName, stepName){
        if(!this.storeData) return undefined;
        return this.storeData[htvName][monoName].stepsData[stepName];
    }
}