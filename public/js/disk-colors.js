export function getDiskColors(storeData, psfd){
    let pink = [];
    let black = [];
    let purple = [];
    let red = [];



    if(storeData && psfd){
        for(let i = 0; i < storeData.fileNames.length; i++){
            if(storeData.fileNames[i]===psfd.fileName){
                for(let j = 0; j < storeData[storeData.fileNames[i]].monopiles.length; j++){
                    if(!psfd.monopileName) break;
                    if(storeData[storeData.fileNames[i]].monopiles[j]===psfd.monopileName) break;
                    purple.push(storeData[storeData.fileNames[i]].monopiles[j]);
                }
                break;
            }
            black = black.concat(storeData[storeData.fileNames[i]].monopiles);
        }
        if(storeData[psfd.fileName]) pink = storeData[psfd.fileName].monopiles;
        if(psfd.monopileName) red.push(psfd.monopileName);
    }
    return {
        pink:pink,
        black:black,
        purple:purple,
        red:red
    }
}