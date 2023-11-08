class DataValidator{
    static doError = false;
    static errorObj = {};
    static log = [];
    static valid = true;

    static error(object, message){
        this.log.push('Data Error:\t'+object.join('\t\t') + '\t\t'+message);
        let obj = this.errorObj;
        for(let i = 0; i < object.length; i++){
            if(!obj[object[i]])obj[object[i]] = {};
            obj = obj[object[i]];
            if(i === object.length-1){
                obj.message=message;
            }
        }
        if(object.length===0) obj.message=message;
        if (this.doError) {
            throw new Error(message)
        }
        this.valid = false;
        return false;
    }

    static validateDeckLayout(storeData){
        const deckMap = storeData.transportDeckMap;
        if(!deckMap) return this.error([], "No transportDeckMap.json");
        const fileNames = storeData.fileNames;
        for(const htv of fileNames){
            const deckLayoutName = deckMap[htv];
            if(!deckLayoutName) return this.error([htv], "No no deck layout mapped for HTV");
            const deckLayout = storeData[deckLayoutName];

            if(!deckLayout) return this.error([], "No Deck layout in store data");
            const sheet1 = deckLayout.Sheet1;
            if(!sheet1) return this.error([ deckLayoutName], "No sheet1 in deck layout");
            const steps = sheet1.steps;
            if(!steps) return this.error([deckLayoutName, 'Sheet1'], "No steps in sheet");
            const stepsData = sheet1.stepsData;
            if(!stepsData) return this.error([ deckLayoutName, 'Sheet1'], "No stepsData in sheet");

            const expectedFields = ['HTV_DL_X', 'HTV_DL_Y', 'HTV_DL_Z', 'HTV_DL_QX', 'HTV_DL_QY', 'HTV_DL_QZ', 'HTV_DL_QW'];
            for (const step of steps) {
                const stepData = stepsData[step];
                if(!stepData) {
                    this.error([ deckLayoutName, 'Sheet1', step], "No data for step");
                }
                else {
                    for (const field of expectedFields) {
                        if (!stepData[field]) this.error([ deckLayoutName, 'Sheet1', step, field], "Missing field in Deck data");
                    }
                }
            }
        }
    }

    static validateMonopile(storeData, htv, mono){
        let json = storeData[mono];
        if(!json) json = storeData[mono+"_MP"];
        if(!json) return this.error([ htv, mono], "No mex json present with this name");
        const data = json.properties ? json : json[0];
        if(!data) return this.error(json, "No data for this mex");
        const properties = data.properties;
        if(!properties) {
            this.error([ htv, mono, data], "No properties for this mex");
        }
        else {
            const fieldPosition = properties.fieldPosition;
            if (!fieldPosition) {
                this.error([ htv, mono, data], "No field positions in mex properties");
            }
            else{
                const easting = fieldPosition.easting;
                if (!easting) this.error([ htv, mono, data], "No easting for mex");
                const northing = fieldPosition.northing;
                if (!northing) this.error([ htv, mono, data], "No northing for mex");
            }
            const name = properties.name;
            if (!name) this.error([ htv, mono, data], "No name for mex");
            const seaLevel = properties.seaLevel;
            if (!seaLevel) this.error([ htv, mono, data], "No seaLevel for mex");
        }

        const geometry = data.geometry;
        if(!geometry) return this.error([ htv, mono, data], "No geometry for mex");
        const shapes = geometry.shapes;
        if(!shapes) return this.error([ htv, mono, data], "No shapes for mex");
        for (const shape of shapes) {
            const name = shape.name;
            if(!name) this.error([ htv, mono, data, shape], "No name for shape");
            const pos = shape.position;
            if(!pos) {
                this.error([ htv, mono, data, shape], "No position for shape");
            }
            else {
                const z = pos.z;
                if (!z) this.error([ htv, mono, data, shape], "No z position for shape");
            }
            const shapeProperties = shape.shapeProperties;
            if(!shapeProperties) {
                this.error([ htv, mono, data, shape], "No shapeProperties for shape");
            } else {
                const expectedFields = ['height', 'radius1', 'radius2', 'thickness'];
                for (const field of expectedFields) {
                    if (!shapeProperties[field]) this.error([ htv, mono, data, shape, field], "Missing field in shape properties data");
                }
            }
        }
    }

    static validateTransportMonopile( htv, monopileName, monopile){
        const steps = monopile.steps;
        if(!steps) return this.error([ htv, monopileName], "No steps data in monopile");
        const stepsData = monopile.stepsData;
        if(!stepsData) return this.error([ htv, monopileName], "No stepsData data in monopile");
        for (const step of steps) {
            const stepData = stepsData[step];
            if(!stepData) {
                this.error([ htv, monopileName, step], "No stepData data in monopile at step");
            } else {
                const columnMap = {}
                const expectedFields = [
                    'HTV_X', 'HTV_Y', 'HTV_Z', 'HTV_QX', 'HTV_QY', 'HTV_QZ', 'HTV_QW',
                    'HLV_X', 'HLV_Y', 'HLV_Z', 'HLV_QX', 'HLV_QY', 'HLV_QZ', 'HLV_QW',
                ];
                for (const property in columnMap) {
                    expectedFields.push(columnMap[property]);
                }
                for (const field of expectedFields) {
                    if (!stepData[field]) this.error([ htv, monopileName, step, field], "Missing field in htv data");
                }
            }
        }
    }


    static validate(storeData) {
        this.errorObj = {};
        this.log = [];
        this.valid = true;
        if(!storeData) return this.error([], "No storeData");
        if(!storeData.excelConfig) return this.error([storeData], "No excelConfig");
        this.validateDeckLayout(storeData);

        const fileNames= storeData.fileNames;
        if(!fileNames) return this.error([], "No fileNames in storeData");
        for (const htv of fileNames) {
            const htvData = storeData[htv];
            if(!htvData) {
                this.error([ htv], "No htv data for this htv");
                continue;
            }
            const monopiles = htvData.monopiles;
            if(!monopiles) {
                this.error([ htv], "No monopile list in htv data");
                continue;
            }
            for (const monopileName of monopiles) {
                const monopile = htvData[monopileName];
                if(!monopile) {
                    this.error([ htv, monopileName], "No monopile data in htv data");
                }
                else {
                    this.validateTransportMonopile( htv, monopileName, monopile);
                }
            }

            const htvMonopiles = htvData.monopiles;
            if(!htvMonopiles) {
                this.error([ htv], "No monopiles in this htv data");
            } else {
                for (const mono of htvMonopiles) {
                    this.validateMonopile(storeData, htv, mono);
                }
            }
        }
        return this.valid;
    }
}