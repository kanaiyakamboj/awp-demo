import * as THREE from 'three';
import {MonopileGenerator} from "./monopile-generator.js";

export class SubjectManager{

    subjectMap = new Map();
    clear(){
        this.subjectMap.clear();
    }

    parse(storeData) {
        const subjectModelSet = new Set();

        // console.log(storeData.fileNames);
        storeData.fileNames.forEach((htv)=>{

            storeData[htv].monopiles.forEach((mono)=>{
                // console.log(storeData[htv][mono]);
                storeData[htv][mono].steps.forEach(step=>{
                    const subjectModel = storeData[htv][mono].stepsData[step][storeData.excelConfig.htvColumnMap.subjectModel];
                    if(subjectModel) subjectModelSet.add(subjectModel);
                    else console.log('No Subject Model for: ',htv,mono, step);
                })
            });
        })

        subjectModelSet.forEach((subjectModel)=>{
            let subjectModelSplit = subjectModel.split('.');
            subjectModelSplit.pop();
            const name = subjectModelSplit.join('');
            if(name.split('_').pop() ==='MP'){
                let json = storeData[name];
                MonopileGenerator.init(()=>{
                    const mono = MonopileGenerator.generate(json.properties ? json : json[0], null, true, 'x z y' );
                    const fieldPosition = json.properties.fieldPosition;
                    let latLon = toLatLon(fieldPosition.easting, fieldPosition.northing, 18, 'N');
                    // console.log(latLon);
                    let x = -latLon.longitude/180*5760/2*5000 ;
                    let z = -latLon.latitude/90*2880/2*5000 ;
                    mono.fieldPos = {x:x, z:z};
                    this.subjectMap.set(subjectModel, mono);

                });
            }
        });
    }
}